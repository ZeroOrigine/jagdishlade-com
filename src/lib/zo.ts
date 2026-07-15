/**
 * The live data layer.
 *
 * Every number about ZeroOrigine that appears on this site is fetched, at request
 * time, from zeroorigine.com's public API. The same database the Minds write to.
 * Nothing is typed by hand. That is the entire point: the old site said "2 products
 * live" for four months while six were live. A site about honesty cannot need a human
 * to remember to tell it the truth.
 *
 * FAIL-SOFT CONTRACT: if an endpoint blips (and /api/stats is known to intermittently
 * return {"detail":"Unauthorized"} because a Netlify redirect shadows the Next route),
 * we return null and the UI renders NOTHING for that block. We never fall back to a
 * remembered number. A stale number is a lie; an absence is honest.
 */

const ZO = 'https://zeroorigine.com';

async function get<T>(path: string): Promise<T | null> {
  try {
    // no-store, not ISR: Netlify's data cache never refreshed `revalidate`
    // entries. The site served July-12 numbers for days while claiming
    // "refreshed every 60s". A per-request fetch cannot serve a remembered
    // number; zeroorigine's own CDN caching (s-maxage=60) keeps it cheap.
    const res = await fetch(`${ZO}${path}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null; // an HTML page came back = route shadowed
    const json = (await res.json()) as Record<string, unknown>;
    // The control API answers {"detail":"Unauthorized"} with HTTP 200. Treat as absence.
    if (json && json.ok !== true) return null;
    return json as T;
  } catch {
    return null;
  }
}

export interface ZoProduct {
  slug: string;
  name: string;
  tagline: string | null;
  url: string | null;
}

export interface ZoStats {
  ok: true;
  liveCount: number;
  totalCount: number;
  totalSpend: number;
  products: ZoProduct[];
}

export interface ZoPulse {
  ok: true;
  version: string;
  events: { icon?: string; mind: string; line: string; at?: string }[];
}

export interface ZoInflight {
  name: string;
  status: string;
  station: number;
  halted: boolean;
  since: string;
  born: string;
  cost: number;
  thought: string | null;
  thoughtBy: string | null;
  thoughtAt: string | null;
}

export interface ZoBirthline {
  ok: true;
  inflight: ZoInflight | null;
  lastBirth: { name: string; created_at: string } | null;
}

export const STATIONS = ['Research', 'Evaluation', 'Ethics', 'Builder', 'QA', 'Launch'];

/**
 * The live /api/birthline is currently publishing raw model output as "the machine's
 * thought". Including ```json blocks with internal file paths. The fix exists in the
 * zeroorigine.com rebuild but is not deployed. Until it is, this site refuses to
 * republish it: if the thought looks like code or JSON, we say so plainly instead of
 * leaking a file tree onto a personal homepage.
 */
export function readableThought(t: string | null): string | null {
  if (!t) return null;
  const s = t.trim();
  const looksLikeCode =
    s.startsWith('```') ||
    s.startsWith('{') ||
    s.startsWith('[') ||
    /"(target|content|path|file)"\s*:/.test(s.slice(0, 200)) ||
    /\b(import|export|const|function)\s/.test(s.slice(0, 120));
  if (looksLikeCode) return null;
  const clean = s
    .replace(/(sk|re|ghp|gho|whsec|pk|rk)_[A-Za-z0-9_-]{8,}/g, '[redacted]')
    .replace(/eyJ[A-Za-z0-9_-]{20,}\.?[A-Za-z0-9._-]*/g, '[redacted]')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > 200 ? clean.slice(0, 200) + '…' : clean;
}

export const getStats = () => get<ZoStats>('/api/stats');
export const getPulse = () => get<ZoPulse>('/api/pulse');
export const getBirthline = () => get<ZoBirthline>('/api/birthline');

export function elapsed(from: string): string {
  const ms = Date.now() - new Date(from).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

export function money(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
