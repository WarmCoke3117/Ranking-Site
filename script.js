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
});

let draggedItem = null;

function dragStart(event) {
  draggedItem = event.target;
  setTimeout(() => {
      draggedItem.style.visibility = "hidden";
  }, 0);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  // Ensure draggedItem exists and remove duplicates
  if (draggedItem) {
      draggedItem.style.visibility = "visible";
      event.target.appendChild(draggedItem);

      // Remove duplicates from other tiers
      const tiers = document.querySelectorAll(".tier");
      tiers.forEach(tier => {
          if (tier !== event.target && tier.contains(draggedItem)) {
              tier.removeChild(draggedItem);
          }
      });
  }
}
