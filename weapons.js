import {
  getWeapons,
  searchWeapons,
  getWeaponsByType,
  getWeaponById
} from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("weapons-container");
  const details = document.getElementById("weapon-details");
  const searchInput = document.getElementById("search");

  // DISPLAY WEAPONS
  function displayWeapons(list) {
    container.innerHTML = "";

    if (!list || list.length === 0) {
      container.innerHTML = "<p>No weapons found</p>";
      return;
    }

    list.forEach(weapon => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${weapon.name}</h3>
        <p>${weapon.type}</p>
        <img src="${weapon.image}" width="100">
      `;

      div.addEventListener("click", () => {
        showDetails(weapon.id);
      });

      container.appendChild(div);
    });
  }

  // SHOW DETAILS
  async function showDetails(id) {
    const weapon = await getWeaponById(id);

    if (!weapon) {
      details.innerHTML = "<p>No details found</p>";
      return;
    }

    details.innerHTML = `
      <h2>${weapon.name}</h2>
      <img src="${weapon.image}" width="200">
      <p>Type: ${weapon.type}</p>
      <p>Damage: ${weapon.damage}</p>
      <p>Range: ${weapon.range}</p>
    `;
  }

  // SEARCH
  searchInput.addEventListener("input", async () => {
    const value = searchInput.value;

    if (!value) {
      loadWeapons();
      return;
    }

    const results = await searchWeapons(value);
    displayWeapons(results);
  });

  // LOAD DEFAULT
  async function loadWeapons() {
    const weapons = await getWeapons();
    displayWeapons(weapons);
  }

  // INIT
  loadWeapons();

});