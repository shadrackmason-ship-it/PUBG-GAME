
const API = "http://localhost:3000/api";
const id = new URLSearchParams(window.location.search).get("id");

// ================= SAFETY CHECK =================
if (!id) {
  console.error("No game ID found in URL");
}

// ================= GAME INFO =================
async function loadGame() {
  try {
    const res = await fetch(`${API}/games/${id}`);
    const g = await res.json();

    const box = document.getElementById("game");
    if (!box) return;

    box.innerHTML = `
      <h1>${g?.name || "Unknown Game"}</h1>
      <img src="${g?.image || ''}" alt="${g?.name}">
      <p>${g?.description || "No description available."}</p>
    `;
  } catch (err) {
    console.error("Game load error:", err);
  }
}

// ================= WEAPONS =================
async function loadWeapons() {
  try {
    const res = await fetch(`${API}/games/${id}/weapons`);
    const data = await res.json();

    const box = document.getElementById("weapons");
    if (!box) return;

    box.innerHTML = "";

    if (!data || !Array.isArray(data.weapons)) {
      box.innerHTML = "<p>No weapons found</p>";
      return;
    }

    data.weapons.forEach(w => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${w.name}</h3>
        <p>Damage: ${w.damage}</p>
        <p>Recoil: ${w.recoil}</p>
        <p>Range: ${w.range}</p>
        <button class="btn">Save Loadout</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        saveLoadout(w);
      });

      box.appendChild(card);
    });

  } catch (err) {
    console.error("Weapons load error:", err);
  }
}

// ================= SAVE LOADOUT =================
function saveLoadout(weapon) {
  let data = JSON.parse(localStorage.getItem("loadouts")) || [];

  data.push({
    name: weapon.name,
    type: weapon.type || "Weapon",
    damage: weapon.damage,
    range: weapon.range,
    recoil: weapon.recoil
  });

  localStorage.setItem("loadouts", JSON.stringify(data));

  alert("Loadout saved!");
}

// ================= INIT =================
loadGame();
loadWeapons();