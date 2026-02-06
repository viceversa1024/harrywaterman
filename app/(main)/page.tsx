import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="apollo">
        <Image
          src="/apollo.png"
          alt="Apollo"
          width={500}
          height={500}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <p>Hello. I&apos;m Harry.</p>
      <p>I care about literature, chemistry, machines, madness, and people. On earth as it is in heaven.</p>
      <p>I&apos;m currently studying at the University of California, Irvine.</p>
    </>
  );
}
