"use client";

import { useState } from "react";

const posters = [
  { src: "/zine/spendadaywith.png", alt: "Spend a Day With advertisement poster" },
  { src: "/zine/inaday.png", alt: "In a Day advertisement poster" },
  { src: "/zine/grazewithus.png", alt: "Graze With Us Zine-a-thon advertisement poster" },
];

export default function Zine() {
  const [selected, setSelected] = useState<string | null>(null);
  const [adsOpen, setAdsOpen] = useState(false);

  return (
    <>
      <h1>Zine-a-thon</h1>
      <div className="page-text">
        <p><a href="https://helenatran.com/humanexperiments/" target="_blank" rel="noopener noreferrer">Human Experiments</a></p>
        <p><a href="https://helenatran.com/bovination/" target="_blank" rel="noopener noreferrer">Foundations of Modern Bovination</a></p>
      </div>

      <p
        onClick={() => setAdsOpen(!adsOpen)}
        style={{ cursor: "pointer" }}
      >
        <em>Selected Advertisement {adsOpen ? "▼" : "▶"}</em>
      </p>
      {adsOpen && <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        {posters.map((p) => (
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            onClick={() => setSelected(p.src)}
            style={{ flex: "1 1 0", maxWidth: "30%", cursor: "pointer" }}
          />
        ))}
      </div>}

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1001,
          }}
        >
          <img
            src={selected}
            alt=""
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
          />
        </div>
      )}
    </>
  );
}
