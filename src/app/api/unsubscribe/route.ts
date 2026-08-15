import { NextResponse } from 'next/server';

/**
 * THE WAY OUT, FOR THE ONE EMAIL RESEND CANNOT ADD IT TO.
 *
 * Broadcasts get {{{RESEND_UNSUBSCRIBE_URL}}} substituted by Resend itself. The
 * welcome email is NOT a broadcast, it goes through /emails, and that endpoint
 * substitutes nothing. So that email promised "one-click unsubscribe on every
 * email" while carrying no link at all, which is the worst arrangement
 * available: the reader believes there is a way out, cannot find it, and
 * reaches for the spam button instead. A spam complaint is scored against the
 * sending domain. An unsubscribe is not.
 *
 * KEYED ON THE CONTACT ID, NEVER THE ADDRESS. The id is an unguessable uuid
 * Resend hands back when the contact is created. Putting the email in the URL
 * instead would let anyone unsubscribe anyone by typing an address, and would
 * spray it through every proxy, log and referrer between the reader and here.
 *
 * ANSWERS 2xx EVEN WHEN IT FAILS. Mailbox providers POST here for RFC 8058
 * one-click and show the reader an error on any non-2xx, which would mean
 * telling them we failed at the one action they are entitled to perform
 * without friction. The failure is logged; the reader is not blamed for it.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SITE = process.env.SITE_URL || 'https://jagdishlade.com';

async function suppress(contactId: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const aud = process.env.RESEND_AUDIENCE_ID;
  if (!key || !aud || !UUID.test(contactId)) return false;
  try {
    const r = await fetch(`https://api.resend.com/audiences/${aud}/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ unsubscribed: true }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

// RFC 8058 one-click: a server-to-server POST with no browser and no JavaScript.
// This must DO the work here, not hand it to a page that runs a script, which is
// how a one-click unsubscribe ends up answering 200 and changing nothing.
export async function POST(req: Request) {
  const c = new URL(req.url).searchParams.get('c') || '';
  await suppress(c);
  return NextResponse.json({ ok: true });
}

// A human clicking the link in the footer. Honour it, then say so in words.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const c = url.searchParams.get('c') || '';
  const ok = await suppress(c);
  return new NextResponse(page(ok), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

function page(ok: boolean): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${ok ? 'Unsubscribed' : 'Something went wrong'}</title></head>
<body style="margin:0;background:#f2ede2;font-family:Georgia,serif;color:#16181b">
<div style="max-width:520px;margin:0 auto;padding:96px 24px">
<div style="font-family:monospace;font-size:11px;letter-spacing:3px;color:#8b9299;text-transform:uppercase">${ok ? 'Unsubscribed' : 'Not done'}</div>
<h1 style="font-size:30px;line-height:1.25;margin:14px 0 0">${ok ? 'Done. You are off the list.' : 'That did not work.'}</h1>
<p style="font-size:16px;line-height:1.6;color:#5d6167">${
    ok
      ? 'Nothing further is sent. No confirmation email, because that would be one more email.'
      : `The link may have expired. Tell me at <a href="${SITE}/connect" style="color:#16181b">jagdishlade.com/connect</a> and it will be handled by hand.`
  }</p>
<p style="font-size:14px;color:#8b9299"><a href="${SITE}" style="color:#8b9299">jagdishlade.com</a></p>
</div></body></html>`;
}
