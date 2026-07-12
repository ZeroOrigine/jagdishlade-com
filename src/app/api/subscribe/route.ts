import { NextResponse } from 'next/server';

/**
 * Subscribe. Deliberately dumb: it stores nothing here.
 * If RESEND_API_KEY + AUDIENCE are set, the contact goes to a Resend audience.
 * If they are not set, the endpoint returns an honest 503 and the form tells the
 * person to email me — rather than pretending it worked.
 */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) {
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  }

  const r = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (!r.ok) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: true });
}
