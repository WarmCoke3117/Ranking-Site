// Drag-and-Drop Logic
document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', event.target.src);
    });
  });
  
  document.querySelectorAll('.rank').forEach(rank => {
    rank.addEventListener('dragover', event => {
      event.preventDefault();
    });
  
    rank.addEventListener('drop', event => {
      event.preventDefault();
      const imgSrc = event.dataTransfer.getData('text/plain');
      const img = document.querySelector(`img[src="${imgSrc}"]`);
      event.target.appendChild(img);
      saveRankings(); // Save rankings on drop
    });
  });
  
  // Save Rankings to LocalStorage
  function saveRankings() {
    const rankings = {};
    document.querySelectorAll('.rank').forEach(rank => {
      const items = Array.from(rank.children).map(item => item.src);
      rankings[rank.id] = items;
    });
    localStorage.setItem('colors', JSON.stringify(rankings)); // Update for each category
  }
  
  // Load Rankings on Page Load
  function loadRankings() {
    const saved = localStorage.getItem('colors'); // Update for each category
    if (saved) {
      const rankings = JSON.parse(saved);
      Object.keys(rankings).forEach(rankId => {
        const rankDiv = document.getElementById(rankId);
        rankings[rankId].forEach(imgSrc => {
          const img = document.querySelector(`img[src="${imgSrc}"]`);
          if (img) rankDiv.appendChild(img);
        });
      });
    }
  }
  
  loadRankings();
  