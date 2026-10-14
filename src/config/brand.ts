/**
 * إعدادات الهوية — Brand configuration (Brand Identity Guidelines, Version 1, 2026).
 *
 * Logo files in /public/brand/ were exported from the official vector artwork
 * (v1هوية.ps, pages 1 and 4) — not redrawn:
 *   sedes-logo.png        full logo, colour — for white / light backgrounds
 *   sedes-logo-light.png  full logo, white + light-blue star — for dark navy
 *   sedes-mark.png        brand mark only (no word mark), colour
 *   sedes-mark-light.png  brand mark only, for dark backgrounds
 * Use the variant that matches the background (guide p.6) and keep clear
 * space around it (guide p.5).
 */
export const brand = {
  name: "Sedes Scholarium",
  logo: { src: "/brand/sedes-logo.png", width: 720, height: 679 },
  logoOnDark: { src: "/brand/sedes-logo-light.png", width: 720, height: 679 },
  mark: { src: "/brand/sedes-mark.png", width: 360, height: 260 },
  markOnDark: { src: "/brand/sedes-mark-light.png", width: 360, height: 261 },
};
