import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { StarPattern } from "@/components/motif/StarPattern";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <StarPattern className="absolute inset-0 h-full w-full" />
      <div className="container-page relative flex min-h-[60vh] flex-col items-start justify-center py-20">
        <p className="font-display text-7xl font-bold text-sand md:text-8xl" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-deep md:text-4xl">انقطع الخيط هنا</h1>
        <p className="mt-3 max-w-lg text-lg leading-9 text-muted">
          الصفحة التي تبحث عنها غير موجودة أو نُقلت. يمكنك العودة إلى الرئيسة، أو البحث عمّا تريد.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={routes.home()}
            className="group inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3 font-semibold text-ivory hover:bg-teal"
          >
            الصفحة الرئيسة
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href={routes.search()}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-6 py-3 font-semibold text-deep hover:border-teal"
          >
            <Search className="size-4" aria-hidden="true" />
            البحث
          </Link>
          <Link
            href={routes.conferences()}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-teal hover:text-deep"
          >
            المؤتمرات
          </Link>
        </div>
      </div>
    </section>
  );
}
