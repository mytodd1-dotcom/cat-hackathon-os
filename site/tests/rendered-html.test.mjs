import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the CAT Hackathon OS dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CAT Hackathon OS<\/title>/i);
  assert.match(html, /Ship the right thing before the clock runs out\./);
  assert.match(html, /OpenAI Build Week/);
  assert.match(html, /Start demo sequence/);
  assert.match(html, /Demo beats/);
  assert.match(html, /npm run verify/);
  assert.match(html, /cat-hackathon-os-title-card\.jpg/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("keeps the demo package concrete and reproducible", async () => {
  const [page, css, layout, script] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../DEMO-VOICEOVER.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Start demo sequence/);
  assert.match(page, /Demo beats/);
  assert.match(page, /showTourStep/);
  assert.match(css, /\.demo-console/);
  assert.match(css, /\.tour-focus/);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /cat-hackathon-os-title-card\.jpg/);
  assert.match(script, /0:00–0:08/);
  assert.match(script, /OpenAI Build Week/);
  assert.match(script, /Codex and GPT-5\.6/);

  await access(new URL("../public/cat-hackathon-os-title-card.jpg", import.meta.url));
});
