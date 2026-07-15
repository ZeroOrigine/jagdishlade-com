import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import ReadingBar from '@/components/ReadingBar';
import Constellation from '@/components/Constellation';
import SubscribeForm from '@/components/SubscribeForm';
import ReadNext from '@/components/ReadNext';
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
    openGraph: { type: 'article', title: p.title, description: p.summary, publishedTime: p.date, url: `/writing/${p.slug}` },
    twitter: { card: 'summary_large_image', title: p.title, description: p.summary },
  };
}

const mdxComponents = {
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const external = (props.href || '').startsWith('http');
    return <a {...props} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} />;
  },
};

export default function Post({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();

  const all = getPosts();
  const related = all
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({ ...x, shared: x.tags.filter((t) => p.tags.includes(t) && t !== 'launch').length }))
    .sort((a, b) => b.shared - a.shared || (a.date < b.date ? 1 : -1))
    .slice(0, 4)
    .map((x) => ({ slug: x.slug, title: x.title, summary: x.summary, readingMinutes: x.readingMinutes, dateLabel: formatDate(x.date) }));

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
        <div className="const-band const-band-essay">
          <Constellation seed={p.slug} height={200} />
        </div>
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
          <MDXRemote source={p.body} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>

        <ReadNext items={related} />

        <div className="subscribe-block">
          <h3>More where this came from.</h3>
          <p>New essays, sent the day they publish. No schedule, no noise.</p>
          <SubscribeForm />
        </div>
        <p className="sub-note" style={{ paddingBottom: 72 }}>
          <Link href="/writing">← All essays</Link> · If this made you think, tell me:{' '}
          <a href="mailto:cajagdishlade@gmail.com">cajagdishlade@gmail.com</a>. I answer everyone.
        </p>
      </article>
    </>
  );
}
