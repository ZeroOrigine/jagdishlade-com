import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SubscribeForm from '@/components/SubscribeForm';
import { getPosts, formatDate } from '@/lib/writing';

export default async function Home() {
  const posts = await getPosts();
  const latest = posts.slice(0, 3);

  return (
    <>
      <Reveal />

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="wrap-wide">
          <p className="eyebrow">Chartered Accountant · AI &amp; Automation Architect · Mississauga, Canada</p>
          <h1>
            I collect dots. <em>Zero</em> is where I connect them.
          </h1>
          <p className="lede">
            Twenty years as a Chartered Accountant taught me that numbers are the oldest form of
            truth-telling. Building with AI taught me the other half: the person most easily fooled
            by the numbers is the one presenting them. So my work is simple to say and hard to do. Strip everything back to zero, keep only what is true, and build from there.
          </p>
          <div className="hero-ctas">
            <Link href="/philosophy" className="btn btn-live">
              Read TRUTH. The manuscript
            </Link>
            <Link href="/writing" className="btn">
              Read the essays
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- THREE BELIEFS ---------- */}
      <section>
        <div className="wrap-wide">
          <p className="sec-label">What I believe</p>
          <h2 className="sec-title">Three ideas run through everything I do.</h2>
          <div className="doors">
            <div className="door reveal" data-track="philosophy">
              <div className="k">Back to Zero</div>
              <h3>Zero is not nothing.</h3>
              <p>
                Zero is potential. Every skill, every product, every life begins there. Most people
                begin once and spend decades protecting that one beginning. I practice returning to
                zero. Deliberately, without fear. What survives the return is truth.
              </p>
            </div>

            <div className="door reveal" data-track="building">
              <div className="k">Collecting dots</div>
              <h3>Dots, not degrees.</h3>
              <p>
                An accounting anomaly connects to a machine-learning pattern. A child&apos;s question
                breaks a business model. A line of Nietzsche fixes a debugging session. Knowledge is
                cheap. The connections between fields nobody puts together. That is the unfair
                advantage.
              </p>
            </div>

            <div className="door reveal" data-track="writing">
              <div className="k">The mirror</div>
              <h3>To command AI, study your own mind.</h3>
              <p>
                Not the machine&apos;s architecture. Yours. How you decide. What you assume without
                noticing. Which steps in your work exist only because humans get tired and forget.
                Describe your thinking clearly, remove the biology, and the machine becomes an
                extension of you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- THE PERSON ---------- */}
      <section>
        <div className="wrap">
          <p className="sec-label">The person</p>
          <h2 className="sec-title">Behind the pages.</h2>
          <p className="sec-sub">
            Father of two. Advik and Eeva, my strictest reviewers. If they can&apos;t understand an
            idea, it isn&apos;t simple enough yet, and simplicity is the result of depth, not the
            absence of it.
          </p>
          <p className="sec-sub">
            I am an introvert who builds in silence and shows the work when it is done. I read
            Nietzsche, Taleb and Feynman in the evening and reconcile invoices in the morning. Because theory I haven&apos;t proven with my own hands is entertainment. By day I run
            financial reporting and automation for a multi-entity group in Ontario. The rest of the
            time, I build.
          </p>
          <p className="sec-sub">
            I trust what reconciles. I question everything else.
          </p>
        </div>
      </section>

      {/* ---------- WHAT I BUILD ---------- */}
      <section>
        <div className="wrap">
          <p className="sec-label">What I build</p>
          <h2 className="sec-title">Machines that don&apos;t need me.</h2>
          <p className="sec-sub">
            My rule for innovation is subtraction: break the goal into steps, challenge every step,
            and delete the ones that exist only because a human used to do them. What remains is the
            pure path. And that is what I hand to the machine.
          </p>
          <p className="sec-sub">
            <strong>ZeroOrigine</strong> is the furthest expression of that idea. An autonomous
            ecosystem of eight AI Minds with a constitution, which research, build, refuse to ship
            when the work isn&apos;t good enough, and launch software with no one in the loop. It
            keeps its own ledger, every dollar and every failure, published by the machine itself at{' '}
            <a href="https://zeroorigine.com" target="_blank" rel="noopener noreferrer">zeroorigine.com</a>.
            I don&apos;t repeat its numbers here. The machine speaks for itself.
          </p>
          <p className="sec-sub">
            <strong>Speed CA</strong> is the same philosophy pointed at my own profession. A
            platform for Chartered Accountants in India, built from twenty years inside the work, at{' '}
            <a href="https://ai2all.ai" target="_blank" rel="noopener noreferrer">ai2all.ai</a>.
          </p>
          <p className="sec-sub" style={{ marginTop: 8 }}>
            <Link href="/building">The longer story of what I build, and why →</Link>
          </p>
        </div>
      </section>

      {/* ---------- LATEST WRITING ---------- */}
      {latest.length > 0 && (
        <section>
          <div className="wrap">
            <p className="sec-label">Latest</p>
            <h2 className="sec-title">Recent essays</h2>
            <div className="post-list">
              {latest.map((p) => (
                <Link key={p.slug} href={`/writing/${p.slug}`} className="post-row">
                  <div className="meta">
                    {formatDate(p.date)}
                    <br />
                    {p.readingMinutes} min
                  </div>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- QUOTE ---------- */}
      <section>
        <div className="wrap">
          <p className="quote reveal">&ldquo;Be original. Pure. Clean. Untouched. Be Zero.&rdquo;</p>
          <p className="quote-by">TRUTH · page V</p>
        </div>
      </section>

      {/* ---------- SUBSCRIBE ---------- */}
      <section>
        <div className="wrap">
          <p className="sec-label">Stay close</p>
          <h2 className="sec-title">One message when I publish something new.</h2>
          <p className="sec-sub">
            Not a newsletter. No schedule, no noise. A short note when there is a new essay, a new
            manuscript page, or something worth your attention. Nothing else.
          </p>
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}
