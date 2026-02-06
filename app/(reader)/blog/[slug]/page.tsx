import { getPostData, getAllPostSlugs, formatDateLong } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - Harry Waterman`,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <>
      <Link href="/blog" className="reader-back">
        &larr; Back
      </Link>
      <article className="reader-article">
        <header className="reader-header">
          <h1 className="reader-title">{post.title}</h1>
          <time className="reader-date">{formatDateLong(post.date)}</time>
        </header>
        <div
          className="reader-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
        />
      </article>
    </>
  );
}
