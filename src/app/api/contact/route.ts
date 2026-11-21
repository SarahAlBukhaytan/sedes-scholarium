import { NextResponse, type NextRequest } from "next/server";
import { initiative } from "@/content/site";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact — «نقطة وصل» form → the initiative's official inbox.
 *
 * Mail is sent from the server through Resend (https://resend.com); the API
 * key never reaches the browser. Environment variables (Vercel → Settings →
 * Environment Variables):
 *   RESEND_API_KEY      required — without it the form answers 503 and says so.
 *   CONTACT_TO_EMAIL    optional — defaults to the official address in site.ts.
 *   CONTACT_FROM_EMAIL  optional — defaults to Resend's shared test sender,
 *                       which can only deliver to the Resend account's own
 *                       address (so create the Resend account with the
 *                       official inbox, or verify a domain and set this).
 *
 * Spam protection, invisible to visitors: a hidden honeypot field, a minimum
 * time on the page before sending, a per-address rate limit, length limits,
 * and bots are refused. Messages are not stored anywhere on the site.
 */

const BOT = /bot|crawl|spider|slurp|headless|lighthouse/i;
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max) : "";
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get("user-agent") ?? "")) return fail(403, "تعذّر إرسال الرسالة.");

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail(400, "تعذّر قراءة الرسالة. حدّث الصفحة وحاول مرة أخرى.");
  }

  // honeypot: real visitors never see or fill this field
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });
  // filled in under 3 seconds = automated
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 3000) {
    return fail(400, "أُرسلت الرسالة بسرعة غير معتادة. انتظر لحظات ثم أعد المحاولة.");
  }

  const name = oneLine(clean(body.name, 120));
  const email = oneLine(clean(body.email, 200));
  const subject = oneLine(clean(body.subject, 200));
  const message = clean(body.message, 5000);
  if (!name || !email || !subject || !message) return fail(400, "يُرجى تعبئة جميع الحقول المطلوبة.");
  if (!EMAIL.test(email)) return fail(400, "يُرجى إدخال بريد إلكتروني صحيح.");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip) || rateLimited(`email:${email.toLowerCase()}`)) {
    return fail(429, "أرسلت عدة رسائل خلال وقت قصير. يُرجى المحاولة بعد قليل.");
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return fail(503, `خدمة الإرسال غير مهيأة حاليًا. يمكنك مراسلتنا مباشرة عبر ${initiative.email}`);
  }

  const to = process.env.CONTACT_TO_EMAIL || initiative.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Sedes Scholarium <onboarding@resend.dev>";
  const text = [
    "رسالة جديدة من نموذج «نقطة وصل» في موقع Sedes Scholarium",
    "",
    `الاسم الكامل: ${name}`,
    `البريد الإلكتروني: ${email}`,
    `موضوع الرسالة: ${subject}`,
    "",
    "نص الرسالة:",
    message,
  ].join("\n");

  try {
    const res = await fetch(`${process.env.RESEND_API_BASE || "https://api.resend.com"}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `نقطة وصل: ${subject}`, text }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    // success only when the mail service confirms it accepted the message
    if (!res.ok || !data.id) {
      console.error("contact: mail service refused", res.status);
      return fail(502, `تعذّر إرسال الرسالة الآن. حاول لاحقًا أو راسلنا مباشرة عبر ${initiative.email}`);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return fail(502, `تعذّر الاتصال بخدمة البريد. حاول لاحقًا أو راسلنا مباشرة عبر ${initiative.email}`);
  }
}
