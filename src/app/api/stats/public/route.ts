import { NextResponse } from "next/server";
import { readPublicStats } from "@/lib/analytics/service";

export const dynamic = "force-dynamic";

/** GET /api/stats/public — the platform-wide visit total (public counter only). */
export async function GET() {
  try {
    return NextResponse.json(await readPublicStats(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ connected: false, visits: null, since: null }, { status: 503 });
  }
}
