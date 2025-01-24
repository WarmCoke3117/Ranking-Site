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
    draggedItem.style.visibility = "hidden";
  }, 0);
}

function dragEnd() {
  draggedItem.style.visibility = "visible";
  draggedItem = null;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  if (draggedItem && event.target.classList.contains("tier")) {
    document.querySelectorAll(".tier").forEach(tier => {
      if (tier.contains(draggedItem)) {
        tier.removeChild(draggedItem);
      }
    });

    event.target.appendChild(draggedItem);
    saveRankings();
  }
}

function dropToPool(event) {
  event.preventDefault();

  if (draggedItem && event.target === document.querySelector(".image-pool")) {
    document.querySelectorAll(".tier").forEach(tier => {
      if (tier.contains(draggedItem)) {
        tier.removeChild(draggedItem);
      }
    });

    event.target.appendChild(draggedItem);
    saveRankings();
  }
}

// Save Rankings to LocalStorage
function saveRankings() {
  const currentPage = getPageName(); // Get the current page name
  const allRankings = JSON.parse(localStorage.getItem("allRankings") || "{}");

  const currentRankings = {};
  document.querySelectorAll(".tier").forEach(tier => {
    const items = Array.from(tier.querySelectorAll(".draggable")).map(item => item.src);
    currentRankings[tier.dataset.tier] = items;
  });

  const poolItems = Array.from(document.querySelector(".image-pool").querySelectorAll(".draggable")).map(item => item.src);
  currentRankings["pool"] = poolItems;

  allRankings[currentPage] = currentRankings; // Update the rankings for the current page
  localStorage.setItem("allRankings", JSON.stringify(allRankings)); // Save all rankings
}

function loadRankings() {
  const currentPage = getPageName();
  const allRankings = JSON.parse(localStorage.getItem("allRankings") || "{}");

  if (allRankings[currentPage]) {
    const rankings = allRankings[currentPage];

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

function getPageName() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1); // Extract the filename
}
