import { notFound } from "next/navigation";
import { getBundle, getConferences } from "@/lib/content";

export function generateStaticParams() {
  return getConferences().map((c) => ({ conference: c.slug }));
}

export const dynamicParams = false;

/**
 * Conference pages share no extra chrome: the overview page is the hub,
 * and every inner page carries its own breadcrumb / back link.
 */
export default async function ConferenceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ conference: string }>;
}) {
  const { conference } = await params;
  if (!getBundle(conference)) notFound();
  return children;
}
