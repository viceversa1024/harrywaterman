"use client";

import { useState } from "react";
import "./feedback.css";

// TODO: replace YOUR_FORM_ID with the real Formspree form ID (https://formspree.io).
// The endpoint ID is not secret. Until it's set, the form renders and works but
// submissions return an error instead of reaching Formspree.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

type Status = "idle" | "submitting" | "success" | "error";

export default function Feedback() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim() || status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      if (res.ok) {
        setMessage("");
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
  }

  return (
    <>
      <h1>Feedback</h1>

      {status === "success" ? (
        <div className="feedback-done">
          <p>Thanks — your anonymous feedback was sent.</p>
          <button type="button" className="feedback-button" onClick={reset}>
            Send another
          </button>
        </div>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit}>
          {/* Honeypot: hidden from people, bots tend to fill it. */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="feedback-honeypot"
          />

          <textarea
            name="message"
            className="feedback-textarea"
            rows={6}
            placeholder="What's on your mind?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="feedback-actions">
            <button
              type="submit"
              className="feedback-button"
              disabled={status === "submitting" || !message.trim()}
            >
              {status === "submitting" ? "Sending…" : "Send anonymously"}
            </button>
            {status === "error" && (
              <span className="feedback-status feedback-error">
                Something went wrong — please try again.
              </span>
            )}
          </div>
        </form>
      )}
    </>
  );
}
