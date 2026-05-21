import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deranged Surveys — calibration game",
  description: "Guess how the US general public answered Leo Gao's deranged-survey questions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
