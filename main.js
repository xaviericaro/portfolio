// ===== Preloader =====
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const barFill = document.getElementById('plBarFill');
  const plDot = document.getElementById('plDot');
  const logoDot = document.getElementById('logoDot');
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startKickerRotator = () => {
    const el = document.getElementById('kickerWord');
    if (!el) return;

    const words = ['Código', 'Aprendizado', 'Evolução contínua.'];

    if (reduceMotion) {
      el.textContent = 'Código, aprendizado e evolução contínua.';
      return;
    }

    let index = 0;
    setInterval(() => {
      el.classList.add('is-out');
      setTimeout(() => {
        index = (index + 1) % words.length;
        el.textContent = words[index];
        el.classList.remove('is-out');
        el.classList.add('is-in-start');
        void el.offsetWidth; // força reflow antes de tirar a transição
        el.classList.remove('is-in-start');
      }, 450);
    }, 2200);
  };

  const finish = () => {
    preloader.classList.add('is-done');
    body.classList.remove('no-scroll');
    body.classList.add('is-ready');
    setTimeout(() => preloader.remove(), 600);
    startKickerRotator();
  };

  if (!preloader) return;

  if (reduceMotion) {
    finish();
    return;
  }

  body.classList.add('no-scroll');

  // 1) nome escrito + barra carregando
  requestAnimationFrame(() => {
    preloader.classList.add('is-loading');
    barFill.style.width = '100%';
  });

  // 2) ao concluir a barra, apaga o nome da esquerda para a direita
  setTimeout(() => {
    preloader.classList.add('is-erasing');
  }, 1900);

  // 3) ponto gira e voa até a posição exata do ponto no logo do header
  setTimeout(() => {
    const from = plDot.getBoundingClientRect();
    const to = logoDot.getBoundingClientRect();

    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    const scale = (to.height / from.height) || 1;

    preloader.style.setProperty(
      '--fly-transform',
      `translate(${dx}px, ${dy}px) scale(${scale}) rotate(360deg)`
    );
    preloader.classList.add('is-flying');
  }, 2650);

  // 4) o ponto "pousa" exatamente sobre o do header e some, revelando o site
  setTimeout(() => {
    preloader.classList.add('is-landed');
    finish();
  }, 3450);
})();

const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Menu mobile =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Revelar seções ao rolar =====
// ===== Mostrar todos os projetos =====
const showAllProjectsButton = document.getElementById('showAllProjects');
const projectGrid = document.querySelector('.project-grid');

if (showAllProjectsButton && projectGrid) {
  showAllProjectsButton.addEventListener('click', () => {
    projectGrid.classList.add('show-all');
    showAllProjectsButton.setAttribute('aria-expanded', 'true');
    showAllProjectsButton.parentElement.hidden = true;
  });
}

const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ===== Formulário de contato (Formspree) =====
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formNote.textContent = 'Enviando...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      formNote.textContent = 'Mensagem enviada — retorno em breve!';
      form.reset();
    } else {
      formNote.textContent = 'Não deu pra enviar agora. Tenta de novo ou manda um email direto.';
    }
  } catch (err) {
    formNote.textContent = 'Não deu pra enviar agora. Tenta de novo ou manda um email direto.';
  }
});