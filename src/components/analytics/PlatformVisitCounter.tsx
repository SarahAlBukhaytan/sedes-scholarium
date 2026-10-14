"use client";

import { useEffect, useRef, useState } from "react";
import { StarGlyph } from "@/components/motif/StarPattern";
import { metricLabel } from "@/config/analytics";

interface Stats {
  connected: boolean;
  visits: number | null;
  since: string | null;
}

const fmtNumber = new Intl.NumberFormat("ar-SA-u-nu-latn");
const DURATION = 1800; // ms
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * «إجمالي زيارات المنصة» — homepage section (platform-wide total).
 *
 * The number comes from /api/stats/public (real visits of the whole platform)
 * and refreshes every minute. When the section first enters the viewport the
 * DISPLAYED number counts up from 0 to the real total once (ease-out, ~1.8 s,
 * requestAnimationFrame); later refreshes update it directly. The animation
 * is display-only — it never changes the stored count. Reduced-motion users
 * see the final number immediately. With no data store: a calm message, no
 * number.
 */
export function PlatformVisitCounter() {
  const label = metricLabel.visits;
  const [stats, setStats] = useState<Stats | null>(null);
  const [shown, setShown] = useState(0);
  const [inView, setInView] = useState(false);
  const animated = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // real data, refreshed every minute
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/stats/public", { cache: "no-store" })
        .then((r) => r.json())
        .then((s: Stats) => alive && setStats(s))
        .catch(() => alive && setStats({ connected: false, visits: null, since: null }));
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // start once, when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const target = stats?.connected && stats.visits !== null ? stats.visits : null;

  useEffect(() => {
    if (target === null || !inView) return;
    // after the first animation, refreshes simply show the new real value
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animated.current || reduce || target === 0) {
      animated.current = true;
      setShown(target);
      return;
    }
    animated.current = true;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setShown(Math.round(easeOutCubic(t) * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, inView]);

  return (
    <section ref={sectionRef} aria-labelledby="visits-h" className="container-page pb-14 md:pb-20">
      <div className="on-dark relative overflow-hidden rounded-[1.5rem] bg-indigo text-ivory">
      {/* quiet identity stars */}
      <StarGlyph className="absolute top-8 right-[12%] size-5" />
      <StarGlyph className="absolute top-14 right-[calc(12%+1.6rem)] size-2.5" />
      <StarGlyph className="absolute bottom-10 left-[10%] size-6" />
      <StarGlyph className="absolute bottom-16 left-[calc(10%+2rem)] size-3" />

      <div className="relative flex flex-col items-center px-6 py-14 text-center md:py-16">
        <h2 id="visits-h" className="font-display text-xl font-bold text-lilac-soft md:text-2xl">
          {label.title}
        </h2>
        <span aria-hidden="true" className="mt-4 block h-px w-16 bg-sky" />

        <div className="mt-6 min-h-[5.5rem] md:min-h-[7rem]" aria-live="polite">
          {stats === null ? (
            <p className="pt-6 text-lg text-lilac-soft">…</p>
          ) : target !== null ? (
            <p className="flex items-baseline justify-center gap-3">
              {/* screen readers get the real number straight away */}
              <span className="sr-only">
                {fmtNumber.format(target)} {label.unit}
              </span>
              <span aria-hidden="true" className="font-latin text-6xl leading-none font-bold tabular-nums md:text-8xl">
                {fmtNumber.format(shown)}
              </span>
              <span aria-hidden="true" className="font-display text-xl font-semibold text-sky md:text-2xl">
                {label.unit}
              </span>
            </p>
          ) : (
            <p className="pt-6 text-lg leading-8 text-lilac-soft">سيظهر العدد قريبًا</p>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
