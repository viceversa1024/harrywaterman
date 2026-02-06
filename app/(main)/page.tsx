const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/harrywaterman' : '';

export default function Home() {
  return (
    <>
      <div className="apollo">
        <img
          src={`${basePath}/apollo.png`}
          alt="Apollo"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <p>Hello. I&apos;m Harry.</p>
      <p>I care about literature, chemistry, machines, madness, and people. On earth as it is in heaven.</p>
      <p>I&apos;m currently studying at the University of California, Irvine.</p>
    </>
  );
}
