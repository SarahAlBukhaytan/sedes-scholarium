import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInterface } from "@/components/search/SearchInterface";
import { getBundle, getConferences, getTopicsWithStats } from "@/lib/content";
import { routes } from "@/lib/routes";
import { buildSearchIndex } from "@/lib/search";

export const metadata: Metadata = { title: "البحث" };

export default function SearchPage() {
  const index = buildSearchIndex();
  const first = getConferences()[0];
  const bundle = first ? getBundle(first.slug) : undefined;
  const suggestions = [
    ...(bundle ? getTopicsWithStats(bundle).slice(0, 5) : []).map((t) => t.topic.name),
    "ورشة",
    "اليوم الثاني",
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "الرئيسة", href: routes.home() }, { label: "البحث" }]}
        title="البحث في المنصة"
        lead="ابحث في المؤتمرات والجلسات والورش والمتحدثين والموضوعات."
        motif={false}
        width="reading"
      />
      <div className="container-reading pt-10 pb-20 md:pt-12">
        <Suspense fallback={<div className="h-16 animate-pulse rounded-full bg-surface-muted" aria-busy="true" />}>
          <SearchInterface index={index} suggestions={suggestions} />
        </Suspense>
      </div>
    </>
  );
}
