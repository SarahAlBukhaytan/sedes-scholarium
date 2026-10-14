import type { Metadata } from "next";
import { currentUser, requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "../AdminShell";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "تغيير كلمة المرور", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PasswordPage() {
  const session = await requireAdmin(undefined, { allowTempPassword: true });
  const user = await currentUser();
  const forced = Boolean(user?.mustChangePassword);

  return (
    <AdminShell session={session} active="password" title="تغيير كلمة المرور">
      <div className="max-w-md space-y-5 rounded-[var(--radius-card)] bg-surface p-6 md:p-7">
        {forced && (
          <p className="rounded-[var(--radius-control)] bg-lilac-soft px-4 py-3 text-sm leading-7 text-deep">
            تدخل بكلمة مرور مؤقتة. اختر كلمة مرور خاصة بك قبل المتابعة.
          </p>
        )}
        {user?.source === "env" ? (
          <p className="leading-8 text-ink">
            هذا حساب مدير نظام مُعرَّف في إعدادات الخادم، وتُغيَّر كلمة مروره من تلك الإعدادات (انظر README).
          </p>
        ) : (
          <PasswordForm />
        )}
      </div>
    </AdminShell>
  );
}
