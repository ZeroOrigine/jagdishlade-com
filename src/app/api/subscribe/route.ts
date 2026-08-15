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

  // Instant welcome email (only for a genuinely new subscriber, not a re-subscribe).
  if (r.ok) {
    // The contact id is an unguessable uuid, which is what makes a one-click
    // unsubscribe possible without putting the reader's address in a URL where
    // it can be enumerated or logged by every hop in between.
    let contactId = '';
    try {
      contactId = String(((await r.json()) as { id?: string })?.id || '');
    } catch {
      /* no id, the footer degrades to the typed form below */
    }
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: 'Jagdish Lade <essays@zeroorigine.com>',
          // NO reply_to. It used to fall back to a personal Gmail address, which
          // meant every subscriber could read it in the headers. A Reply-To is a
          // contact method that leaves the machine, and the rule is the same one
          // the footer obeys: never publish a personal address, and never print
          // a contact route that cannot receive. /connect is real and is neither.
          subject: "You're subscribed",
          html: welcomeHtml(contactId),
          ...(contactId
            ? {
                // RFC 8058, so leaving costs one click in the mail client and a
                // reader who cannot find the link never has to reach for 'spam'.
                headers: {
                  'List-Unsubscribe': `<${SITE}/api/unsubscribe?c=${contactId}>`,
                  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                },
              }
            : {}),
        }),
      });
    } catch {
      /* welcome email is best-effort; the subscription already succeeded */
    }
  }

  return NextResponse.json({ ok: true });
}

const SITE = process.env.SITE_URL || 'https://jagdishlade.com';

function welcomeHtml(contactId = ''): string {
  const site = SITE;
  // The promise and the link must match. This email said "one-click unsubscribe
  // on every email" and carried none, which is the worst combination: the reader
  // stops looking for a way out and presses spam instead, and a spam complaint
  // is scored against the sending domain where an unsubscribe is not.
  const unsub = contactId
    ? `${site}/api/unsubscribe?c=${encodeURIComponent(contactId)}`
    : `${site}/connect`;
  return `<!doctype html><html><body style="margin:0;background:#f2ede2;font-family:Georgia,serif;color:#16181b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede2;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#faf7f0;border:1px solid #e3dccd;border-radius:14px;overflow:hidden">
<tr><td style="padding:30px 34px 8px">
<div style="font-family:monospace;font-size:11px;letter-spacing:3px;color:#8b9299;text-transform:uppercase">Subscribed</div>
</td></tr>
<tr><td style="padding:6px 34px 0">
<div style="font-size:26px;line-height:1.25;color:#16181b">You're in.</div>
</td></tr>
<tr><td style="padding:16px 34px 0">
<div style="font-size:16px;line-height:1.6;color:#5d6167">You'll get one short email whenever the machine ships a new product, or I publish a new essay. The URL and the writing, so you know what it is. No schedule, no noise, and one-click unsubscribe on every email.</div>
</td></tr>
<tr><td style="padding:26px 34px 4px">
<a href="${site}/writing" style="display:inline-block;background:#16181b;color:#faf7f0;text-decoration:none;font-family:monospace;font-size:13px;letter-spacing:1px;padding:13px 24px;border-radius:8px">READ WHAT'S THERE NOW</a>
</td></tr>
<tr><td style="padding:24px 34px 30px">
<div style="border-top:1px solid #e3dccd;padding-top:18px;font-size:13px;color:#8b9299;line-height:1.6">
You received this because you subscribed at jagdishlade.com. &middot; <a href="${unsub}" style="color:#8b9299">Unsubscribe</a><br>
Say something back at <a href="${site}/connect" style="color:#8b9299">jagdishlade.com/connect</a>, which reaches me.<br>Jagdish Lade &middot; jagdishlade.com
</div>
</td></tr>
</table></td></tr></table></body></html>`;
}
