// ===== Preloader (elegant lines) =====
document.body.classList.add('is-loading');
(function preloader() {
  const pre = document.getElementById('preloader');
  const countEl = document.getElementById('preCount');
  if (!pre) { document.body.classList.remove('is-loading'); document.body.classList.add('loaded'); initReveals(); return; }

  const DURATION = 1900;
  const start = Date.now();
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    clearInterval(iv);
    if (countEl) countEl.textContent = 100;
    setTimeout(() => {
      pre.classList.add('is-done');
      document.body.classList.remove('is-loading');
      document.body.classList.add('loaded');
      initReveals();
      setTimeout(() => pre.remove(), 950);
    }, 260);
  }

  const iv = setInterval(() => {
    const t = Math.min((Date.now() - start) / DURATION, 1);
    if (countEl) countEl.textContent = Math.floor(t * 100);
    if (t >= 1) finish();
  }, 16);
  setTimeout(finish, DURATION + 700);
})();

// ===== Per-character blur-in text =====
const BLUR_SELECTOR = '.hero__line > span, .giant, .about__statement, .contact__title';

function splitToChars(el) {
  const frag = document.createDocumentFragment();
  el.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      for (const ch of node.textContent) {
        const s = document.createElement('span');
        s.className = 'bchar';
        s.textContent = ch;
        frag.appendChild(s);
      }
    } else {
      frag.appendChild(node.cloneNode(true));
    }
  });
  el.innerHTML = '';
  el.appendChild(frag);
  el.querySelectorAll('.bchar').forEach((s, i) => { s.style.transitionDelay = (i * 0.026) + 's'; });
  el.classList.remove('reveal', 'is-visible'); // avoid double animation with per-char
  el.classList.add('is-split');
}

// ===== i18n (RU / EN) =====
const translations = {
  en: {
    'nav-about': 'About',
    'nav-projects': 'Projects',
    'nav-process': 'Process',
    'nav-facts': 'Facts',
    'nav-contact': 'Contact',
    'nav-cta': 'Get in touch',

    'hero-s1': 'Product design',
    'hero-s2': 'UX research',
    'hero-s3': 'Design systems',
    'hero-s4': 'Prototyping',
    'hero-t1': 'UX/UI design',
    'hero-t2': 'with character',
    'hero-lead': 'I help brands and startups craft digital design that boosts conversion and holds attention.',
    'hero-cta': 'View projects',

    'clients-label': 'Worked with',

    'about-index': 'About me',
    'about-trust': 'Trusted by teams and founders',
    'about-statement': 'I help products grow through strategic design — thoughtful, visually bold, and built to make an impression.',

    'q-title': 'Design that moves metrics',
    'q-text': '“Elya builds thoughtful digital products, crafts strong interfaces, and finds solutions that deliver real results.”',
    'q-role': 'CEO, fintech startup',

    'fact-label': 'Fact 01',
    'fact-desc': 'average conversion lift after redesigning key product flows',
    'visual-caption': 'Design is a brand’s story, told without words',

    'projects-title': 'Projects',
    'projects-sub': 'Selected work: every project’s journey — from research and structure to a final interface ready to ship.',

    'p1-title': 'Nova Bank — mobile banking',
    'p1-tag': 'UX/UI · Mobile app',
    'p2-title': 'Treva — SaaS analytics dashboard',
    'p2-tag': 'Product design · Web',
    'p3-title': 'Amara — e-commerce platform',
    'p3-tag': 'UX audit · Redesign',
    'p4-title': 'Kanba — design system',
    'p4-tag': 'Design system · UI kit',

    'process-title': 'Process',
    'process-sub': 'Let’s dive into the process. From the first idea to the final launch, every step is clear and intentional.',

    'step1-title': 'Research',
    'step1-body': 'I study the product, audience, and competitors. I run interviews, analyze metrics, and define the problems design has to solve.',
    'step2-title': 'Concept',
    'step2-body': 'I map flows, build structure and prototypes, and test hypotheses with users before the final UI exists.',
    'step3-title': 'Design',
    'step3-body': 'I craft the visual language: typography, color, grids, components — and assemble a clean design system for the dev team.',
    'step4-title': 'Launch',
    'step4-body': 'I support development, review the build, gather post-release feedback, and improve the product iteratively.',

    'facts-title': 'Numbers<br>&amp; facts',
    'f1': 'years in product design',
    'f2': 'completed projects',
    'f3': 'design systems built from scratch',
    'f4': 'of clients come back',

    'contact-label': 'Got a project?',
    'contact-title': 'Let’s<br>work together',
    'footer-top': 'Back to top ↑'
  }
};

const i18nEls = document.querySelectorAll('[data-i18n]');
i18nEls.forEach(el => { el.dataset.ru = el.dataset.ru || el.innerHTML; });
let i18nReady = false;

function applyLang(lang) {
  const dict = translations[lang];
  i18nEls.forEach(el => {
    const key = el.dataset.i18n;
    const isBlur = el.matches(BLUR_SELECTOR);
    if (lang === 'ru') {
      el.innerHTML = el.dataset.ru;
    } else if (dict && dict[key] != null) {
      el.innerHTML = dict[key];
    }
    if (isBlur) {
      splitToChars(el);
      if (i18nReady) el.classList.add('is-revealed'); // instant on manual switch
    }
  });
  document.documentElement.lang = lang;
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'ru' ? 'EN' : 'RU';
  try { localStorage.setItem('lang', lang); } catch (e) {}
}

let currentLang = 'ru';
try {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'ru') currentLang = saved;
} catch (e) {}
applyLang(currentLang);
i18nReady = true;

const langSwitch = document.getElementById('langSwitch');
if (langSwitch) {
  langSwitch.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    applyLang(currentLang);
  });
}

// ===== Reveal-on-view (blur-in) — initialised after the preloader lifts =====
let revealsStarted = false;
function initReveals() {
  if (revealsStarted) return;
  revealsStarted = true;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible', 'is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal, .is-split').forEach(el => io.observe(el));

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
}

// ===== Nav: фон при скролле =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

// ===== Мобильное меню =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', open);
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
});

// ===== Аккордеон «Процесс» =====
document.querySelectorAll('[data-step]').forEach(step => {
  step.addEventListener('click', () => {
    const wasOpen = step.classList.contains('is-open');
    document.querySelectorAll('[data-step]').forEach(s => s.classList.remove('is-open'));
    if (!wasOpen) step.classList.add('is-open');
  });
});

// ===== Счётчики в «Цифры & факты» =====
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
