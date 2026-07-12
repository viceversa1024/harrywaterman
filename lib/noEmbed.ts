import type { Metadata } from "next";

// Blank metadata for redirect pages so Discord/Slack render no embed card.
export const noEmbedMetadata: Metadata = {
  title: "",
  description: null,
  robots: { index: false, follow: false },
};
