const request = require("supertest");
const app = require("./server");

describe(" GameHub API Tests", () => {

  /* =========================
      BASIC HEALTH CHECK
  ========================= */
  test("API is running", async () => {
    const res = await request(app).get("/api/games?search=pubg");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  }, 15000); // ⏱ timeout for API calls

  /* =========================
      GAME DETAILS TEST
  ========================= */
  test("GET /api/games/:id returns valid game object", async () => {
    const res = await request(app).get("/api/games/3498");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("image");
  }, 15000);

  /* =========================
      WEAPONS SYSTEM TEST
  ========================= */
  test("GET /api/games/:id/weapons returns weapons array", async () => {
    const res = await request(app).get("/api/games/3498/weapons");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("weapons");
    expect(Array.isArray(res.body.weapons)).toBe(true);
    expect(res.body.weapons.length).toBeGreaterThan(0);

    // check weapon structure
    const weapon = res.body.weapons[0];
    expect(weapon).toHaveProperty("name");
    expect(weapon).toHaveProperty("damage");
    expect(weapon).toHaveProperty("recoil");
    expect(weapon).toHaveProperty("range");
  }, 15000);

  /* =========================
     ERROR HANDLING TEST
  ========================= */
  test("handles invalid game ID gracefully", async () => {
    const res = await request(app).get("/api/games/invalid123");

    expect(res.statusCode).toBe(200);
    // should not crash server
  }, 15000);

});