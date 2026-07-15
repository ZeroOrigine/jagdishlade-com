import type { Metadata } from 'next';
import Constellation from '@/components/Constellation';
import SubscribeForm from '@/components/SubscribeForm';
import WritingList from '@/components/WritingList';
import { getPosts, formatDate } from '@/lib/writing';

export const metadata: Metadata = {
  title: 'Writing. Essays on truth, failure, building, starting over',
  description:
    'Essays by Jagdish Lade on truth, failure, accounting, autonomous systems, and what happens when you remove every step that only exists because a human used to do it.',
  alternates: { canonical: '/writing' },
};

export default function Writing() {
  const posts = getPosts().map((p) => ({ ...p, dateLabel: formatDate(p.date) }));

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

          <div className="subscribe-block">
            <h3>Get new essays by email.</h3>
            <p>When the machine ships a product, or I finish a piece of writing, it reaches you the same day. Nothing else.</p>
            <SubscribeForm />
          </div>
          <p className="sub-note" style={{ marginTop: 20 }}>
            Or subscribe by <a href="/rss.xml">RSS</a>, for people who still own their own reading list.
          </p>
        </div>
      </section>
    </>
  );
}
