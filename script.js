const revealElements = document.querySelectorAll('.reveal');

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

const tiltCards = document.querySelectorAll('.tilt');

function setTilt(event, card) {
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -5;
  const rotateY = ((x - centerX) / centerX) * 5;

  card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
}

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => setTilt(event, card));
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

const magnets = document.querySelectorAll('.magnet');
const rootStyles = getComputedStyle(document.documentElement);
const magnetGlow = rootStyles.getPropertyValue('--glow-strong').trim() || 'rgba(6, 182, 212, 0.45)';

magnets.forEach((button) => {
  button.addEventListener('mousemove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    button.style.boxShadow = `0 12px 28px ${magnetGlow}`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
    button.style.boxShadow = '';
  });
});

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
