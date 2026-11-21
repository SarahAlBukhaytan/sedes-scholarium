import type { Metadata } from "next";
import { Mail, MessagesSquare } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { initiative } from "@/content/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "نقطة وصل" };

/** «نقطة وصل» — contact form, then «أو», then the official email. */
export default function ContactPage() {
  return (
    <div className="container-reading pt-6 pb-20 md:pt-10">
      <Breadcrumbs items={[{ label: "الرئيسة", href: routes.home() }, { label: "نقطة وصل" }]} />

      <div className="mx-auto mt-8 max-w-2xl text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-deep text-sky">
          <MessagesSquare className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-[1.85rem] leading-snug font-bold text-deep md:text-[2.6rem] md:leading-tight">نقطة وصل</h1>
        <p className="mt-4 text-base leading-8 text-muted md:text-lg md:leading-9">
          نسعد بتواصلكم، ونرحّب باستفساراتكم ومقترحاتكم وفرص التعاون مع مبادرة <bdi dir="ltr">{initiative.publicName}</bdi>!
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-2xl rounded-[1.5rem] bg-surface p-6 shadow-card md:p-9">
        <ContactForm />
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-line-strong" />
        <span className="text-sm font-semibold text-muted">أو</span>
        <span className="h-px flex-1 bg-line-strong" />
      </div>

      <section aria-labelledby="direct-h" className="mx-auto mt-10 max-w-2xl rounded-[1.5rem] bg-deep px-6 py-9 text-center text-ivory md:px-10">
        <Mail className="mx-auto size-8 text-sky" aria-hidden="true" />
        <h2 id="direct-h" className="mt-3 font-display text-2xl font-bold">
          راسلنا مباشرة
        </h2>
        <p className="mt-2 text-ivory/80">عبر البريد الإلكتروني الرسمي للمبادرة</p>
        <a
          href={`mailto:${initiative.email}`}
          className="mt-4 inline-block font-latin text-lg font-bold break-all text-ivory underline decoration-sky/60 underline-offset-[6px] hover:decoration-sky md:text-xl"
        >
          <bdi dir="ltr">{initiative.email}</bdi>
        </a>
      </section>
    </div>
  );
}
