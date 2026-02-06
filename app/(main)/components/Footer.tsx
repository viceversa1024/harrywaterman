const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/harrywaterman' : '';

export default function Footer() {
  return (
    <div
      className="footer"
      style={{ backgroundImage: `url('${basePath}/partygoers.png')` }}
    />
  );
}
