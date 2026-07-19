const scoreUrl = "./hackathon-assets/opportunity-scores.json";
const packUrl = "./hackathon-assets/judge-readiness-pack.json";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function statusLabel(status) {
  return {
    ready: "Ready",
    planned: "Planned",
    "needs-human": "Needs human"
  }[status] || status;
}

function renderOpportunities(scored) {
  const list = document.querySelector("#opportunity-list");
  list.innerHTML = scored
    .map(
      (item, index) => `
        <button class="opportunity ${index === 0 ? "selected" : ""}" data-id="${item.id}">
          <span class="rank">#${index + 1}</span>
          <span>
            <strong>${item.name}</strong>
            <small>${item.hoursUntilDeadline} hours left • ${money.format(item.prizeUsd)} prize pool</small>
            <small>Fit: ${item.themeMatches.join(", ") || "no direct theme match"}</small>
          </span>
          <b>${item.scores.total}</b>
        </button>
      `
    )
    .join("");
}

function renderRecommendation(item) {
  document.querySelector("#recommended-title").textContent = item.recommendation.product;
  document.querySelector("#recommended-wedge").textContent = item.recommendation.wedge;
  document.querySelector("#demo-flow").innerHTML = item.recommendation.firstDemo
    .map((step) => `<li>${step}</li>`)
    .join("");
}

function renderSprint(sprint) {
  document.querySelector("#sprint-plan").innerHTML = sprint
    .map(
      (phase) => `
        <div class="timeline-item">
          <span>${phase.phase}</span>
          <strong>${phase.objective}</strong>
          <ul>${phase.outputs.map((output) => `<li>${output}</li>`).join("")}</ul>
        </div>
      `
    )
    .join("");
}

function renderAssets(assets) {
  document.querySelector("#asset-list").innerHTML = assets
    .map(
      (asset) => `
        <div class="asset ${asset.status}">
          <span>${statusLabel(asset.status)}</span>
          <strong>${asset.label}</strong>
          <p>${asset.nextStep}</p>
        </div>
      `
    )
    .join("");
}

function renderReceipt(receipt) {
  document.querySelector("#receipt").innerHTML = `
    <p class="big-copy">${receipt.claim}</p>
    <div class="receipt-grid">
      <div>
        <h3>Evidence</h3>
        <ul>${receipt.evidence.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div>
        <h3>Human approval gates</h3>
        <ul>${receipt.humanApprovalNeeded.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div>
        <h3>Safety boundary</h3>
        <ul>${receipt.safeBoundaries.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

async function boot() {
  const [scores, pack] = await Promise.all([
    fetch(scoreUrl).then((response) => response.json()),
    fetch(packUrl).then((response) => response.json())
  ]);

  renderOpportunities(scores.scored);
  renderRecommendation(scores.scored[0]);
  renderSprint(pack.sprint);
  renderAssets(pack.requiredAssets);
  renderReceipt(pack.receipt);

  document.querySelector("#opportunity-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    const selected = scores.scored.find((item) => item.id === button.dataset.id);
    document.querySelectorAll(".opportunity").forEach((node) => node.classList.remove("selected"));
    button.classList.add("selected");
    renderRecommendation(selected);
  });
}

boot().catch((error) => {
  document.body.innerHTML = `<pre>Could not load CAT Hackathon OS demo assets.\nRun: npm run verify\n\n${error.stack}</pre>`;
});
