export default function Home() {
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
                fill: rgba(0, 0, 0, 0.15);
              }
            `}</style>
            <a href="#" className="layer-link">
              <polygon points="42,57 160,16 156,284 37,325" />
            </a>
            <a href="#" className="layer-link">
              <polygon points="279,63 401,17 396,288 275,328" />
            </a>
            <a href="#" className="layer-link">
              <polygon points="513,63 636,19 630,292 511,333" />
            </a>
          </svg>
        </div>
      </div>
      <p>Hello, I&apos;m Harry.</p>
      <p>I care about the future of humans and machines. Powerful artificial intelligence is possible, and when I'm not working to align it, I enjoy writing, talking, wearing sweaters, believing, and seeing. On earth as it is in heaven.</p>
      <p>I&apos;m currently studying math at the University of California, Irvine.</p>
    </>
  );
}
