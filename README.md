# سفراء — Sofraa (functional prototype)

**مبادرة طلبة وخريجي كلية اللغات وعلومها للرصد والترجمة والتوثيق المعرفي للمؤتمرات**

Sofraa is a long-term university knowledge platform. It monitors, translates and documents the knowledge produced at conferences. This repository holds a **high-fidelity functional prototype**: real front-end code (Next.js + TypeScript + Tailwind) that can grow into the production site without a rebuild.

The first conference in the platform is **مؤتمر جمعية الترجمة الأول**, held in partnership with كلية اللغات وعلومها بجامعة الملك سعود (Riyadh, 30 September – 1 October 2026).

> ⚠️ There is **no database, CMS, admin dashboard, authentication or analytics** yet. All content lives in TypeScript data files, and the site is fully static.

---

## 1. Run it locally

Requirements: **Node.js 20+** (LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (every page is pre-rendered to static HTML) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

> On this machine Node was installed as a portable copy in `%LOCALAPPDATA%\node-portable\node-v24.21.0-win-x64`, because the system installer needed admin rights. Either add that folder to `PATH` or install Node.js normally from nodejs.org.

---

## 2. Project structure

```
src/
├─ app/                          # Routes (Next.js App Router)
│  ├─ page.tsx                   # /  Homepage (hero, عن سفراء, كيف تعمل سفراء؟, team tracks)
│  ├─ team/  search/             # /team, /search
│  ├─ conferences/page.tsx       # /conferences
│  ├─ conferences/[conference]/  # one folder serves every conference
│  │  ├─ page.tsx                # conference overview = the conference hub
│  │  ├─ main-sessions/  scientific-sessions/  workshops/
│  │  ├─ topics/  topics/[slug]/
│  │  ├─ activities/[slug]/      # one detail template for sessions + workshops
│  │  ├─ knowledge-map/  outcome/
│  ├─ not-found.tsx              # 404
│  ├─ globals.css                # ★ DESIGN TOKENS (colours, radii, shadows)
│  └─ fonts.ts                   # ★ FONTS
├─ config/
│  ├─ brand.ts                   # ★ LOGO switch
│  └─ navigation.ts              # global nav: الرئيسية · المؤتمرات · الفريق (+ البحث button)
├─ content/                      # ★ ALL CONTENT (no content in components)
│  ├─ types.ts                   # data model (Conference, Activity, Topic, Speaker, TeamStructure…)
│  ├─ site.ts                    # initiative texts + "how Sofraa works" workflow
│  ├─ team.ts                    # OFFICIAL structure: head, supervision, 3 tracks (+ members later)
│  └─ conferences/
│     ├─ index.ts                # registry of conferences
│     └─ translation-conference-1/
│        ├─ conference.ts        # facts, days, program items
│        ├─ activities.ts        # sessions + workshops (reference topic IDs)
│        ├─ topics.ts            # topic taxonomy
│        ├─ speakers.ts
│        └─ outcome.ts           # conference synthesis (empty until documented)
├─ lib/
│  ├─ content.ts                 # query layer — pages read content ONLY through here
│  ├─ search.ts                  # static search index + Arabic normalisation
│  ├─ routes.ts  labels.ts  view-models.ts  page.ts
└─ components/
   ├─ layout/     Header, MobileNavigation, Footer, Breadcrumbs (desktop trail / mobile back link), PageHeader
   ├─ conference/ ConferenceCard, ProgramTimeline, ConferenceVisual
   ├─ activity/   ActivityCard, ActivitiesByDay, ActivityTypeBadge, SpeakerCard, RelatedContent
   ├─ map/        KnowledgeConstellation (new knowledge map: circles, panel, bottom sheet)
   ├─ analytics/  PlatformVisitCounter, Charts (internal dashboard prototype)
   ├─ topics/     TopicIndex
   ├─ ui/         SectionHeader, TopicChip, TopicCard, PendingNote, QuoteBlock, EmptyState
   ├─ search/     SearchInterface
   ├─ brand/      BrandMark (temporary wordmark)
   └─ motif/      Threads ("threads of knowledge" motif)
refrences/                       # source material (conference program image) — untouched
```

---

## 3. How content works

### The core relationship: Topic ↔ Session ↔ Workshop

Relationships are defined in **one place only**: the `topicIds` array on each activity in `activities.ts`.

```ts
{
  id: "workshop-llm-translators",
  kind: "workshop",
  title: "النماذج اللغوية الكبيرة للمترجمين: …",
  topicIds: ["llm", "ai", "machine-translation"],   // ← the relationship
}
```

Everything else is **derived** from that array through one function, `topicIdsOf` in `src/lib/content.ts`, which de-duplicates ids and ignores unknown ones. That covers:

- topic occurrence counts (unique activities);
- each topic page's activity list;
- activity topic chips;
- related activities (shared topics);
- co-occurring topics;
- the outcome's crossing points;
- every edge of the knowledge map.

Nothing is duplicated or hand-wired.

- **Co-occurring topics ("موضوعات تتقاطع معه"):** two topics are related when they appear together in at least one activity. The number of shared activities is the strength, and the list is sorted by it.
- **Topics index:** every topic uses the same tile, in neutral alphabetical order (`getTopicIndex`). Frequency appears only as text ("ظهر في N فعاليات"), never as size or position.

### Where the facts come from

Each record carries a `source` field:

- `"official-program"` — read from the published program image in `/refrences` (titles, days, times, rooms, program items).
- `"prototype"` — written for the prototype and must be replaced or confirmed.

Notes on the current data:

- **Topics** are a *prototype taxonomy*. The documentation team assigned them from the activity titles (`isPrototype: true`).
- **Speakers:** only names that were legible in the program image are listed, each flagged `needsVerification: true`. Scientific-session panels were too small to read reliably, so those activities use `speakersPending: true`, and the UI says the names are "being completed".
- **Summaries, key ideas, outputs/recommendations and quotes** are intentionally **empty**. The UI shows designed "in documentation" states. Nothing is invented.
- **Definition, vision, mission and goal** are presentation-ready prototype wording. Replace them with the approved texts.
- **Team** (`team.ts`) holds only the official structure: founder & head, supervision, and the three tracks with their confirmed leaders. The technology & design track has no confirmed leader, so none is shown. Member lists are empty until the initiative decides to publish them; once filled, they appear as simple text lists per track below the chart.

### Replacing / adding content

| To… | Edit |
| --- | --- |
| Change initiative texts | `src/content/site.ts` |
| Add a track leader or members | `src/content/team.ts` (`leader`, `members: ["…"]`; no photos by design) |
| Document an activity | Fill `summary`, `keyIdeas`, `outputs`, `quote: { text, speakerId, documented: true }` in `activities.ts` |
| Add speakers or bios | `speakers.ts`, then reference their IDs in `speakerIds` / `moderatorIds` |
| Refine topics | `topics.ts` + the `topicIds` on activities |
| Publish the outcome | `outcome.ts`: set `status`, add `items` to each section and the closing `overallReading` |
| **Add a new conference** | Copy the `translation-conference-1/` folder, edit its files, and register it in `src/content/conferences/index.ts`. Every page, search result and the knowledge map pick it up automatically. |

### Path to a CMS later

Pages never import data files directly; they call functions in `src/lib/content.ts`. To move to a CMS (e.g. Sanity, Strapi, Payload, or a headless DB):

1. Recreate the entities from `src/content/types.ts` as CMS collections (they already use stable IDs and slugs).
2. Re-implement the functions in `lib/content.ts` to fetch from the CMS (they can become `async`).
3. Keep the pages and components as they are.

---

### Layout system

There is one centred outer container (76rem). It uses 1.25rem side margins on mobile and 2.5rem from tablet up.

- `container-page`: grids, the conference hub, card lists, the topics index, the knowledge map and the team chart.
- `container-reading`: the same outer container, but every direct child is capped to a 52rem reading measure. In RTL that column sits at the right of the grid, with breathing room to the left. Used for activity detail, topic detail, the conference outcome and search.

A page's header and body use the same container (`<PageHeader width="reading">`), so breadcrumb, title, dividers and content share one right edge. Editorial sections use `RuledHeading` ("العنوان ────").

### Backgrounds

All backgrounds belong to one warm family (tokens in `:root`), and there is no pure white:

| Token | Use |
| --- | --- |
| ivory | Page background |
| `band-sand` | Subtle warm section band |
| `band-teal` | Calm teal-tinted band, e.g. related content |
| deep teal | Rare anchors: conference hero, "how it works", footer |
| `surface` | Warm off-white for cards |

### Imagery

The homepage hero uses `HeroVisual`, an academic arch carrying the knowledge threads. Until approved photography exists, it shows a prototype illustration (not a photo) evoking a conference hall, documentation and translation. To use a photo, set `heroImage: { src, alt }` in `src/config/brand.ts`; it is masked into the same arch with the thread overlay. Conference covers use `coverImage` in each `conference.ts`, and fall back to a generated typographic cover.

### Highlight quote

`QuoteBlock` ("اقتباس بارز") renders only when an activity has `quote: { text, speakerId | attribution, documented: true }`. Without that, the whole section is absent. No quotes exist in the data yet.

---

## 4. Branding (temporary)

The official identity hasn't been supplied yet. Everything is centralised so you can reskin without touching layouts:

- **Colours, radii, shadows:** the `:root` block at the top of `src/app/globals.css`. Components use semantic tokens (`bg-deep`, `text-teal`, `bg-sand`…), never raw hex values.
  Current palette: deep teal `#0E3B3A`, muted teal `#2E6F6A`, warm sand `#C9A96A`, ivory `#F5F2EB`, charcoal `#1F1F1F`.
- **Fonts:** `src/app/fonts.ts`. The body font is IBM Plex Sans Arabic; the temporary display/wordmark font is Noto Kufi Arabic.
- **Logo:** put the files in `public/brand/` and set `logo` / `logoOnDark` in `src/config/brand.ts`. `BrandMark` then renders the real logo everywhere (header, footer, mobile menu).

---

## 5. Knowledge map (new design)

`/conferences/<slug>/knowledge-map` — `src/components/map/KnowledgeConstellation.tsx`, data in `map-topics.ts`.

- **Topics:** the 14 approved map topics (Arabic and English names kept as supplied). This list is **separate** from the 12 knowledge topics and is never merged with them.
- **Layout:** a long, vertically scrolling page of elegant circles (fine rings, an icon, Arabic and English names) in an irregular zigzag, with a gentler zigzag on phones so nothing is clipped. Built from HTML and SVG with no graph library.
- **Lines:** the dotted gold thread only links circles visually in reading order (the legend says so). Teal lines are drawn **only** from approved relations (`relatedMapTopicIds`).
- **Interaction:** click, tap or Enter selects a circle. It is highlighted and the others dim, and the details open in a side panel on desktop or a bottom sheet on phones. The details show linked sessions and workshops, keywords, related topics and links to the 12 knowledge topics. Esc closes them. `?topic=<map-slug>` preselects a topic.
- **Pending state:** every relationship field is empty until approved, and the map then shows a clear pending note instead of invented links.

## 5b. Identity (Sedes Scholarium)

`src/content/site.ts` holds `name` ("سفراء", the current logo wordmark, kept until an updated logo is supplied) and `publicName` ("Sedes Scholarium", used in the hero, about, how-it-works and footer). Latin text is wrapped in `<bdi dir="ltr">`. Change either value in one place.

## 5c. Designer templates (Arabic + English)

`DesignTemplates` on every session or workshop page shows the official Arabic and English templates side by side (stacked on phones). Each image keeps its exact aspect ratio, loads lazily, can be enlarged in a dialog, and can be opened full-size. Until files are supplied, a pending note is shown; no fake templates are ever displayed. Add a template like this:

```ts
templates: {
  ar: { src: "/templates/translation-conference-1/keynote-2-ar.png", width: 1080, height: 1350, alt: "…" },
  en: { src: "/templates/translation-conference-1/keynote-2-en.png", width: 1080, height: 1350, alt: "…" },
},
```

The team org chart works the same way (`team.ts` → `chart`, with an optional portrait version for mobile).

## 5d. Platform visit counter ("عدّاد الزيارات")

The homepage counter covers the **whole platform**. It is **not connected yet**: it shows a pending state and **never a placeholder number** (`src/config/analytics.ts`, where `provider` is `"none"`).

**What is being counted** (`metric`, shown on the page):
- `visits`: browsing sessions. This is the recommended metric.
- `pageviews`: every page opened.
- `visitors`: unique visitors, as estimated by the analytics tool.

**Important:** enabling Vercel Web Analytics does **not** give a public endpoint the site can read to display a total. Its numbers live in the Vercel dashboard. Exporting them requires Web Analytics Drains, which are a paid-plan feature, so this should be confirmed on the actual account.

**Recommended options:**
1. **A dedicated counter in a key-value store**, such as Upstash Redis from the Vercel Marketplace (a free tier is available). A small server route increments the counter once per browser session and returns the total; the key stays in a server-side environment variable. This gives a simple, reliable public number with a clear "since" date.
2. **A privacy-friendly analytics tool with a read API**, such as Plausible (paid) or Umami (free if self-hosted, or a cloud plan). It also powers the internal dashboard, with the API key kept server-side.

Both options need an account or service outside this project, and pricing should be confirmed before connecting. Nothing has been connected.

## 5e. Internal team dashboard (prototype)

`/internal/analytics` is a **design prototype** using clearly labelled illustrative data (`src/content/analytics-demo.ts`). It is not linked anywhere and is marked `noindex`. **Hiding the URL is not security:** before it shows real data it must sit behind access control, such as Vercel Password Protection or SSO (plan-dependent) or an auth layer. Its indicators: total platform visits, visits per conference or output, top pages, top sessions, top workshops, knowledge-map interaction, top topics and keywords, and average session duration. Charts are single-hue (deep teal), with every value printed as text.

See **CONTENT_STATUS.md** for open source conflicts and everything awaiting approval.

---

## 6. Accessibility & quality notes

- `lang="ar" dir="rtl"`, a skip link, semantic landmarks and `aria-current` on navigation.
- Breadcrumbs on desktop; on phones a single stable "العودة إلى …" link to the parent page.
- Visible focus rings, a focus-trapped mobile menu (Esc closes it), and keyboard-selectable map nodes.
- Old URLs redirect: `/about` → `/#about`, `/conferences/<slug>/sessions` → the conference's content section (`next.config.ts`).
- `prefers-reduced-motion` disables animation site-wide.
- Search normalises Arabic (hamza/alef forms, ta marbuta, diacritics, tatweel), supports ↑/↓/Enter, and syncs the query to the URL.
- The pages are marked `noindex` while this is a prototype (see `src/app/layout.tsx`). Remove that at launch.

---

## 7. Putting it on GitHub and deploying (later)

Nothing has been pushed or deployed. When you're ready:

```bash
git init
git add .
git commit -m "Sofraa prototype"
git remote add origin https://github.com/<org>/sofraa-website.git
git push -u origin main
```

> Note: on this computer, the whole user folder (`C:\Users\USER`) is already inside a git repository. Running `git init` inside `SofraaWebsite` gives the project its own repository, so it isn't mixed with the home folder's.

**Deploy:** the easiest route is **Vercel** (import the GitHub repo; no configuration needed). Because every page is static, it can also run on Netlify, Cloudflare Pages, or any Node host via `npm run build && npm start`. Analytics can be added later with an external service (for example Vercel Analytics, Plausible, or Google Analytics) in `src/app/layout.tsx`.

---

## لوحة الإدارة والإحصاءات (أُضيفت في 14 أكتوبر 2026)

### ما الذي يُسجَّل
- يسجّل الموقع زياراته بنفسه عبر `src/components/analytics/Tracker.tsx`، الذي يرسل إلى `/api/track`:
  - مشاهدات الصفحات، والزيارات، ومدة التصفح النشطة.
  - النقر على الكلمات المفتاحية ودوائر الخريطة، وفتح ملفات التقارير.
- **الخصوصية:** لا ملفات تعريف ارتباط، ولا عنوان IP، ولا بيانات شخصية. يُحترم إعداد «عدم التتبع» في المتصفح، وتُستبعد زيارات البرامج الآلية.
- **الزيارة:** جلسة تصفح للمنصة كاملة، تنتهي بعد 30 دقيقة بلا نشاط.
- **مشاهدة الصفحة:** كل صفحة تُفتح.
- **بدء الجمع:** يبدأ العدّ لحظة ربط المخزن، ولا يمكن احتساب ما قبل ذلك لأنه لم يُسجَّل.

### أين تُحفظ الأرقام (`src/lib/analytics/store.ts`)
- **على Vercel:** قاعدة Upstash Redis، ولها خطة مجانية. ربطها خطوة يقوم بها صاحب حساب Vercel:
  1. Vercel ← المشروع ← **Storage** (أو Marketplace) ← **Upstash Redis** ← Create، ثم Connect to Project.
  2. يضيف هذا تلقائيًا المتغيرين `KV_REST_API_URL` و`KV_REST_API_TOKEN`.
  3. أعد النشر (Redeploy).
- **محليًا:** الملف `.data/analytics.json`. فيه زيارات المعاينة المحلية فقط، ولا يُرفع إلى Git.
- **دون مخزن:** يعرض العدّاد حالة انتظار ولا يعرض أي رقم.

### الوصول إلى اللوحة
- **الرابط:** `/admin`. محليًا `http://localhost:3000/admin`، وبعد النشر `https://<نطاق-الموقع>/admin`.
- **الحماية على الخادم:** كل صفحة إدارة تتحقق من جلسة موقّعة (HMAC) في ملف تعريف ارتباط محمي (`HttpOnly`، `SameSite=Strict`، مدته 8 ساعات). من لا يحمل جلسة يُحوَّل إلى `/admin/login`.
- **متغيرات البيئة المطلوبة على Vercel** (Settings ← Environment Variables)، والقالب في `.env.example`:
  - `ADMIN_SESSION_SECRET`: نص عشوائي طوله 32 حرفًا على الأقل.
  - `ADMIN_USERS`: حساب مدير النظام الأول أو أكثر، بصيغة `email:owner:salt:hash`. يُنشأ السطر بالأمر `node scripts/create-admin-user.mjs <email> owner`، ويُضبط مرة واحدة فقط.
- **الصلاحيات:**
  - **مدير نظام** (`owner`): يرى الإحصاءات ويدير المستخدمين.
  - **عضو** (`viewer`): يرى الإحصاءات فقط.
- **إدارة المستخدمين** من اللوحة نفسها (`/admin/accounts`)، لمديري النظام فقط، دون إعادة نشر ودون Claude Code:
  - إضافة مستخدم: يولّد النظام كلمة مرور مؤقتة قوية تظهر مرة واحدة فقط، ويُلزَم صاحبها بتغييرها عند أول دخول.
  - ترقية المستخدم إلى مدير نظام أو تحويله إلى عضو.
  - كلمة مرور مؤقتة جديدة لمن نسي كلمته.
  - إيقاف الصلاحية وإعادة التفعيل.
  - الحذف.
  - إيقاف الحساب أو حذفه أو تغيير كلمة مروره ينهي جلساته المفتوحة فورًا.
- **حدود الإدارة:** حسابات `ADMIN_USERS` لا تُعدَّل من اللوحة، ولا يستطيع أحد تعديل حسابه بنفسه من صفحة المستخدمين، فلا يمكن فقدان الوصول إلى اللوحة.
- **أين تُحفظ الحسابات:** حسابات اللوحة محفوظة في مخزن البيانات نفسه (Upstash Redis على Vercel، والملف `.data/` محليًا). كلمات المرور لا تُحفظ؛ تُحفظ بصمتها المشفّرة (scrypt) فقط.
- **حساب اختبار محلي:** موجود في `.env.local`. الملف للجهاز فقط ولا يُرفع إلى Git، ولا يُستخدم على Vercel.
## إضافات النسخة العربية (نوفمبر 2026)

### صفحات جديدة
- `/about` «عن المبادرة»: النبذة والرؤية والرسالة والهدف ودلالة التسمية والهيكل التنظيمي، من «Sedes Scholarium COLS KSU.pdf» (النصوص في `src/content/site.ts`).
- `/contact` «نقطة وصل»: نموذج تواصل يُرسَل من الخادم إلى البريد الرسمي، مع بطاقة «راسلنا مباشرة».
- `/calendar` «تقويم المؤتمرات»: عدّاد تنازلي وتقويم شهري وتصفية حسب المجال، وتُدار بياناته من لوحة الإدارة.
- قائمة اللغات في الشريط العلوي (`src/config/languages.ts`). العربية وحدها مفعّلة؛ الإنجليزية «قريبًا» حتى تكتمل ترجمتها وتُعتمد.

### إعداد إرسال نموذج «نقطة وصل» (مطلوب مرة واحدة)
يُرسل النموذج عبر خدمة Resend من الخادم، ولا يظهر أي مفتاح في المتصفح. أضيفي في Vercel ← Settings ← Environment Variables:

| المتغير | إلزامي؟ | القيمة |
|---|---|---|
| `RESEND_API_KEY` | نعم | مفتاح API من resend.com |
| `CONTACT_TO_EMAIL` | لا | البريد المستقبِل (الافتراضي sscolsksu@gmail.com) |
| `CONTACT_FROM_EMAIL` | لا | المرسِل، مثل `Sedes Scholarium <noreply@نطاقكم>` بعد توثيق نطاق في Resend |

بدون نطاق موثَّق يُستخدم المرسِل التجريبي `onboarding@resend.dev`، وهو لا يُوصل إلا إلى بريد صاحب حساب Resend؛ لذا أنشئي حساب Resend بالبريد الرسمي sscolsksu@gmail.com. بعد إضافة المتغيرات أعيدي النشر (Redeploy). قبل ذلك يعرض النموذج رسالة واضحة تحيل إلى البريد المباشر، ولا يُظهر رسالة نجاح.

### إدارة تقويم المؤتمرات
لوحة الإدارة ← «تقويم المؤتمرات» (لمدير النظام فقط): إضافة مؤتمر أو تعديله أو حذفه، وتظهر التعديلات فورًا. تُحفظ القائمة في مخزن البيانات نفسه (Upstash Redis). القائمة المبدئية المتحقق منها في `src/content/calendar.ts`.
