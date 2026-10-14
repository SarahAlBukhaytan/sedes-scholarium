import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tracker } from "@/components/analytics/Tracker";
import { brand } from "@/config/brand";
import { initiative } from "@/content/site";
import { arabicFont, latinFont } from "./fonts";
import "./globals.css";

const title = `${initiative.name} — ${initiative.descriptor}`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s · ${initiative.name}`,
  },
  description: initiative.definition,
  applicationName: initiative.name,
  icons: { icon: brand.mark.src, apple: brand.logo.src },
  // Social share card. Set `metadataBase` to the real domain at launch so the
  // image URL becomes absolute (not done here: the domain is out of scope).
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: initiative.name,
    title,
    description: initiative.definition,
    images: [{ url: brand.logo.src, width: brand.logo.width, height: brand.logo.height, alt: initiative.name }],
  },
  twitter: { card: "summary", title, description: initiative.definition, images: [brand.logo.src] },
  // Prototype: keep out of search engines until launch.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0931",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arabicFont.variable} ${latinFont.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-deep px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:right-3"
        >
          تخطَّ إلى المحتوى
        </a>
        <Header />
        <main id="main" className="surface-gray flex-1">
          {children}
        </main>
        <Footer />
        <Tracker />
      </body>
    </html>
  );
}
