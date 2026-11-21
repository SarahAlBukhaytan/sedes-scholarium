"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const SUCCESS = "شكرًا لتواصلك مع فريق Sedes Scholarium، وسنوافيك بردّنا في أقرب وقت!";

const field =
  "mt-2 block w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/25 aria-[invalid=true]:border-red-600";

/**
 * «نقطة وصل» form. Sends to /api/contact; the button is locked while a
 * message is being sent, and the thank-you message appears only after the
 * server confirms the mail service accepted it.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const startedAt = useRef(0);
  // a ref, not state: blocks a second click before React has re-rendered
  const inFlight = useRef(false);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const sending = status.kind === "sending";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const bad: Record<string, boolean> = {};
    for (const k of ["name", "email", "subject", "message"]) if (!data[k]?.trim()) bad[k] = true;
    const emailEl = form.elements.namedItem("email") as HTMLInputElement;
    if (data.email?.trim() && !emailEl.checkValidity()) bad.email = true;
    setInvalid(bad);
    if (Object.keys(bad).length) {
      setStatus({
        kind: "error",
        message: bad.email && data.email?.trim() ? "يُرجى إدخال بريد إلكتروني صحيح." : "يُرجى تعبئة جميع الحقول المطلوبة.",
      });
      (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && out.ok) {
        form.reset();
        setStatus({ kind: "sent" });
      } else {
        setStatus({ kind: "error", message: out.error ?? "تعذّر إرسال الرسالة. حاول مرة أخرى." });
      }
    } catch {
      setStatus({ kind: "error", message: "تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت وحاول مرة أخرى." });
    } finally {
      inFlight.current = false;
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="flex flex-col items-center gap-4 px-2 py-10 text-center">
        <CheckCircle2 className="size-12 text-royal" aria-hidden="true" />
        <p className="max-w-md font-display text-xl leading-9 font-bold text-deep">{SUCCESS}</p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus({ kind: "idle" });
          }}
          className="mt-2 text-sm font-semibold text-royal underline underline-offset-4 hover:text-deep"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  const label = (id: string, text: string) => (
    <label htmlFor={id} className="block font-semibold text-deep">
      {text} <span className="text-red-700" aria-hidden="true">*</span>
      <span className="sr-only"> (إلزامي)</span>
    </label>
  );

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={sending} className="space-y-5">
      <div>
        {label("c-name", "الاسم الكامل")}
        <input id="c-name" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="أدخل اسمك الكامل" aria-invalid={invalid.name || undefined} className={field} />
      </div>
      <div>
        {label("c-email", "البريد الإلكتروني")}
        <input id="c-email" name="email" type="email" dir="ltr" required maxLength={200} autoComplete="email" placeholder="أدخل بريدك الإلكتروني" aria-invalid={invalid.email || undefined} className={`${field} text-left placeholder:text-right`} />
      </div>
      <div>
        {label("c-subject", "موضوع الرسالة")}
        <input id="c-subject" name="subject" type="text" required maxLength={200} placeholder="اكتب موضوع رسالتك" aria-invalid={invalid.subject || undefined} className={field} />
      </div>
      <div>
        {label("c-message", "نص الرسالة")}
        <textarea id="c-message" name="message" required maxLength={5000} rows={6} placeholder="اكتب رسالتك هنا…" aria-invalid={invalid.message || undefined} className={`${field} resize-y`} />
      </div>
      {/* honeypot — hidden from people and assistive technology */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="c-website">الموقع</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="polite">
        {status.kind === "error" && (
          <p role="alert" className="rounded-[var(--radius-control)] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-800">
            {status.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-deep px-7 py-3 font-bold text-ivory transition-colors hover:bg-royal disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4 -scale-x-100" aria-hidden="true" />}
        {sending ? "جارٍ الإرسال…" : "إرسال الرسالة"}
      </button>
    </form>
  );
}
