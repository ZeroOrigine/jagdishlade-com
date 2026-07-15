import type { Metadata } from 'next';
import { Fraunces, Newsreader, Inter_Tight, IBM_Plex_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});
const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  // Newsreader ships no metric overrides in next/font's table, which makes Next emit a
  // build warning and skip the size-adjusted fallback. Supply the fallback explicitly.
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: false,
});
const sans = Inter_Tight({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jagdishlade.com'),
  title: {
    default: 'Jagdish Lade. I collect dots. Zero is where I connect them.',
    template: '%s. Jagdish Lade',
  },
  description:
    'Chartered Accountant and AI & Automation architect. On truth, Back to Zero, collecting dots, and building machines that don\'t need me.',
  openGraph: {
    type: 'website',
    url: 'https://jagdishlade.com',
    siteName: 'Jagdish Lade',
    title: 'Jagdish Lade',
    description: 'On truth, Back to Zero, collecting dots. And building machines that don\'t need me.',
  },
  twitter: { card: 'summary_large_image', creator: '@jagdishlade' },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': [{ url: '/rss.xml', title: 'Jagdish Lade. Writing' }] },
  },
};

// Set the theme before paint so the page never flashes the wrong colour.
// Ink is the identity. The OS preference does not get to overrule it. Paper is a
// deliberate choice the reader makes (and we remember it).
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('jl-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jagdish Lade',
  url: 'https://jagdishlade.com',
  email: 'cajagdishlade@gmail.com',
  jobTitle: 'Chartered Accountant · AI & Automation Architect',
  description:
    'Chartered Accountant turned AI/automation architect. Founder of ZeroOrigine, an autonomous AI ecosystem that builds and ships software with no humans in the loop.',
  sameAs: [
    'https://www.linkedin.com/in/jagdishlade',
    'https://x.com/jagdishlade',
    'https://github.com/ZeroOrigine',
    'https://zeroorigine.com',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
