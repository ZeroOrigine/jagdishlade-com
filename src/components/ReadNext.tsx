import Link from 'next/link';

type Item = { slug: string; title: string; summary: string; dateLabel: string; readingMinutes: number };

export default function ReadNext({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="readnext" aria-label="Read next">
      <p className="sec-label">Read next</p>
      <div className={`readnext-track${items.length > 2 ? ' scroll' : ''}`}>
        {items.map((p) => (
          <Link key={p.slug} href={`/writing/${p.slug}`} className="readnext-card">
            <div className="readnext-meta">
              {p.dateLabel} · {p.readingMinutes} min
            </div>
            <h4>{p.title}</h4>
            <p>{p.summary}</p>
            <span className="readnext-go">Read →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
