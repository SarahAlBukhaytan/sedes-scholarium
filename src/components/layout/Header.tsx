"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { mainNav } from "@/config/navigation";
import { initiative } from "@/content/site";
import { routes } from "@/lib/routes";
import { LanguageMenu } from "./LanguageMenu";
import { MobileNavigation } from "./MobileNavigation";

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/80">
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-4 md:h-[4.5rem]">
        <Link href={routes.home()} aria-label={`${initiative.name} — الصفحة الرئيسية`} className="shrink-0 rounded-md">
          <BrandMark />
        </Link>

        <nav aria-label="التنقل الرئيسي" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-md px-3 py-2 text-[0.95rem] font-medium whitespace-nowrap xl:px-3.5 transition-colors ${
                      active ? "text-deep" : "text-muted hover:text-deep"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-[0.9rem] xl:inset-x-3.5 h-0.5 rounded-full bg-sand"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Language and search are utility actions, kept apart from the primary navigation. */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <LanguageMenu />
          <Link
            href={routes.search()}
            aria-current={pathname === "/search" ? "page" : undefined}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-deep transition-colors hover:border-line-strong sm:size-auto sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm sm:text-muted sm:hover:text-deep"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">البحث</span>
            <span className="sr-only sm:hidden">البحث</span>
          </Link>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
