import { createHmac, randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBackend } from "@/lib/analytics/store";

/**
 * حماية لوحة الإدارة — server-side authentication and user management.
 *
 * Roles
 *   owner  = مدير النظام: sees statistics AND adds / disables / removes users.
 *   viewer = عضو مصرّح له: sees statistics only.
 *
 * Where accounts live
 *   1. ADMIN_USERS (environment variable) — the bootstrap system admin(s),
 *      set once by whoever manages the hosting. They cannot be edited or
 *      removed from the dashboard, so the platform can never be locked out.
 *      Format: email:role:saltHex:hashHex, separated by ";".
 *   2. The data store (Upstash Redis on Vercel, .data/ locally) — every
 *      account created from the dashboard «إدارة المستخدمين» page.
 *
 * Security
 *   - Every person has their own account; no shared password.
 *   - Passwords are never stored, only their scrypt hash with a random salt.
 *   - New accounts and password resets get a strong random temporary
 *     password that MUST be changed at first login.
 *   - Sessions: HMAC-signed HttpOnly cookie (8 h), re-checked against the
 *     account on every request — disabling/removing a user or changing a
 *     password ends their existing sessions immediately.
 *   - ADMIN_SESSION_SECRET (≥ 32 chars) signs the cookie; never in code.
 */

export type Role = "owner" | "viewer";
export interface AdminSession {
  email: string;
  role: Role;
  /** account version — bumps on password change / reset */
  v: number;
  exp: number;
}
export interface AdminUser {
  email: string;
  role: Role;
  source: "env" | "store";
  salt: string;
  hash: string;
  v: number;
  disabled?: boolean;
  mustChangePassword?: boolean;
  createdAt?: string;
  createdBy?: string;
}

export const SESSION_COOKIE = "ss_admin";
const SESSION_HOURS = 8;
const KEYLEN = 64;
const USERS_KEY = "admin-users";
export const MIN_PASSWORD = 12;

/* ── accounts ─────────────────────────────────────────────────────────── */

function envUsers(): AdminUser[] {
  return (process.env.ADMIN_USERS ?? "")
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line): AdminUser | null => {
      const [email, role, salt, hash] = line.split(":");
      if (!email || !salt || !hash || (role !== "owner" && role !== "viewer") || hash.length !== KEYLEN * 2) return null;
      return { email: email.toLowerCase(), role, source: "env", salt, hash, v: 0 };
    })
    .filter((u): u is AdminUser => u !== null);
}

async function storeUsers(): Promise<AdminUser[]> {
  const store = getBackend();
  if (!store) return [];
  const raw = await store.hgetRecords(USERS_KEY);
  return Object.values(raw)
    .map((json): AdminUser | null => {
      try {
        return { ...(JSON.parse(json) as AdminUser), source: "store" };
      } catch {
        return null;
      }
    })
    .filter((u): u is AdminUser => u !== null);
}

export async function listUsers(): Promise<AdminUser[]> {
  const env = envUsers();
  const envEmails = new Set(env.map((u) => u.email));
  return [...env, ...(await storeUsers()).filter((u) => !envEmails.has(u.email))];
}

async function findUser(email: string) {
  const e = email.trim().toLowerCase();
  return (await listUsers()).find((u) => u.email === e);
}

async function saveUser(u: AdminUser) {
  const store = getBackend();
  if (!store) throw new Error("no-store");
  const { source: _source, ...rest } = u;
  void _source;
  await store.write([{ kind: "hset", key: USERS_KEY, field: u.email, value: JSON.stringify(rest) }]);
}

export function userManagementAvailable() {
  return getBackend() !== null;
}

export function authConfigured(): boolean {
  return (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32;
}

/* ── passwords ────────────────────────────────────────────────────────── */

function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? Buffer.from(saltHex, "hex") : randomBytes(16);
  return { salt: salt.toString("hex"), hash: scryptSync(password, salt, KEYLEN).toString("hex") };
}

/** Strong random temporary password (no look-alike characters), shown once. */
export function generateTempPassword(length = 16) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789-_";
  return Array.from({ length }, () => chars[randomInt(chars.length)]).join("");
}

/** ADMIN_USERS entry for a bootstrap system admin (scripts / docs). */
export function makeUserEntry(email: string, role: Role, password: string): string {
  const { salt, hash } = hashPassword(password);
  return `${email.trim().toLowerCase()}:${role}:${salt}:${hash}`;
}

/* ── brute-force brake (per server instance) ── */
const failures = new Map<string, { count: number; until: number }>();
export function isLocked(email: string) {
  const f = failures.get(email.toLowerCase());
  return Boolean(f && f.count >= 5 && f.until > Date.now());
}
function noteFailure(email: string) {
  const k = email.toLowerCase();
  const f = failures.get(k) ?? { count: 0, until: 0 };
  failures.set(k, { count: f.count + 1, until: Date.now() + 15 * 60 * 1000 });
}

export async function verifyCredentials(email: string, password: string): Promise<AdminSession | null> {
  const user = await findUser(email);
  // hash even for unknown users so response time does not reveal valid emails
  const candidate = Buffer.from(hashPassword(password, user?.salt ?? "00".repeat(16)).hash, "hex");
  if (!user || user.disabled || !timingSafeEqual(candidate, Buffer.from(user.hash, "hex"))) {
    noteFailure(email);
    return null;
  }
  failures.delete(user.email);
  return { email: user.email, role: user.role, v: user.v, exp: Date.now() + SESSION_HOURS * 3600 * 1000 };
}

/* ── sessions ─────────────────────────────────────────────────────────── */

function sign(data: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(data).digest("base64url");
}

export function encodeSession(s: AdminSession): string {
  const data = Buffer.from(JSON.stringify(s)).toString("base64url");
  return `${data}.${sign(data)}`;
}

async function decodeSession(token: string | undefined): Promise<{ session: AdminSession; user: AdminUser } | null> {
  if (!token || !authConfigured()) return null;
  const [data, mac] = token.split(".");
  if (!data || !mac) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const s = JSON.parse(Buffer.from(data, "base64url").toString()) as AdminSession;
    const user = await findUser(s.email);
    // account must still exist, be active, keep the same role and password version
    if (!user || user.disabled || user.role !== s.role || user.v !== s.v || s.exp < Date.now()) return null;
    return { session: s, user };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  return (await decodeSession((await cookies()).get(SESSION_COOKIE)?.value))?.session ?? null;
}

/**
 * Use at the top of every admin page / server action.
 * `owner` restricts to system admins. Accounts with a temporary password
 * are sent to the change-password page before anything else.
 */
export async function requireAdmin(role?: Role, opts: { allowTempPassword?: boolean } = {}): Promise<AdminSession> {
  const r = await decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!r) redirect("/admin/login");
  if (r.user.mustChangePassword && !opts.allowTempPassword) redirect("/admin/password");
  if (role === "owner" && r.session.role !== "owner") redirect("/admin");
  return r.session;
}

export async function currentUser(): Promise<AdminUser | null> {
  return (await decodeSession((await cookies()).get(SESSION_COOKIE)?.value))?.user ?? null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_HOURS * 3600,
};

/* ── user management (system admins only — callers must requireAdmin("owner")) ── */

export type ManageResult = { ok: true; tempPassword?: string; message: string } | { ok: false; error: string };

export async function createUser(by: string, email: string, role: Role): Promise<ManageResult> {
  const e = email.trim().toLowerCase();
  if (!/^[^\s:@;]+@[^\s:@;]+\.[^\s:@;]+$/.test(e)) return { ok: false, error: "أدخل بريدًا إلكترونيًا صحيحًا." };
  if (await findUser(e)) return { ok: false, error: "يوجد حساب بهذا البريد." };
  const tempPassword = generateTempPassword();
  await saveUser({
    email: e,
    role,
    source: "store",
    ...hashPassword(tempPassword),
    v: 1,
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
    createdBy: by,
  });
  return { ok: true, tempPassword, message: `أُنشئ حساب ${e}.` };
}

async function editable(by: string, email: string): Promise<AdminUser | string> {
  const u = await findUser(email);
  if (!u) return "الحساب غير موجود.";
  if (u.source === "env") return "هذا حساب مدير نظام مُعرَّف في إعدادات الخادم، ولا يُعدَّل من اللوحة.";
  if (u.email === by) return "لا يمكنك تعديل حسابك من هذه الصفحة.";
  return u;
}

export async function setUserDisabled(by: string, email: string, disabled: boolean): Promise<ManageResult> {
  const u = await editable(by, email);
  if (typeof u === "string") return { ok: false, error: u };
  await saveUser({ ...u, disabled });
  return { ok: true, message: disabled ? `أُوقفت صلاحية ${u.email}.` : `أُعيد تفعيل ${u.email}.` };
}

export async function setUserRole(by: string, email: string, role: Role): Promise<ManageResult> {
  const u = await editable(by, email);
  if (typeof u === "string") return { ok: false, error: u };
  await saveUser({ ...u, role });
  return { ok: true, message: `صلاحية ${u.email} الآن: ${role === "owner" ? "مدير نظام" : "عضو"}.` };
}

export async function resetUserPassword(by: string, email: string): Promise<ManageResult> {
  const u = await editable(by, email);
  if (typeof u === "string") return { ok: false, error: u };
  const tempPassword = generateTempPassword();
  await saveUser({ ...u, ...hashPassword(tempPassword), v: u.v + 1, mustChangePassword: true });
  return { ok: true, tempPassword, message: `أُعيد تعيين كلمة مرور ${u.email}.` };
}

export async function deleteUser(by: string, email: string): Promise<ManageResult> {
  const u = await editable(by, email);
  if (typeof u === "string") return { ok: false, error: u };
  const store = getBackend();
  if (!store) return { ok: false, error: "مخزن البيانات غير متصل." };
  await store.write([{ kind: "hdel", key: USERS_KEY, field: u.email }]);
  return { ok: true, message: `حُذف حساب ${u.email}.` };
}

/** The signed-in user changes their own password (dashboard accounts only). */
export async function changeOwnPassword(email: string, current: string, next: string): Promise<ManageResult> {
  const u = await findUser(email);
  if (!u) return { ok: false, error: "الحساب غير موجود." };
  if (u.source === "env") return { ok: false, error: "كلمة مرور مدير النظام المُعرَّف في إعدادات الخادم تُغيَّر من تلك الإعدادات." };
  const check = Buffer.from(hashPassword(current, u.salt).hash, "hex");
  if (!timingSafeEqual(check, Buffer.from(u.hash, "hex"))) return { ok: false, error: "كلمة المرور الحالية غير صحيحة." };
  if (next.length < MIN_PASSWORD) return { ok: false, error: `كلمة المرور الجديدة ${MIN_PASSWORD} حرفًا على الأقل.` };
  if (next === current) return { ok: false, error: "اختر كلمة مرور مختلفة عن الحالية." };
  await saveUser({ ...u, ...hashPassword(next), v: u.v + 1, mustChangePassword: false });
  return { ok: true, message: "تغيّرت كلمة المرور. سجّل الدخول بها من جديد." };
}
