import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-in">
        <span>© {new Date().getFullYear()} Jagdish Lade · Mississauga, Canada</span>
        <div className="foot-links">
          <Link href="/philosophy">Philosophy</Link>
          <Link href="/building">Building</Link>
          <Link href="/writing">Writing</Link>
          <Link href="/connect">Connect</Link>
          <a href="/rss.xml">RSS</a>
          <a href="https://zeroorigine.com" target="_blank" rel="noopener">ZeroOrigine ↗</a>
        </div>
      </div>
    </footer>
  );
}
