
const API = "http://localhost:3000/api";

/* =========================
    LIVE GAME SEARCH
========================= */
export async function searchGames(query, page = 1) {
  try {
    const res = await fetch(
      `${API}/games?search=${encodeURIComponent(query)}&page=${page}`
    );

    const data = await res.json();
    return Array.isArray(data) ? data : [];

  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
}

/* =========================
    GET SINGLE GAME
========================= */
export async function getGame(id) {
  try {
    const res = await fetch(`${API}/games/${id}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* =========================
    GET GAME WEAPONS
========================= */
export async function getWeapons(id) {
  try {
    const res = await fetch(`${API}/games/${id}/weapons`);
    const data = await res.json();
    return data.weapons || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

/* =========================
   LOCAL WEAPON SYSTEM
========================= */
const weapons = [
  { id: 1, name: "AKM", type: "AR", damage: 49, desc: "High damage", image: "images/akm.png" },
  { id: 2, name: "M416", type: "AR", damage: 41, desc: "Balanced rifle", image: "images/m416.png" },
  { id: 3, name: "UZI", type: "SMG", damage: 26, desc: "Fast fire rate", image: "images/uzi.png" },
  { id: 4, name: "Kar98k", type: "Sniper", damage: 75, desc: "One-shot sniper", image: "images/kar98k.png" }
];

/* =========================
    WEAPON FUNCTIONS (LOCAL)
========================= */
export function getLocalWeapons() {
  return weapons;
}

export function searchWeapons(query) {
  return weapons.filter(w =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function getWeaponsByType(type) {
  if (type === "All") return weapons;
  return weapons.filter(w => w.type === type);
}

export function getWeaponById(id) {
  return weapons.find(w => w.id === id);
}