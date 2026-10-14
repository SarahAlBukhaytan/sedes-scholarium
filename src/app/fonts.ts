import { Cairo, Noto_Sans } from "next/font/google";

/**
 * Official typefaces (Brand Identity Guidelines, Typography):
 *  - Cairo      — Arabic text (body and headings).
 *  - Noto Sans  — English / Latin text.
 *
 * Noto Sans is loaded with the Latin subset only, so in the font stack
 * (Noto Sans → Cairo) Latin characters use Noto Sans and Arabic falls
 * through to Cairo automatically.
 */
export const arabicFont = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

export const latinFont = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
  // The generated size-adjusted fallback covers ALL characters and would
  // capture Arabic before Cairo — so it is disabled.
  adjustFontFallback: false,
});
