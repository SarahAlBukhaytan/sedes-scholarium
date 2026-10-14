import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * مخزن الإحصاءات — where the platform's own visit counts are kept.
 *
 * Backends, picked automatically:
 *  1. Upstash Redis (REST) — used whenever its env variables exist. This is
 *     the production store on Vercel (Vercel Marketplace → Upstash Redis adds
 *     KV_REST_API_URL / KV_REST_API_TOKEN to the project). Free tier exists.
 *  2. Local file `.data/analytics.json` — development only (never on Vercel,
 *     whose file system is not persistent). Counts real local visits.
 *  3. None — production without Redis: the public counter shows a pending
 *     state and the dashboard says "not connected". No fake numbers anywhere.
 *
 * Only aggregate counters are stored: no IP address, user agent, cookie or
 * personal data.
 */

const PREFIX = "ss:";

type Op =
  | { kind: "incr"; key: string; by: number }
  | { kind: "hincr"; key: string; field: string; by: number }
  | { kind: "setnx"; key: string; value: string }
  /** string records (e.g. admin accounts as JSON) */
  | { kind: "hset"; key: string; field: string; value: string }
  | { kind: "hdel"; key: string; field: string };

interface Backend {
  name: "upstash" | "local-file";
  write(ops: Op[]): Promise<void>;
  get(key: string): Promise<string | null>;
  hgetall(key: string): Promise<Record<string, number>>;
  /** String-valued hash (records), e.g. admin accounts. */
  hgetRecords(key: string): Promise<Record<string, string>>;
}

/* ── Upstash Redis (REST API, no SDK needed) ─────────────────────────── */
function upstash(): Backend | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const call = async (body: unknown, endpoint = "") => {
    const res = await fetch(`${url}${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstash ${res.status}`);
    return res.json();
  };
  return {
    name: "upstash",
    async write(ops) {
      const cmds = ops.map((o) =>
        o.kind === "incr"
          ? ["INCRBY", PREFIX + o.key, String(o.by)]
          : o.kind === "hincr"
            ? ["HINCRBY", PREFIX + o.key, o.field, String(o.by)]
            : o.kind === "hset"
              ? ["HSET", PREFIX + o.key, o.field, o.value]
              : o.kind === "hdel"
                ? ["HDEL", PREFIX + o.key, o.field]
                : ["SET", PREFIX + o.key, o.value, "NX"],
      );
      if (cmds.length) await call(cmds, "/pipeline");
    },
    async get(key) {
      const r = (await call(["GET", PREFIX + key])) as { result: string | null };
      return r.result;
    },
    async hgetall(key) {
      const r = (await call(["HGETALL", PREFIX + key])) as { result: string[] | null };
      const out: Record<string, number> = {};
      const arr = r.result ?? [];
      for (let i = 0; i + 1 < arr.length; i += 2) out[arr[i]] = Number(arr[i + 1]) || 0;
      return out;
    },
    async hgetRecords(key) {
      const r = (await call(["HGETALL", PREFIX + key])) as { result: string[] | null };
      const out: Record<string, string> = {};
      const arr = r.result ?? [];
      for (let i = 0; i + 1 < arr.length; i += 2) out[arr[i]] = arr[i + 1];
      return out;
    },
  };
}

/* ── Local JSON file (development only) ──────────────────────────────── */
interface FileData {
  values: Record<string, string>;
  hashes: Record<string, Record<string, number>>;
  records?: Record<string, Record<string, string>>;
}
const FILE = path.join(process.cwd(), ".data", "analytics.json");
let queue: Promise<unknown> = Promise.resolve();

async function readFile(): Promise<FileData> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as FileData;
  } catch {
    return { values: {}, hashes: {} };
  }
}

function localFile(): Backend | null {
  if (process.env.NODE_ENV === "production") return null;
  return {
    name: "local-file",
    write(ops) {
      // serialise writes so concurrent requests never lose an increment
      const job = queue.then(async () => {
        const d = await readFile();
        for (const o of ops) {
          if (o.kind === "incr") d.values[o.key] = String((Number(d.values[o.key]) || 0) + o.by);
          else if (o.kind === "hincr") {
            const h = (d.hashes[o.key] ??= {});
            h[o.field] = (h[o.field] ?? 0) + o.by;
          } else if (o.kind === "hset") (d.records ??= {})[o.key] = { ...(d.records?.[o.key] ?? {}), [o.field]: o.value };
          else if (o.kind === "hdel") delete d.records?.[o.key]?.[o.field];
          else if (d.values[o.key] === undefined) d.values[o.key] = o.value;
        }
        await fs.mkdir(path.dirname(FILE), { recursive: true });
        await fs.writeFile(FILE, JSON.stringify(d, null, 1));
      });
      queue = job.catch(() => undefined);
      return job;
    },
    async get(key) {
      await queue;
      return (await readFile()).values[key] ?? null;
    },
    async hgetall(key) {
      await queue;
      return (await readFile()).hashes[key] ?? {};
    },
    async hgetRecords(key) {
      await queue;
      return (await readFile()).records?.[key] ?? {};
    },
  };
}

export function getBackend(): Backend | null {
  return upstash() ?? localFile();
}

export type { Op };
