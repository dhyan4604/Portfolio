document.documentElement.classList.add('js');
requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((el) => el.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }
});

const navToggle = document.querySelector('.nav-toggle');
const drawer = document.querySelector('.mobile-drawer');
const drawerCloseTargets = document.querySelectorAll('[data-drawer-close], .drawer-nav a');

function closeDrawer() {
  document.body.classList.remove('drawer-open');
  if (drawer) drawer.setAttribute('aria-hidden', 'true');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && drawer) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('drawer-open');
    drawer.setAttribute('aria-hidden', String(!isOpen));
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

drawerCloseTargets.forEach((node) => {
  node.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDrawer();
  }
});

const projectTabsRoot = document.querySelector('[data-project-tabs]');

if (projectTabsRoot) {
  const tabs = Array.from(projectTabsRoot.querySelectorAll('[data-project-target]'));
  const panels = Array.from(document.querySelectorAll('[data-project-panel]'));

  function activateProjectTab(target) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.projectTarget === target;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
      const shouldShow = panel.dataset.projectPanel === target;
      if (shouldShow) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  projectTabsRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-project-target]');
    if (!button) return;
    activateProjectTab(button.dataset.projectTarget);
  });
}

// =========================================
// UNIVERSAL ANIMATIONS (MOBILE + DESKTOP)
// =========================================

if (!prefersReducedMotion) {

  // 1. Neon Shockwave on Touch/Click (Works everywhere)
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'neon-shockwave';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });

  // 2. 3D Card Tilt with Mobile Gyroscope Support
  const tiltScript = document.createElement('script');
  tiltScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js';
  tiltScript.onload = () => {
    VanillaTilt.init(document.querySelectorAll(".project-card, .panel"), {
      max: 5,
      speed: 400,
      glare: true,
      "max-glare": 0.1,
      gyroscope: true, // Tilts based on phone orientation!
      gyroscopeMinAngleX: -45,
      gyroscopeMaxAngleX: 45,
      gyroscopeMinAngleY: -45,
      gyroscopeMaxAngleY: 45,
    });
  };
  document.head.appendChild(tiltScript);
}
