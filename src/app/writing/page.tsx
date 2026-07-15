import type { Metadata } from 'next';
import Constellation from '@/components/Constellation';
import WritingList from '@/components/WritingList';
import { getPosts, formatDate } from '@/lib/writing';

export const metadata: Metadata = {
  title: 'Writing. Essays on truth, failure, building, starting over',
  description:
    'Essays by Jagdish Lade on truth, failure, accounting, autonomous systems, and what happens when you remove every step that only exists because a human used to do it.',
  alternates: { canonical: '/writing' },
};

export default function Writing() {
  const posts = getPosts().map((p) => ({ slug: p.slug, title: p.title, date: p.date, summary: p.summary, tags: p.tags, series: p.series, readingMinutes: p.readingMinutes, dateLabel: formatDate(p.date) }));

  return (
    <>
      <section className="hero" style={{ paddingBottom: 28 }}>
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
          <div className="const-band">
            <Constellation seed="jagdish-lade-writing" height={130} />
          </div>
          {posts.length === 0 ? (
            <div className="empty">Nothing published yet.</div>
          ) : (
            <WritingList posts={posts} />
          )}

        </div>
      </section>
    </>
  );
}
