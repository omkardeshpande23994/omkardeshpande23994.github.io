(function(){
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const chips = document.querySelectorAll('.blog-filters .chip');
  const cards = Array.from(grid.querySelectorAll('.card'));
  const loadMoreBtn = document.getElementById('loadMore');

  let activeTag = 'all';
  let visibleCount = 6;

  function matchesTag(card, tag){
    if (tag === 'all') return true;
    const tags = (card.getAttribute('data-tags') || '').split(',').map(s=>s.trim().toLowerCase());
    return tags.includes(tag.toLowerCase());
  }

  function render(){
    let shown = 0;
    const filtered = cards.filter(c => matchesTag(c, activeTag));
    cards.forEach(c => c.style.display = 'none');
    filtered.forEach((c, i) => {
      if (i < visibleCount) { c.style.display = ''; shown++; }
    });
    // Toggle load more
    if (shown < filtered.length) {
      loadMoreBtn.style.display = '';
    } else {
      loadMoreBtn.style.display = filtered.length > 0 ? 'none' : 'none';
    }
  }

  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    activeTag = chip.dataset.tag || 'all';
    visibleCount = 6;
    render();
  }));

  loadMoreBtn.addEventListener('click', () => {
    visibleCount += 6;
    render();
  });

  render();
})();
