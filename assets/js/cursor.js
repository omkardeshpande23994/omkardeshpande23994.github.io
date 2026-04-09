/* ============================================================
   CURSOR — Custom dot cursor for pointer (non-touch) devices
   ============================================================ */

(function () {
  'use strict';

  // Only activate on fine pointer devices (mouse/trackpad, not touch)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-follower');
  if (!dot || !ring) return;

  // Show cursor elements
  dot.style.display = 'block';
  ring.style.display = 'block';

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;

  // Dot follows mouse exactly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Ring follows with lerp — increased for snappier feel
  function animateRing() {
    const lerp = isHovering ? 0.38 : 0.28;
    ringX += (mouseX - ringX) * lerp;
    ringY += (mouseY - ringY) * lerp;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  // Expand ring on interactive elements
  const interactiveSelectors = 'a, button, .project-card, .writing-card, .writing-feature, .bento-card, .stat-card, .btn, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovering = true;
      ring.classList.add('cursor-follower--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovering = false;
      ring.classList.remove('cursor-follower--hover');
    }
  });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();
