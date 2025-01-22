// Initialize Drag-and-Drop Functionality
document.addEventListener("DOMContentLoaded", () => {
  const draggableItems = document.querySelectorAll(".draggable");
  const tiers = document.querySelectorAll(".tier");
  const imagePool = document.querySelector(".image-pool");

  draggableItems.forEach(item => {
      item.addEventListener("dragstart", dragStart);
      item.addEventListener("dragend", dragEnd);
  });

  tiers.forEach(tier => {
      tier.addEventListener("dragover", dragOver);
      tier.addEventListener("drop", drop);
  });

  imagePool.addEventListener("dragover", dragOver);
  imagePool.addEventListener("drop", dropToPool);

  loadRankings(); // Load saved rankings on page load
});

let draggedItem = null;

function dragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.setData('text/plain', event.target.src);
  setTimeout(() => {
      draggedItem.style.visibility = "hidden"; // Temporary hide to avoid UI conflicts
  }, 0);
}

function dragEnd() {
  draggedItem.style.visibility = "visible"; // Ensure the item reappears
  draggedItem = null;
}

function dragOver(event) {
  event.preventDefault(); // Allow the drop action
}

function drop(event) {
  event.preventDefault();

  // Ensure a valid drop target and dragged item
  if (draggedItem && event.target.classList.contains("tier")) {
      // Check if the image already exists in a tier
      document.querySelectorAll(".tier").forEach(tier => {
          if (tier.contains(draggedItem)) {
              tier.removeChild(draggedItem);
          }
      });

      event.target.appendChild(draggedItem); // Append the image to the target tier
      saveRankings(); // Save the new state
  }
}

function dropToPool(event) {
  event.preventDefault();

  // Return the image to the pool if dropped there
  if (draggedItem && event.target === document.querySelector(".image-pool")) {
      document.querySelectorAll(".tier").forEach(tier => {
          if (tier.contains(draggedItem)) {
              tier.removeChild(draggedItem);
          }
      });

      event.target.appendChild(draggedItem);
      saveRankings(); // Save the new state
  }
}

// Save Rankings to LocalStorage
function saveRankings() {
  const rankings = {};
  document.querySelectorAll(".tier").forEach(tier => {
      const items = Array.from(tier.querySelectorAll(".draggable")).map(item => item.src);
      rankings[tier.dataset.tier] = items;
  });

  // Save remaining images in the pool
  const poolItems = Array.from(document.querySelector(".image-pool").querySelectorAll(".draggable")).map(item => item.src);
  rankings["pool"] = poolItems;

  localStorage.setItem("rankings", JSON.stringify(rankings));
}

// Load Rankings from LocalStorage
function loadRankings() {
  const savedRankings = localStorage.getItem("rankings");
  if (savedRankings) {
      const rankings = JSON.parse(savedRankings);

      // Load images into their tiers
      Object.keys(rankings).forEach(tierId => {
          const tierElement = document.querySelector(`.tier[data-tier="${tierId}"]`);
          if (tierElement) {
              rankings[tierId].forEach(imgSrc => {
                  const img = document.querySelector(`img[src="${imgSrc}"]`);
                  if (img) {
                      tierElement.appendChild(img);
                  }
              });
          }
      });

      // Load remaining images into the pool
      const imagePool = document.querySelector(".image-pool");
      if (rankings["pool"]) {
          rankings["pool"].forEach(imgSrc => {
              const img = document.querySelector(`img[src="${imgSrc}"]`);
              if (img) {
                  imagePool.appendChild(img);
              }
          });
      }
  }
}
