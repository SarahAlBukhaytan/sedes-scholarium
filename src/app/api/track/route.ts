import { NextResponse, type NextRequest } from "next/server";
import { parsePayload, record } from "@/lib/analytics/service";

export const dynamic = "force-dynamic";

/** Automated clients are not visitors. */
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor/i;

/**
 * POST /api/track — one aggregate counter update from the in-site tracker.
 * The request's IP and user agent are not stored.
 */
export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const payload = parsePayload(body);
  if (!payload) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const stored = await record(payload);
    return NextResponse.json({ ok: true, stored });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
