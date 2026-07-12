'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/philosophy', label: 'Philosophy', track: 'philosophy' },
  { href: '/building', label: 'Building', track: 'building' },
  { href: '/writing', label: 'Writing', track: 'writing' },
  { href: '/connect', label: 'Connect', track: 'connect', small: true },
];

export default function Nav() {
  const path = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const t = (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
    setTheme(t);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('jl-theme', next);
    } catch {
      /* private mode — theme just won't persist */
    }
    setTheme(next);
  }

  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-in">
        <Link href="/" className="brand">
          Jagdish<span className="zero">.</span>Lade
        </Link>
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href} className={l.small ? 'hide-sm' : undefined}>
              <Link
                href={l.href}
                data-track={l.track}
                className={path?.startsWith(l.href) ? 'on' : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="theme-btn"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to paper (light) mode' : 'Switch to ink (dark) mode'}
              title={theme === 'dark' ? 'Paper' : 'Ink'}
            >
              {theme === 'dark' ? '☾' : '☀'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
