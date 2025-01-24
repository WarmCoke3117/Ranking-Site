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
    const items = [...tier.querySelectorAll("img")].map(img => img.id); // Save the item's unique ID
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
      items.forEach(itemId => {
        const existingItem = document.getElementById(itemId);

        if (existingItem) {
          tier.appendChild(existingItem); // Move the existing item to the correct tier
        }
      });
    }
  }
}

// Function to set up drag-and-drop functionality
function setupDragAndDrop() {
  const draggableItems = document.querySelectorAll(".draggable");
  const dropZones = document.querySelectorAll(".tier");

  // Add event listeners to draggable items
  draggableItems.forEach(item => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id); // Use the item's ID
      e.target.classList.add("dragging"); // Add a class to identify the dragged item
    });

    item.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging"); // Clean up the class
    });
  });

  // Add event listeners to drop zones
  dropZones.forEach(zone => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow dropping
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();

      const draggedItemId = e.dataTransfer.getData("text/plain"); // Get the dragged item's ID
      const draggedItem = document.getElementById(draggedItemId); // Find the dragged item by ID

      // Move the item to the new zone if it's not already there
      if (draggedItem && draggedItem.parentElement !== zone) {
        zone.appendChild(draggedItem);
        saveRankings(); // Save the updated rankings
      }
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
