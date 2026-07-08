"use client";

import { useEffect } from "react";

const DOCS_URL =
  "https://docs.google.com/document/d/1MfNyR7vdH2XSJ8jRPxrtHb30nkjwryBwzSVF0oUCA2g/edit?tab=t.0";

export default function Docs() {
  useEffect(() => {
    window.location.replace(DOCS_URL);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${DOCS_URL}`} />
      <p>
        Redirecting to <a href={DOCS_URL}>masterdoc</a>…
      </p>
    </>
  );
}
