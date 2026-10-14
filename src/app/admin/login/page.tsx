import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { authConfigured, getSession } from "@/lib/admin/auth";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "دخول لوحة الإدارة", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  "1": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  locked: "محاولات كثيرة غير ناجحة. حاول مجددًا بعد 15 دقيقة.",
  config: "لوحة الإدارة غير مهيأة بعد: لم يُضبط مفتاح الجلسة (ADMIN_SESSION_SECRET) في إعدادات الخادم.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; changed?: string }> }) {
  if (await getSession()) redirect("/admin");
  const { error, changed } = await searchParams;
  const configured = authConfigured();

  return (
    <div className="surface-gray container-page flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-md rounded-[var(--radius-card)] bg-surface p-7 md:p-9">
        <BrandMark variant="full" className="mx-auto h-auto w-28" />
        <h1 className="mt-6 flex items-center justify-center gap-2 font-display text-2xl font-bold text-deep">
          <LockKeyhole className="size-5 text-blue" aria-hidden="true" />
          لوحة الإدارة
        </h1>
        <p className="mt-2 text-center text-sm leading-6 text-muted">للمصرّح لهم من فريق المبادرة فقط.</p>

        {changed && !error && (
          <p role="status" className="mt-5 rounded-lg border border-teal/30 bg-teal-soft px-4 py-3 text-sm leading-6 text-deep">
            تغيّرت كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.
          </p>
        )}
        {(error || !configured) && (
          <p role="alert" className="mt-5 rounded-lg border border-[#c0392b]/30 bg-[#fdecea] px-4 py-3 text-sm leading-6 text-[#8e2a20]">
            {errors[error ?? ""] ?? errors.config}
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-deep">البريد الإلكتروني</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              dir="ltr"
              className="mt-1.5 block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 text-left focus:border-teal focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-deep">كلمة المرور</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              className="mt-1.5 block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 text-left focus:border-teal focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={!configured}
            className="min-h-11 w-full rounded-full bg-deep font-semibold text-ivory transition-colors hover:bg-teal disabled:cursor-not-allowed disabled:opacity-50"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
