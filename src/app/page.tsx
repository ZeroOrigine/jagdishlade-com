import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SubscribeForm from '@/components/SubscribeForm';
import { getPosts, formatDate } from '@/lib/writing';
import { getStats, getBirthline, money, elapsed, readableThought, STATIONS } from '@/lib/zo';

export const revalidate = 60;

export default async function Home() {
  const [stats, birth, posts] = await Promise.all([getStats(), getBirthline(), getPosts()]);
  const f = birth?.inflight ?? null;
  const thought = readableThought(f?.thought ?? null);
  const latest = posts.slice(0, 3);

  return (
    <>
      <Reveal />

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="wrap-wide">
          <p className="eyebrow">Chartered Accountant · AI architect · Mississauga</p>
          <h1>
            Failed. Returned to <em>zero</em>. Building from there.
          </h1>
          <p className="lede">
            I spent twenty years learning that numbers tell the truth. Then I learned that the
            person most convinced by the numbers is the one presenting them. So I stripped it all
            back and started building machines that <strong>cannot</strong> flatter me — they
            publish what they spend, what they break, and what they refuse to ship.
          </p>
          <div className="hero-ctas">
            <Link href="/building" className="btn btn-live">
              Watch the machine
            </Link>
            <Link href="/writing" className="btn">
              Read the essays
            </Link>
          </div>

          {/* Honest counters — every one of these comes from the live API. If it fails, nothing renders. */}
          {stats && (
            <div className="counters">
              <div className="counter is-live">
                <span className="n">
                  {stats.liveCount}
                  <span className="dim">/{stats.totalCount}</span>
                </span>
                <span className="l">products live / attempted</span>
              </div>
              <div className="counter">
                <span className="n">{money(stats.totalSpend)}</span>
                <span className="l">spent building them</span>
              </div>
              <div className="counter is-zero">
                <span className="n">$0</span>
                <span className="l">revenue — still</span>
              </div>
              <div className="counter">
                <span className="n">0</span>
                <span className="l">employees, investors, permission</span>
              </div>
              <div className="counter-src">
                read live from zeroorigine.com · not typed by me · refreshed every 60s
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------- THE MACHINE ---------- */}
      <section>
        <div className="wrap-wide">
          <p className="sec-label">Live</p>
          {/* The headline follows the machine's ACTUAL state. A halted product must never be
              described as "being born" — that is precisely the comfortable lie this site exists
              to make impossible. Caught on the first live deploy: RigFile was qa_failed while the
              page cheerfully announced a birth. */}
          <h2 className="sec-title">
            {!f
              ? 'The machine, when it wakes.'
              : f.halted
                ? `${f.name} is stuck, and I am not going to hide it.`
                : 'Something is being born right now.'}
          </h2>
          <p className="sec-sub">
            ZeroOrigine is eight AI Minds with a constitution and a budget. They research a problem,
            argue about whether it deserves to exist, build it, refuse to ship it when it isn&apos;t
            good enough, and launch it. I am not in the loop. This panel is their actual work — not
            a demo of it.
          </p>

          <div className={`machine${f && !f.halted ? ' on' : ''}`}>
            <div className="machine-head">
              <span>{f ? f.name : 'the line'}</span>
              <span className="live">
                {f ? (f.halted ? '⏸ halted' : '● building') : '○ idle'}
              </span>
            </div>

            <div className="machine-body">
              {!f ? (
                <span className="idle">
                  No product is on the line at this moment. When one is, this panel shows the Mind
                  that is working and the last thing it thought — unedited.
                </span>
              ) : f.halted ? (
                <span className="idle">
                  {f.name} is halted at {STATIONS[f.station] ?? 'the line'} — status{' '}
                  <code>{f.status}</code>. Its own QA refused to let it ship, so it is sitting
                  there, costing me {money(f.cost)}, until it is fixed. This is what the inside of
                  building looks like. Most sites would show you a green tick.
                </span>
              ) : thought ? (
                <>
                  <span className="who">{f.thoughtBy ?? 'A Mind'}</span>
                  {' → '}
                  {thought}
                </>
              ) : (
                <span className="idle">
                  {f.thoughtBy ?? 'A Mind'} is emitting source code, not sentences, at this exact
                  second — so there is nothing honest to quote here. The stage and the money below
                  are real.
                </span>
              )}
            </div>

            {f && (
              <>
                <div className="rail" aria-label="Pipeline stage">
                  {STATIONS.map((s, i) => (
                    <div
                      key={s}
                      className={`station${i < f.station ? ' done' : ''}${i === f.station ? ' now' : ''}`}
                    >
                      <div className="bar" />
                      <div className="s">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="machine-foot">
                  <span>
                    alive for <b className="mono">{elapsed(f.born)}</b>
                  </span>
                  <span>
                    spent so far <b className="mono">{money(f.cost)}</b>
                  </span>
                  <span>
                    humans involved <b className="mono">0</b>
                  </span>
                </div>
              </>
            )}
          </div>

          {!birth && (
            <p className="sub-note" style={{ marginTop: 14 }}>
              The machine&apos;s API didn&apos;t answer just now. Rather than show you a number I
              remembered, I&apos;m showing you nothing.
            </p>
          )}
        </div>
      </section>

      {/* ---------- THE THREE DOORS ---------- */}
      <section>
        <div className="wrap-wide">
          <p className="sec-label">Three ways in</p>
          <h2 className="sec-title">Pick the thread you want to pull.</h2>
          <div className="doors">
            <Link href="/philosophy" className="door reveal" data-track="philosophy">
              <div className="k">Philosophy</div>
              <h3>TRUTH</h3>
              <p>
                Five pages, written by hand, in one sitting. On conditioning, on the pain of
                seeking, and on why going back to zero is not a metaphor.
              </p>
              <span className="go">read the manuscript →</span>
            </Link>

            <Link href="/building" className="door reveal" data-track="building">
              <div className="k">Building</div>
              <h3>ZeroOrigine</h3>
              <p>
                {stats
                  ? `${stats.liveCount} products alive, ${money(stats.totalSpend)} spent, $0 earned. Every figure pulled from the machine, including the ones that embarrass me.`
                  : 'Honest numbers, live from the machine — including the ones that embarrass me.'}
              </p>
              <span className="go">open the ledger →</span>
            </Link>

            <Link href="/writing" className="door reveal" data-track="writing">
              <div className="k">Writing</div>
              <h3>Essays</h3>
              <p>
                On truth, failure, accounting, Feynman, and what happens when you delete every step
                that only exists because a human used to do it.
              </p>
              <span className="go">
                {posts.length} {posts.length === 1 ? 'essay' : 'essays'} →
              </span>
            </Link>
          </div>
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
          <p className="quote reveal">“Be original. Pure. Clean. Untouched. Be Zero.”</p>
          <p className="quote-by">TRUTH · page V</p>
        </div>
      </section>

      {/* ---------- SUBSCRIBE ---------- */}
      <section>
        <div className="wrap">
          <p className="sec-label">Watch it happen</p>
          <h2 className="sec-title">I&apos;ll tell you the moment a Mind starts building.</h2>
          <p className="sec-sub">
            Not a newsletter. One message when a build starts — so you can open the page and watch a
            product go from a question to a live URL, mistakes included.
          </p>
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}
