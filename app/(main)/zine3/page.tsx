"use client";

import { useEffect } from "react";

export default function Zine3Redirect() {
  useEffect(() => {
    window.location.replace("https://zineathon.com");
  }, []);

  return <p>Redirecting...</p>;
}
