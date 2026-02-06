import Link from 'next/link';
import { getSortedPostsData, formatDate } from '@/lib/posts';

export default function Blog() {
  const posts = getSortedPostsData();

  return (
    <>
      <h1>Blog</h1>
      <div className="blog-list">
        {posts.length === 0 ? (
          <p>No posts yet. Check back soon!</p>
        ) : (
          posts.map((post) => (
            <div key={post.slug} className="blog-entry">
              <div className="blog-title">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </div>
              <div className="blog-date">{formatDate(post.date)}</div>
              {post.excerpt && <div className="blog-excerpt">{post.excerpt}</div>}
            </div>
          ))
        )}
      </div>
    </>
  );
}
