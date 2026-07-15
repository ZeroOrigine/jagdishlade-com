/**
 * Keyless anti-spam for the contact + subscribe endpoints. Layers, cheap first:
 *  1. honeypot   - a hidden field; real people leave it empty, bots fill it.
 *  2. time-trap  - the form reports ms since it mounted; a submit under ~2.5s is a bot.
 *  3. rate limit - per-IP sliding window (best-effort; module memory per warm instance).
 *  4. heuristics - callers can reject link-stuffed messages.
 * The strong upgrade (recommended) is Cloudflare Turnstile, which needs a site key.
 */

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('x-nf-client-connection-ip') ||
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

const buckets = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear(); // crude memory cap
  return hits.length > max;
}

export function tooFast(elapsedMs: unknown, min = 2500): boolean {
  const n = Number(elapsedMs);
  return !Number.isFinite(n) || n < min;
}

export function looksLikeSpam(message: string): boolean {
  const links = (message.match(/https?:\/\//gi) || []).length;
  if (links >= 4) return true;
  if (/\b(viagra|casino|crypto giveaway|forex|seo services|buy followers)\b/i.test(message)) return true;
  return false;
}

/**
 * Verify a Cloudflare Turnstile token. Enforced ONLY when TURNSTILE_SECRET_KEY is
 * set; otherwise returns true (the other layers still apply). Fail-closed when a
 * secret exists but the token is missing/invalid.
 */
export async function turnstileOk(token: unknown, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet
  if (!token || typeof token !== 'string') return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const d = (await r.json()) as { success?: boolean };
    return d.success === true;
  } catch {
    return false; // fail closed
  }
}
