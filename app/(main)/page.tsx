'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <>
      <div className="apollo">
        <img
          src="/apollo.png"
          alt="Apollo"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', width: '25%' }}>
          <img
            src="/layers.png"
            alt="Neural network layers"
            style={{ width: '100%', height: 'auto' }}
          />
          <svg
            viewBox="0 0 700 350"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <style>{`
              .layer-link polygon {
                fill: rgba(0, 0, 0, 0);
                cursor: pointer;
                transition: fill 0.2s ease;
              }
              .layer-link:hover polygon {
                fill: rgba(0, 0, 0, 0.07);
              }
            `}</style>
            <a
              href="/HW_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="layer-link"
              onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, text: 'resume' })}
              onMouseLeave={() => setTooltip(null)}
            >
              <polygon points="42,57 160,16 156,284 37,325" />
            </a>
            <a
              className="layer-link"
              onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, text: 'discord (copy)' })}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText('vice9versa');
                setCopied(true);
              }}
            >
              <polygon points="279,63 401,17 396,288 275,328" />
            </a>
            <a
              href="https://helenatran.com/humanexperiments/"
              target="_blank"
              rel="noopener noreferrer"
              className="layer-link"
              onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, text: 'zine-a-thon' })}
              onMouseLeave={() => setTooltip(null)}
            >
              <polygon points="513,63 636,19 630,292 511,333" />
            </a>
          </svg>
        </div>
      </div>
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: 'black',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {tooltip.text}
        </div>
      )}
      {copied && (
        <div
          style={{
            position: 'fixed',
            bottom: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'black',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            zIndex: 1000,
          }}
        >
          discord username copied to clipboard
        </div>
      )}
      <p>Hello, I&apos;m Harry.</p>
      <p>I care about the future of humans and machines. Powerful artificial intelligence is possible, and when I'm not working to align it, I enjoy writing, talking, wearing sweaters, believing, and seeing. On earth as it is in heaven.</p>
      <p>I&apos;m currently studying math at the University of California, Irvine.</p>
    </>
  );
}
