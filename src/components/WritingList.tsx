'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type Post = {
  slug: string; title: string; date: string; summary: string; tags: string[];
  series: 'ideas' | 'launch' | 'speed-ca'; readingMinutes: number; dateLabel: string;
};

const FILTERS: { id: 'all' | 'ideas' | 'launch' | 'speed-ca'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'launch', label: 'Product launches' },
  { id: 'speed-ca', label: 'Speed CA' },
];

export default function WritingList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<'all' | 'ideas' | 'launch' | 'speed-ca'>('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length, ideas: 0, launch: 0, 'speed-ca': 0 };
    posts.forEach((p) => (c[p.series] = (c[p.series] || 0) + 1));
    return c;
  }, [posts]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter !== 'all' && p.series !== filter) return false;
      if (!needle) return true;
      return (p.title + ' ' + p.summary + ' ' + p.tags.join(' ')).toLowerCase().includes(needle);
    });
  }, [posts, filter, q]);

  return (
    <>
      <div className="filters">
        <div className="filter-tabs">
          {FILTERS.map((f) =>
            f.id === 'all' || counts[f.id] > 0 ? (
              <button
                key={f.id}
                className={`filter-tab${filter === f.id ? ' on' : ''}`}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
              >
                {f.label} <span className="filter-n">{counts[f.id] || 0}</span>
              </button>
            ) : null,
          )}
        </div>
        <div className="filter-search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search essays…"
            aria-label="Search essays"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="empty">Nothing matches that. Try another word, or clear the search.</div>
      ) : (
        <div className="post-list">
          {shown.map((p) => (
            <Link key={p.slug} href={`/writing/${p.slug}`} className="post-row">
              <div className="meta">
                {p.dateLabel}
                <br />
                {p.readingMinutes} min read
              </div>
              <div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                {p.tags.length > 0 && (
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
