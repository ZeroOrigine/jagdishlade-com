import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, formatDate } from '@/lib/writing';

export const metadata: Metadata = {
  title: 'Writing — essays on truth, failure, building, starting over',
  description:
    'Essays by Jagdish Lade on truth, failure, accounting, Feynman, autonomous systems, and what happens when you remove every step that only exists because a human used to do it.',
  alternates: { canonical: '/writing' },
};

export default function Writing() {
  const posts = getPosts();

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <p className="eyebrow">Writing</p>
          <h1>
            Essays on truth, failure, <em>and</em> starting over.
          </h1>
          <p className="lede">
            I write to find out what I actually think. Most of it comes back to one question: what
            survives when you strip away everything you were told to believe?
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="empty">Nothing published yet.</div>
          ) : (
            <div className="post-list">
              {posts.map((p) => (
                <Link key={p.slug} href={`/writing/${p.slug}`} className="post-row">
                  <div className="meta">
                    {formatDate(p.date)}
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
          <p className="sub-note" style={{ marginTop: 28 }}>
            <a href="/rss.xml">RSS feed</a> — for people who still own their own reading list.
          </p>
        </div>
      </section>
    </>
  );
}
