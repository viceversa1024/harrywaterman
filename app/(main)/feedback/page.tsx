"use client";

import { useEffect } from "react";

const FEEDBACK_URL = "https://www.admonymous.co/harry";

export default function Feedback() {
  useEffect(() => {
    window.location.replace(FEEDBACK_URL);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${FEEDBACK_URL}`} />
      <p>
        Redirecting to <a href={FEEDBACK_URL}>anonymous feedback</a>…
      </p>
    </>
  );
}
