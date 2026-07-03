// Terra Kitchen - Main Application

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Load menu
  menuManager.loadMenu();

  // Initialize reservation form
  reservationManager.init();

  // Initialize contact form
  contactManager.init();

  // Setup scroll reveal
  setupScrollReveal();

  // Setup mobile menu toggle
  setupMobileMenu();

  // Setup smooth scrolling
  setupSmoothScroll();

  console.log('[APP] Terra Kitchen initialized');
}

function setupMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close menu when link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Handle errors globally
window.addEventListener('error', (event) => {
  console.error('[ERROR]', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[ERROR] Unhandled rejection:', event.reason);
});
