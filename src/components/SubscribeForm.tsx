'use client';
import { useState } from 'react';

/**
 * Essay subscription. Email only, straight into the Resend audience.
 * Different intent from the contact form: this is "send me new writing."
 */
export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setErr('');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (r.ok) setState('done');
      else {
        const j = await r.json().catch(() => ({}));
        setErr(j.error || 'That did not go through.');
        setState('error');
      }
    } catch {
      setErr('Network error.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className="form-note" style={{ color: 'var(--green)', fontSize: '0.95rem' }}>
        You&apos;re in. New essays will reach you the day they publish. Nothing else.
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
          aria-label="Your email"
        />
        <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Adding…' : 'Get new essays'}
        </button>
      </form>
      <p className="form-note">
        {state === 'error'
          ? `${err} You can also just email me: cajagdishlade@gmail.com`
          : 'An email only when I publish a new essay. No schedule, no noise. One-click unsubscribe.'}
      </p>
    </>
  );
}
