/* nav.js — mobile drawer toggle, sticky-header shadow on scroll */
(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const body = document.body;

  // Sticky-header shadow when scrolled past a threshold
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile drawer toggle
  if (hamburger && drawer) {
    const closeDrawer = () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      body.classList.remove('no-scroll');
    };

    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      body.classList.toggle('no-scroll', isOpen);
    });

    // Close drawer on nav link click
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    // Close drawer on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer if resized above mobile breakpoint
    const mql = window.matchMedia('(min-width: 900px)');
    mql.addEventListener('change', (e) => {
      if (e.matches) closeDrawer();
    });
  }
})();
