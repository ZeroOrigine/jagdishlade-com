'use client';
import { useState } from 'react';

export default function SubscribeForm() {
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

  if (state === 'done') {
    return (
      <p className="sub-note" style={{ color: 'var(--green)' }}>
        ✓ You&apos;re on the list. You&apos;ll hear from me when a Mind starts building. Not before.
      </p>
    );
  }

  return (
    <>
      <form className="sub" onSubmit={submit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
        />
        <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Notify me'}
        </button>
      </form>
      <p className="sub-note">
        {state === 'error'
          ? 'That did not go through. Email me directly. Cajagdishlade@gmail.com'
          : 'One message when a build starts. No newsletter. No drip. Unsubscribe in one click.'}
      </p>
    </>
  );
}
