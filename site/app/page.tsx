"use client";

import { useState } from "react";

type Opportunity = {
  name: string;
  score: number;
  prize: string;
  hours: string;
  fit: string[];
  description: string;
  product: string;
  workflow: string[];
};

const opportunities: Opportunity[] = [
  {
    name: "OpenAI Build Week",
    score: 77,
    prize: "$100K",
    hours: "71h left",
    fit: ["Codex", "Agents", "Devtools", "Productivity"],
    description:
      "The best immediate fit: a focused developer tool with a clear Codex story and judge-ready evidence.",
    product: "CAT Hackathon OS",
    workflow: [
      "Rank incoming hackathons against actual capabilities.",
      "Pick the smallest workflow that can impress judges.",
      "Generate a deadline-aware sprint, asset checklist, and receipt.",
      "Ship the proof: site, repo, video, README, and Devpost." 
    ]
  },
  {
    name: "Backblaze Generative Media",
    score: 42,
    prize: "$10K",
    hours: "388h left",
    fit: ["Creator tools", "Automation"],
    description:
      "A strong follow-on target for turning the CAT demo and submission workflow into a reusable media pipeline.",
    product: "CAT Submission Studio",
    workflow: [
      "Collect project notes and raw assets.",
      "Produce a demo script and submission checklist.",
      "Track publishing readiness across every judge-facing link.",
      "Export a polished handoff pack." 
    ]
  },
  {
    name: "CockroachDB x AWS Agentic Memory",
    score: 41,
    prize: "$8.75K",
    hours: "748h left",
    fit: ["Agents", "Data"],
    description:
      "A deeper second sprint that can turn CAT's safety receipts into durable, explainable agent memory.",
    product: "CAT Agent Memory Ledger",
    workflow: [
      "Write a decision with its evidence.",
      "Retrieve context at the next decision point.",
      "Show the decision diff and why it changed the action.",
      "Expose safety boundaries in a receipt." 
    ]
  },
  {
    name: "Build with Gemini XPRIZE",
    score: 23,
    prize: "$2M",
    hours: "724h left",
    fit: ["Scale"],
    description:
      "High upside, but poor immediate fit without a narrower product wedge and real traction evidence.",
    product: "Not this sprint",
    workflow: [
      "Keep this on the radar.",
      "Build a stronger product wedge first.",
      "Return with adoption evidence.",
      "Avoid competing on vague ambition." 
    ]
  }
];

const sprint = [
  ["0–4", "Lock the product slice", "Scoring model · dashboard shell · proof path"],
  ["4–18", "Make the core loop tangible", "Interactive radar · sprint plan · asset readiness"],
  ["18–36", "Polish for a judge", "Hosted site · README · screenshots · Devpost story"],
  ["36–60", "Record and verify", "Two-minute demo · reproducible proof command"],
  ["60–72", "Sweep the submission", "Public links · no-placeholder scan · final handoff"]
];

const assets = [
  ["Live demo", "planned", "A hosted dashboard that a judge can open without setup."],
  ["Public repository", "planned", "Focused source, proof scripts, and the Codex collaboration story."],
  ["Demo video", "planned", "A concise walkthrough of radar → plan → judge pack."],
  ["README", "ready", "Explains the product, proof command, and new Build Week work."],
  ["Proof command", "ready", "npm run verify regenerates the scoring and judge assets."],
  ["Final submission", "human", "Devpost publish remains a deliberate human approval gate."]
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const chosen = opportunities[selected];

  const tourTargets = ["hero", "radar", "sprint", "proof"];
  const tourLabels = ["The problem", "The radar", "The sprint", "The proof"];

  const showTourStep = (step: number) => {
    setTourStep(step);
    if (step === 1) setSelected(0);
    document.getElementById(tourTargets[step])?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const startDemo = () => {
    [0, 1, 2, 3].forEach((step) => {
      window.setTimeout(() => showTourStep(step), step * 5500);
    });
  };

  return (
    <main className="shell">
      <section id="hero" className={`hero ${tourStep === 0 ? "tour-focus" : ""}`} aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">CAT // Hackathon OS</p>
          <h1 id="page-title">Ship the right thing before the clock runs out.</h1>
          <p className="lede">
            A Codex-powered operating system that turns messy hackathon research into a
            focused build, a hard deadline plan, and a judge-ready proof trail.
          </p>
          <div className="hero-actions">
            <a href="#radar">Explore the radar</a>
            <button type="button" className="tour-button" onClick={startDemo}>Start demo sequence</button>
          </div>
        </div>
        <aside className="signal-card" aria-label="Current recommendation">
          <span className="signal-label">Recommended now</span>
          <strong>OpenAI Build Week</strong>
          <div className="score-ring"><b>77</b><span>fit score</span></div>
          <p>Find → score → sprint → submit → compound.</p>
        </aside>
      </section>

      <section id="radar" className={`section-grid ${tourStep === 1 ? "tour-focus" : ""}`} aria-label="Opportunity radar">
        <article className="panel radar-panel">
          <div className="panel-head">
            <p className="eyebrow">Opportunity radar</p>
            <h2>Ranked against the actual edge.</h2>
          </div>
          <div className="opportunity-list">
            {opportunities.map((item, index) => (
              <button
                className={`opportunity ${index === selected ? "selected" : ""}`}
                key={item.name}
                onClick={() => setSelected(index)}
                aria-pressed={index === selected}
              >
                <span className="rank">0{index + 1}</span>
                <span className="opportunity-copy">
                  <strong>{item.name}</strong>
                  <small>{item.hours} · {item.prize} prize pool</small>
                  <small>{item.fit.join(" · ")}</small>
                </span>
                <b>{item.score}</b>
              </button>
            ))}
          </div>
        </article>

        <article className="panel selected-panel">
          <p className="eyebrow">Selected build</p>
          <div className="selected-title"><span>Target</span><h2>{chosen.product}</h2></div>
          <p className="big-copy">{chosen.description}</p>
          <p className="workflow-label">The killer workflow</p>
          <ol className="workflow">
            {chosen.workflow.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}
          </ol>
        </article>
      </section>

      <section id="sprint" className={`section-grid second-grid ${tourStep === 2 ? "tour-focus" : ""}`} aria-label="Sprint and readiness">
        <article className="panel">
          <div className="panel-head"><p className="eyebrow">72-hour sprint</p><h2>Make the deadline do the work.</h2></div>
          <div className="timeline">
            {sprint.map(([range, title, output]) => <div className="timeline-row" key={range}>
              <span>{range}h</span><div><strong>{title}</strong><p>{output}</p></div>
            </div>)}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head"><p className="eyebrow">Submission readiness</p><h2>Every artifact has an owner.</h2></div>
          <div className="asset-list">
            {assets.map(([label, state, detail]) => <div className={`asset ${state}`} key={label}>
              <span>{state === "human" ? "human gate" : state}</span><strong>{label}</strong><p>{detail}</p>
            </div>)}
          </div>
        </article>
      </section>

      <section id="proof" className={`proof panel ${tourStep === 3 ? "tour-focus" : ""}`} aria-label="Judge proof layer">
        <div className="panel-head"><p className="eyebrow">Judge receipt</p><h2>Claim less. Prove more.</h2></div>
        <p className="proof-lede">CAT Hackathon OS turns hackathon discovery and submission into a repeatable operating system—with explicit assumptions, evidence, and human approval gates.</p>
        <div className="proof-grid">
          <div><span>Evidence</span><p>Data-driven fit score, deadline-aware sprint, readiness states, and a reproducible judge pack.</p></div>
          <div><span>Boundaries</span><p>No hidden credentials, no paid judge setup, no real-money actions, no off-platform obligations.</p></div>
          <div><span>Proof command</span><code>npm run verify</code><p>Regenerates the scored opportunities and judge readiness artifacts.</p></div>
        </div>
      </section>

      <aside className="demo-console" aria-label="Demo recording controls">
        <span>Demo beats</span>
        {tourLabels.map((label, index) => (
          <button
            type="button"
            className={tourStep === index ? "active" : ""}
            onClick={() => showTourStep(index)}
            key={label}
          >
            {String(index + 1).padStart(2, "0")} {label}
          </button>
        ))}
      </aside>

      <footer><span>Built for OpenAI Build Week</span><span>CAT makes shipping visible.</span></footer>
    </main>
  );
}
