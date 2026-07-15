'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setErr('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
      company: String(fd.get('company') || ''), // honeypot
    };
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setState('done');
      } else {
        const j = await r.json().catch(() => ({}));
        setErr(j.error || 'Something went wrong.');
        setState('error');
      }
    } catch {
      setErr('Network error.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p className="form-note" style={{ color: 'var(--green)', fontSize: '1rem' }}>
        Thank you. Your message is in my inbox and I read every one. I&apos;ll reply from
        cajagdishlade@gmail.com.
      </p>
    );
  }

  return (
    <form className="contact" onSubmit={submit}>
      <div className="contact-row">
        <input name="name" required placeholder="Your name" aria-label="Your name" autoComplete="name" />
        <input name="email" type="email" required placeholder="Your email" aria-label="Your email" autoComplete="email" />
      </div>
      <textarea name="message" required rows={5} placeholder="What&apos;s on your mind?" aria-label="Your message" />
      {/* honeypot: hidden from humans, catches bots */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <div className="contact-send">
        <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {state === 'error' && (
          <span className="form-note" style={{ color: 'var(--red)' }}>
            {err} You can also email me directly:{' '}
            <a href="mailto:cajagdishlade@gmail.com">cajagdishlade@gmail.com</a>
          </span>
        )}
      </div>
    </form>
  );
}
