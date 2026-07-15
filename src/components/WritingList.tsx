'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type Post = { slug: string; title: string; date: string; summary: string; tags: string[]; readingMinutes: number; dateLabel: string };

const isLaunch = (p: Post) => p.tags.includes('launch');

export default function WritingList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<'all' | 'essays' | 'launches'>('all');
  const [sort, setSort] = useState<'new' | 'old'>('new');

  const counts = useMemo(
    () => ({ all: posts.length, launches: posts.filter(isLaunch).length, essays: posts.filter((p) => !isLaunch(p)).length }),
    [posts],
  );

  const shown = useMemo(() => {
    let list = posts.filter((p) => (filter === 'all' ? true : filter === 'launches' ? isLaunch(p) : !isLaunch(p)));
    list = [...list].sort((a, b) => (sort === 'new' ? (a.date < b.date ? 1 : -1) : a.date < b.date ? -1 : 1));
    return list;
  }, [posts, filter, sort]);

  const tab = (id: typeof filter, label: string, n: number) => (
    <button className={`filter-tab${filter === id ? ' on' : ''}`} onClick={() => setFilter(id)} aria-pressed={filter === id}>
      {label} <span className="filter-n">{n}</span>
    </button>
  );

  return (
    <>
      <div className="filters" role="group" aria-label="Filter essays">
        <div className="filter-tabs">
          {tab('all', 'All', counts.all)}
          {tab('essays', 'Deep dives', counts.essays)}
          {tab('launches', 'Launches', counts.launches)}
        </div>
        <button className="filter-sort" onClick={() => setSort((s) => (s === 'new' ? 'old' : 'new'))}>
          {sort === 'new' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

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
    </>
  );
}
