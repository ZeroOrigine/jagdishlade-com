'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile: invisible, privacy-friendly bot wall.
 * Renders ONLY when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so until the founder
 * adds the key the forms work exactly as before (honeypot + time-trap + rate limit).
 * On success it hands the token up via onVerify; the server verifies it.
 */
export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (!SITE_KEY || rendered.current) return;
    const id = 'cf-turnstile-script';
    const render = () => {
      if (rendered.current || !ref.current || !window.turnstile) return;
      rendered.current = true;
      window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        theme: 'auto',
        appearance: 'interaction-only',
        size: 'flexible',
        callback: (token: string) => onVerify(token),
        'expired-callback': () => onVerify(''),
        'error-callback': () => onVerify(''),
      });
    };
    if (window.turnstile) return render();
    if (!document.getElementById(id)) {
      const sc = document.createElement('script');
      sc.id = id;
      sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      sc.async = true;
      sc.defer = true;
      sc.onload = render;
      document.head.appendChild(sc);
    } else {
      document.getElementById(id)!.addEventListener('load', render);
    }
  }, [onVerify]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="cf-turnstile-holder" style={{ marginTop: 4 }} />;
}

export const turnstileEnabled = !!SITE_KEY;
