"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Languages, Lock } from "lucide-react";
import { currentLanguage, languages } from "@/config/languages";

/**
 * Header language menu (globe icon). Only languages with status "active" can
 * be chosen; "pending" ones (approved but not yet translated — English for
 * now) and "planned" ones are shown greyed out with «قريبًا» and cannot be
 * selected, so no incomplete version is ever reachable. Each entry carries
 * its own `lang` / `dir` so names render correctly in RTL and LTR scripts.
 */
export function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const current = languages.find((l) => l.code === currentLanguage)!;
  const approved = languages.filter((l) => l.status !== "planned");
  const planned = languages.filter((l) => l.status === "planned");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex size-10 items-center justify-center gap-1.5 rounded-full border border-line bg-surface text-deep transition-colors hover:border-line-strong sm:size-auto sm:px-3.5 sm:py-2 sm:text-sm sm:text-muted sm:hover:text-deep"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown className={`hidden size-3.5 transition-transform sm:block ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        <span className="sr-only">اللغة: {current.nameAr}. اختيار اللغة</span>
      </button>

      {open && (
        <div
          id={panelId}
          className="animate-fade-up fixed inset-x-3 top-[4.6rem] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto sm:absolute sm:inset-x-auto sm:end-0 sm:top-[calc(100%+0.6rem)] sm:w-80 sm:max-h-[min(34rem,calc(100dvh-6rem))] rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-lift"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <p className="font-display text-base font-bold text-deep">اللغات</p>
            <Languages className="size-4 text-muted" aria-hidden="true" />
          </div>

          <p className="mt-3 text-xs font-semibold text-muted">اللغات المعتمدة</p>
          <ul className="mt-2 space-y-1">
            {approved.map((l) => {
              const isCurrent = l.code === currentLanguage;
              if (l.status === "active" && l.href) {
                return (
                  <li key={l.code}>
                    <Link
                      href={l.href}
                      lang={l.code}
                      dir={l.dir}
                      aria-current={isCurrent ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] px-3 font-semibold ${
                        isCurrent ? "bg-lilac-soft/60 text-deep" : "text-ink hover:bg-surface-muted"
                      }`}
                    >
                      <span>{l.native}</span>
                      {isCurrent && <Check className="size-4 text-royal" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={l.code}
                  className="flex min-h-11 cursor-not-allowed items-center justify-between gap-3 rounded-[var(--radius-control)] px-3 text-muted"
                >
                  <span lang={l.code} dir={l.dir} className="font-semibold">
                    {l.native}
                  </span>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[0.7rem] font-semibold">
                    قريبًا<span className="sr-only"> — غير متاحة حاليًا</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <p className="text-xs font-semibold text-muted">لغات ستُضاف لاحقًا</p>
            <p className="text-[0.7rem] text-muted">قريبًا</p>
          </div>
          <ul className="mt-1" aria-label="لغات ستُضاف لاحقًا، غير متاحة حاليًا">
            {planned.map((l) => (
              <li
                key={l.code}
                className="flex min-h-10 cursor-not-allowed items-center justify-between gap-3 px-3 text-sm text-muted/70"
              >
                <span>
                  {l.nameAr}{" "}
                  <span lang={l.code} dir={l.dir} className="ms-1 text-xs">
                    {l.native}
                  </span>
                </span>
                <Lock className="size-3.5 shrink-0" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
