
const API = "http://localhost:3000/api";

let timeout = null;

const quickTerms = [
  "pubg",
  "call of duty",
  "fortnite",
  "gta",
  "grand theft auto",
  "football",
  "soccer",
  "truck simulator"
];

// =========================
// 🎮 INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchBox");
  const results = document.getElementById("results");

  if (!input || !results) return;

  renderQuickSearches();
  showQuickMessage();

  input.addEventListener("input", (e) => {
    clearTimeout(timeout);

    const value = e.target.value.trim();

    timeout = setTimeout(() => {
      if (value.length < 2) {
        showQuickMessage();
        return;
      }
      searchGames(value);
    }, 300);
  });
});

// =========================
// ⚡ QUICK SEARCH BUTTONS
// =========================
function renderQuickSearches() {
  let quickBox = document.getElementById("quickSearches");

  if (!quickBox) {
    quickBox = document.createElement("div");
    quickBox.id = "quickSearches";
    quickBox.className = "grid";

    const results = document.getElementById("results");
    if (results && results.parentNode) {
      results.parentNode.insertBefore(quickBox, results);
    }
  }

  quickBox.innerHTML = "";

  quickTerms.forEach((term) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.style.margin = "6px";
    btn.textContent = term;

    btn.addEventListener("click", () => {
      const input = document.getElementById("searchBox");
      if (input) input.value = term;
      searchGames(term);
    });

    quickBox.appendChild(btn);
  });
}

// =========================
// DEFAULT MESSAGE
// =========================
function showQuickMessage() {
  const box = document.getElementById("results");
  if (!box) return;

  box.innerHTML = `
    <div class="card">
      <p>Type to search games instantly.</p>
      <p>Try: PUBG, GTA, Fortnite, Call of Duty, Football, Trucks</p>
    </div>
  `;
}

// =========================
// 🔍 SEARCH GAMES
// =========================
async function searchGames(query) {
  const box = document.getElementById("results");
  if (!box) return;

  const q = query.trim();

  if (!q) {
    showQuickMessage();
    return;
  }

  box.innerHTML = `
    <div class="card">
      <p>Scanning database for "<b>${q}</b>"...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API}/games?search=${encodeURIComponent(q)}`);

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      box.innerHTML = `
        <div class="card">
          <p>No games found for "${q}"</p>
        </div>
      `;
      return;
    }

    renderResults(data);

  } catch (err) {
    console.error("Search error:", err);
    box.innerHTML = `
      <div class="card">
        <p>System error while searching.</p>
      </div>
    `;
  }
}

// =========================
// RENDER RESULTS
// =========================
function renderResults(games) {
  const box = document.getElementById("results");
  if (!box) return;

  box.innerHTML = "";

  games.forEach((game) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = game.image ? game.image : "";

    card.innerHTML = `
      <img src="${img}" alt="${game.name}">
      <h3>${game.name}</h3>
      <p> ${game.rating ?? "N/A"}</p>
      <button class="view-btn">VIEW GAME</button>
    `;

    const btn = card.querySelector(".view-btn");

    btn.addEventListener("click", () => {
      window.location.href = `game.html?id=${game.id}`;
    });

    box.appendChild(card);
  });
}