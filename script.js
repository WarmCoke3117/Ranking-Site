// Initialize Drag-and-Drop Functionality
document.addEventListener("DOMContentLoaded", () => {
  const draggableItems = document.querySelectorAll(".draggable");
  const tiers = document.querySelectorAll(".tier");

  draggableItems.forEach(item => {
      item.addEventListener("dragstart", dragStart);
  });

  tiers.forEach(tier => {
      tier.addEventListener("dragover", dragOver);
      tier.addEventListener("drop", drop);
  });

  loadRankings(); // Load saved rankings on page load
});

let draggedItem = null;

function dragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.setData('text/plain', event.target.src);
  setTimeout(() => {
      draggedItem.style.visibility = "hidden";
  }, 0);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  // Ensure draggedItem exists and only allow unique items in each tier
  if (draggedItem) {
      draggedItem.style.visibility = "visible";
      const target = event.target;

      if (!target.classList.contains('tier')) return;

      // Remove item if already in another tier
      const allTiers = document.querySelectorAll('.tier');
      allTiers.forEach(tier => {
          if (tier.contains(draggedItem)) {
              tier.removeChild(draggedItem);
          }
      });

      target.appendChild(draggedItem);
      saveRankings(); // Save rankings to localStorage
  }
}

// Select all draggable elements and tiers
const draggables = document.querySelectorAll('.draggable');
const tiers = document.querySelectorAll('.tier');
const imagePool = document.querySelector('.image-pool');

// Add drag-and-drop functionality
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        // If the image is not in any tier, return it to the pool
        if (![...tiers].some(tier => tier.contains(draggable))) {
            imagePool.appendChild(draggable);
        }
    });
});

// Allow dropping images into the tiers
tiers.forEach(tier => {
    tier.addEventListener('dragover', e => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        tier.appendChild(dragging);
    });
});

// Save Rankings to LocalStorage
function saveRankings() {
  const rankings = {};
  document.querySelectorAll('.tier').forEach(tier => {
      const items = Array.from(tier.querySelectorAll('.draggable')).map(item => item.src);
      rankings[tier.dataset.tier] = items;
  });
  localStorage.setItem('rankings', JSON.stringify(rankings));
}

// Load Rankings from LocalStorage
function loadRankings() {
  const savedRankings = localStorage.getItem('rankings');
  if (savedRankings) {
      const rankings = JSON.parse(savedRankings);
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
  }
}
