
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("loadouts");

  let loadouts = JSON.parse(localStorage.getItem("loadouts")) || [];

  function renderLoadouts() {
    container.innerHTML = "";

    // EMPTY STATE
    if (!loadouts.length) {
      container.innerHTML = `
        <div class="card">
          <p>No loadouts saved yet.</p>
        </div>
      `;
      return;
    }

    // DISPLAY LOADOUTS
    loadouts.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>🎮 ${item.name}</h3>
        <p>Type: ${item.type}</p>
        <button class="btn delete-btn">Delete</button>
      `;

      card.querySelector(".delete-btn").addEventListener("click", () => {
        deleteLoadout(index);
      });

      container.appendChild(card);
    });
  }

  function deleteLoadout(index) {
    loadouts.splice(index, 1);
    localStorage.setItem("loadouts", JSON.stringify(loadouts));
    renderLoadouts();
  }

  renderLoadouts();
});