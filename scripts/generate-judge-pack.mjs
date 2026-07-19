import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "hackathon-assets");
const scoresPath = path.join(outDir, "opportunity-scores.json");
const scores = JSON.parse(await readFile(scoresPath, "utf8"));
const top = scores.scored[0];

const requiredAssets = [
  {
    id: "live-demo",
    label: "Live demo URL",
    status: "planned",
    nextStep: "Publish the static dashboard after the first UI pass."
  },
  {
    id: "repo",
    label: "Public GitHub repository",
    status: "planned",
    nextStep: "Split or publish this project folder as a focused repo."
  },
  {
    id: "youtube",
    label: "Public YouTube demo under 3 minutes",
    status: "planned",
    nextStep: "Record the ranked-opportunity → sprint-plan → judge-pack flow."
  },
  {
    id: "readme",
    label: "README explaining Codex collaboration",
    status: "ready",
    nextStep: "Keep updated as implementation grows."
  },
  {
    id: "proof-command",
    label: "Local proof command",
    status: "ready",
    nextStep: "Run npm run verify before each submission checkpoint."
  },
  {
    id: "codex-session-id",
    label: "/feedback Codex Session ID",
    status: "needs-human",
    nextStep: "Add the session ID from the project thread before final submission."
  }
];

const sprint = [
  {
    phase: "Hour 0-4",
    objective: "Lock product slice",
    outputs: ["Opportunity scoring model", "Static dashboard shell", "README proof path"]
  },
  {
    phase: "Hour 4-18",
    objective: "Make it feel real",
    outputs: ["Interactive radar", "Sprint planner", "Submission checklist", "Receipt export"]
  },
  {
    phase: "Hour 18-36",
    objective: "Judge polish",
    outputs: ["Hosted site", "Screenshots", "Devpost story draft", "GitHub cleanup"]
  },
  {
    phase: "Hour 36-60",
    objective: "Demo and verification",
    outputs: ["2-minute YouTube demo", "Proof command passing", "README evidence section"]
  },
  {
    phase: "Hour 60-72",
    objective: "Submission sweep",
    outputs: ["Devpost final fields", "No placeholder scan", "Public link verification"]
  }
];

const receipt = {
  project: "CAT Hackathon OS",
  targetHackathon: top.name,
  track: "Developer Tools / Work and Productivity",
  generatedAt: new Date().toISOString(),
  claim: "CAT can turn hackathon discovery and submission into a repeatable operating system.",
  evidence: [
    "Data-driven opportunity score with explicit assumptions",
    "Generated sprint plan tied to deadline pressure",
    "Submission asset checklist with ready/planned/needs-human statuses",
    "Local proof command that regenerates judge artifacts"
  ],
  humanApprovalNeeded: [
    "Final Devpost submission",
    "YouTube upload/publish",
    "GitHub repository creation or push",
    "Any use of private credentials or paid services"
  ],
  safeBoundaries: [
    "No hidden credentials",
    "No payment required for judges",
    "No real-money trading or gambling execution",
    "No off-platform obligations"
  ]
};

const pack = { top, requiredAssets, sprint, receipt };

const md = `# CAT Hackathon OS Judge Readiness Pack

Generated: ${receipt.generatedAt}

## One-line project

CAT Hackathon OS is a Codex-powered command center that finds winnable hackathons, plans the sprint, and turns each build into a polished submission artifact.

## Target

- Hackathon: **${top.name}**
- Track: **${receipt.track}**
- Recommended product: **${top.recommendation.product}**
- Killer workflow: ${top.recommendation.killerWorkflow}

## Sprint plan

${sprint
  .map(
    (item) =>
      `### ${item.phase}: ${item.objective}\n\n${item.outputs.map((output) => `- ${output}`).join("\n")}`
  )
  .join("\n\n")}

## Submission asset status

| Asset | Status | Next step |
| --- | --- | --- |
${requiredAssets.map((asset) => `| ${asset.label} | ${asset.status} | ${asset.nextStep} |`).join("\n")}

## Receipt

Claim: ${receipt.claim}

Evidence:
${receipt.evidence.map((item) => `- ${item}`).join("\n")}

Human approval needed:
${receipt.humanApprovalNeeded.map((item) => `- ${item}`).join("\n")}

Safe boundaries:
${receipt.safeBoundaries.map((item) => `- ${item}`).join("\n")}
`;

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "judge-readiness-pack.json"), JSON.stringify(pack, null, 2));
await writeFile(path.join(outDir, "judge-readiness-pack.md"), md);

console.log(`Generated judge readiness pack for ${receipt.project}.`);
