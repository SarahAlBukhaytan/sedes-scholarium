"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/config/navigation";
import { BrandMark } from "@/components/brand/BrandMark";
import { initiative } from "@/content/site";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel) {
        // Simple focus trap
        const focusables = panel.querySelectorAll<HTMLElement>("a,button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex size-10 items-center justify-center rounded-full text-deep hover:bg-surface-muted"
      >
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">فتح القائمة</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="القائمة">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 bg-deep/40"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            ref={panelRef}
            className="animate-fade-up absolute inset-x-3 top-3 rounded-2xl bg-ivory p-5 shadow-lift"
          >
            <div className="flex items-center justify-between">
              <BrandMark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full text-deep hover:bg-surface-muted"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">إغلاق القائمة</span>
              </button>
            </div>
            <nav
              aria-label="التنقل الرئيسي"
              className="mt-6"
              onClick={(e) => {
                // Close the menu when any link is followed.
                if ((e.target as HTMLElement).closest("a")) setOpen(false);
              }}
            >
              <ul className="divide-y divide-line border-y border-line">
                {mainNav.map((item) => {
                  const active =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-4 text-lg font-medium ${
                          active ? "text-deep" : "text-ink/80"
                        }`}
                      >
                        {item.label}
                        {active && <span aria-hidden="true" className="size-2 rounded-full bg-sand" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <p className="mt-5 text-sm leading-7 text-muted">{initiative.fullName}</p>
          </div>
        </div>
      )}
    </div>
  );
}
