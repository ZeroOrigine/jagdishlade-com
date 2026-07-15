import { getBirthline, elapsed, money, readableThought } from '@/lib/zo';

export const revalidate = 60;

/**
 * The heartbeat. Sits above the nav on every page.
 * If the machine is building something, this line says so. With the real product,
 * the real stage, and the real money spent so far. If it isn't, it says that too.
 * If the API is unreachable, it renders a quiet, honest "no signal". Never a guess.
 */
export default async function LiveStrip() {
  const b = await getBirthline();

  if (!b) {
    return (
      <div className="livestrip">
        <div className="livestrip-in">
          <span className="dot" aria-hidden="true" />
          <span className="what">no signal from the machine right now</span>
        </div>
      </div>
    );
  }

  const f = b.inflight;

  if (!f) {
    return (
      <div className="livestrip">
        <div className="livestrip-in">
          <span className="dot" aria-hidden="true" />
          <span className="what">
            the machine is idle. Nothing is being born at this moment
          </span>
        </div>
      </div>
    );
  }

  const thought = readableThought(f.thought);

  return (
    <div className={`livestrip${f.halted ? '' : ' on'}`} role="status" aria-live="polite">
      <div className="livestrip-in">
        <span className="dot" aria-hidden="true" />
        <span className="what">
          {f.halted ? 'halted · ' : 'building now · '}
          <strong>{f.name}</strong>
          {' · '}
          {f.halted
            ? `stuck at ${STATION_LABEL[f.station] ?? 'the line'} · ${f.status}`
            : `${f.thoughtBy ?? 'the pipeline'} at ${STATION_LABEL[f.station] ?? 'work'}`}
          {!f.halted && thought
            ? ` · “${thought.slice(0, 70)}${thought.length > 70 ? '…' : ''}”`
            : ''}
        </span>
        <span className="cost mono">
          {elapsed(f.born)} · {money(f.cost)}
        </span>
      </div>
    </div>
  );
}

const STATION_LABEL: Record<number, string> = {
  0: 'research',
  1: 'evaluation',
  2: 'ethics review',
  3: 'the build',
  4: 'QA',
  5: 'launch',
};
