import Link from 'next/link';

export default function Navigation() {
  return (
    <div className="left-column">
      <Link href="/" className="name-link">
        <h1>Waterman</h1>
        <h1>Harry</h1>
      </Link>
      <h2><Link href="/about">About</Link></h2>
      <h2><Link href="/reading">Reading</Link></h2>
      <h2><Link href="/riting">Riting</Link></h2>
      <h2><Link href="/rithmetic">Rithmetic</Link></h2>
      <h2><Link href="/friends">Friends</Link></h2>
      <h2><Link href="/blog">Blog</Link></h2>
    </div>
  );
}
