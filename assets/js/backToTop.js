(function () {
  // Create the floating circular button (no HTML edits needed)
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.title = 'Back to top';
  // Inline SVG arrow (chevron up)
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 14l6-6 6 6"></path>
    </svg>
  `;
  document.body.appendChild(btn);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function scrollToTop() {
    if (prefersReducedMotion.matches) window.scrollTo(0, 0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shouldShow() {
    // Only show when an article overlay is open (HTML5UP Dimension behavior)
    const articleOpen = document.body.classList.contains('is-article-visible');
    if (!articleOpen) return false;

    const y = window.scrollY || document.documentElement.scrollTop;
    const threshold = Math.max(window.innerHeight * 0.6, 400);
    const nearBottom = (window.innerHeight + y) >= (document.documentElement.scrollHeight - 200);
    return y > threshold || nearBottom;
  }

  function update() {
    if (shouldShow()) {
      if (!btn.classList.contains('show')) {
        btn.style.display = 'inline-flex';
        btn.classList.remove('hide');
        btn.classList.add('show');
      }
    } else if (btn.classList.contains('show')) {
      btn.classList.remove('show');
      btn.classList.add('hide');
      setTimeout(() => { if (!btn.classList.contains('show')) btn.style.display = 'none'; }, 180);
    }
  }

  // rAF-throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  // React when articles open/close
  const obs = new MutationObserver(update);
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Click handler
  btn.addEventListener('click', scrollToTop);

  // Initial state
  update();
})();
