/* accordion.js — smooth max-height animation for native <details> FAQ items
   Usage: <details class="faq-item" data-accordion>...</details>
   Supports single-open-per-group by wrapping items in [data-accordion-group]. */
(function () {
  'use strict';

  const items = document.querySelectorAll('details[data-accordion]');
  if (!items.length) return;

  // Animate max-height on open/close for each details element
  items.forEach((item) => {
    const body = item.querySelector('.faq-body');
    if (!body) return;

    // Initialise closed height
    body.style.overflow = 'hidden';
    body.style.transition = 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    const setHeight = () => {
      if (item.open) {
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = '0px';
      }
    };

    // Set initial state
    if (!item.open) body.style.maxHeight = '0px';

    // Intercept toggle to animate
    item.addEventListener('toggle', () => {
      // Single-open-per-group behavior
      const group = item.closest('[data-accordion-group]');
      if (group && item.open) {
        group.querySelectorAll('details[data-accordion][open]').forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
      setHeight();
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      if (item.open) setHeight();
    }, { passive: true });
  });
})();
