import { ImageResponse } from 'next/og';

// nodejs runtime (no `edge`): Netlify's edge bundler needs Deno, and this image doesn't need it.
export const alt = 'Jagdish Lade — Failed. Returned to zero. Building from there.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Satori (the renderer behind next/og) has two rules that will fail a production build:
 *   1. every element with more than one child MUST declare display:flex (or none)
 *   2. any glyph outside the loaded font (e.g. "●") triggers a dynamic font fetch — which 400s
 * Both were caught by the real Netlify build. Kept to ASCII, flexed everywhere.
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
          background: '#08090a',
          padding: '70px',
        }}
      >
        <div style={{ display: 'flex', color: '#575e66', fontSize: 24, letterSpacing: 4 }}>
          JAGDISH LADE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 78, color: '#e8eaec', lineHeight: 1.05 }}>
            Failed. Returned to zero.
          </div>
          <div style={{ display: 'flex', fontSize: 78, color: '#c79a3e', lineHeight: 1.05 }}>
            Building from there.
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#8b9299', marginTop: 30 }}>
            Eight AI Minds. No employees. No investors. Honest numbers.
          </div>
        </div>

        <div style={{ display: 'flex', color: '#3ddc84', fontSize: 22, letterSpacing: 2 }}>
          zeroorigine.com — live
        </div>
      </div>
    ),
    { ...size },
  );
}
