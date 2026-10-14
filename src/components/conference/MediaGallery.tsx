"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ConferenceMedia } from "@/content/types";

type Img = Extract<ConferenceMedia, { kind: "image" }>;
type Vid = Extract<ConferenceMedia, { kind: "video" }>;

/**
 * التغطية المصورة — responsive photo grid + lightbox, and a native video
 * player with controls. Thumbnails keep each photo's own aspect ratio
 * (masonry columns), are lazy-loaded with their real size so nothing shifts. No captions are invented:
 * images are described generically by their position only.
 */
export function MediaGallery({ items, label }: { items: ConferenceMedia[]; label: string }) {
  const images = items.filter((m): m is Img => m.kind === "image");
  const videos = items.filter((m): m is Vid => m.kind === "video");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const show = useCallback((i: number) => {
    setOpen(i);
    dialog.current?.showModal();
  }, []);
  const close = useCallback(() => dialog.current?.close(), []);
  const step = useCallback(
    (d: number) => setOpen((cur) => (cur === null ? cur : (cur + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => setOpen(null);
    // RTL: the right arrow goes to the previous photo, the left arrow to the next.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(1);
      if (e.key === "ArrowRight") step(-1);
    };
    el.addEventListener("close", onClose);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const alt = (i: number) => `${label} — صورة ${i + 1} من ${images.length}`;
  const current = open === null ? null : images[open];

  return (
    <div className="space-y-8">
      {videos.map((v, i) => (
        <figure key={v.src} className="flex justify-center overflow-hidden rounded-[var(--radius-card)] border border-line bg-deep p-2">
          <video
            controls
            preload="metadata"
            playsInline
            className="block h-auto max-h-[75vh] w-auto max-w-full rounded-lg bg-deep"
            aria-label={`${label} — مقطع فيديو ${i + 1}`}
          >
            <source src={v.src} type={v.type} />
            يتعذر تشغيل الفيديو في هذا المتصفح.{" "}
            <a href={v.src} className="underline">
              تنزيل المقطع
            </a>
          </video>
        </figure>
      ))}

      {images.length > 0 && (
        <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {images.map((m, i) => (
            <li key={m.src} className="mb-3 break-inside-avoid">
              <button
                type="button"
                onClick={() => show(i)}
                className="group relative block w-full overflow-hidden rounded-xl border border-line bg-surface-muted"
                style={{ aspectRatio: `${m.width} / ${m.height}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export-friendly thumbnail with known size */}
                <img
                  src={m.thumb}
                  alt={alt(i)}
                  width={480}
                  height={Math.round((480 * m.height) / m.width)}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-2 flex size-8 items-center justify-center rounded-full bg-deep/70 text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <Expand className="size-4" />
                </span>
                <span className="sr-only">عرض الصورة بحجم أكبر</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        aria-label="عارض الصور"
        className="m-auto h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 backdrop:bg-deep/90"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {current && open !== null && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-3 sm:p-6" onClick={(e) => e.target === e.currentTarget && close()}>
            {/* eslint-disable-next-line @next/next/no-img-element -- original photo, natural aspect ratio */}
            <img
              src={current.src}
              alt={alt(open)}
              width={current.width}
              height={current.height}
              className="max-h-[calc(100dvh-6rem)] w-auto max-w-full rounded-lg object-contain"
            />
            <div className="flex items-center gap-3 text-ivory">
              <button type="button" onClick={() => step(-1)} className="flex size-11 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20">
                <ChevronRight className="size-5" aria-hidden="true" />
                <span className="sr-only">الصورة السابقة</span>
              </button>
              <p className="min-w-16 text-center text-sm tabular-nums" aria-live="polite">
                {open + 1} / {images.length}
              </p>
              <button type="button" onClick={() => step(1)} className="flex size-11 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20">
                <ChevronLeft className="size-5" aria-hidden="true" />
                <span className="sr-only">الصورة التالية</span>
              </button>
              <button type="button" onClick={close} className="ms-4 flex size-11 items-center justify-center rounded-full bg-ivory/10 hover:bg-ivory/20">
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">إغلاق</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
