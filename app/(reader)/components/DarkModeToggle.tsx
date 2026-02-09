'use client';

import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('reader-dark');
    if (saved === 'true') setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('reader-dark', String(dark));
    document.documentElement.classList.toggle('reader-dark', dark);
    return () => document.documentElement.classList.remove('reader-dark');
  }, [dark]);

  return (
    <button
      className="dark-toggle"
      onClick={() => setDark(!dark)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? 'light' : 'dark'}
    </button>
  );
}
