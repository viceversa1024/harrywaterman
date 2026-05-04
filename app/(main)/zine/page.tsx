"use client";

import { useEffect } from "react";

export default function ZineRedirect() {
  useEffect(() => {
    window.location.replace("https://zineathon.com");
  }, []);

  return <p>Redirecting...</p>;
}
