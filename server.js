require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.RAWG_KEY;
const BASE = "https://api.rawg.io/api";

/* =========================
   CHECK API KEY
========================= */
if (!API_KEY) {
  console.error(" RAWG_KEY is missing in .env file");
}

/* =========================
    RAWG HELPER (FIXED)
========================= */
async function fetchFromRAWG(endpoint) {
  try {
    const url = `${BASE}${endpoint}&key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error("RAWG ERROR STATUS:", res.status);
      return null;
    }

    return await res.json();

  } catch (err) {
    console.error("RAWG FETCH ERROR:", err.message);
    return null;
  }
}

/* =========================
    SEARCH GAMES
========================= */
app.get("/api/games", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = req.query.page || 1;

    const data = await fetchFromRAWG(
      `/games?search=${encodeURIComponent(search)}&page=${page}&page_size=20`
    );

    if (!data || !data.results) {
      return res.json([]);
    }

    const games = data.results.map(g => ({
      id: g.id,
      name: g.name,
      image: g.background_image,
      rating: g.rating,
      released: g.released,
      genres: g.genres?.map(x => x.name).join(", ") || "Unknown"
    }));

    res.json(games);

  } catch (err) {
    console.error("SEARCH ERROR:", err.message);
    res.json([]);
  }
});

/* =========================
    GAME DETAILS
========================= */
app.get("/api/games/:id", async (req, res) => {
  try {
    const data = await fetchFromRAWG(`/games/${req.params.id}?`);

    if (!data) {
      return res.json(null);
    }

    res.json({
      name: data.name,
      image: data.background_image,
      description: data.description_raw,
      rating: data.rating,
      released: data.released
    });

  } catch (err) {
    console.error(err.message);
    res.json(null);
  }
});

/* =========================
    WEAPONS (SIMULATED SYSTEM)
========================= */
app.get("/api/games/:id/weapons", async (req, res) => {
  try {
    const data = await fetchFromRAWG(`/games/${req.params.id}?`);

    if (!data) {
      return res.json({ game: null, weapons: [] });
    }

    const name = data.name;

    res.json({
      game: name,
      weapons: [
        {
          id: 1,
          name: `${name} Assault Rifle`,
          type: "AR",
          damage: 80,
          recoil: 65,
          range: 70
        },
        {
          id: 2,
          name: `${name} Sniper Rifle`,
          type: "Sniper",
          damage: 95,
          recoil: 40,
          range: 95
        },
        {
          id: 3,
          name: `${name} SMG`,
          type: "SMG",
          damage: 60,
          recoil: 55,
          range: 50
        }
      ]
    });

  } catch (err) {
    console.error(err.message);
    res.json({ game: null, weapons: [] });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});