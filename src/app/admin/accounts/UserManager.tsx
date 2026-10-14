"use client";

import { useActionState } from "react";
import { KeyRound, ShieldCheck, Trash2, UserPlus, UserRoundCheck, UserRoundX } from "lucide-react";
import { manageUserAction, type ActionState } from "../actions";

export interface UserRow {
  email: string;
  role: "owner" | "viewer";
  source: "env" | "store";
  disabled: boolean;
  mustChangePassword: boolean;
  createdAt: string | null;
  createdBy: string | null;
}

const roleLabel = { owner: "مدير نظام", viewer: "عضو" } as const;
const fmtDate = new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { dateStyle: "medium" });

export function UserManager({ users, me }: { users: UserRow[]; me: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(manageUserAction, {});
  const field = "block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 focus:border-teal focus:outline-none";
  const btn = "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold disabled:opacity-50";

  return (
    <div className="space-y-6">
      {/* result of the last action — a temporary password is shown ONCE */}
      {state.ok === false && (
        <p role="alert" className="rounded-lg border border-[#c0392b]/30 bg-[#fdecea] px-4 py-3 text-sm text-[#8e2a20]">
          {state.error}
        </p>
      )}
      {state.ok === true && (
        <div role="status" className="rounded-lg border border-teal/30 bg-teal-soft px-4 py-3 text-sm leading-7 text-deep">
          <p className="font-semibold">{state.message}</p>
          {state.tempPassword && (
            <>
              <p className="mt-1">كلمة المرور المؤقتة (تظهر الآن فقط — انسخيها وسلّميها لصاحب الحساب بطريقة آمنة):</p>
              <input
                readOnly
                dir="ltr"
                value={state.tempPassword}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-1.5 w-full max-w-sm rounded-md border border-line-strong bg-surface px-3 py-2 font-mono text-base"
              />
            </>
          )}
        </div>
      )}

      {/* add user */}
      <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-deep">
          <UserPlus className="size-5 text-blue" aria-hidden="true" /> إضافة مستخدم
        </h2>
        <form action={action} className="mt-4 grid gap-3 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
          <input type="hidden" name="op" value="create" />
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-deep">البريد الإلكتروني</span>
            <input name="email" type="email" required dir="ltr" autoComplete="off" className={`${field} text-left`} />
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-deep">الصلاحية</span>
            <select name="role" defaultValue="viewer" className={field}>
              <option value="viewer">عضو — يطّلع على الإحصاءات</option>
              <option value="owner">مدير نظام — ويدير المستخدمين</option>
            </select>
          </label>
          <button disabled={pending} className="min-h-11 rounded-full bg-deep px-6 font-semibold text-ivory hover:bg-teal disabled:opacity-60">
            إضافة
          </button>
        </form>
      </section>

      {/* user list */}
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-deep">المستخدمون ({users.length})</h2>
        <ul className="divide-y divide-line">
          {users.map((u) => {
            const locked = u.source === "env" || u.email === me;
            return (
              <li key={u.email} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <bdi dir="ltr" className="font-semibold text-deep">
                      {u.email}
                    </bdi>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.role === "owner" ? "bg-deep text-ivory" : "bg-teal-soft text-teal"}`}>
                      {roleLabel[u.role]}
                    </span>
                    {u.disabled && <span className="rounded-full bg-[#fdecea] px-2.5 py-0.5 text-xs font-semibold text-[#8e2a20]">موقوف</span>}
                    {u.mustChangePassword && !u.disabled && (
                      <span className="rounded-full bg-sand-soft px-2.5 py-0.5 text-xs font-semibold text-indigo">لم يغيّر كلمة المرور المؤقتة بعد</span>
                    )}
                    {u.email === me && <span className="text-xs text-muted">(أنت)</span>}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {u.source === "env"
                      ? "مدير نظام مُعرَّف في إعدادات الخادم — لا يُعدَّل من اللوحة"
                      : [u.createdAt && `أُنشئ ${fmtDate.format(new Date(u.createdAt))}`, u.createdBy && `بواسطة ${u.createdBy}`].filter(Boolean).join(" ")}
                  </p>
                </div>
                {!locked && (
                  <div className="flex flex-wrap gap-2">
                    <form action={action}>
                      <input type="hidden" name="email" value={u.email} />
                      <input type="hidden" name="op" value="role" />
                      <input type="hidden" name="role" value={u.role === "owner" ? "viewer" : "owner"} />
                      <button disabled={pending} className={`${btn} border-line-strong text-deep hover:border-teal`}>
                        <ShieldCheck className="size-3.5" aria-hidden="true" />
                        {u.role === "owner" ? "تحويله إلى عضو" : "ترقيته إلى مدير نظام"}
                      </button>
                    </form>
                    <form action={action}>
                      <input type="hidden" name="email" value={u.email} />
                      <input type="hidden" name="op" value="reset" />
                      <button disabled={pending} className={`${btn} border-line-strong text-deep hover:border-teal`}>
                        <KeyRound className="size-3.5" aria-hidden="true" /> كلمة مرور مؤقتة جديدة
                      </button>
                    </form>
                    <form action={action}>
                      <input type="hidden" name="email" value={u.email} />
                      <input type="hidden" name="op" value={u.disabled ? "enable" : "disable"} />
                      <button disabled={pending} className={`${btn} border-line-strong text-deep hover:border-teal`}>
                        {u.disabled ? <UserRoundCheck className="size-3.5" aria-hidden="true" /> : <UserRoundX className="size-3.5" aria-hidden="true" />}
                        {u.disabled ? "إعادة التفعيل" : "إيقاف الصلاحية"}
                      </button>
                    </form>
                    <form
                      action={action}
                      onSubmit={(e) => {
                        if (!confirm(`حذف حساب ${u.email} نهائيًا؟`)) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="email" value={u.email} />
                      <input type="hidden" name="op" value="delete" />
                      <button disabled={pending} className={`${btn} border-[#c0392b]/40 text-[#8e2a20] hover:bg-[#fdecea]`}>
                        <Trash2 className="size-3.5" aria-hidden="true" /> حذف
                      </button>
                    </form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
