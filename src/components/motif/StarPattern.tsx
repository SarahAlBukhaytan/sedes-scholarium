/**
 * The star-inspired pattern of the identity (guide p.7): the four-pointed
 * star of the logo, used as large corner shapes and small sparkles.
 * Purely decorative (aria-hidden). It sits on the inline-END side (left in
 * RTL) so it never runs behind the start of Arabic text.
 */

/** Four-pointed star with concave sides, centred on (cx, cy). */
export function starPath(cx: number, cy: number, r: number, k = 0.16) {
  const c = k * r;
  return [
    `M${cx} ${cy - r}`,
    `Q${cx + c} ${cy - c} ${cx + r} ${cy}`,
    `Q${cx + c} ${cy + c} ${cx} ${cy + r}`,
    `Q${cx - c} ${cy + c} ${cx - r} ${cy}`,
    `Q${cx - c} ${cy - c} ${cx} ${cy - r}Z`,
  ].join(" ");
}

export function StarPattern({
  className = "",
  tone = "light",
  density = "full",
}: {
  className?: string;
  /** "light" for white/lilac backgrounds, "dark" for navy sections */
  tone?: "light" | "dark";
  density?: "full" | "sparse";
}) {
  const full = density === "full";
  return (
    <svg
      viewBox="0 0 920 340"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {tone === "dark" ? (
        <>
          {/* solid identity colours only (no transparency-made shades) */}
          <path d={starPath(40, 330, 250, 0.2)} fill="var(--sedes-indigo)" />
          {full && <path d={starPath(930, -20, 130, 0.2)} fill="var(--sedes-royal)" />}
          {full && <path d={starPath(560, 34, 6)} fill="var(--sedes-sky)" />}
        </>
      ) : (
        <>
          <path d={starPath(40, 320, 230, 0.2)} fill="none" stroke="var(--sedes-sky)" strokeWidth="1.2" />
          {full && <path d={starPath(900, 0, 120, 0.2)} fill="none" stroke="var(--sedes-sky)" strokeWidth="1.2" />}
          {full && <path d={starPath(330, 74, 9)} fill="var(--sedes-sky)" />}
        </>
      )}
    </svg>
  );
}

/** A single small star (bullets, rules, quote marks). */
export function StarGlyph({ className = "", color = "var(--sedes-sky)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d={starPath(10, 10, 10, 0.16)} fill={color} />
    </svg>
  );
}
