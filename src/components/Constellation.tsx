'use client';
import { useEffect, useRef } from 'react';

/**
 * The signature visual: a living constellation of dots and connections, unique to
 * each essay (seeded from its slug, so it is stable and never repeats). A few gold
 * nodes are the "connected dots" — the insight — joined by a gold line with a
 * travelling spark. A faint ring is the zero. Pure canvas, no images, no cost.
 * Honours prefers-reduced-motion (renders one still frame) and pauses off-screen.
 */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Constellation({ seed, height = 200 }: { seed: string; height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0,
      H = height,
      raf = 0,
      running = true;

    const palette = () => {
      const cs = getComputedStyle(document.documentElement);
      const g = (v: string, f: string) => cs.getPropertyValue(v).trim() || f;
      return {
        ink: g('--text', '#16181b'),
        gold: g('--gold', '#9a7422'),
        line: g('--border-strong', '#cdc4b1'),
      };
    };
    let C = palette();

    const rnd = mulberry(hash(seed));
    const N = 15 + Math.floor(rnd() * 6);
    const nodes = Array.from({ length: N }, () => ({
      bx: 0.08 + rnd() * 0.84,
      by: 0.14 + rnd() * 0.72,
      ph: rnd() * Math.PI * 2,
      ph2: rnd() * Math.PI * 2,
      sp: 0.25 + rnd() * 0.5,
      am: 5 + rnd() * 9,
      gold: false,
    }));
    const golds: number[] = [];
    while (golds.length < 3) {
      const gi = Math.floor(rnd() * N);
      if (!golds.includes(gi)) {
        golds.push(gi);
        nodes[gi].gold = true;
      }
    }

    const size = () => {
      W = canvas.getBoundingClientRect().width;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pos = (n: (typeof nodes)[number], t: number) => ({
      x: n.bx * W + Math.sin(t * n.sp + n.ph) * n.am,
      y: n.by * H + Math.cos(t * n.sp * 0.8 + n.ph2) * n.am * 0.7,
    });

    const frame = (ts: number) => {
      const t = reduce ? 0 : ts / 1000;
      ctx.clearRect(0, 0, W, H);
      const P = nodes.map((n) => pos(n, t));

      ctx.strokeStyle = C.gold;
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, Math.min(W, H) * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const thr = Math.min(W, H) * 0.42;
      for (let i = 0; i < N; i++) {
        const ds: [number, number][] = [];
        for (let j = 0; j < N; j++) {
          if (i === j) continue;
          const dx = P[i].x - P[j].x,
            dy = P[i].y - P[j].y;
          ds.push([dx * dx + dy * dy, j]);
        }
        ds.sort((a, b) => a[0] - b[0]);
        for (let m = 0; m < 2; m++) {
          const j = ds[m][1];
          if (i >= j) continue;
          const d = Math.sqrt(ds[m][0]);
          if (d > thr * 1.5) continue;
          const g = nodes[i].gold && nodes[j].gold;
          ctx.strokeStyle = g ? C.gold : C.line;
          ctx.lineWidth = g ? 1.2 : 0.7;
          ctx.globalAlpha = g ? 0.7 : Math.max(0.1, 0.5 * (1 - d / (thr * 1.5)));
          ctx.beginPath();
          ctx.moveTo(P[i].x, P[i].y);
          ctx.lineTo(P[j].x, P[j].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      for (let a = 0; a < golds.length; a++)
        for (let b = a + 1; b < golds.length; b++) {
          const i = golds[a],
            j = golds[b];
          ctx.strokeStyle = C.gold;
          ctx.lineWidth = 1.1;
          ctx.globalAlpha = 0.45;
          ctx.beginPath();
          ctx.moveTo(P[i].x, P[i].y);
          ctx.lineTo(P[j].x, P[j].y);
          ctx.stroke();
          const u = reduce ? 0.5 : Math.sin(t * 0.7 + a + b) * 0.5 + 0.5;
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = C.gold;
          ctx.beginPath();
          ctx.arc(P[i].x + (P[j].x - P[i].x) * u, P[i].y + (P[j].y - P[i].y) * u, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      ctx.globalAlpha = 1;

      for (let i = 0; i < N; i++) {
        if (nodes[i].gold) {
          const pulse = reduce ? 0 : Math.sin(t * 1.1 + nodes[i].ph) * 0.6;
          ctx.fillStyle = C.gold;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(P[i].x, P[i].y, 4 + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.16;
          ctx.beginPath();
          ctx.arc(P[i].x, P[i].y, 9 + pulse * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = C.ink;
          ctx.globalAlpha = 0.78;
          ctx.beginPath();
          ctx.arc(P[i].x, P[i].y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (running && !reduce) raf = requestAnimationFrame(frame);
    };

    size();
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          running = e.isIntersecting;
          if (running && !reduce) {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(frame);
          }
        }),
      { threshold: 0 },
    );
    io.observe(canvas);
    const onResize = () => {
      size();
      if (reduce) frame(0);
    };
    window.addEventListener('resize', onResize);
    const mo = new MutationObserver(() => {
      C = palette();
      if (reduce) frame(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (reduce) frame(0);
    else raf = requestAnimationFrame(frame);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [seed, height]);

  return <canvas ref={ref} aria-hidden="true" style={{ width: '100%', height, display: 'block' }} />;
}
