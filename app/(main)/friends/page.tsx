'use client';

import { useState, useRef, useEffect } from 'react';
import friends from './friends.json';

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
        {friends.map((friend, i) => (
          <div key={friend.name}>
            <div className="friend-entry">
              <div className="friend-name">
                <a href={friend.url} target="_blank" rel="noopener noreferrer">{friend.name}</a>
              </div>
              <div className="friend-description">{friend.description}</div>
            </div>
            <div className="friend-divider"></div>
          </div>
        ))}

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
