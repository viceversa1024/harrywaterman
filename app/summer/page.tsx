"use client";

import { useEffect } from "react";

const SUMMER_URL = "https://docs.google.com/document/d/1RRUeR57PDhVbVmY8vl8ccLSEX2yon3P-rLeZs_Ibd7g/edit?tab=t.0";

export default function Summer() {
  useEffect(() => {
    window.location.replace(SUMMER_URL);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${SUMMER_URL}`} />
      <p>
        Redirecting to <a href={SUMMER_URL}>the document</a>…
      </p>
    </>
  );
}
