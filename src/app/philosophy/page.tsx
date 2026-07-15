import type { Metadata } from 'next';
import ReadingBar from '@/components/ReadingBar';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'TRUTH. A manuscript on returning to zero',
  description:
    'Five pages, written by hand in one sitting, December 2025. On conditioning, the pain of seeking, and why going back to zero is not a metaphor.',
  alternates: { canonical: '/philosophy' },
};

/**
 * The manuscript, treated as a manuscript. Not a page of copy.
 * One page per screen-block, gold rule, serif at reading size, nothing else competing.
 */
const PAGES = [
  {
    n: 'Page I',
    t: 'The Rabbit Hole',
    body: [
      'Being too much aware of everything is very painful. You may suffer every day, every minute, every movement. This is one kind of addiction, and if we can’t control it or don’t stop, it will affect us badly.',
      { pull: '“Truth” is a rabbit hole. Once you fall, you may not get out of it.' },
      'You crave a different world in that rabbit hole, but it eventually reaches suffering and pain. Humans are trying to find the truth of God, the truth of death, the truth of love. Countless truths which are beyond our life. We simply follow what our parents told us, what our society told us, what our religion told us.',
      '**We are not pure or original.** We are moving in the completely opposite direction of the so-called TRUTH.',
    ],
  },
  {
    n: 'Page II',
    t: 'The Pain of Seeking',
    body: [
      'You will suffer more and more when you come near to Truth. But your pain is one of the greatest feelings of bliss you may get. If you survive, you may understand there is no truth. Or you may understand beyond pain or happiness. Or both.',
      { pull: 'Most people do not survive. The very few who do cannot explain it to others.' },
      'All intellectuals who tried to create a path toward it by their teachings are false paths. There are two kinds of people who fall into this rabbit hole automatically: one who is completely isolated from society, and one who experienced so much pain and suffering through this wasted society that they slowly realised how their life was wasted.',
    ],
  },
  {
    n: 'Page III',
    t: 'Isolation and Suffering',
    body: [
      'Without isolation and suffering. Lonesome. No one can go ahead. We are all trapped in words, feelings, and external attachments. We, our society, our ancestors created this environment.',
      { pull: 'We are just garbage.' },
      'We have collected so much garbage for so long that it has become our lives and the lives around us. Everyone cluttered this garbage into beliefs, religions, countries, cultures and gods. We simply can’t clean it, because the beliefs are so scattered.',
    ],
  },
  {
    n: 'Page IV',
    t: 'Going Back to Zero',
    body: [
      'When you reach. Or nearly reach. You will realise: **let’s go back to zero.** You will start this journey again and again by returning to the start, because you feel the conditioned mind, the corrupt mind, the garbage inside you and around you.',
      'You start seeking the real truth inside before searching for an imaginary truth outside. You start **removing the garbage** and all the conditioned thoughts created by a wasted society.',
      'Going back to zero. No-thought moments. Observing everything without judging, without labelling.',
      { pull: 'You start connecting dots. Invisible dots that only a zero person can see.' },
    ],
  },
  {
    n: 'Page V',
    t: 'Freedom at Zero',
    body: [
      'Whoever successfully comes back to zero suffers less than the one stuck in the middle. **They find their own purpose. They are not lost.** They conquered their pain, suffering, happiness, anger, ego.',
      'This zero place is neither happiness nor pain, neither good nor bad. A person who reaches zero will not be on any side, will not carry any label. Beyond labels, words, or thoughts. A zero person sees crystal clear, everywhere. They don’t need any senses, or any illusionary senses.',
      { pull: 'Be original. Pure. Clean. Untouched. Be Zero.' },
      'There is no label, no bias, no culture, no agnostic, no theism. Here is only love. A different dimension. Here is freedom. Here is god. Here is everything you are searching for. All your searching will stop.',
      '*Do you understand this place? Everything is here.*',
    ],
  },
];

const CONCEPTS = [
  ['Back to Zero', 'Strip away conditioned thinking, biases, labels, and inherited garbage. Return to pure observation.'],
  ['Connecting Dots', 'At zero, you see connections others cannot. This is the source of insight. And my only real advantage.'],
  ['Beyond Labels', 'Beyond atheist, agnostic, theist. Beyond good and bad. Beyond pain and happiness.'],
  ['The Rabbit Hole', 'Truth-seeking is addictive and painful. You do not choose it. You fall in, through isolation or suffering.'],
  ['Freedom at Zero', 'Zero is where the searching stops. Everything you were looking for was already there.'],
  ['The Cycle', 'You go back to zero again and again. Each return strips more garbage. Each return brings more clarity.'],
  ['Crystal Clear Vision', 'A zero person sees through the artificial world. Reality without illusion, without labels.'],
];

function Line({ text }: { text: string }) {
  // minimal inline formatting: **bold** and *italic*
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  return <p dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Philosophy() {
  return (
    <>
      <ReadingBar />
      <Reveal />

      <header className="ms-hero">
        <div className="wrap">
          <div className="t">TRUTH</div>
          <p className="s">a manuscript on returning to zero</p>
          <p
            className="sub-note"
            style={{ marginTop: 28, fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--text-muted)' }}
          >
Five pages, written in one sitting in December 2025. The name became a
            company, and then the way I build everything.
          </p>
        </div>
      </header>

      <div className="ms">
        {PAGES.map((p) => (
          <article className="page reveal" key={p.n}>
            <div className="page-n">
              {p.n} · {p.t}
            </div>
            {p.body.map((b, i) =>
              typeof b === 'string' ? (
                <Line key={i} text={b} />
              ) : (
                <p className="pull" key={i}>
                  {b.pull}
                </p>
              ),
            )}
          </article>
        ))}
      </div>

      <section>
        <div className="wrap">
          <p className="sec-label">What survived the page</p>
          <h2 className="sec-title">Seven ideas I had to learn the hard way.</h2>
          <p className="sec-sub">
            None of these are original. That is rather the point. They became the reason I started
            over. And they are wired, literally, into how the machine decides what to build.
          </p>
          <div className="doors">
            {CONCEPTS.map(([t, d], i) => (
              <div className="door reveal" data-track="philosophy" key={t}>
                <div className="k">{String(i + 1).padStart(2, '0')}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
