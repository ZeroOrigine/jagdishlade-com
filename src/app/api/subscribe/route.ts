import { NextResponse } from 'next/server';
import { clientIp, rateLimited, tooFast, turnstileOk } from '@/lib/antispam';

export const runtime = 'nodejs';

/**
 * Add an email to the Resend audience of essay subscribers.
 * Honest 503 if not configured, rather than pretending it worked.
 */
export async function POST(req: Request) {
  let email = '', company = '', elapsed: unknown, cfToken: unknown;
  try {
    const b = await req.json();
    email = String(b.email || '').trim();
    company = String(b.company || '');
    elapsed = b.elapsed;
    cfToken = b.cfToken;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });
  }
  if (company) return NextResponse.json({ ok: true }); // honeypot
  if (tooFast(elapsed)) return NextResponse.json({ ok: true }); // time-trap
  if (rateLimited(`sub:${clientIp(req)}`, 5, 10 * 60 * 1000))
    return NextResponse.json({ ok: false, error: 'too many attempts, please try again later' }, { status: 429 });
  if (!(await turnstileOk(cfToken, clientIp(req))))
    return NextResponse.json({ ok: false, error: 'anti-bot check failed, please retry' }, { status: 403 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'please enter a valid email' }, { status: 400 });
  }
  const key = process.env.RESEND_API_KEY;
  const aud = process.env.RESEND_AUDIENCE_ID;
  if (!key || !aud) {
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  }
  const r = await fetch(`https://api.resend.com/audiences/${aud}/contacts`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (!r.ok && r.status !== 409) {
    return NextResponse.json({ ok: false, error: 'could not subscribe' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
