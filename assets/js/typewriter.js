/* ============================================================
   TYPEWRITER — Hero subtitle cycling animation
   ============================================================ */

(function () {
  'use strict';

  const roles = [
    'Senior Analytics Consultant',
    'Business Analyst',
    'Data Storyteller',
    'BI Engineer',
    'ML Enthusiast',
  ];

  const el = document.getElementById('typewriter');
  if (!el) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function tick() {
    if (isPaused) return;

    const current = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          tick();
        }, 2200);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          tick();
        }, 350);
        return;
      }
    }

    const speed = isDeleting ? 38 : 75;
    setTimeout(tick, speed);
  }

  // Small initial delay so page loads before animation starts
  setTimeout(tick, 600);
})();
