"use client";

import { useEffect } from "react";

export default function Zine3Redirect() {
  useEffect(() => {
    window.location.replace("https://forms.gle/EXyBM8F676JQ3tgy9");
  }, []);

  return <p>Redirecting...</p>;
}
