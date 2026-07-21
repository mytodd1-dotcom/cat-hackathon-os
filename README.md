# CAT Hackathon OS

CAT Hackathon OS is a Codex-powered command center for turning hackathons into repeatable shipping loops.

It helps a builder:

- find hackathons where they have a credible edge;
- score fit, urgency, prize quality, and artifact leverage;
- choose the smallest impressive workflow to build;
- generate a sprint plan;
- track required judge assets;
- create an evidence pack that explains what was built, how Codex helped, and what still needs a human approval.

## OpenAI Build Week angle

Track: **Developer Tools** / **Work and Productivity**

The project is intentionally meta: it productizes the exact workflow that helped ship CAT Context Agent. Instead of treating each hackathon as a one-off scramble, CAT Hackathon OS turns the process into a reusable operating system.

## Local proof

Run:

```bash
npm run verify
```

This produces:

- `hackathon-assets/opportunity-scores.json`
- `hackathon-assets/opportunity-scores.md`
- `hackathon-assets/judge-readiness-pack.json`
- `hackathon-assets/judge-readiness-pack.md`

## Demo

The judge-facing dashboard lives in [`site/`](./site). It is a production build
of the radar and judge-readiness experience, while the scoring engine and proof
assets remain intentionally simple and inspectable at the repository root.

Preview the original static proof model:

```bash
npm run verify
npm run serve
```

Then open `http://127.0.0.1:4177`.

The static dashboard reads the generated demo model and shows:

1. ranked hackathon targets;
2. a recommended sprint path;
3. submission asset readiness;
4. a judge-facing receipt trail.

To run the deployed dashboard locally:

```bash
cd site
npm run dev
```

For a production check:

```bash
cd site
npm run build
```

## How GPT-5.6 and Codex collaborated

CAT Hackathon OS was created during OpenAI Build Week with GPT-5.6 and Codex.
GPT-5.6 helped pressure-test the product narrative, reduce the broad concept to
a credible build wedge, and turn that wedge into concrete acceptance checks.
Codex was the implementation partner. The collaboration focused on three
deliberate jobs:

1. turning a loosely defined hackathon-search process into an inspectable
   scoring model;
2. shaping the highest-scoring result into a small, testable product wedge;
3. producing a judge-facing dashboard, evidence artifacts, and a repeatable
   verification command.

Codex was used for code generation, interface implementation, artifact
generation, test/smoke checks, and packaging. Todd made the final product,
design, scope, and publication decisions. Human approval remains required for
external submissions, publication, credentials, payments, and any action that
could create an obligation.

## Judge testing path

- **Supported platform:** modern desktop or mobile web browser.
- **Live demo:** https://cat-hackathon-os.flyguy.chatgpt.site
- **No test account, payment, or installation is required** for the live demo.
- **Local verification:** clone the repository, run `npm install`, then run
  `npm run verify`; for the dashboard, run `cd site && npm install && npm run build`.

## What is new during OpenAI Build Week

This project folder, scoring model, static dashboard, and generated judge artifacts were created for OpenAI Build Week after the submission period opened. The README and generated artifacts should be kept with timestamped commits so judges can distinguish new work from prior CAT infrastructure.

## Safety and honesty boundaries

- No real-money trading execution.
- No credential collection.
- No off-platform contest obligations.
- No hidden paid services required for judging.
- Any live submission action remains human-approved.
- Generated recommendations include assumptions and missing evidence instead of pretending to know what was not verified.
