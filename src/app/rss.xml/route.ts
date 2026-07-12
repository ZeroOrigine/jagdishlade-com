import { getPosts } from '@/lib/writing';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const base = 'https://jagdishlade.com';
  const posts = getPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/writing/${p.slug}</link>
      <guid isPermaLink="true">${base}/writing/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>Jagdish Lade — Writing</title>
    <link>${base}/writing</link>
    <description>Essays on truth, failure, building, and starting over.</description>
    <language>en</language>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml', 'cache-control': 'public, s-maxage=3600' },
  });
}
