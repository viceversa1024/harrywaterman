"use client";

import { useEffect, useRef, useState } from "react";
import "./derangedsurveys.css";

type Q = {
  q: string;
  options: string[];
  answer: number[];
  n: number;
  date: string;
  notes?: string;
};

const QUESTIONS: Q[] = [
  { q: "If you had the option to live forever in perfect health and youth, would you choose to? (assume you could change your mind any time)", options: ["Yes", "No", "Not sure"], answer: [66, 14, 20], n: 500, date: "2025-07", notes: "Big result — Americans much more pro-immortality than expected." },
  { q: "Should developing the technology to greatly extend healthy youthful life be a top priority for humanity?", options: ["Yes", "No", "Not sure"], answer: [35, 35, 30], n: 500, date: "2025-07", notes: "Even split." },
  { q: "On your deathbed, you're offered preservation until life-extension tech exists (decades away). Would you choose to be preserved?", options: ["Yes", "No", "Not sure"], answer: [27, 46, 27], n: 500, date: "2025-07", notes: "Cryonics polls way worse than 'live forever' despite being instrumental for it." },
  { q: "Would the world be better or worse if everyone could safely make themselves much smarter whenever they wanted?", options: ["Better", "Worse", "Neither or unsure"], answer: [42, 19, 39], n: 200, date: "2025-07", notes: "Bucketed from much/somewhat better/neither/somewhat/much worse." },
  { q: "Would the world be better or worse if anyone could cheaply, safely, painlessly change their physical appearance to whatever they want?", options: ["Better", "Worse", "Neither or unsure"], answer: [23, 37, 40], n: 500, date: "2026-02", notes: "Net negative — Leo Gao was surprised." },
  { q: "Would the world be better or worse if we terraformed other planets so billions of people could live elsewhere in the galaxy?", options: ["Better", "Worse", "Neither or unsure"], answer: [37, 16, 47], n: 200, date: "2025-07", notes: "Lukewarm support." },
  { q: "Would the world be better or worse if everyone had freedom to work on whatever they want, as much as they want, with robots doing what we don't want?", options: ["Better", "Worse", "Neither or unsure"], answer: [51, 25, 24], n: 200, date: "2025-07", notes: "Post-scarcity. Only barely majority support — surprised Leo." },
  { q: "Would it be better or worse if everyone in the world had 10× more inflation-adjusted wealth without working any harder?", options: ["Better", "Worse", "Neither or unsure"], answer: [39, 19, 42], n: 500, date: "2026-02", notes: "Reframing of post-scarcity. Still no enthusiastic 'better.'" },
  { q: "Should people create an AI more intelligent/capable/charismatic/creative than any person alive? (Assume it's possible.)", options: ["Yes (good idea)", "No (bad idea)", "Not sure"], answer: [6, 75, 19], n: 500, date: "2026-02", notes: "Overwhelming opposition to building superintelligence." },
  { q: "Should people create an AI capable of making smarter AIs, causing a chain reaction of increasingly intelligent AIs?", options: ["Yes (good idea)", "No (bad idea)", "Not sure"], answer: [12, 69, 19], n: 500, date: "2025-07", notes: "RSI variant. 2× the 'yes' rate of the plain superintelligence question." },
  { q: "Do you think it's possible to create an AI better than any person at being a CEO, scientist, artist, general, etc?", options: ["Yes", "No", "Not sure"], answer: [25, 40, 35], n: 500, date: "2025-07", notes: "Mid-2025. Rerun in early 2026 jumped to 35% Yes. (No/Not sure split approximate.)" },
  { q: "With which political party do you associate the idea that AI could pose an extinction-level risk to humanity?", options: ["Democrats", "Republicans", "Neither party"], answer: [17, 17, 66], n: 500, date: "2026-02", notes: "Roughly 2/3 say no party; remaining third split evenly." },
  { q: "Do you believe society is currently trending in a positive or negative direction?", options: ["Positive", "Negative", "Neither / not sure"], answer: [14, 60, 26], n: 500, date: "2026-02", notes: "Only 14% any-positive. Bucketed; negative/neutral split approximate." },
  { q: "Which best describes what Sam Altman is known for being?", options: ["Entrepreneur", "Musician / actor / congressperson", "Not sure / don't know"], answer: [36, 5, 59], n: 500, date: "2026-02", notes: "Most Americans don't recognize him." },
  { q: "Which is the name of a well-known Silicon Valley venture capital firm?", options: ["Y Combinator", "X Combinator", "W or Z Combinator"], answer: [32, 42, 26], n: 500, date: "2026-02", notes: "More picked the fake 'X Combinator' than the real Y Combinator." },
  { q: "Newcomb's problem (wizard, $1000 clear + $1M-or-empty opaque). Of respondents who didn't pick 'not sure', what was the split?", options: ["One-box (opaque only)", "Two-box (both)"], answer: [46, 54], n: 500, date: "2025-07", notes: "Almost identical to PhilPapers professional philosophers (44% one-box)." },
  { q: "Would it be better or worse if we could grow meat directly without raising/slaughtering animals?", options: ["Better", "Worse", "Neither / not sure"], answer: [32, 29, 39], n: 500, date: "2026-02", notes: "Split. Climbs to 44/21 among the 55% who say meat production is inhumane." },
];

function tvdScore(guess: number[], actual: number[]) {
  let s = 0;
  for (let i = 0; i < guess.length; i++) s += Math.abs(guess[i] - actual[i]);
  return Math.max(0, 100 - s / 2);
}

type Submitted = { guess: number[]; score: number } | null;

function QuestionCard({
  q, idx, submitted, onSubmit, onNext, isLast,
}: {
  q: Q; idx: number; submitted: Submitted;
  onSubmit: (g: number[]) => void; onNext: () => void; isLast: boolean;
}) {
  const [vals, setVals] = useState<string[]>(() => q.options.map(() => ""));
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (idx > 0) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [idx]);

  const nums = vals.map((v) => Number(v) || 0);
  const sum = nums.reduce((a, b) => a + b, 0);
  const ready = sum === 100 && !submitted;

  return (
    <div ref={cardRef} className="ds-card">
      <div className="ds-q-text">{idx + 1}. {q.q}</div>
      <div className="ds-q-meta">n={q.n} · {q.date} · allocate so the buckets sum to 100%</div>
      <div className="ds-rows">
        {q.options.map((opt, i) => (
          <div className="ds-row" key={i}>
            <label>{opt}</label>
            <input
              type="number" min={0} max={100} step={1}
              value={vals[i]} disabled={!!submitted}
              onChange={(e) => {
                const n = [...vals]; n[i] = e.target.value; setVals(n);
              }}
            />
            <span className="ds-pct">%</span>
          </div>
        ))}
      </div>
      {!submitted && (
        <div className="ds-sum-line">
          <span>Sum: <span className={sum === 100 ? "ds-good-sum" : sum > 100 ? "ds-bad-sum" : ""}>{sum}</span></span>
          <span style={{ color: sum === 100 ? "var(--ds-good)" : sum > 100 ? "var(--ds-bad)" : "var(--ds-muted)" }}>
            {sum === 100 ? "ready to submit" : sum > 100 ? `over by ${sum - 100}` : `need ${100 - sum} more`}
          </span>
        </div>
      )}
      {!submitted && (
        <button className="ds-submit" disabled={!ready} onClick={() => onSubmit(nums)}>Submit</button>
      )}
      {submitted && (
        <div className="ds-reveal">
          <div className="ds-reveal-row ds-header">
            <span>Option</span><span className="ds-num">You</span><span className="ds-num">Truth</span><span className="ds-num">Δ</span>
          </div>
          {q.options.map((opt, i) => {
            const d = submitted.guess[i] - q.answer[i];
            const absD = Math.abs(d);
            const dCls = absD <= 5 ? "ds-good" : absD >= 20 ? "ds-bad" : "";
            return (
              <div className="ds-reveal-row" key={i}>
                <span>{opt}</span>
                <span className="ds-num">{submitted.guess[i]}%</span>
                <span className="ds-num">{q.answer[i]}%</span>
                <span className={`ds-num ds-diff ${dCls}`}>{d >= 0 ? "+" : ""}{d}</span>
              </div>
            );
          })}
          <div className="ds-qscore" style={{
            color: submitted.score >= 80 ? "var(--ds-good)" : submitted.score < 40 ? "var(--ds-bad)" : "var(--ds-fg)",
          }}>Score: {submitted.score.toFixed(1)} / 100</div>
          {q.notes && <div className="ds-notes">{q.notes}</div>}
          {!isLast && (
            <button className="ds-submit" style={{ marginTop: 12 }} onClick={onNext}>Next question →</button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DerangedSurveys() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<Submitted[]>(() => new Array(QUESTIONS.length).fill(null));
  const [showFinal, setShowFinal] = useState(false);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("ds-isolated");
    return () => { document.body.classList.remove("ds-isolated"); };
  }, []);

  const answered = results.filter((r): r is { guess: number[]; score: number } => !!r);
  const totalScore = answered.reduce((a, b) => a + b.score, 0);
  const avg = answered.length > 0 ? totalScore / answered.length : 0;

  useEffect(() => {
    if (showFinal) finalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showFinal]);

  function newGame() {
    setResults(new Array(QUESTIONS.length).fill(null));
    setCurrentIdx(0);
    setShowFinal(false);
  }

  function handleSubmit(idx: number, guess: number[]) {
    const score = tvdScore(guess, QUESTIONS[idx].answer);
    const next = [...results];
    next[idx] = { guess, score };
    setResults(next);
    if (idx === QUESTIONS.length - 1) setShowFinal(true);
  }

  function handleNext() {
    setCurrentIdx((i) => Math.min(i + 1, QUESTIONS.length - 1));
  }

  return (
    <div className="ds-body">
      <h1>Deranged Surveys</h1>
      <div className="ds-tagline">
        Guess how the <strong>US general public</strong> answered each survey question.
        Allocate percentages across the answer buckets so they sum to 100%.
      </div>
      <div className="ds-source-line">
        A calibration game built on the polling data from <strong>Leo Gao</strong>&apos;s{" "}
        <a href="https://www.lesswrong.com/posts/fQz6afpcZhdMdYzgE/my-hobby-running-deranged-surveys" target="_blank" rel="noopener">
          &quot;My hobby: running deranged surveys&quot;
        </a>{" "}
        (LessWrong, 2026‑03‑26). All survey numbers, wording, and commentary are Leo&apos;s; this page just turns them into a guessing game.
        Polls are representative US samples (most n=500, some n=200), weighted to match census demographics.
      </div>

      <div className="ds-controls">
        <button onClick={newGame}>New game</button>
        <span className="ds-tier-key">Question {currentIdx + 1} of {QUESTIONS.length}</span>
        {answered.length > 0 && (
          <span className="ds-tier-key">
            · Total: {totalScore.toFixed(1)} (avg {avg.toFixed(1)}/100, {answered.length} answered)
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span className="ds-tier-key">Score: total variation distance. Perfect = 100, max-wrong = 0.</span>
      </div>

      {QUESTIONS.slice(0, currentIdx + 1).map((q, i) => (
        <QuestionCard
          key={i} q={q} idx={i}
          submitted={results[i]}
          onSubmit={(g) => handleSubmit(i, g)}
          onNext={handleNext}
          isLast={i === QUESTIONS.length - 1}
        />
      ))}

      {showFinal && (
        <div className="ds-final" ref={finalRef}>
          <h2>Round complete</h2>
          <div>
            Average: <b>{avg.toFixed(1)}</b> / 100 across {answered.length} questions.<br />
            Total: {totalScore.toFixed(1)}.
          </div>
          <button className="ds-submit" style={{ marginTop: 12 }} onClick={newGame}>Play again</button>
        </div>
      )}
    </div>
  );
}
