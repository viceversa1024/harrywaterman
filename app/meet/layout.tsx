import type { Metadata } from "next";

const TITLE = "Schedule a 15 minute meeting with Harry";

export const metadata: Metadata = {
  title: TITLE,
  description: TITLE,
  openGraph: {
    title: TITLE,
    description: TITLE,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
