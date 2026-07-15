import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Add an email to the Resend audience of essay subscribers.
 * Honest 503 if not configured, rather than pretending it worked.
 */
export async function POST(req: Request) {
  let email = '';
  try {
    email = String((await req.json()).email || '').trim();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });
  }
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
