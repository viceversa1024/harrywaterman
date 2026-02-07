'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="left-column">
      <div className="nav-header">
        <Link href="/" className="name-link">
          <h1>Waterman</h1>
          <h1>Harry</h1>
        </Link>
        <button
          className={`nav-toggle${open ? ' nav-toggle-open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="nav-bar" />
          <span className="nav-bar" />
          <span className="nav-bar" />
        </button>
      </div>
      <div className={`nav-links${open ? ' nav-open' : ''}`}>
        <h2><Link href="/about" onClick={() => setOpen(false)}>About</Link></h2>
        <h2><Link href="/reading" onClick={() => setOpen(false)}>Reading</Link></h2>
        <h2><Link href="/riting" onClick={() => setOpen(false)}>Riting</Link></h2>
        <h2><Link href="/rithmetic" onClick={() => setOpen(false)}>Rithmetic</Link></h2>
        <h2><Link href="/friends" onClick={() => setOpen(false)}>Friends</Link></h2>
        <h2><Link href="/blog" onClick={() => setOpen(false)}>Blog</Link></h2>
      </div>
    </div>
  );
}
