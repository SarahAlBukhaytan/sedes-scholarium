"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * In-site tracker (privacy-friendly):
 *  - no cookies, no IP or personal data, nothing shared with third parties;
 *  - respects the browser's "Do Not Track" setting;
 *  - a visit = one entry to the site in a browser tab. It is marked in
 *    sessionStorage (kept per tab, never leaves the browser): refreshing the
 *    page or moving between pages in the same tab keeps the mark, so it is
 *    not a new visit; opening the site again in a new tab or after closing it
 *    starts a new visit — no time window;
 *  - sends page views, active time, and clicks on elements marked with
 *    data-track-keyword / data-track-map / data-track-event.
 */
const KEY = "ss-visit";

function send(body: object) {
  const data = JSON.stringify(body);
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([data], { type: "application/json" }))) return;
  } catch {}
  fetch("/api/track", { method: "POST", body: data, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
}

function visitState(path: string) {
  let s: { confs: string[] } | null = null;
  try {
    s = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
  } catch {}
  const newVisit = !s;
  const confs = s?.confs ?? [];
  const conf = /^\/conferences\/([^/]+)/.exec(path)?.[1];
  const newConfVisit = Boolean(conf && !confs.includes(conf));
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ confs: conf && newConfVisit ? [...confs, conf] : confs }));
  } catch {}
  return { newVisit, newConfVisit };
}

export function Tracker() {
  const pathname = usePathname();
  const visibleSince = useRef<number | null>(null);
  const off = typeof navigator !== "undefined" && navigator.doNotTrack === "1";

  // page views
  useEffect(() => {
    if (off || !pathname || pathname.startsWith("/admin")) return;
    send({ t: "pv", path: pathname, ...visitState(pathname) });
  }, [pathname, off]);

  // active time + marked clicks
  useEffect(() => {
    if (off) return;
    visibleSince.current = document.visibilityState === "visible" ? Date.now() : null;
    const flush = () => {
      if (visibleSince.current === null) return;
      const seconds = Math.min((Date.now() - visibleSince.current) / 1000, 1800);
      visibleSince.current = null;
      if (seconds >= 1) send({ t: "dur", seconds });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else visibleSince.current = Date.now();
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track-keyword],[data-track-map],[data-track-event]");
      if (!el) return;
      if (el.dataset.trackKeyword) send({ t: "ev", name: "keyword", value: el.dataset.trackKeyword });
      else if (el.dataset.trackMap) send({ t: "ev", name: "map-topic", value: el.dataset.trackMap });
      else if (el.dataset.trackEvent) send({ t: "ev", name: el.dataset.trackEvent });
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [off]);

  return null;
}
