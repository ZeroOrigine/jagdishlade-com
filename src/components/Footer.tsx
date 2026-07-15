import Link from 'next/link';
import FooterSubscribe from './FooterSubscribe';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="foot-in">
        <div className="foot-top">
          <div className="foot-brand">
            <Link href="/" className="brand">
              Jagdish<span className="zero">.</span>Lade
            </Link>
            <p>I collect dots. Zero is where I connect them.</p>
          </div>
          <div className="foot-sub">
            <span className="foot-h">New essays by email</span>
            <FooterSubscribe />
            <span className="foot-sub-note">No schedule, no noise. One-click unsubscribe.</span>
          </div>
        </div>

        <div className="foot-cols">
          <nav className="foot-col" aria-label="Explore">
            <span className="foot-h">Explore</span>
            <Link href="/philosophy">Philosophy</Link>
            <Link href="/building">Building</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/connect">Connect</Link>
          </nav>
          <nav className="foot-col" aria-label="Elsewhere">
            <span className="foot-h">Elsewhere</span>
            <a href="https://www.linkedin.com/in/jagdishlade" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://x.com/jagdishlade" target="_blank" rel="noopener">X</a>
            <a href="https://github.com/ZeroOrigine" target="_blank" rel="noopener">GitHub</a>
            <a href="https://zeroorigine.com" target="_blank" rel="noopener">ZeroOrigine ↗</a>
          </nav>
          <nav className="foot-col" aria-label="More">
            <span className="foot-h">More</span>
            <a href="/rss.xml">RSS</a>
            <a href="mailto:cajagdishlade@gmail.com">Email</a>
          </nav>
        </div>

        <div className="foot-bottom">
          <span>© {year} Jagdish Lade</span>
          <span>Written and built in public.</span>
        </div>
      </div>
    </footer>
  );
}
