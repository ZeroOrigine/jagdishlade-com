import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * The autonomous launch-essay engine. Stateless: the git repo IS the state store.
 *   1. read live products from Supabase (anon, read-only)
 *   2. keep only products launched after ESSAY_SINCE (new-only baseline)
 *   3. an essay exists iff content/writing/launch-<slug>.mdx exists in the repo
 *   4. one action per run: write the newest missing essay, OR email one that is
 *      already live but not yet sent, OR idle.
 * Grounded generation + a hard quality gate (no invented claims, no superiority
 * language, no em dashes) protect the personal brand. Triggered hourly by the
 * Netlify scheduled function, or manually with ?key=CRON_SECRET (&dry=1 to preview).
 */

const REPO = process.env.GITHUB_REPO || 'ZeroOrigine/jagdishlade-com';
const SITE = process.env.SITE_URL || 'https://jagdishlade.com';
const BANNED = [' first ', ' only ', 'revolutionary', 'nobody else', 'game-changer', 'game changer', 'world-class', 'best-in-class', 'cutting-edge'];

function gh(path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function listEssaySlugs(): Promise<string[]> {
  const r = await gh('contents/content/writing');
  if (!r.ok) return [];
  const files = (await r.json()) as { name: string }[];
  return files.filter((f) => f.name.startsWith('launch-') && f.name.endsWith('.mdx')).map((f) => f.name.slice(7, -4));
}

type Product = { slug: string; name: string; tagline: string; description: string; url: string; created_at: string; category?: string };

async function liveProducts(): Promise<Product[]> {
  const url = `${process.env.SUPABASE_URL}/rest/v1/zo_products?status=eq.live&select=slug,name,tagline,description,url,created_at&order=created_at.desc`;
  const r = await fetch(url, {
    headers: { apikey: process.env.SUPABASE_ANON_KEY || '', authorization: `Bearer ${process.env.SUPABASE_ANON_KEY || ''}` },
    cache: 'no-store',
  });
  if (!r.ok) return [];
  return (await r.json()) as Product[];
}

function gate(mdx: string): string | null {
  if (/—/.test(mdx)) return 'contains an em dash';
  const low = mdx.toLowerCase();
  const bad = BANNED.find((b) => low.includes(b));
  if (bad) return `contains banned phrase "${bad.trim()}"`;
  for (const k of ['title:', 'summary:', 'url:', 'product:', 'tags:']) if (!mdx.includes(k)) return `missing frontmatter ${k}`;
  const words = mdx.replace(/^---[\s\S]*?---/, '').trim().split(/\s+/).length;
  if (words < 300 || words > 800) return `word count ${words} out of range`;
  return null;
}

async function generate(p: Product): Promise<string> {
  const system = `You write as Jagdish Lade: Chartered Accountant turned AI/automation architect, founder of the autonomous ZeroOrigine ecosystem. His voice: a bold opening punch (a true, slightly uncomfortable statement, never a question). Short sentences. First person. He connects unexpected dots between fields. He believes innovation is removing steps, not adding features, and in "back to zero." He is honest to a fault. He is a CA: he respects what reconciles.

You are writing a LEAD-MAGNET essay for his personal site about a product his machine just built and launched. The essay's job is to make a specific reader feel understood, then route them to the product.

HARD RULES:
- Only claim what the provided product facts support. Invent NO features, NO user counts, NO testimonials, NO metrics. If you cannot ground a claim in the facts, cut it.
- Never use the words first, only, revolutionary, best, nobody else, game-changer, or any superiority claim.
- NEVER use an em dash. Use a period, comma, or colon instead.
- Exactly ONE call to action, linking to the product URL once, honestly framed.
- Structure: bold hook, then the real problem a specific person has, then a dot-connection to a wider truth, then how this product removes a step, then an honest note that his machine built it (one link to zeroorigine.com allowed), then one-line CTA to the product URL, then end with a genuine question that invites a reply.
- 450 to 650 words. Warm, direct, no corporate jargon, no hype.

OUTPUT ONLY valid MDX: frontmatter first, then body. Exactly this frontmatter shape:
---
title: "<hook-style title, sentence case, NOT 'Introducing X'>"
date: "<TODAY>"
summary: "<one honest sentence, the promise, no em dash>"
tags: ["launch", "<one category word>"]
product: "<slug>"
url: "<product url>"
---

<body in markdown, ## subheads allowed, ends with the question>`;

  const today = new Date().toISOString().slice(0, 10);
  const user = `Product facts (the ONLY things you may claim):
name: ${p.name}
tagline: ${p.tagline}
what it does: ${p.description}
url: ${p.url}
slug: ${p.slug}
today's date: ${today}

Write the lead-magnet essay now. Infer the specific reader from the description and speak to that one person.`;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY || '', 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 2000, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  const text = (d.content || []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('').trim();
  if (!text.startsWith('---')) throw new Error('model did not return frontmatter');
  return text;
}

function fm(mdx: string, key: string): string {
  const m = mdx.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return m ? m[1] : '';
}

function emailHtml(title: string, summary: string, essayUrl: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f2ede2;font-family:Georgia,serif;color:#16181b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede2;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#faf7f0;border:1px solid #e3dccd;border-radius:14px;overflow:hidden">
<tr><td style="padding:30px 34px 8px">
<div style="font-family:monospace;font-size:11px;letter-spacing:3px;color:#8b9299;text-transform:uppercase">New writing</div>
</td></tr>
<tr><td style="padding:6px 34px 0">
<div style="font-size:26px;line-height:1.2;color:#16181b">${title}</div>
</td></tr>
<tr><td style="padding:16px 34px 0">
<div style="font-size:16px;line-height:1.6;color:#5d6167">${summary}</div>
</td></tr>
<tr><td style="padding:26px 34px 4px">
<a href="${essayUrl}" style="display:inline-block;background:#16181b;color:#faf7f0;text-decoration:none;font-family:monospace;font-size:13px;letter-spacing:1px;padding:13px 24px;border-radius:8px">READ THE ESSAY</a>
</td></tr>
<tr><td style="padding:24px 34px 30px">
<div style="border-top:1px solid #e3dccd;padding-top:18px;font-size:13px;color:#8b9299;line-height:1.6">
You get this because you asked to hear when I publish. Reply anytime, it reaches me.<br>Jagdish Lade &middot; jagdishlade.com
</div>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function sendBroadcast(title: string, summary: string, essayUrl: string) {
  const key = process.env.RESEND_API_KEY;
  const aud = process.env.RESEND_AUDIENCE_ID;
  if (!key || !aud) return { skipped: 'resend not configured' };
  const create = await fetch('https://api.resend.com/broadcasts', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      audience_id: aud,
      from: 'Jagdish Lade <essays@zeroorigine.com>',
      reply_to: process.env.CONTACT_TO || 'cajagdishlade@gmail.com',
      subject: title,
      name: `Launch essay: ${title}`.slice(0, 100),
      html: emailHtml(title, summary, essayUrl),
    }),
  });
  if (!create.ok) throw new Error(`broadcast create ${create.status}: ${(await create.text()).slice(0, 160)}`);
  const id = (await create.json()).id;
  const send = await fetch(`https://api.resend.com/broadcasts/${id}/send`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!send.ok) throw new Error(`broadcast send ${send.status}: ${(await send.text()).slice(0, 160)}`);
  return { broadcast: id };
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const key = req.headers.get('x-cron-key') || u.searchParams.get('key') || '';
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const dry = u.searchParams.get('dry') === '1';

  try {
    const since = new Date(process.env.ESSAY_SINCE || '2026-07-14T00:00:00Z').getTime();
    const [products, have] = await Promise.all([liveProducts(), listEssaySlugs()]);
    const missing = products.filter((p) => new Date(p.created_at).getTime() >= since && !have.includes(p.slug));

    // PHASE 1: write the newest missing essay
    if (missing.length) {
      const p = missing[0];
      const mdx = await generate(p);
      const reason = gate(mdx);
      if (reason) return NextResponse.json({ ok: false, action: 'rejected', slug: p.slug, reason });
      if (dry) return NextResponse.json({ ok: true, action: 'dry-generated', slug: p.slug, mdx });
      const put = await gh(`contents/content/writing/launch-${p.slug}.mdx`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `essay: launch of ${p.name} (autonomous)`,
          content: Buffer.from(mdx).toString('base64'),
        }),
      });
      if (!put.ok) return NextResponse.json({ ok: false, action: 'commit-failed', status: put.status, detail: (await put.text()).slice(0, 200) });
      return NextResponse.json({ ok: true, action: 'generated', slug: p.slug, title: fm(mdx, 'title') });
    }

    // PHASE 2: email one live-but-unsent essay
    const emailedR = await gh('contents/data/emailed.json');
    let emailed: string[] = [];
    let sha: string | undefined;
    if (emailedR.ok) {
      const j = await emailedR.json();
      sha = j.sha;
      emailed = JSON.parse(Buffer.from(j.content, 'base64').toString());
    }
    for (const slug of have) {
      if (emailed.includes(slug)) continue;
      const pageUrl = `${SITE}/writing/launch-${slug}`;
      const live = await fetch(pageUrl, { method: 'HEAD' });
      if (!live.ok) continue; // not deployed yet, try next run
      const fileR = await gh(`contents/content/writing/launch-${slug}.mdx`);
      if (!fileR.ok) continue;
      const mdx = Buffer.from((await fileR.json()).content, 'base64').toString();
      const title = fm(mdx, 'title'), summary = fm(mdx, 'summary');
      if (dry) return NextResponse.json({ ok: true, action: 'dry-email', slug, title, summary, pageUrl });
      const res = await sendBroadcast(title, summary, pageUrl);
      emailed.push(slug);
      await gh('contents/data/emailed.json', {
        method: 'PUT',
        body: JSON.stringify({
          message: `mark ${slug} emailed`,
          content: Buffer.from(JSON.stringify(emailed, null, 2)).toString('base64'),
          ...(sha ? { sha } : {}),
        }),
      });
      return NextResponse.json({ ok: true, action: 'emailed', slug, ...res });
    }

    return NextResponse.json({ ok: true, action: 'idle', live: products.length, essays: have.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e).slice(0, 300) }, { status: 500 });
  }
}
