import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "data");
const outDir = path.join(root, "hackathon-assets");

const hackathons = JSON.parse(await readFile(path.join(dataDir, "hackathons.json"), "utf8"));
const capabilities = JSON.parse(await readFile(path.join(dataDir, "capabilities.json"), "utf8"));

const now = new Date(`${capabilities.currentDate}T20:00:00-05:00`);
const preferred = new Set(capabilities.preferredThemes);
const strengths = new Set(capabilities.strengths);

function hoursUntil(deadline) {
  return Math.max(0, (new Date(deadline).getTime() - now.getTime()) / 36e5);
}

function urgencyScore(hours) {
  if (hours <= 0) return 0;
  if (hours <= 96) return 10;
  if (hours <= 240) return 7;
  return 4;
}

function themeFit(themes) {
  const hits = themes.filter((theme) => preferred.has(theme));
  return {
    hits,
    score: Math.min(10, hits.length * 2.25)
  };
}

function scopePenalty(item) {
  const risky = item.riskFlags.filter((flag) =>
    /broad|traction|private|real-money|credential|off-platform|unavailable/i.test(flag)
  );
  const normal = item.riskFlags.length - risky.length;
  return risky.length * 3 + normal;
}

function artifactScore(item) {
  const leverage = item.artifactLeverage.length;
  const requirements = item.requirements.join(" ").toLowerCase();
  let score = Math.min(10, leverage * 1.6);
  if (requirements.includes("repository")) score += 1.2;
  if (requirements.includes("demo")) score += 1.2;
  if (requirements.includes("readme")) score += 1.2;
  if (requirements.includes("codex")) score += 1.5;
  return Math.min(10, score);
}

function prizeScore(prizeUsd) {
  if (prizeUsd >= 100000) return 10;
  if (prizeUsd >= 25000) return 8;
  if (prizeUsd >= 10000) return 6.5;
  if (prizeUsd >= 5000) return 5;
  return 3;
}

function recommendBuild(item) {
  if (item.id === "openai-build-week-2026") {
    return {
      product: "CAT Hackathon OS",
      wedge: "A Codex-powered command center that ranks hackathons and generates a judge-ready sprint plan.",
      killerWorkflow: "Paste or load hackathon opportunities → score fit → pick target → generate sprint plan, asset checklist, and judge receipt.",
      firstDemo: [
        "Show ranked opportunity radar",
        "Open OpenAI Build Week card",
        "Generate 72-hour sprint plan",
        "Display required assets and missing evidence",
        "Export judge readiness pack"
      ]
    };
  }

  if (item.id.includes("cockroachdb")) {
    return {
      product: "CAT Agent Memory Ledger",
      wedge: "A durable, auditable memory layer for agent decisions.",
      killerWorkflow: "Agent stores decisions → retrieves context → explains why a memory changed the next action.",
      firstDemo: ["Memory write", "Memory readback", "Decision diff", "Safety receipt"]
    };
  }

  return {
    product: "CAT Submission Studio",
    wedge: "A reusable artifact pipeline for demos, screenshots, and judge copy.",
    killerWorkflow: "Project notes → asset checklist → demo script → publish-ready submission pack.",
    firstDemo: ["Project intake", "Asset generation", "Readiness score", "Export pack"]
  };
}

const scored = hackathons
  .map((item) => {
    const hours = hoursUntil(item.deadline);
    const fit = themeFit(item.themes);
    const urgency = urgencyScore(hours);
    const artifacts = artifactScore(item);
    const prize = prizeScore(item.prizeUsd);
    const penalty = scopePenalty(item);
    const total = Math.round((fit.score * 3 + urgency * 2 + artifacts * 2 + prize * 1.2 - penalty) * 10) / 10;
    return {
      ...item,
      hoursUntilDeadline: Math.round(hours),
      themeMatches: fit.hits,
      scores: {
        themeFit: fit.score,
        urgency,
        artifacts,
        prize,
        penalty,
        total
      },
      recommendation: recommendBuild(item)
    };
  })
  .sort((a, b) => b.scores.total - a.scores.total);

const top = scored[0];
const markdown = `# CAT Hackathon OS Opportunity Scores

Generated: ${new Date().toISOString()}

## Recommendation

Enter **${top.name}** with **${top.recommendation.product}**.

Why: ${top.notes}

Killer workflow: ${top.recommendation.killerWorkflow}

## Ranked opportunities

| Rank | Hackathon | Deadline hours | Prize | Fit themes | Total |
| ---: | --- | ---: | ---: | --- | ---: |
${scored
  .map(
    (item, index) =>
      `| ${index + 1} | ${item.name} | ${item.hoursUntilDeadline} | $${item.prizeUsd.toLocaleString()} | ${item.themeMatches.join(", ") || "none"} | ${item.scores.total} |`
  )
  .join("\n")}

## OpenAI Build Week sprint

${top.recommendation.firstDemo.map((step, index) => `${index + 1}. ${step}`).join("\n")}
`;

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "opportunity-scores.json"), JSON.stringify({ capabilities, scored }, null, 2));
await writeFile(path.join(outDir, "opportunity-scores.md"), markdown);

console.log(`Ranked ${scored.length} hackathons. Top pick: ${top.name} (${top.scores.total}).`);
