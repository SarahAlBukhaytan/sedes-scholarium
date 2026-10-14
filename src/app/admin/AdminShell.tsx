import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, KeyRound, LogOut, UserCog } from "lucide-react";
import type { AdminSession } from "@/lib/admin/auth";
import { logoutAction } from "./actions";

/**
 * Shared frame for every admin page: a navy toolbar (title, signed-in user,
 * navigation, sign-out) above a light-gray working area with white panels.
 */
export function AdminShell({
  session,
  active,
  title,
  children,
}: {
  session: AdminSession;
  active: "dashboard" | "users" | "password";
  title: string;
  children: ReactNode;
}) {
  const links = [
    { key: "dashboard", href: "/admin", label: "الإحصاءات", icon: BarChart3, show: true },
    { key: "users", href: "/admin/accounts", label: "إدارة المستخدمين", icon: UserCog, show: session.role === "owner" },
    { key: "password", href: "/admin/password", label: "تغيير كلمة المرور", icon: KeyRound, show: true },
  ] as const;

  return (
    <div className="surface-gray min-h-[70vh]">
      <div className="on-dark bg-deep text-ivory" style={{ boxShadow: "0 0 0 100vmax var(--sedes-navy)", clipPath: "inset(0 -100vmax)" }}>
        <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5">
          <div>
            <p className="text-xs font-semibold tracking-wide text-sky">لوحة الإدارة</p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-lilac-soft sm:inline">
              <bdi dir="ltr">{session.email}</bdi> · {session.role === "owner" ? "مدير نظام" : "عضو مصرّح له"}
            </span>
            <form action={logoutAction}>
              <button className="inline-flex min-h-10 items-center gap-2 rounded-full border border-lilac-soft px-4 font-semibold text-ivory hover:bg-ivory hover:text-deep">
                <LogOut className="size-4" aria-hidden="true" /> خروج
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="أقسام لوحة الإدارة" className="container-page">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto">
            {links
              .filter((l) => l.show)
              .map((l) => {
                const on = l.key === active;
                return (
                  <li key={l.key}>
                    <Link
                      href={l.href}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-t-[var(--radius-control)] px-4 text-sm font-semibold whitespace-nowrap ${
                        on ? "bg-[var(--sedes-gray-200)] text-deep" : "text-lilac-soft hover:text-ivory"
                      }`}
                    >
                      <l.icon className="size-4" aria-hidden="true" />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
      <div className="container-page space-y-6 py-8 md:py-10">{children}</div>
    </div>
  );
}

/** White panel with a title — the one card style used across the dashboard. */
export function Panel({ title, hint, children, id }: { title: string; hint?: string; children: ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="rounded-[var(--radius-card)] bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={id} className="font-display text-lg font-bold text-deep">
          {title}
        </h2>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
