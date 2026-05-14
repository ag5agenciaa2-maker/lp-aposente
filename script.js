/**
 * APOSENTE CAMPO GRANDE — script.js
 * JavaScript Vanilla ES6+
 * Sem frameworks ou bibliotecas externas
 */

// ====== INTERSECTION OBSERVER — Scroll Reveal ======
(function initReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px' });

  revealElements.forEach(el => observer.observe(el));
})();

// ====== STAGGER REVEAL ======
(function initStaggerReveal() {
  const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');

  staggerContainers.forEach(container => {
    const delay = parseInt(container.dataset.stagger) || 100;
    const children = container.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(children).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    children.forEach(child => observer.observe(child));
  });
})();

// ====== NAVBAR SCROLL BEHAVIOR ======
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navbarToggle');
  const drawer = document.getElementById('mobileMenu');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const currentY = window.scrollY;

    if (currentY > 80) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    if (currentY > lastScrollY && currentY > 200) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  function openDrawer() {
    drawer.classList.add('drawer--open');
    overlay.classList.add('drawer-overlay--visible');
    toggle.classList.add('navbar-toggle--active');
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('drawer--open');
    overlay.classList.remove('drawer-overlay--visible');
    toggle.classList.remove('navbar-toggle--active');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    drawer.classList.contains('drawer--open') ? closeDrawer() : openDrawer();
  });

  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close on link click
  drawer.querySelectorAll('.drawer-link, .drawer-logo').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('drawer--open')) closeDrawer();
  });
})();

// ====== SMOOTH SCROLL ======
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Also handle data-scroll links
  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();

// ====== DEPOIMENTOS CAROUSEL ======
(function initCarousel() {
  const slides = document.querySelectorAll('.depoimento-slide');
  const dotsContainer = document.getElementById('depoimentoDots');
  const prevBtn = document.getElementById('depoimentoPrev');
  const nextBtn = document.getElementById('depoimentoNext');
  const carousel = document.getElementById('depoimentosCarousel');

  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;
  let isPlaying = true;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'depoimento-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.depoimento-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    if (isPlaying) startAutoplay();
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Pause on hover
  carousel.addEventListener('mouseenter', () => {
    isPlaying = false;
    stopAutoplay();
  });

  carousel.addEventListener('mouseleave', () => {
    isPlaying = true;
    startAutoplay();
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  startAutoplay();
})();

// ====== FAQ ACCORDION ======
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (optional - remove if you want multiple open)
      items.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ====== SPOTLIGHT EFFECT ======
(function initSpotlight() {
  const cards = document.querySelectorAll('[data-spotlight]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();

// ====== COUNTER ANIMATION ======
(function initCounters() {
  const counters = document.querySelectorAll('.counter-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));

  function animateCounter(el, target, suffix) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
})();

// ====== FORM — WhatsApp Redirect ======
(function initForm() {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  // Máscara de telefone
  const phoneInput = document.getElementById('telefone');
  phoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    e.target.value = v;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    const nome     = document.getElementById('nome');
    const email    = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const beneficio = document.getElementById('beneficio');
    const mensagem = document.getElementById('mensagem');

    if (!nome.value.trim() || nome.value.trim().length < 3) {
      showError(nome, 'nomeError', 'Nome deve ter pelo menos 3 caracteres');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, 'emailError', 'Informe um e-mail válido');
      isValid = false;
    }

    const phoneDigits = telefone.value.replace(/\D/g, '');
    if (!/^[1-9]{2}[2-9][0-9]{8}$/.test(phoneDigits)) {
      showError(telefone, 'telefoneError', 'Informe um telefone válido com DDD');
      isValid = false;
    }

    if (!beneficio.value) {
      showError(beneficio, 'beneficioError', 'Selecione um benefício');
      isValid = false;
    }

    if (!isValid) return;

    // Monta mensagem formatada
    const situacao = mensagem.value.trim();
    let texto = `Olá, me chamo ${nome.value.trim()}, vim através do site e gostaria de uma informação.\n\n`;
    texto += `- E-mail: ${email.value.trim()}\n`;
    texto += `- Telefone: ${telefone.value.trim()}\n`;
    texto += `- Benefício de interesse: ${beneficio.value}`;
    if (situacao) texto += `\n- Situação do caso: ${situacao}`;

    const url = `https://wa.me/5521971168856?text=${encodeURIComponent(texto)}`;

    // Feedback visual antes de redirecionar
    form.classList.add('hidden');
    successMsg.classList.remove('hidden');
    setTimeout(() => { window.open(url, '_blank'); }, 600);
  });

  function showError(input, errorId, message) {
    input.classList.add('error');
    document.getElementById(errorId).textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(e => e.textContent = '');
  }

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const err = document.getElementById(input.id + 'Error');
      if (err) err.textContent = '';
    });
  });
})();

// ====== VIDEO MODAL ======
(function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalVideo');
  const closeBtn = document.getElementById('videoModalClose');
  const cards = document.querySelectorAll('.video-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.video;
      if (src) {
        video.src = src;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        video.play().catch(() => {});
      }
    });
  });

  function closeModal() {
    modal.hidden = true;
    video.pause();
    video.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

// ====== DOR/SOLUÇÃO LINE ANIMATION ======
(function initDorLine() {
  const line = document.querySelector('.dor-solucao-line');
  if (!line) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.classList.add('visible');
        observer.unobserve(line);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(line);
})();

// ====== HERO ANIMATIONS (fallback for JS-triggered) ======
(function initHeroAnimations() {
  const heroElements = document.querySelectorAll('[data-animate]');
  heroElements.forEach(el => {
    el.style.willChange = 'opacity, transform, clip-path';
    setTimeout(() => { el.style.willChange = 'auto'; }, 2000);
  });
})();

// ====== WHATSAPP PREMIUM (AG5 V2) ======
(function initWaPremium() {
  const bubble   = document.getElementById('wa-message-bubble');
  const typing   = document.getElementById('wa-typing');
  const realMsg  = document.getElementById('wa-real-message');
  const badge    = document.getElementById('wa-notification');
  const closeBtn = document.getElementById('wa-close-btn');
  const mainBtn  = document.getElementById('wa-main-btn');

  if (!bubble) return;

  // Exibe o balão após 6 s, mostra mensagem real após mais 2,5 s de "digitação"
  setTimeout(() => {
    bubble.classList.add('show');
    setTimeout(() => {
      if (typing) typing.style.display = 'none';
      if (realMsg) realMsg.style.display = 'block';
    }, 2500);
  }, 6000);

  // Fechar balão → badge aparece após 2 s para manter engajamento
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bubble.classList.remove('show');
    setTimeout(() => { badge.classList.add('show'); }, 2000);
  });

  // Clicar no botão principal remove tudo
  mainBtn.addEventListener('click', () => {
    bubble.classList.remove('show');
    badge.classList.remove('show');
  });
})();
