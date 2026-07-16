// Delta Bright — site interactions

document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav toggle */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');
const setActiveLink = () => {
  let current = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
document.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* Scroll reveal */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

/* Back to top */
const backToTop = document.getElementById('back-to-top');
document.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Quote form: client-side handling + WhatsApp handoff
   NOTE: There is no backend wired up yet. To actually receive these
   requests by email, connect this form to a service like Formspree,
   EmailJS, or your own endpoint and POST the form data to it inside
   the submit handler below. */
const quoteForm = document.getElementById('quote-form');
const formStatus = document.getElementById('form-status');
const whatsappLink = document.getElementById('whatsapp-quote-link');

quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('q-name').value.trim();
  const phone = document.getElementById('q-phone').value.trim();
  const type = document.getElementById('q-type').value;
  const details = document.getElementById('q-details').value.trim();

  if (!name || !phone || !type || !details) {
    formStatus.style.color = '#c0392b';
    formStatus.textContent = 'Please fill in all required fields.';
    return;
  }

  // Build a prefilled WhatsApp message as the current delivery method.
  const message = `Quote request from ${name} (${phone})%0AProject type: ${type}%0ADetails: ${details}`;
  whatsappLink.href = `https://wa.me/251930873476?text=${message}`;

  formStatus.style.color = '#1F8A44';
  formStatus.textContent = "Thanks! Click 'Chat on WhatsApp Instead' to send this to our team now, or we'll follow up by phone shortly.";
  quoteForm.reset();
});