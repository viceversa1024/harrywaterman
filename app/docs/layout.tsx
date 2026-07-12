import { noEmbedMetadata } from "@/lib/noEmbed";

export const metadata = noEmbedMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
