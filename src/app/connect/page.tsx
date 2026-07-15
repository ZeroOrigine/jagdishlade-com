import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Connect. I read every message',
  description: 'No autoresponders, no team. Email, LinkedIn, X, GitHub, or a form that reaches the same inbox.',
  alternates: { canonical: '/connect' },
};

const LINKS = [
  ['Email', 'cajagdishlade@gmail.com', 'mailto:cajagdishlade@gmail.com'],
  ['LinkedIn', 'linkedin.com/in/jagdishlade', 'https://www.linkedin.com/in/jagdishlade'],
  ['X', '@jagdishlade', 'https://x.com/jagdishlade'],
  ['GitHub', 'github.com/ZeroOrigine', 'https://github.com/ZeroOrigine'],
  ['The machine', 'zeroorigine.com', 'https://zeroorigine.com'],
];

export default function Connect() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <p className="eyebrow">Connect</p>
          <h1>
            I read <em>every</em> message.
          </h1>
          <p className="lede">
            If something here made you think, or you want to talk about building, failing, or
            starting over, I&apos;m here. No autoresponders, no team. Whichever way you reach me
            below, it lands with the same person.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="links">
            {LINKS.map(([k, v, href]) => (
              <a key={k} className="link-row" href={href} target="_blank" rel="noopener">
                <span className="lk">{k}</span>
                <span className="lv">{v}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="sec-label">Write to me</p>
          <h2 className="sec-title">A message, straight to my inbox.</h2>
          <p className="sec-sub">
            Prefer a form to your mail client? This does the same thing. It reaches the same person.
          </p>
          <ContactForm />
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="quote">
            “Here is no conflict, no suffering. Do you understand this place? Everything is here.”
          </p>
          <p className="quote-by">TRUTH · page V</p>
        </div>
      </section>
    </>
  );
}
