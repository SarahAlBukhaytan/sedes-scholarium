import type { Metadata } from "next";
import { Clock, Eye, FileText, Network, Users, type LucideIcon } from "lucide-react";
import { conferenceBundles } from "@/content/conferences";
import { requireAdmin } from "@/lib/admin/auth";
import { readAdminStats } from "@/lib/analytics/service";
import { routes } from "@/lib/routes";
import { AdminShell, Panel } from "./AdminShell";
import { AutoRefresh } from "./AutoRefresh";
import { DailyVisitsChart } from "./DailyVisitsChart";

export const metadata: Metadata = { title: "لوحة الإدارة", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("ar-SA-u-nu-latn");
const fmtDate = new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { dateStyle: "long" });

/** Human labels for stored keys (paths, slugs, ids) — resolved from the content. */
function labels() {
  const m = new Map<string, string>([
    ["/", "الرئيسية"],
    ["/conferences", "المؤتمرات"],
    ["/team", "فريق العمل"],
    ["/search", "البحث"],
  ]);
  const sub: Record<string, string> = {
    "main-sessions": "الجلسات الرئيسة",
    "scientific-sessions": "الجلسات العلمية",
    workshops: "ورش العمل",
    axes: "محاور المؤتمر",
    topics: "الموضوعات المعرفية",
    "knowledge-map": "خريطة الترابط المعرفي",
    outcome: "حصيلة المؤتمر",
  };
  for (const b of conferenceBundles) {
    const c = b.conference;
    m.set(c.slug, c.title);
    m.set(routes.conference(c.slug), c.title);
    for (const [k, v] of Object.entries(sub)) m.set(`/conferences/${c.slug}/${k}`, `${v} — ${c.shortTitle}`);
    for (const a of b.activities) {
      m.set(`${c.slug}/${a.slug}`, a.title);
      m.set(routes.activity(c.slug, a.slug), a.title);
    }
    for (const t of b.topics) {
      m.set(`${c.slug}/${t.slug}`, t.name);
      m.set(routes.topic(c.slug, t.slug), `موضوع: ${t.name}`);
    }
    for (const t of b.mapTopics) m.set(t.id, t.nameAr);
  }
  return (k: string) => m.get(k) ?? k;
}

/** Request time (server render) — kept outside the component body for purity. */
function renderTime() {
  return Date.now();
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (!m) return { value: fmt.format(sec), unit: "ثانية" };
  return { value: `${fmt.format(m)}:${String(sec).padStart(2, "0")}`, unit: "دقيقة" };
}

export default async function AdminPage() {
  const session = await requireAdmin();
  const stats = await readAdminStats().catch(() => null);
  const label = labels();

  return (
    <AdminShell session={session} active="dashboard" title="إحصاءات المنصة">
      {/* live numbers: re-fetched every 20 seconds while this page is open */}
      <AutoRefresh seconds={20} />
      {!stats ? (
        <div className="rounded-[var(--radius-card)] bg-surface p-6 leading-8 text-ink">
          <p className="font-semibold text-deep">مخزن الإحصاءات غير متصل في هذه البيئة.</p>
          <p className="text-muted">لا تُعرض أي أرقام حتى يُربط المخزن. على Vercel: ربط قاعدة Upstash Redis بالمشروع (README ← «لوحة الإدارة والإحصاءات»).</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted">
            {stats.since ? `بدأ جمع البيانات في ${fmtDate.format(new Date(stats.since))}` : "لم تُسجَّل أي زيارة بعد"} · المصدر:{" "}
            {stats.backend === "upstash" ? "قاعدة بيانات الخادم" : "ملف محلي (بيانات المعاينة على هذا الجهاز فقط)"}
          </p>

          <section aria-label="المؤشرات الرئيسة" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={Users} label="إجمالي الزيارات" value={fmt.format(stats.visits)} unit="زيارة" hint="جلسات تصفّح للمنصة كاملة" />
            <Kpi icon={Eye} label="مشاهدات الصفحات" value={fmt.format(stats.pageviews)} unit="مشاهدة" hint={stats.visits ? `${fmt.format(Math.round((stats.pageviews / stats.visits) * 10) / 10)} صفحة لكل زيارة في المتوسط` : "كل صفحة تُفتح"} />
            <Kpi
              icon={Clock}
              label="متوسط مدة التصفح"
              {...(stats.avgDurationSeconds === null
                ? { value: "—", unit: "", hint: "تُسجَّل المدة حين يغادر الزائر الصفحة" }
                : { ...formatDuration(stats.avgDurationSeconds), hint: "الوقت النشط في الزيارة الواحدة" })}
            />
            <Kpi icon={Network} label="تفاعلات الخريطة" value={fmt.format(stats.mapInteractions)} unit="نقرة" hint={`${fmt.format(stats.mapViews)} مشاهدة لصفحة الخريطة`} />
          </section>

          <Panel title="الزيارات اليومية" hint="آخر 30 يومًا، بالتوقيت العالمي" id="daily-h">
            <DailyVisitsChart byDay={Object.fromEntries(stats.visitsByDay.map((r) => [r.key, r.value]))} since={stats.since} now={renderTime()} />
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="الزيارات بحسب المؤتمر" id="conf-h">
              <BarList rows={stats.conferenceVisits} label={label} unit="زيارة" />
            </Panel>
            <Panel title="أكثر الصفحات مشاهدة" id="pages-h">
              <BarList rows={stats.topPages} label={label} unit="مشاهدة" />
            </Panel>
            <Panel title="أكثر الجلسات والورش مشاهدة" id="acts-h">
              <BarList rows={stats.topActivities} label={label} unit="مشاهدة" />
            </Panel>
            <Panel title="أكثر الموضوعات المعرفية دخولًا" id="topics-h">
              <BarList rows={stats.topTopics} label={label} unit="مشاهدة" />
            </Panel>
            <Panel title="التفاعل مع دوائر خريطة الترابط" id="map-h">
              <BarList rows={stats.topMapTopics} label={label} unit="نقرة" />
            </Panel>
            <Panel title="أكثر الكلمات المفتاحية نقرًا" id="kw-h">
              <BarList rows={stats.topKeywords} label={(k) => k} unit="نقرة" />
            </Panel>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted">
            <FileText className="size-4" aria-hidden="true" /> فتح ملفات التقارير الأصلية أو تحميلها: {fmt.format(stats.pdfOpens)}
          </p>
        </>
      )}

      {/* how the numbers are counted — kept here, not on the public page */}
      <Panel title="عن الإحصاءات: كيف تُحتسب الأرقام" id="help-h">
        <dl className="grid gap-x-10 gap-y-5 text-[0.95rem] leading-7 text-ink md:grid-cols-2">
          <HelpItem term="الزيارة">
            كل دخول جديد إلى المنصة يُحتسب زيارة، حتى لو عاد الزائر نفسه بعد دقائق: فتح الموقع في تبويب جديد، أو العودة إليه بعد إغلاقه.
            أما تحديث الصفحة والتنقل بين صفحات الموقع في التبويب نفسه فيبقيان ضمن الزيارة نفسها ولا يُحتسبان زيارة جديدة. هذا هو الرقم
            الظاهر للزوار في الصفحة الرئيسية.
          </HelpItem>
          <HelpItem term="مشاهدة الصفحة">
            كل صفحة تُفتح تُحتسب مشاهدةً مستقلة، بما في ذلك إعادة تحميلها، فالزيارة الواحدة تضم عادةً عدة مشاهدات.
          </HelpItem>
          <HelpItem term="تحديث الأرقام">
            تُسجَّل الزيارات لحظة حدوثها، وتتحدث هذه الصفحة تلقائيًا كل 20 ثانية ما دامت مفتوحة، ويتحدث العدّاد في الصفحة الرئيسية كل 30 ثانية،
            دون إعادة نشر الموقع أو تعديل يدوي.
          </HelpItem>
          <HelpItem term="النطاق">تُجمع الأرقام لمنصة Sedes Scholarium كاملة، بكل مؤتمراتها وصفحاتها، ثم تُفصَّل هنا بحسب المؤتمر والصفحة.</HelpItem>
          <HelpItem term="ما لا يُحتسب">برامج الفهرسة الآلية، وصفحات لوحة الإدارة، ومن فعّل خيار «عدم التتبع» في متصفحه.</HelpItem>
          <HelpItem term="مدة التصفح">الوقت الذي تكون فيه الصفحة ظاهرة أمام الزائر، ويُسجَّل حين يغادرها أو يخفيها؛ والمتوسط = مجموع المدد ÷ عدد الزيارات.</HelpItem>
          <HelpItem term="الخصوصية وبدء الجمع">
            لا تُحفظ ملفات تعريف ارتباط ولا عناوين IP ولا بيانات شخصية، بل أعداد إجمالية فقط. يبدأ العدّ من لحظة تشغيل المخزن، ولا يمكن احتساب
            ما قبلها.
          </HelpItem>
        </dl>
      </Panel>
    </AdminShell>
  );
}

function HelpItem({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-deep">{term}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, unit, hint }: { icon: LucideIcon; label: string; value: string; unit: string; hint: string }) {
  return (
    <div className="flex flex-col rounded-[var(--radius-card)] bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-full bg-lilac-soft text-royal" aria-hidden="true">
          <Icon className="size-[1.1rem]" />
        </span>
      </div>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="font-latin text-4xl leading-none font-bold text-deep tabular-nums">{value}</span>
        {unit && <span className="text-sm font-semibold text-royal">{unit}</span>}
      </p>
      <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-muted">{hint}</p>
    </div>
  );
}

/** Ranked list: rank · label with a one-blue bar on a lilac track · value. */
function BarList({ rows, label, unit }: { rows: { key: string; value: number }[]; label: (k: string) => string; unit: string }) {
  if (!rows.length) {
    return <p className="rounded-[var(--radius-control)] border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">لا توجد بيانات بعد.</p>;
  }
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <table className="w-full text-sm">
      <thead className="sr-only">
        <tr>
          <th>الترتيب</th>
          <th>العنصر</th>
          <th>العدد</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.key} title={`${label(r.key)}: ${fmt.format(r.value)} ${unit}`}>
            <td className="w-7 py-2 align-top text-xs font-semibold text-muted tabular-nums">{fmt.format(i + 1)}</td>
            <td className="py-2 pe-4">
              <p className="line-clamp-1 text-ink">{label(r.key)}</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-lilac-soft">
                <div className="h-full rounded-full bg-royal" style={{ width: `${Math.max(3, (r.value / max) * 100)}%` }} />
              </div>
            </td>
            <td className="w-14 py-2 text-start align-top font-semibold text-deep tabular-nums">{fmt.format(r.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
