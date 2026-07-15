import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { getStats, getPulse, getBirthline, money, elapsed, readableThought, STATIONS } from '@/lib/zo';

export const metadata: Metadata = {
  title: 'Building in public — honest numbers, live from the machine',
  description:
    'ZeroOrigine: eight AI Minds, a constitution, and a budget. Every number on this page is read from the machine at the moment you load it — including the ones that embarrass me.',
  alternates: { canonical: '/building' },
};

export const dynamic = 'force-dynamic'; // live numbers render per-request — never from a build-time snapshot

export default async function Building() {
  const [stats, pulse, birth] = await Promise.all([getStats(), getPulse(), getBirthline()]);
  const f = birth?.inflight ?? null;
  const thought = readableThought(f?.thought ?? null);
  const avg = stats && stats.liveCount ? stats.totalSpend / stats.liveCount : null;

  return (
    <>
      <Reveal />

      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap-wide">
          <p className="eyebrow">Building in public</p>
          <h1>
            The numbers on this page were <em>not</em> typed by me.
          </h1>
          <p className="lede">
            They are read from ZeroOrigine&apos;s database at the moment you load this page. I
            can&apos;t round them, delay them, or quietly forget to update them. My old site said
            &ldquo;two products live&rdquo; for four months while six were live. That is exactly the
            kind of small, comfortable lie this page exists to make impossible.
          </p>
        </div>
      </section>

      {/* ---------- THE LEDGER ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="sec-label">The ledger</p>
          <h2 className="sec-title">Where it actually stands.</h2>

          {stats ? (
            <div className="ledger reveal">
              <div className="ledger-row">
                <span className="k">Products alive on the internet</span>
                <span className="v good">{stats.liveCount}</span>
              </div>
              <div className="ledger-row">
                <span className="k">Products attempted</span>
                <span className="v">{stats.totalCount}</span>
              </div>
              <div className="ledger-row">
                <span className="k">Total invested — API spend + infrastructure</span>
                <span className="v">{money(stats.totalSpend)}</span>
              </div>
              {avg !== null && (
                <div className="ledger-row">
                  <span className="k">Average cost of one living product</span>
                  <span className="v">{money(avg)}</span>
                </div>
              )}
              <div className="ledger-row">
                <span className="k">Revenue</span>
                <span className="v zero">$0.00</span>
              </div>
              <div className="ledger-row">
                <span className="k">Employees · investors · permission</span>
                <span className="v zero">0 · 0 · 0</span>
              </div>
              {pulse?.version && (
                <div className="ledger-row">
                  <span className="k">Pipeline version running right now</span>
                  <span className="v">v{pulse.version}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="empty">
              The machine&apos;s API did not answer. I would rather show you an empty box than a
              number I remembered.
            </div>
          )}

          <div className="callout reveal">
            <p>
              <strong>Yes, revenue is zero.</strong>{' '}
              {stats ? `All ${stats.liveCount} live products` : 'Every live product'} and not one
              dollar between them. I could hide that behind &ldquo;early stage.&rdquo; The whole
              experiment is worth nothing if I do.
            </p>
            <p>
              The number that matters to me isn&apos;t revenue yet — it&apos;s{' '}
              <strong>the cost of one act of creation</strong>. I am probably the only person alive
              who can tell you, to the cent, what it costs to take a piece of software from a
              question to a live URL with no human touching it.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- ON THE LINE ---------- */}
      <section>
        <div className="wrap-wide">
          <p className="sec-label">On the line</p>
          <h2 className="sec-title">
            {!f
              ? 'Nothing is on the line right now.'
              : f.halted
                ? `${f.name} is halted — and I am showing you anyway.`
                : `${f.name} is being born.`}
          </h2>

          {f ? (
            <div className={`machine${f.halted ? '' : ' on'}`}>
              <div className="machine-head">
                <span>{f.name}</span>
                <span className="live">{f.halted ? '⏸ halted' : '● working'}</span>
              </div>
              <div className="machine-body">
                {f.halted ? (
                  <span className="idle">
                    Halted at {STATIONS[f.station] ?? 'the line'} — status <code>{f.status}</code>.
                    The machine&apos;s own QA refused to pass it. {money(f.cost)} spent and it is
                    not shipping until it is right. Nobody publishes this screen. That is why I do.
                  </span>
                ) : thought ? (
                  <>
                    <span className="who">{f.thoughtBy ?? 'A Mind'}</span>
                    {' → '}
                    {thought}
                  </>
                ) : (
                  <span className="idle">
                    {f.thoughtBy ?? 'A Mind'} is emitting source code, not sentences. I won&apos;t
                    dress raw output up as &ldquo;the machine&apos;s thought&rdquo; — that would be
                    theatre. The stage and the spend below are real.
                  </span>
                )}
              </div>
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
                  status <b className="mono">{f.status}</b>
                </span>
              </div>
            </div>
          ) : (
            <div className="empty">
              The line is idle. When a Mind starts, this fills up on its own — no one presses
              anything.
            </div>
          )}
        </div>
      </section>

      {/* ---------- WHAT THEY BUILT ---------- */}
      {stats && stats.products?.length > 0 && (
        <section>
          <div className="wrap-wide">
            <p className="sec-label">What they built</p>
            <h2 className="sec-title">Every one has a URL you can open right now.</h2>
            <div className="prods">
              {stats.products.map((p) => (
                <a
                  key={p.slug}
                  className="prod reveal"
                  href={p.url ?? `https://zeroorigine.com/products`}
                  target="_blank"
                  rel="noopener"
                >
                  <div className="st">live</div>
                  <h4>{p.name}</h4>
                  <p>{p.tagline ?? ''}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- THE MACHINE'S RECENT DECISIONS ---------- */}
      {pulse?.events?.length ? (
        <section>
          <div className="wrap">
            <p className="sec-label">Recent decisions</p>
            <h2 className="sec-title">The last things the Minds did — including the refusals.</h2>
            <div className="ledger reveal">
              {pulse.events.slice(0, 8).map((e, i) => (
                <div className="ledger-row" key={i}>
                  <span className="k">
                    <strong style={{ color: 'var(--text)' }}>{e.mind}</strong> {e.line}
                  </span>
                  <span className="v" style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {e.at ? elapsed(e.at) + ' ago' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------- THE HONEST PART ---------- */}
      <section>
        <div className="wrap">
          <p className="sec-label">The part nobody publishes</p>
          <h2 className="sec-title">What has gone wrong.</h2>
          <p className="sec-sub">
            Every AI company shows you its wins. This is the section that costs me something —
            which is precisely why it is here.
          </p>
          <div className="ledger reveal">
            <div className="ledger-row">
              <span className="k">
                <strong style={{ color: 'var(--text)' }}>InvoiceMemory</strong> — approved at 8.5,
                built nine times, never once passed QA. Dropped.
              </span>
              <span className="v" style={{ color: 'var(--red)' }}>−$126</span>
            </div>
            <div className="ledger-row">
              <span className="k">
                <strong style={{ color: 'var(--text)' }}>RigFile, first attempt</strong> — the
                landing page and the API described two different products. Its own QA killed it.
              </span>
              <span className="v" style={{ color: 'var(--red)' }}>−$37</span>
            </div>
            <div className="ledger-row">
              <span className="k">
                <strong style={{ color: 'var(--text)' }}>The alarm bell</strong> — every founder
                alert the pipeline &ldquo;sent&rdquo; me for months silently threw an error and was
                swallowed. The machine thought it had shouted. It had never once shouted.
              </span>
              <span className="v" style={{ color: 'var(--text-dim)' }}>fixed</span>
            </div>
          </div>
          <div className="callout reveal">
            <p>
              A build that fails the same way twice is not a build problem —{' '}
              <strong>it is a specification problem.</strong> That sentence cost me $126 to learn,
              and it is now a rule the machine enforces on itself.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
