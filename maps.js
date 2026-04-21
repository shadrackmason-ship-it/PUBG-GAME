
const maps = [
  {
    id: 1,
    name: "Erangel",
    img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    type: "Classic Battle Royale"
  },
  {
    id: 2,
    name: "Miramar",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    type: "Desert Tactical Zone"
  },
  {
    id: 3,
    name: "Sanhok",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    type: "Fast Close Combat"
  }
];

const box = document.getElementById("mapGrid");

// Safety check
if (!box) {
  console.error("mapGrid element not found");
}

// =========================
// RENDER MAPS
// =========================
function renderMaps() {
  box.innerHTML = "";

  maps.forEach(map => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${map.img}" alt="${map.name}">
      <h3>${map.name}</h3>
      <p>${map.type}</p>
      <button>View Intel</button>
    `;

    // CLICK EVENT (future expansion)
    card.addEventListener("click", () => {
      showMapDetails(map);
    });

    box.appendChild(card);
  });
}

// =========================
// MAP DETAILS (FUTURE READY)
// =========================
function showMapDetails(map) {
  alert(
    `MAP INTEL:\n\nName: ${map.name}\nType: ${map.type}`
  );

  // Later upgrade:
  // - open side panel
  // - show zones
  // - show loot density
  // - show landing spots
}

// =========================
// INIT
// =========================
renderMaps();