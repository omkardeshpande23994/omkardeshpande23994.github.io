/* Back-to-Top (Dimension-friendly) */
;(function () {
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  function init() {
    // Reuse if already in DOM, else create
    var btn = document.getElementById('backToTop') || (function () {
      var b = document.createElement('button');
      b.id = 'backToTop';
      b.type = 'button';
      b.setAttribute('aria-label', 'Back to top');
      b.title = 'Back to top';
      b.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true" style="display:block;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;width:22px;height:22px"><path d="M6 14l6-6 6 6"/></svg>';
      document.body.appendChild(b);
      return b;
    })();

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var lastArticle = null;

    function getActiveArticle() {
      return document.querySelector('#main article.active, #main article.visible');
    }

    function scrollContext() {
      var articleOpen = document.body.classList.contains('is-article-visible');
      var art = getActiveArticle();
      if (articleOpen && art && (art.scrollHeight - art.clientHeight) > 2) {
        return { el: art, win: false };
      }
      return { el: window, win: true };
    }

    function getTop(ctx) {
      return ctx.win
        ? (window.scrollY || document.documentElement.scrollTop || 0)
        : ctx.el.scrollTop;
    }

    function getSizes(ctx) {
      return ctx.win
        ? {
            h: window.innerHeight,
            sh: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
          }
        : { h: ctx.el.clientHeight, sh: ctx.el.scrollHeight };
    }

    function show() {
      if (btn.style.display !== 'inline-flex') btn.style.display = 'inline-flex';
      btn.classList.add('show');
      btn.classList.remove('hide');
    }

    function hide() {
      btn.classList.remove('show');
      btn.classList.add('hide');
      setTimeout(function () {
        if (!btn.classList.contains('show')) btn.style.display = 'none';
      }, 150);
    }

    function update() {
      // 1) Never show on the landing/cover
      if (!document.body.classList.contains('is-article-visible')) { hide(); return; }

      var ctx = scrollContext();
      var y = getTop(ctx);
      var s = getSizes(ctx);

      // 2) If content barely scrolls, hide (prevents showing at "top")
      var scrollable = (s.sh - s.h) > 240; // ~1.5 screens
      if (!scrollable) { hide(); return; }

      // 3) Show only after scrolling a bit (and NOT at exact top)
      var threshold = Math.min(400, Math.max(200, s.h * 0.30)); // 30% of viewport, bounded 200-400
      if (y > threshold) show(); else hide();
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }

    // Prevent article from closing when clicking the FAB
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var ctx = scrollContext();
      var behavior = prefersReduced.matches ? 'auto' : 'smooth';
      if (ctx.win) window.scrollTo({ top: 0, behavior });
      else ctx.el.scrollTo({ top: 0, behavior });
    });

    // Wire listeners
    var ticking = false;
    window.addEventListener('scroll', onScroll, { passive: true });

    function attachArticleScroll() {
      var art = getActiveArticle();
      if (art !== lastArticle) {
        if (lastArticle) lastArticle.removeEventListener('scroll', onScroll);
        if (art) art.addEventListener('scroll', onScroll, { passive: true });
        lastArticle = art;
      }
    }

    // React to article open/close
    var mo = new MutationObserver(function () { attachArticleScroll(); update(); });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Initial kick
    attachArticleScroll();
    update();
  }
})();
