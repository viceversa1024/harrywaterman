"use client";

import { useEffect } from "react";

const MEETING_URL = "https://calendar.app.google/RJz5GmyK3fpELsz66";

export default function Meet() {
  useEffect(() => {
    window.location.replace(MEETING_URL);
  }, []);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${MEETING_URL}`} />
      <p>
        Redirecting to <a href={MEETING_URL}>meeting page</a>…
      </p>
    </>
  );
}
