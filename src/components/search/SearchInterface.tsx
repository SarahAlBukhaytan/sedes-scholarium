"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpenText,
  CalendarRange,
  Hash,
  PenTool,
  Search,
  SearchX,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { runSearch, searchTypeLabel, type SearchItem, type SearchType } from "@/lib/search";

const typeIcon: Record<SearchType, LucideIcon> = {
  conference: CalendarRange,
  session: BookOpenText,
  workshop: PenTool,
  speaker: UserRound,
  topic: Hash,
};

const typeOrder: SearchType[] = ["topic", "conference", "session", "workshop", "speaker"];

export function SearchInterface({
  index,
  suggestions,
}: {
  index: SearchItem[];
  suggestions: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [type, setType] = useState<SearchType | "all">("all");
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const inputId = useId();
  const listId = useId();

  const all = useMemo(() => runSearch(index, query), [index, query]);
  const results = type === "all" ? all : all.filter((r) => r.type === type);
  const counts = useMemo(() => {
    const m = new Map<SearchType, number>();
    for (const r of all) m.set(r.type, (m.get(r.type) ?? 0) + 1);
    return m;
  }, [all]);

  const update = (q: string) => {
    setQuery(q);
    setActiveIndex(-1);
    // Keep the URL shareable without adding history entries per keystroke.
    router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      router.push(results[activeIndex].href);
    }
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          ابحث في المنصة
        </label>
        <Search className="pointer-events-none absolute top-1/2 right-5 size-5 -translate-y-1/2 text-teal" aria-hidden="true" />
        <input
          id={inputId}
          type="search"
          autoFocus
          value={query}
          onChange={(e) => update(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="ابحث عن موضوع، أو جلسة، أو ورشة، أو متحدث…"
          role="combobox"
          aria-expanded={hasQuery && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          className="w-full rounded-full border border-line-strong bg-surface py-4 pr-13 pl-12 text-lg text-deep shadow-card placeholder:text-muted/80 focus:border-teal focus:outline-none focus-visible:outline-2 focus-visible:outline-teal [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => update("")}
            className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-deep"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">مسح البحث</span>
          </button>
        )}
      </div>

      {hasQuery && all.length > 0 && (
        <div role="group" aria-label="تصفية النتائج حسب النوع" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4">
          <FilterChip active={type === "all"} onClick={() => setType("all")} label="الكل" count={all.length} />
          {typeOrder
            .filter((t) => counts.get(t))
            .map((t) => (
              <FilterChip
                key={t}
                active={type === t}
                onClick={() => setType(t)}
                label={searchTypeLabel[t]}
                count={counts.get(t) ?? 0}
              />
            ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {hasQuery ? `${results.length} نتيجة` : ""}
      </p>

      <div className="mt-6">
        {!hasQuery ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-8">
            <p className="font-semibold text-deep">ابدأ من موضوع</p>
            <p className="mt-1 text-sm text-muted">
              يشمل البحث المؤتمرات والجلسات والورش والمتحدثين والموضوعات. جرّب مثلًا:
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => update(s)}
                    className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-deep hover:border-teal hover:bg-teal-soft"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <EmptyState icon={SearchX} variant="empty" title={`لا نتائج لـ «${query.trim()}»`}>
            تحقق من الإملاء، أو جرّب كلمة أقصر أو أعم، مثل «الترجمة» أو «الذكاء».
          </EmptyState>
        ) : (
          <ul ref={listRef} id={listId} role="listbox" aria-label="نتائج البحث" className="space-y-2.5">
            {results.map((r, i) => {
              const Icon = typeIcon[r.type];
              const active = i === activeIndex;
              return (
                <li key={r.id} id={`${listId}-${i}`} role="option" aria-selected={active}>
                  <Link
                    href={r.href}
                    className={`group flex items-start gap-4 rounded-[var(--radius-card)] border p-4 transition-colors md:p-5 ${
                      active ? "border-teal bg-teal-soft" : "border-line bg-surface hover:border-teal/50"
                    }`}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-sand-ink">{searchTypeLabel[r.type]}</span>
                      <span className="mt-0.5 block font-semibold leading-7 text-deep group-hover:text-teal">
                        <Highlight text={r.title} query={query} />
                      </span>
                      <span className="block text-sm leading-6 text-muted">{r.subtitle}</span>
                    </span>
                    <ArrowLeft className="mt-3 size-4 shrink-0 text-teal opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active ? "border-deep bg-deep text-ivory" : "border-line-strong bg-surface text-deep hover:border-teal"
      }`}
    >
      {label}
      <span className={`text-xs tabular-nums ${active ? "text-ivory/70" : "text-muted"}`}>{count}</span>
    </button>
  );
}

/** Highlights the exact query inside the title when it appears verbatim. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-sand-soft px-0.5 text-deep">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
