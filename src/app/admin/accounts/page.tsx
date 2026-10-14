import type { Metadata } from "next";
import { listUsers, requireAdmin, userManagementAvailable } from "@/lib/admin/auth";
import { AdminShell } from "../AdminShell";
import { UserManager, type UserRow } from "./UserManager";

export const metadata: Metadata = { title: "إدارة المستخدمين", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** إدارة المستخدمين — system admins (owner) only; checked on the server. */
export default async function AccountsPage() {
  const me = await requireAdmin("owner");
  // never send salts or hashes to the browser
  const users: UserRow[] = (await listUsers()).map((u) => ({
    email: u.email,
    role: u.role,
    source: u.source,
    disabled: Boolean(u.disabled),
    mustChangePassword: Boolean(u.mustChangePassword),
    createdAt: u.createdAt ?? null,
    createdBy: u.createdBy ?? null,
  }));

  return (
    <AdminShell session={me} active="users" title="إدارة المستخدمين">
      <div>
        <p className="max-w-3xl leading-8 text-ink">
          لكل شخص حسابه الخاص. عند إضافة عضو يُنشئ النظام كلمة مرور مؤقتة قوية تظهر مرة واحدة فقط؛ سلّميها له بطريقة آمنة،
          وسيُطلب منه تغييرها عند أول دخول. إيقاف الحساب أو حذفه يُنهي جلساته فورًا.
        </p>
      </div>
      {!userManagementAvailable() ? (
        <p className="rounded-[var(--radius-card)] bg-surface p-5 leading-8">
          مخزن البيانات غير متصل في هذه البيئة، فلا يمكن حفظ الحسابات من اللوحة. على Vercel يلزم ربط Upstash Redis (انظر README).
        </p>
      ) : (
        <UserManager users={users} me={me.email} />
      )}
    </AdminShell>
  );
}
