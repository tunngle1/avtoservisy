const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const modal = document.getElementById('bookingModal');
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsPrev = document.getElementById('reviewsPrev');
const reviewsNext = document.getElementById('reviewsNext');

function setNavOpen(isOpen) {
  if (!burger || !nav) return;
  burger.classList.toggle('active', isOpen);
  nav.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
}

if (burger && nav) {
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    setNavOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setNavOpen(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target) || burger.contains(e.target)) return;
    setNavOpen(false);
  });
}

function openModal() {
  setNavOpen(false);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!nav.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-modal="booking"]').forEach((btn) => {
  btn.addEventListener('click', openModal);
});

modal.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('open')) closeModal();
    if (nav.classList.contains('open')) setNavOpen(false);
  }
});

function handleFormSubmit(form, e) {
  e.preventDefault();
  const phone = form.querySelector('[name="phone"]').value.trim();
  if (!phone) return;

  closeModal();
  form.reset();
  alert('Спасибо! Мы перезвоним вам в течение 10 минут.');
}

document.getElementById('bookingForm').addEventListener('submit', (e) => {
  handleFormSubmit(e.target, e);
});

document.getElementById('modalForm').addEventListener('submit', (e) => {
  handleFormSubmit(e.target, e);
});

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

revealElements.forEach((el) => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    setNavOpen(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (reviewsTrack && reviewsPrev && reviewsNext) {
  const scrollAmount = Math.min(360, reviewsTrack.clientWidth * 0.85);

  reviewsPrev.addEventListener('click', () => {
    reviewsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  reviewsNext.addEventListener('click', () => {
    reviewsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7') && value.length) value = '7' + value;

    let formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
    if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
    if (value.length >= 7) formatted += '-' + value.slice(7, 9);
    if (value.length >= 9) formatted += '-' + value.slice(9, 11);

    e.target.value = formatted;
  });
});
