import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * The blog. One .mdx file per essay in /content/writing. Push the file, it's published.
 * No CMS, no database, no hand-written HTML. Which is exactly why the old site only
 * ever got three posts.
 */

const DIR = path.join(process.cwd(), 'content', 'writing');

export interface Post {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  series: 'ideas' | 'launch' | 'speed-ca';
  product: string | null;
  productName: string | null;
  url: string | null;
  readingMinutes: number;
  body: string;
}

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
      const { data, content } = matter(raw);
      const slug = f.replace(/\.mdx$/, '');
      const series = (data.series as Post['series']) || (slug.startsWith('launch-') ? 'launch' : 'ideas');
      return {
        slug,
        title: String(data.title ?? f),
        date: String(data.date ?? ''),
        summary: String(data.summary ?? ''),
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        series,
        product: data.product ? String(data.product) : null,
        productName: data.productName ? String(data.productName) : null,
        url: data.url ? String(data.url) : null,
        readingMinutes: readingMinutes(content),
        body: content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  return getPosts().find((p) => p.slug === slug) ?? null;
}

export function formatDate(d: string): string {
  if (!d) return '';
  const dt = new Date(`${d}T00:00:00Z`);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
