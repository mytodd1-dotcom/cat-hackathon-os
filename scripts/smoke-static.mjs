import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const required = [
  "index.html",
  "src/app.js",
  "src/styles.css",
  "hackathon-assets/opportunity-scores.json",
  "hackathon-assets/judge-readiness-pack.json",
  "hackathon-assets/opportunity-scores.md",
  "hackathon-assets/judge-readiness-pack.md"
];

for (const file of required) {
  await access(path.join(root, file));
}

const html = await readFile(path.join(root, "index.html"), "utf8");
const app = await readFile(path.join(root, "src/app.js"), "utf8");
const scores = JSON.parse(await readFile(path.join(root, "hackathon-assets/opportunity-scores.json"), "utf8"));
const pack = JSON.parse(await readFile(path.join(root, "hackathon-assets/judge-readiness-pack.json"), "utf8"));

const checks = [
  {
    label: "HTML loads app module",
    pass: html.includes('src="./src/app.js"')
  },
  {
    label: "HTML loads stylesheet",
    pass: html.includes('href="./src/styles.css"')
  },
  {
    label: "App fetches generated opportunity scores",
    pass: app.includes("./hackathon-assets/opportunity-scores.json")
  },
  {
    label: "App fetches generated judge pack",
    pass: app.includes("./hackathon-assets/judge-readiness-pack.json")
  },
  {
    label: "OpenAI Build Week is top ranked",
    pass: scores.scored?.[0]?.id === "openai-build-week-2026"
  },
  {
    label: "Judge pack has human approval gates",
    pass: pack.receipt?.humanApprovalNeeded?.length >= 3
  }
];

const failed = checks.filter((check) => !check.pass);

if (failed.length) {
  console.error("Static smoke check failed:");
  for (const check of failed) console.error(`- ${check.label}`);
  process.exit(1);
}

console.log(`Static smoke check passed (${checks.length}/${checks.length}).`);
