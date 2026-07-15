'use client';
import { useState } from 'react';

export default function FooterSubscribe() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState(r.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') return <p className="foot-sub-done">You&apos;re in. New essays reach you the day they publish.</p>;

  return (
    <form className="foot-sub-form" onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email for new essays"
      />
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? '…' : 'Subscribe'}
      </button>
    </form>
  );
}
