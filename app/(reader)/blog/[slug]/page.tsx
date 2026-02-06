import { getPostData, getAllPostSlugs, formatDate } from '@/lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
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
          <time className="reader-date">{formatDate(post.date)}</time>
        </header>
        <div
          className="reader-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
        />
      </article>
    </>
  );
}
