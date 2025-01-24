// script.js

// Get the page-specific key for local storage based on the title
const pageTitle = document.title; // Example: "Rank Colors"
const storageKey = `${pageTitle.replace("Rank ", "").toLowerCase()}Ranking`; // Example: "colorsRanking"

// Function to save rankings to local storage
function saveRankings() {
  const tiers = document.querySelectorAll(".tier");
  const rankings = {};

  // Loop through each tier and save the items in the tier
  tiers.forEach(tier => {
    const tierName = tier.getAttribute("data-tier");
    const items = [...tier.querySelectorAll("img")].map(img => img.src); // Save image src
    rankings[tierName] = items;
  });

  // Save the rankings object to local storage
  localStorage.setItem(storageKey, JSON.stringify(rankings));
}

// Function to load rankings from local storage
function loadRankings() {
  const savedRankings = localStorage.getItem(storageKey);

  if (savedRankings) {
    const rankings = JSON.parse(savedRankings);

    // Populate the tiers with the saved items
    for (const [tierName, items] of Object.entries(rankings)) {
      const tier = document.querySelector(`.tier[data-tier="${tierName}"]`);
      items.forEach(itemSrc => {
        const img = document.createElement("img");
        img.src = itemSrc;
        img.classList.add("draggable");
        img.draggable = true;

        tier.appendChild(img);
      });
    }
  }
}

// Initialize drag-and-drop functionality
function setupDragAndDrop() {
  const draggableItems = document.querySelectorAll(".draggable");
  const dropZones = document.querySelectorAll(".tier");

  draggableItems.forEach(item => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.src);
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const itemSrc = e.dataTransfer.getData("text/plain");

      const img = document.createElement("img");
      img.src = itemSrc;
      img.classList.add("draggable");
      img.draggable = true;

      zone.appendChild(img);
      setupDragAndDrop(); // Reinitialize drag-and-drop for new items

      saveRankings(); // Save after a drop
    });
  });
}

// Load rankings and set up drag-and-drop when the page loads
window.addEventListener("DOMContentLoaded", () => {
  loadRankings();
  setupDragAndDrop();
});

// Save rankings whenever the window is unloaded
window.addEventListener("beforeunload", saveRankings);
