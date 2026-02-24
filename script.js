
// THEME: Option C — system preference + manual override persisted in localStorage
(function(){
  const root = document.documentElement;
  const stored = localStorage.getItem('theme'); // 'light' | 'dark' | null
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  } else {
    root.removeAttribute('data-theme'); // fall back to prefers-color-scheme
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');
  const root = document.documentElement;

  function currentTheme() {
    const explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light');
    else if (t === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    localStorage.setItem('theme', t);
    if (toggle) toggle.setAttribute('aria-pressed', String(t === 'dark'));
    if (label) label.textContent = t === 'dark' ? 'Dark' : 'Light';
  }

  if (toggle) {
    applyTheme(localStorage.getItem('theme') || currentTheme());
    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const menu = document.getElementById('menu');
if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
}

// Lightbox modal for project images (on pages where present)
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');
  const modalTitle = document.getElementById('modal-title');

  const openModal = (src, alt, title) => {
    modalImg.src = src; modalImg.alt = alt; modalTitle.textContent = title; modalDesc.textContent = alt; lightbox.classList.add('open');
  };
  const closeModal = () => lightbox.classList.remove('open');

  document.addEventListener('click', (e) => {
    const fig = e.target.closest('figure[data-modal]');
    if (fig) {
      const img = fig.querySelector('img');
      openModal(img.src, img.alt, fig.getAttribute('data-modal'));
    }
    if (e.target.matches('[data-close]') || e.target === lightbox) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// Contact form (demo)
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hp = form.querySelector('#company');
    if (hp && hp.value) return; // honeypot
    const success = document.getElementById('form-success');
    const error = document.getElementById('form-error');
    if (success) success.style.display = 'none';
    if (error) error.style.display = 'none';

    if (!form.checkValidity()) {
      if (error){ error.textContent = 'Please fill all required fields correctly.'; error.style.display = 'block'; }
      return;
    }

    try {
      // Simulated success — replace with your endpoint (Netlify, Formspree, etc.)
      await new Promise(r => setTimeout(r, 600));
      if (success) success.style.display = 'block';
      form.reset();
    } catch (err) {
      if (error) error.style.display = 'block';
    }
  });
}
