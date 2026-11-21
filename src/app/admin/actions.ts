"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  authConfigured,
  changeOwnPassword,
  createUser,
  deleteUser,
  encodeSession,
  isLocked,
  requireAdmin,
  resetUserPassword,
  sessionCookieOptions,
  setUserDisabled,
  setUserRole,
  userManagementAvailable,
  verifyCredentials,
  type ManageResult,
  type Role,
} from "@/lib/admin/auth";
import { calendarEditable, cleanEvent, getCalendarEvents, saveCalendarEvents } from "@/lib/calendar";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!authConfigured()) redirect("/admin/login?error=config");
  if (!email || !password) redirect("/admin/login?error=1");
  if (isLocked(email)) redirect("/admin/login?error=locked");
  const session = await verifyCredentials(email, password);
  if (!session) {
    await new Promise((r) => setTimeout(r, 600));
    redirect("/admin/login?error=1");
  }
  (await cookies()).set(SESSION_COOKIE, encodeSession(session), sessionCookieOptions);
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export type ActionState = ManageResult | { ok?: undefined };

/** System admins only: add / disable / enable / change role / reset / delete. */
export async function manageUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireAdmin("owner");
  if (!userManagementAvailable()) return { ok: false, error: "مخزن البيانات غير متصل، فلا يمكن حفظ الحسابات." };
  const op = String(formData.get("op") ?? "");
  const email = String(formData.get("email") ?? "").slice(0, 200);
  const role: Role = formData.get("role") === "owner" ? "owner" : "viewer";
  let result: ManageResult;
  switch (op) {
    case "create":
      result = await createUser(me.email, email, role);
      break;
    case "disable":
      result = await setUserDisabled(me.email, email, true);
      break;
    case "enable":
      result = await setUserDisabled(me.email, email, false);
      break;
    case "role":
      result = await setUserRole(me.email, email, role);
      break;
    case "reset":
      result = await resetUserPassword(me.email, email);
      break;
    case "delete":
      result = await deleteUser(me.email, email);
      break;
    default:
      result = { ok: false, error: "عملية غير معروفة." };
  }
  revalidatePath("/admin/accounts");
  return result;
}

/** Any signed-in dashboard account: change own password (required after a temporary one). */
export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireAdmin(undefined, { allowTempPassword: true });
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next !== confirm) return { ok: false, error: "كلمتا المرور الجديدتان غير متطابقتين." };
  const r = await changeOwnPassword(me.email, current, next);
  if (r.ok) {
    // the old session is now invalid (password version changed) — sign in again
    (await cookies()).delete(SESSION_COOKIE);
    redirect("/admin/login?changed=1");
  }
  return r;
}

export type CalendarActionState = { ok?: boolean; message?: string; error?: string };

/** System admins only: add / edit / delete a conference in «تقويم المؤتمرات». */
export async function manageCalendarAction(_prev: CalendarActionState, formData: FormData): Promise<CalendarActionState> {
  await requireAdmin("owner");
  if (!calendarEditable()) return { ok: false, error: "مخزن البيانات غير متصل، فلا يمكن حفظ التقويم." };
  const op = String(formData.get("op") ?? "");
  const id = String(formData.get("id") ?? "").slice(0, 80);
  const { events } = await getCalendarEvents();
  let next = events;
  let message = "";
  if (op === "delete") {
    if (!events.some((e) => e.id === id)) return { ok: false, error: "المؤتمر غير موجود." };
    next = events.filter((e) => e.id !== id);
    message = "حُذف المؤتمر من التقويم.";
  } else if (op === "save") {
    const raw = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]));
    const result = cleanEvent({ ...raw, sedes: formData.get("sedes") === "on" });
    if (!result.ok) return { ok: false, error: result.error };
    const exists = events.some((e) => e.id === result.event.id);
    next = exists ? events.map((e) => (e.id === result.event.id ? result.event : e)) : [...events, result.event];
    message = exists ? "حُفظت تعديلات المؤتمر." : "أُضيف المؤتمر إلى التقويم.";
  } else {
    return { ok: false, error: "عملية غير معروفة." };
  }
  try {
    await saveCalendarEvents(next);
  } catch {
    return { ok: false, error: "تعذّر الحفظ في مخزن البيانات. حاولي مرة أخرى." };
  }
  revalidatePath("/admin/calendar");
  revalidatePath("/calendar");
  return { ok: true, message };
}
