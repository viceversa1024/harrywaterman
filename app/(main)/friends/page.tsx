'use client';

import { useState, useRef, useEffect } from 'react';

export default function Friends() {
  const [showCam, setShowCam] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleYouClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (showCam) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowCam(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch {
      // permission denied or no camera
    }
  };

  return (
    <>
      <h1>Friends, Under Constant Construction</h1>
      <div className="friends-list">
        <div className="friend-entry">
          <div className="friend-name">
            <a href="https://helenatran.com/" target="_blank" rel="noopener noreferrer">Helena Tran</a>
          </div>
          <div className="friend-description">Real artist in the real world. Utterly exciting progenitor.</div>
        </div>

        <div className="friend-divider"></div>

        <div className="friend-entry">
          <div className="friend-name">
            <a href="https://cairosmith.com/" target="_blank" rel="noopener noreferrer">Cairo Smith</a>
          </div>
          <div className="friend-description">Active anthropologist and the one good podcaster.</div>
        </div>

        <div className="friend-divider"></div>

        <div className="friend-entry">
          <div className="friend-name">
            <a href="#" onClick={handleYouClick}>You</a>
          </div>
          <div className="friend-description">If you&apos;re cool with that.</div>
        </div>

        {showCam && (
          <div style={{ marginTop: '20px', paddingLeft: '20px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    </>
  );
}
