import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Building — machines that don’t need me',
  description:
    'What I build and why: an autonomous software ecosystem, tools for accountants, and the philosophy of removing steps instead of adding features.',
  alternates: { canonical: '/building' },
};

export default function Building() {
  return (
    <>
      <Reveal />

      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap-wide">
          <p className="eyebrow">Building</p>
          <h1>
            Innovation is <em>removing</em> steps, not adding features.
          </h1>
          <p className="lede">
            Every process I have ever automated followed the same pattern: break the goal into
            steps, challenge each one — &ldquo;does this exist because it is necessary, or because
            a human gets tired, forgets, and needs supervision?&rdquo; — and delete everything that
            fails the question. A five-day month-end close became two days that way. Not by adding
            software on top of the old process, but by removing most of the process first.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="sec-label">ZeroOrigine</p>
          <h2 className="sec-title">A company with zero employees, run by its own Minds.</h2>
          <p className="sec-sub">
            ZeroOrigine is eight AI Minds with a constitution and a budget. They research a problem,
            argue about whether it deserves to exist, build it, refuse to ship it when it isn&apos;t
            good enough, and launch it — with no one in the loop. It is the &ldquo;remove the
            steps&rdquo; philosophy taken to its logical end: if a step exists only because humans
            need meetings, approvals and reminders, the Minds don&apos;t have it.
          </p>
          <p className="sec-sub">
            It publishes its own ledger — every product, every dollar spent, every failure kept on
            the books instead of quietly deleted. Those numbers belong to the machine, so they live
            on the machine&apos;s own site:{' '}
            <a href="https://zeroorigine.com" target="_blank" rel="noopener noreferrer">
              zeroorigine.com
            </a>
            . An institution that hides its failures is lying about its successes — so it shows both.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="sec-label">Speed CA</p>
          <h2 className="sec-title">For the profession I come from.</h2>
          <p className="sec-sub">
            Twenty years inside accounting taught me where the hours actually go: compliance
            calendars, client follow-ups, documents chased over WhatsApp, the same reconciliations
            every month. Speed CA is a practice platform for Chartered Accountants in India that
            removes those steps —{' '}
            <a href="https://ai2all.ai" target="_blank" rel="noopener noreferrer">ai2all.ai</a>.
            Built by a CA, for CAs, from the inside.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="sec-label">The method</p>
          <h2 className="sec-title">How every build starts.</h2>
          <p className="sec-sub">
            First: write the goal in one sentence. Not the task — the goal. Second: list the steps.
            Third: attack the list. &ldquo;Is this step necessary, or is it how we&apos;ve always
            done it?&rdquo; Most people add steps to feel thorough. I remove them until what remains
            is the shortest honest path — then I automate that, and only that.
          </p>
          <p className="sec-sub">
            The same method applies to prompting AI. The secret is not learning the machine — it is
            learning your own mind well enough to describe the goal without the biological
            scaffolding: the double-checks that exist because we forget, the approvals that exist
            because we don&apos;t trust, the interfaces that exist because we need to see. Strip
            those away and the machine finds its own path.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="quote reveal">
            &ldquo;The fewer steps between you and the goal, the more elegant the solution.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
