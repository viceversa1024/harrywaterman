import Link from 'next/link';

export default function Friends() {
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
            <Link href="/you">You</Link>
          </div>
          <div className="friend-description">If you&apos;re cool with that.</div>
        </div>

        <div className="friend-divider"></div>
      </div>
    </>
  );
}
