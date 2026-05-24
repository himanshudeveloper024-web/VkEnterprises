/* ============================================
   VK ENTERPRISES — script.js
   Ultra-Modern Luxury Animations & Interactions
   ============================================ */

/* ============================================
   LOADER
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 2000);
  document.body.style.overflow = 'hidden';
});

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  }
});

// Smoothly lag the ring
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (ring) {
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverEls = document.querySelectorAll('a, button, .service-card, .why-card, .gallery-item, .brand-card');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('hovered'));
});

/* ============================================
   NAVBAR — SCROLL EFFECT
   ============================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ============================================
   HAMBURGER / MOBILE MENU
   ============================================ */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
hamburger && hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});
// Section navigation closes the mobile menu from the delegated handler below.

/* ============================================
   PARTICLE CANVAS (HERO)
   ============================================ */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas && canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity  = Math.random() * 0.5 + 0.1;
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
    // Gold or white
    this.color = Math.random() > 0.5
      ? `rgba(212,168,67,${this.opacity})`
      : `rgba(255,255,255,${this.opacity * 0.5})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
    if (this.life <= 0 ||
        this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    const alpha = (this.life / this.maxLife) * this.opacity;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.size * 4;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

if (canvas && ctx) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(212,168,67,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ============================================
   MOUSE PARALLAX ON HERO
   ============================================ */
const heroContent = document.querySelector('.hero-content');
document.getElementById('hero') && document.getElementById('hero').addEventListener('mousemove', (e) => {
  if (!heroContent) return;
  const rx = (e.clientX / window.innerWidth  - 0.5) * 20;
  const ry = (e.clientY / window.innerHeight - 0.5) * 10;
  heroContent.style.transform = `perspective(1000px) rotateY(${rx * 0.2}deg) rotateX(${-ry * 0.1}deg)`;
});
document.getElementById('hero') && document.getElementById('hero').addEventListener('mouseleave', () => {
  if (heroContent) heroContent.style.transform = '';
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const update = () => {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target, parseInt(entry.target.dataset.target));
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

/* ============================================
   SERVICE CARD TILT EFFECT
   ============================================ */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;
    const ry = ((x - cx) / cx) *  8;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('tDots');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');
let currentSlide = 0;

function getSlidesPerView() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function updateSlider() {
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length || !track.parentElement.offsetWidth) return;
  const perView = getSlidesPerView();
  const maxSlide = Math.max(0, cards.length - perView);
  if (currentSlide > maxSlide) currentSlide = maxSlide;

  const trackStyles = window.getComputedStyle(track);
  const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
  const cardWidth = cards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentSlide * (cardWidth + gap)}px)`;

  // Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('div');
      dot.className = 't-dot' + (i === currentSlide ? ' active' : '');
      dot.addEventListener('click', () => { currentSlide = i; updateSlider(); });
      dotsContainer.appendChild(dot);
    }
  }
}

prevBtn && prevBtn.addEventListener('click', () => {
  const cards = track.querySelectorAll('.testimonial-card');
  const perView = getSlidesPerView();
  currentSlide = Math.max(0, currentSlide - 1);
  updateSlider();
});
nextBtn && nextBtn.addEventListener('click', () => {
  const cards = track.querySelectorAll('.testimonial-card');
  const perView = getSlidesPerView();
  const maxSlide = Math.max(0, cards.length - perView);
  currentSlide = Math.min(maxSlide, currentSlide + 1);
  updateSlider();
});

// Auto-scroll
setInterval(() => {
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const perView = getSlidesPerView();
  const maxSlide = Math.max(0, cards.length - perView);
  currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
  updateSlider();
}, 5000);

window.addEventListener('resize', updateSlider);
updateSlider();

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   CONTACT FORM SUBMIT
   ============================================ */
function submitForm() {
  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const service = document.getElementById('fservice').value;
  const msg     = document.getElementById('fmsg').value.trim();
  const success = document.getElementById('formSuccess');

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  // Build WhatsApp message
  const wa = `Hi VK Enterprises,%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(msg)}`;
  window.open(`https://wa.me/918126161656?text=${wa}`, '_blank');

  // Show success
  if (success) {
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 6000);
  }

  // Reset
  document.getElementById('fname').value  = '';
  document.getElementById('fphone').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fservice').value = '';
  document.getElementById('fmsg').value   = '';
}

/* ============================================
   SECTION PAGE NAVIGATION
   ============================================ */
const pageSections = Array.from(document.querySelectorAll('section[id]'));
const navLinksAll = document.querySelectorAll('.nav-links a, .mobile-menu a, .section-nav-link');
const validPages = new Set(pageSections.map(section => section.id));

function normalizePage(page) {
  const cleanPage = String(page || 'hero').replace('#', '');
  return validPages.has(cleanPage) ? cleanPage : 'hero';
}

function closeMobileMenu() {
  mobileMenu && mobileMenu.classList.remove('active');
}

function updateActiveSectionNav(activePage) {
  const current = normalizePage(activePage);

  navLinksAll.forEach(link => {
    const linkPage = normalizePage(link.dataset.page || link.getAttribute('href'));
    const isActive = linkPage === current;

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function jumpToTop() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previousScrollBehavior;
}

function showSection(page, updateUrl = true) {
  const activePage = normalizePage(page);
  const target = document.getElementById(activePage);

  if (!target) return;

  document.body.classList.add('section-view');
  document.body.classList.toggle('home-view', activePage === 'hero');

  pageSections.forEach(section => {
    section.classList.toggle('active-section', section.id === activePage);
  });

  target.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    el.classList.add('visible');
  });

  if (activePage === 'about') {
    requestAnimationFrame(updateSlider);
  }

  closeMobileMenu();
  updateActiveSectionNav(activePage);

  if (updateUrl) {
    const nextHash = '#' + activePage;
    if (window.location.hash !== nextHash) {
      history.pushState({ page: activePage }, '', nextHash);
    }
  }

  jumpToTop();
}

function navigateTo(page) {
  showSection(page, true);
}

function navigateToSection(event, sectionId) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  showSection(sectionId, true);
}

window.navigateTo = navigateTo;
window.navigateToSection = navigateToSection;
window.closeMobileMenu = closeMobileMenu;

/* ============================================
   PARALLAX SECTION BG
   ============================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, i) => {
    const speed = 0.05 + i * 0.02;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

/* ============================================
   HERO TEXT STAGGER (LETTER-BY-LETTER)
   ============================================ */
// Stagger the reveal of hero title words on load
window.addEventListener('load', () => {
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    // Already handled by CSS delay classes on hero-content children
  }, 2100);
});

/* ============================================
   GALLERY HOVER SOUND-LIKE VISUAL FEEDBACK
   ============================================ */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.boxShadow = '0 0 30px rgba(212,168,67,0.2), 0 20px 60px rgba(0,0,0,0.5)';
    item.style.borderColor = 'rgba(212,168,67,0.4)';
    item.style.zIndex = '2';
  });
  item.addEventListener('mouseleave', () => {
    item.style.boxShadow = '';
    item.style.borderColor = '';
    item.style.zIndex = '';
  });
});

/* ============================================
   DYNAMIC GLOW BEHIND HERO ON MOUSE MOVE
   ============================================ */
const heroSection = document.getElementById('hero');
heroSection && heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
  const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
  heroSection.style.setProperty('--mx', x + '%');
  heroSection.style.setProperty('--my', y + '%');
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page], a[href^="#"]');
  if (!link) return;

  const page = link.dataset.page || link.getAttribute('href');
  const activePage = normalizePage(page);

  if (!validPages.has(activePage)) return;

  e.preventDefault();
  showSection(activePage, true);
});

window.addEventListener('popstate', () => {
  showSection(window.location.hash || 'hero', false);
});

window.addEventListener('hashchange', () => {
  showSection(window.location.hash || 'hero', false);
});

showSection(window.location.hash || 'hero', false);

console.log('✨ VK Enterprises – Powered by Vishal Kashyap. All animations loaded.');
