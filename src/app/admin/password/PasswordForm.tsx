"use client";

import { useActionState } from "react";
import { changePasswordAction, type ActionState } from "../actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});
  const field = "mt-1.5 block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 text-left focus:border-teal focus:outline-none";
  return (
    <form action={action} className="space-y-4">
      {state.ok === false && (
        <p role="alert" className="rounded-lg border border-[#c0392b]/30 bg-[#fdecea] px-4 py-3 text-sm text-[#8e2a20]">
          {state.error}
        </p>
      )}
      <label className="block">
        <span className="text-sm font-semibold text-deep">كلمة المرور الحالية</span>
        <input name="current" type="password" required dir="ltr" autoComplete="current-password" className={field} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-deep">كلمة المرور الجديدة (12 حرفًا على الأقل)</span>
        <input name="next" type="password" required minLength={12} dir="ltr" autoComplete="new-password" className={field} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-deep">تأكيد كلمة المرور الجديدة</span>
        <input name="confirm" type="password" required minLength={12} dir="ltr" autoComplete="new-password" className={field} />
      </label>
      <button disabled={pending} className="min-h-11 w-full rounded-full bg-deep font-semibold text-ivory hover:bg-teal disabled:opacity-60">
        حفظ كلمة المرور
      </button>
    </form>
  );
}
