// script.js

// Get the page-specific key for local storage based on the title
const pageTitle = document.title; // Example: "Rank Colors"
const storageKey = `${pageTitle.replace("Rank ", "").toLowerCase()}Ranking`; // Example: "colorsRanking"

// Enable drag-and-drop
document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");
  const tiers = document.querySelectorAll(".tier");

  // Enable dragging for all draggable items
  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  // Enable drop functionality for all tiers
  tiers.forEach(tier => {
    tier.addEventListener("dragover", event => {
      event.preventDefault();
      const draggingItem = document.querySelector(".dragging");
      
      // Check if the item already exists in this tier
      const existingItem = Array.from(tier.children).find(
        child => child === draggingItem
      );

      // If it's not already in this tier, move it
      if (!existingItem) {
        tier.appendChild(draggingItem);
      }
    });
  });

  // Remove the item from the previous parent when dropped into a new tier
  document.querySelectorAll(".tier").forEach(tier => {
    tier.addEventListener("drop", () => {
      const draggingItem = document.querySelector(".dragging");
      draggingItem.parentElement.removeChild(draggingItem); // Ensure removal from the old location
      tier.appendChild(draggingItem); // Append to the new location
    });
  });
});

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
