import type { Metadata } from "next";
import "./globals.css";

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/harrywaterman' : '';

export const metadata: Metadata = {
  title: "Harry Waterman",
  description: "a site of my own",
  icons: {
    icon: [
      { url: `${basePath}/favicons/favicon.ico` },
      { url: `${basePath}/favicons/favicon.svg`, type: 'image/svg+xml' },
    ],
    apple: `${basePath}/favicons/apple-touch-icon.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
