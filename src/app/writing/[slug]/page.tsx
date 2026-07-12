import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ReadingBar from '@/components/ReadingBar';
import { getPost, getPosts, formatDate } from '@/lib/writing';

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return { title: 'Not found' };
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/writing/${p.slug}` },
    openGraph: {
      type: 'article',
      title: p.title,
      description: p.summary,
      publishedTime: p.date,
      url: `/writing/${p.slug}`,
    },
    twitter: { card: 'summary_large_image', title: p.title, description: p.summary },
  };
}

export default function Post({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.summary,
    datePublished: p.date,
    author: { '@type': 'Person', name: 'Jagdish Lade', url: 'https://jagdishlade.com' },
    mainEntityOfPage: `https://jagdishlade.com/writing/${p.slug}`,
  };

  return (
    <>
      <ReadingBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <article className="essay">
        <header className="essay-head">
          <h1>{p.title}</h1>
          <div className="m">
            <span>{formatDate(p.date)}</span>
            <span>{p.readingMinutes} min read</span>
            {p.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
        </header>

        <div className="prose">
          <MDXRemote source={p.body} />
        </div>

        <p className="sub-note" style={{ paddingBottom: 80 }}>
          <Link href="/writing">← All essays</Link> · If this made you think, tell me:{' '}
          <a href="mailto:cajagdishlade@gmail.com">cajagdishlade@gmail.com</a>. I answer everyone.
        </p>
      </article>
    </>
  );
}
