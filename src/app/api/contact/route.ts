import { NextResponse } from 'next/server';
import { clientIp, rateLimited, tooFast, looksLikeSpam, turnstileOk } from '@/lib/antispam';

/**
 * Contact -> Gmail. A visitor's message is emailed straight to Jagdish's inbox,
 * with their address as reply-to, so replying is one click. No list, no storage.
 * Sends via Resend from the verified zeroorigine.com domain.
 * If RESEND_API_KEY is not set, returns an honest 503 and the form tells the
 * person to email directly, rather than pretending the message was delivered.
 */
export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string; elapsed?: number; cfToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });
  }
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();

  // Honeypot: bots fill hidden fields. A real person leaves it empty.
  if (body.company) return NextResponse.json({ ok: true });
  // Time-trap: a form submitted in under 2.5s is automated.
  if (tooFast(body.elapsed)) return NextResponse.json({ ok: true });
  // Rate limit: 3 messages per 10 minutes per IP.
  if (rateLimited(`contact:${clientIp(req)}`, 3, 10 * 60 * 1000))
    return NextResponse.json({ ok: false, error: 'too many messages, please try again later' }, { status: 429 });
  if (!(await turnstileOk(body.cfToken, clientIp(req))))
    return NextResponse.json({ ok: false, error: 'anti-bot check failed, please retry' }, { status: 403 });

  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'please fill in your name, a valid email, and a message' }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: 'message too long' }, { status: 400 });
  }
  if (looksLikeSpam(message)) return NextResponse.json({ ok: true }); // silently drop

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || 'cajagdishlade@gmail.com';
  if (!key) {
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: 'jagdishlade.com <contact@zeroorigine.com>',
      to: [to],
      reply_to: email,
      subject: `New message from ${name}`,
      text: `${message}\n\n---\nFrom: ${name} <${email}>\nSent from the contact form on jagdishlade.com`,
    }),
  });

  if (!r.ok) {
    return NextResponse.json({ ok: false, error: 'send failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
