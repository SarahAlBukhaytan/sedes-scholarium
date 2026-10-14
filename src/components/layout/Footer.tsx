import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { StarPattern } from "@/components/motif/StarPattern";
import { initiative } from "@/content/site";
import { getConferences } from "@/lib/content";
import { routes } from "@/lib/routes";

/** Footer links — approved wording ("الرئيسة", "فريق العمل"). */
const platformLinks = [
  { href: routes.home(), label: "الرئيسة" },
  { href: routes.conferences(), label: "المؤتمرات" },
  { href: routes.team(), label: "فريق العمل" },
  { href: routes.search(), label: "البحث" },
];

export function Footer() {
  const conferences = getConferences();
  return (
    <footer className="on-dark relative overflow-hidden border-t-2 border-sky bg-deep text-ivory">
      <StarPattern tone="dark" density="sparse" className="absolute inset-0 h-full w-full" />
      <div className="container-page relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/* the official logo — light variation for the navy background */}
          <BrandMark tone="light" variant="full" className="h-auto w-40 md:w-44" />
        </div>
        <nav aria-labelledby="footer-platform-h">
          <h2 id="footer-platform-h" className="text-sm font-semibold text-sand">
            المنصة
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {platformLinks.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-ivory/80 hover:text-ivory hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-conferences-h">
          <h2 id="footer-conferences-h" className="text-sm font-semibold text-sand">
            المؤتمرات
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {conferences.map((c) => (
              <li key={c.id}>
                <Link href={routes.conference(c.slug)} className="text-ivory/80 hover:text-ivory hover:underline">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="relative border-t border-ivory/10">
        <div className="container-page py-5 text-xs text-ivory/65">
          <p>
            © 2026 مبادرة <bdi dir="ltr">{initiative.publicName}</bdi>، {initiative.umbrella}
          </p>
        </div>
      </div>
    </footer>
  );
}
