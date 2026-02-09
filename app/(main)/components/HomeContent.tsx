'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

interface LayerInfo {
  text: string;
  href?: string;
  action?: () => void;
}

const layers: LayerInfo[] = [
  { text: 'github', href: 'https://github.com/viceversa1024' },
  { text: 'discord (copy)' },
  { text: 'zine-a-thon', href: 'https://helenatran.com/humanexperiments/' },
];

const layerCenterPct = [14, 48, 82];

interface AltBio {
  name: string;
  paragraphs: string[];
}

interface HomeContentProps {
  altBios: AltBio[];
}

export default function HomeContent({ altBios }: HomeContentProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [mobileTooltip, setMobileTooltip] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [universe, setUniverse] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setMobileTooltip(null);
    }
  }, []);

  useEffect(() => {
    if (mobileTooltip !== null) {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mobileTooltip, handleClickOutside]);

  const handlePolygonClick = (index: number, e: React.MouseEvent) => {
    if (isTouchDevice()) {
      e.preventDefault();
      setMobileTooltip(mobileTooltip === index ? null : index);
    } else if (index === 1) {
      e.preventDefault();
      navigator.clipboard.writeText('vice9versa');
      setCopied(true);
    }
  };

  // Cycle: null → 0 → null → 1 → null → 2 → ... → null → 0 → ...
  const [nextAltIndex, setNextAltIndex] = useState(0);

  const handleUniverseToggle = () => {
    if (altBios.length === 0) return;
    if (universe !== null) {
      // Currently showing an alt — go back to normal
      setNextAltIndex((universe + 1) % altBios.length);
      setUniverse(null);
    } else {
      // Currently normal — show the next alt
      setUniverse(nextAltIndex);
    }
  };

  // Label previews what clicking will do
  const buttonLabel = universe !== null ? 'normal' : (altBios.length > 0 ? altBios[nextAltIndex].name : 'dark');

  return (
    <>
      <div className="apollo">
        <img
          src="/apollo.png"
          alt="Apollo"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div style={{ textAlign: 'center', overflow: 'visible', position: 'relative', zIndex: 5 }}>
        <div
          className="layers-container"
          ref={containerRef}
          style={{ position: 'relative', display: 'inline-block', width: '25%', overflow: 'visible' }}
        >
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
              href="https://github.com/viceversa1024"
              target="_blank"
              rel="noopener noreferrer"
              className="layer-link"
              onMouseMove={(e) => { if (!isTouchDevice()) setTooltip({ x: e.clientX, y: e.clientY, text: 'github' }); }}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => handlePolygonClick(0, e)}
            >
              <polygon points="42,57 160,16 156,284 37,325" />
            </a>
            <a
              className="layer-link"
              onMouseMove={(e) => { if (!isTouchDevice()) setTooltip({ x: e.clientX, y: e.clientY, text: 'discord (copy)' }); }}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => handlePolygonClick(1, e)}
            >
              <polygon points="279,63 401,17 396,288 275,328" />
            </a>
            <a
              href="https://helenatran.com/humanexperiments/"
              target="_blank"
              rel="noopener noreferrer"
              className="layer-link"
              onMouseMove={(e) => { if (!isTouchDevice()) setTooltip({ x: e.clientX, y: e.clientY, text: 'zine-a-thon' }); }}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => handlePolygonClick(2, e)}
            >
              <polygon points="513,63 636,19 630,292 511,333" />
            </a>
          </svg>
          {mobileTooltip !== null && (
            <div
              style={{
                position: 'absolute',
                top: -40,
                left: `${layerCenterPct[mobileTooltip]}%`,
                transform: 'translateX(-50%)',
                fontSize: '20px',
                whiteSpace: 'nowrap',
                background: 'black',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '4px',
                zIndex: 10,
              }}
            >
              {layers[mobileTooltip].href ? (
                <a
                  href={layers[mobileTooltip].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'white', textDecoration: 'underline' }}
                >
                  {layers[mobileTooltip].text}
                </a>
              ) : (
                <span
                  style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText('vice9versa');
                    setCopied(true);
                  }}
                >
                  {layers[mobileTooltip].text}
                </span>
              )}
            </div>
          )}
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
      {universe === null ? (
        <>
          <p>Hello, I&apos;m Harry.</p>
          <p>I care about the future of humans and machines. Powerful artificial intelligence is possible, and when I&apos;m not working to align it, I enjoy writing, talking, wearing sweaters, believing, and seeing. On earth as it is in heaven.</p>
          <p>I&apos;m currently studying math at the University of California, Irvine.</p>
        </>
      ) : (
        <>
          {altBios[universe].paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </>
      )}
      <button className="universe-toggle" onClick={handleUniverseToggle}>
        {buttonLabel}
      </button>
    </>
  );
}
