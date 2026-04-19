document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("results");

  if (!container) {
    console.error("❌ #results not found (app.js)");
    return;
  }

  console.log("✅ app.js loaded successfully");

  // OPTIONAL: UI enhancements only
  setupUI();
});
import express from "express";

const app = express();

// 🔥 THIS GOES HERE (before routes)
app.use(express.static("public"));

// API route
app.get("/api/weapons", (req, res) => {
  res.json([
    { name: "AK-47", type: "ranged" },
    { name: "Katana", type: "melee" }
  ]);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// ===============================
// UI ENHANCEMENTS (SAFE)
// ===============================
function setupUI() {
  const cardsContainer = document.getElementById("results");

  // Example: click interaction
  cardsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".weapon-card");

    if (!card) return;

    console.log("🟢 Clicked weapon:", card.querySelector("h3").textContent);

    // future: open modal, show stats, etc.
  });
}