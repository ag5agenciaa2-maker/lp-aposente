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

// ====== FAQ INTERATIVO ======
(function initFAQ() {
  const items = document.querySelectorAll('.faq-big-item');
  const resp  = document.getElementById('faqResp');
  if (!items.length || !resp) return;

  const p = resp.querySelector('p');

  function activate(item) {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    resp.classList.add('changing');
    setTimeout(() => {
      p.textContent = item.dataset.answer || '';
      resp.classList.remove('changing');
    }, 220);
  }

  // Inicializa com primeiro item
  activate(items[0]);

  items.forEach(item => {
    item.addEventListener('click', () => activate(item));
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 900) activate(item);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(item); }
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

// ====== VDEP CAROUSEL ======
(function initVdepCarousel() {
  const wrap  = document.querySelector('.vdep-track-wrap');
  const track = document.getElementById('vdepTrack');
  const prev  = document.getElementById('vdepPrev');
  const next  = document.getElementById('vdepNext');
  const curEl = document.getElementById('vdepCur');
  const totEl = document.getElementById('vdepTot');

  if (!wrap || !track) return;

  const cards = Array.from(track.querySelectorAll('.vdep-card'));
  let current = 0;

  if (totEl) totEl.textContent = String(cards.length).padStart(2, '0');

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    const card = cards[current];
    const offset = card.offsetLeft - (wrap.offsetWidth / 2) + (card.offsetWidth / 2);
    wrap.scrollTo({ left: offset, behavior: 'smooth' });
    setActive(current);
  }

  function setActive(index) {
    cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
    if (curEl) curEl.textContent = String(index + 1).padStart(2, '0');
  }

  // Detecta card mais centrado após scroll
  let ticking = false;
  wrap.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const center = wrap.scrollLeft + wrap.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== current) setActive(closest);
      current = closest;
      ticking = false;
    });
  }, { passive: true });

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Inicializa
  setActive(0);
})();

// ====== VIDEO MODAL — .video-card (seção de conteúdo) ======
(function initVideoModal() {
  const modal    = document.getElementById('videoModal');
  const player   = document.getElementById('videoModalPlayer');
  const closeBtn = document.getElementById('videoModalClose');
  const cards    = document.querySelectorAll('.video-card');

  if (!modal) return;

  function isYouTubeId(val) {
    return val && !val.includes('/') && !val.includes('.');
  }

  function openModal(src) {
    player.innerHTML = '';
    if (isYouTubeId(src)) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${src}?autoplay=1&rel=0&playsinline=1`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = 'Depoimento em vídeo';
      iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:12px;';
      player.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.style.cssText = 'width:100%;height:100%;border-radius:12px;';
      player.appendChild(video);
      video.play().catch(() => {});
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    player.innerHTML = '';
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.video;
      if (src) openModal(src);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
})();

// ====== VDEP — play inline + controles ======
(function initVdepInlinePlay() {
  document.querySelectorAll('.vdep-card').forEach(card => {
    const playBtn   = card.querySelector('.vdep-play');
    const muteBtn   = card.querySelector('.vdep-ctrl--mute');
    const expandBtn = card.querySelector('.vdep-ctrl--expand');
    const thumb     = card.querySelector('.vdep-thumb');
    if (!playBtn || !thumb) return;

    let iframe = null;
    let muted  = true; // YouTube autoplay exige mudo — começa mudo

    // ── Play ──
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('vdep-playing')) return;

      const src = card.dataset.video;
      if (!src) return;

      iframe = document.createElement('iframe');
      // mute=1 para autoplay funcionar; enablejsapi=1 para postMessage
      iframe.src = `https://www.youtube.com/embed/${src}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1&fs=0&iv_load_policy=3&disablekb=1`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.title = 'Depoimento em vídeo';
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;z-index:10;border-radius:22px;';

      thumb.appendChild(iframe);
      card.classList.add('vdep-playing');
      // inicia mudo — ícone mudo visível por padrão via CSS
    });

    // ── Mudo / Som ──
    muteBtn && muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!iframe) return;

      muted = !muted;
      const cmd = muted ? 'mute' : 'unMute';
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: cmd, args: [] }),
        '*'
      );
      card.classList.toggle('vdep-sound', !muted);
    });

    // ── Expandir → abre modal 9:16 premium com som ──
    expandBtn && expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = card.dataset.video;
      if (!src) return;

      const modal  = document.getElementById('videoModal');
      const player = document.getElementById('videoModalPlayer');
      if (!modal || !player) return;

      player.innerHTML = '';
      const iframeModal = document.createElement('iframe');
      iframeModal.src = `https://www.youtube.com/embed/${src}?autoplay=1&mute=0&controls=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1&fs=0&iv_load_policy=3&disablekb=1`;
      iframeModal.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframeModal.allowFullscreen = true;
      iframeModal.title = 'Depoimento em vídeo';
      iframeModal.style.cssText = 'width:100%;height:100%;border:none;border-radius:20px;';
      player.appendChild(iframeModal);

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
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
