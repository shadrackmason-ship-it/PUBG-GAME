const API_KEY = "b40af10d71ab4d0a99e3150a98e2c214";
const BASE_URL = "https://api.rawg.io/api";
const FALLBACK_BG = "./assets/default-bg.jpg";

let weapons = [];

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  await loadWeapons();
  setupFilters();
  loadBackground();
}

// ===============================
// LOAD WEAPONS (WITH CACHE)
// ===============================
async function loadWeapons() {
  try {
    const cached = sessionStorage.getItem("weapons");

    if (cached) {
      weapons = JSON.parse(cached);
      console.log("📦 Loaded from cache");
      render();
      return;
    }

    const res = await fetch("./data/weapons.json");

    if (!res.ok) throw new Error("JSON not found");

    const data = await res.json();

    weapons = data.map(w => ({
      name: w.name || "Unknown",
      type: w.type || "Unknown",
      category: w.category || "Unknown",
      damage: Number(w.damage) || 0,
      rarity: getRarity(w.damage || 0)
    }));

    sessionStorage.setItem("weapons", JSON.stringify(weapons));

    console.log("✅ Weapons loaded");
    render();

  } catch (err) {
    console.error("❌ Load failed:", err);

    weapons = [
      { name: "M416", type: "ranged", category: "AR", damage: 41 }
    ];

    render();
  }
}

// ===============================
// RENDER (SMART: BOTH PAGES)
// ===============================
function render() {
  const results = document.getElementById("results");
  const preview = document.getElementById("weaponPreview");

  // FULL PAGE (weapons.html)
  if (results) {
    results.innerHTML = weapons.map(w => cardHTML(w)).join("");
  }

  // HOME PREVIEW (index.html)
  if (preview) {
    preview.innerHTML = weapons.slice(0, 4).map(w => cardHTML(w)).join("");
  }
}

function cardHTML(w) {
  return `
    <div class="weapon-card">
      <h3>${w.name}</h3>
      <p>${w.category}</p>
      <p>Damage: ${w.damage}</p>
      <span class="rarity ${w.rarity.toLowerCase()}">${w.rarity}</span>
    </div>
  `;
}

// ===============================
// FILTER SYSTEM
// ===============================
function setupFilters() {
  const search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter");
  const type = document.getElementById("typeFilter");

  if (!search && !category && !type) return;

  const applyFilters = () => {
    const searchValue = search?.value.toLowerCase() || "";
    const categoryValue = category?.value || "";
    const typeValue = type?.value || "";

    let filtered = weapons;

    if (categoryValue) {
      filtered = filtered.filter(w => w.category === categoryValue);
    }

    if (typeValue) {
      filtered = filtered.filter(w => w.type === typeValue);
    }

    if (searchValue) {
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(searchValue)
      );
    }

    renderFiltered(filtered);
  };

  search?.addEventListener("input", applyFilters);
  category?.addEventListener("change", applyFilters);
  type?.addEventListener("change", applyFilters);
}

function renderFiltered(list) {
  const results = document.getElementById("results");

  if (!results) return;

  if (!list.length) {
    results.innerHTML = "<p>No weapons found</p>";
    return;
  }

  results.innerHTML = list.map(w => cardHTML(w)).join("");
}

// ===============================
// BACKGROUND
// ===============================
async function loadBackground() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  try {
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=pubg`);

    if (!res.ok) throw new Error();

    const data = await res.json();
    const bg = data?.results?.[0]?.background_image;

    setBackground(bg || FALLBACK_BG);

  } catch {
    setBackground(FALLBACK_BG);
  }
}

function setBackground(img) {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.style.background = `
    linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.95)),
    url(${img}) center/cover no-repeat
  `;
}

// ===============================
// RARITY
// ===============================
function getRarity(damage) {
  if (damage >= 100) return "Mythic";
  if (damage >= 90) return "Legendary";
  if (damage >= 70) return "Epic";
  if (damage >= 50) return "Rare";
  return "Common";
}
