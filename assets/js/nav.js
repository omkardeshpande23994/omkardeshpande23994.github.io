/* ============================================================
   NAV — Sticky nav: active highlight, scroll state, mobile drawer
   ============================================================ */

(function () {
  'use strict';

  const nav = document.getElementById('site-nav');
  const hamburger = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  const scrollTopBtn = document.getElementById('scroll-top');

  // ——— Scroll state: background blur ———
  function onScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ——— Active section tracking via IntersectionObserver ———
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('nav__link--active', isActive);
          });
          // Also sync drawer links
          document.querySelectorAll('#nav-drawer .nav__link[href^="#"]').forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('nav__link--active', isActive);
          });
        }
      });
    },
    {
      rootMargin: '-35% 0px -60% 0px',
    }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // ——— Mobile hamburger ———
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      drawer.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        drawer.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !drawer.contains(e.target)) {
        hamburger.classList.remove('is-open');
        drawer.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ——— Scroll-to-top button ———
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ——— Smooth scroll for all anchor links ———
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
