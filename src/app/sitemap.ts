import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/writing';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://jagdishlade.com';
  const staticPages = ['', '/philosophy', '/building', '/writing', '/connect'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    priority: p === '' ? 1 : 0.8,
  }));
  const posts = getPosts().map((p) => ({
    url: `${base}/writing/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00Z`),
    priority: 0.7,
  }));
  return [...staticPages, ...posts];
}
