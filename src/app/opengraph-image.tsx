import { ImageResponse } from 'next/og';

// nodejs runtime (no `edge`): Netlify's edge bundler needs Deno, and this image doesn't need it.
export const alt = 'Jagdish Lade. I collect dots. Zero is where I connect them.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The LinkedIn / social share card. Must match the site: paper, not ink.
 * Satori rules that fail the build: every element with >1 child needs display:flex,
 * and any glyph outside the loaded font (bullets, arrows) triggers a 400 font fetch.
 * Kept to ASCII, flexed everywhere.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf7f0',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', color: '#8b9299', fontSize: 24, letterSpacing: 4 }}>
          JAGDISH LADE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 74, color: '#16181b', lineHeight: 1.06 }}>
            I collect dots.
          </div>
          <div style={{ display: 'flex', gap: '0.28em', fontSize: 74, lineHeight: 1.06 }}>
            <span style={{ color: '#9a7422', fontStyle: 'italic' }}>Zero</span>
            <span style={{ color: '#16181b' }}>is where I connect them.</span>
          </div>
          <div style={{ display: 'flex', fontSize: 27, color: '#5d6167', marginTop: 34 }}>
            Chartered Accountant. AI and automation architect. On truth, and building.
          </div>
        </div>

        <div style={{ display: 'flex', color: '#9a7422', fontSize: 22, letterSpacing: 2 }}>
          jagdishlade.com
        </div>
      </div>
    ),
    { ...size },
  );
}
