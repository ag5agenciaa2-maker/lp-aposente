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

  // spotlight nos svc-cards
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--cx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--cy', `${((e.clientY - r.top) / r.height) * 100}%`);
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

  if (!wrap || !track) return;

  const cards   = Array.from(track.querySelectorAll('.vdep-card'));
  const dotsEl  = document.getElementById('vdepDots');
  let current   = 0;

  // Gera dots
  const dots = cards.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'vdep-dot';
    btn.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    btn.addEventListener('click', () => { stopPlayingCards(); goTo(i); });
    dotsEl && dotsEl.appendChild(btn);
    return btn;
  });

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    const card = cards[current];
    const offset = card.offsetLeft - (wrap.offsetWidth / 2) + (card.offsetWidth / 2);
    wrap.scrollTo({ left: offset, behavior: 'smooth' });
    setActive(current);
  }

  function setActive(index) {
    cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
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

  function stopPlayingCards() {
    document.querySelectorAll('.vdep-card.vdep-playing').forEach(card => {
      const v = card.querySelector('video[data-inline]');
      if (v) { v.pause(); v.remove(); }
      card.classList.remove('vdep-playing', 'vdep-sound', 'vdep-paused');
    });
  }

  prev.addEventListener('click', () => { stopPlayingCards(); goTo(current - 1); });
  next.addEventListener('click', () => { stopPlayingCards(); goTo(current + 1); });

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

  closeBtn && closeBtn.addEventListener('click', closeModal);
  document.getElementById('videoModalBackdrop')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
})();

// ====== VDEP — pausa vídeo em play ao sair da seção ======
const vdepSection = document.getElementById('videos-depoimentos');
if (vdepSection) {
  const vdepSectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) return;
      document.querySelectorAll('.vdep-card.vdep-playing').forEach(card => {
        const v = card.querySelector('video[data-inline]');
        if (v) { v.pause(); v.remove(); }
        card.classList.remove('vdep-playing', 'vdep-sound');
      });
    });
  }, { threshold: 0.1 });
  vdepSectionObs.observe(vdepSection);
}

// ====== VDEP — força primeiro frame como thumbnail ======
document.querySelectorAll('.vdep-thumb-video').forEach(v => {
  v.addEventListener('loadedmetadata', () => {
    v.currentTime = parseFloat(v.dataset.thumbTime ?? 0.1);
  });
});

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

    // ── Play / Pause toggle ──
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Se já está tocando → toggle pausa
      if (card.classList.contains('vdep-playing')) {
        if (!iframe) return;
        if (iframe.paused) {
          iframe.play();
          card.classList.remove('vdep-paused');
        } else {
          iframe.pause();
          card.classList.add('vdep-paused');
        }
        return;
      }

      const src = card.dataset.video;
      if (!src) return;

      // Pausa todos os outros cards
      document.querySelectorAll('.vdep-card.vdep-playing').forEach(other => {
        if (other === card) return;
        const v = other.querySelector('video[data-inline]');
        if (v) { v.pause(); v.remove(); }
        other.classList.remove('vdep-playing', 'vdep-sound', 'vdep-paused');
      });

      const video = document.createElement('video');
      video.src = src;
      video.setAttribute('data-inline', '');
      video.muted = true;
      video.autoplay = true;
      video.playsinline = true;
      video.loop = false;
      video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:10;border-radius:22px;background:#000;';
      thumb.appendChild(video);
      video.play();
      iframe = video;

      card.classList.add('vdep-playing');
    });

    // ── Mudo / Som ──
    muteBtn && muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!iframe) return;
      muted = !muted;
      iframe.muted = muted;
      card.classList.toggle('vdep-sound', !muted);
    });

    // ── Expandir → abre modal com o vídeo com som ──
    expandBtn && expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = card.dataset.video;
      if (!src) return;

      const modal  = document.getElementById('videoModal');
      const player = document.getElementById('videoModalPlayer');
      if (!modal || !player) return;

      player.innerHTML = '';
      const videoModal = document.createElement('video');
      videoModal.src = src;
      videoModal.autoplay = true;
      videoModal.controls = true;
      videoModal.playsinline = true;
      videoModal.style.cssText = 'width:100%;height:100%;border-radius:20px;background:#000;object-fit:contain;';
      player.appendChild(videoModal);

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
})();

// ====== VÍDEOS EDUCATIVOS ======
(function initEduVideos() {
  const items    = document.querySelectorAll('.edu-item[data-src]');
  const video    = document.getElementById('eduVideo');
  const phone    = video ? video.closest('.edu-phone') : null;
  const playBtn  = document.getElementById('eduPlayBtn');
  const tagEl    = document.getElementById('eduTag');
  const titleEl  = document.getElementById('eduMetaTitle');

  if (!items.length || !video || !phone) return;

  function select(item) {
    items.forEach(i => i.classList.remove('is-active'));
    item.classList.add('is-active');

    const src   = item.dataset.src;
    const tag   = item.dataset.tag   || '';
    const title = item.dataset.title || '';

    // atualiza meta
    if (tagEl)   tagEl.textContent   = tag;
    if (titleEl) titleEl.textContent = title;

    // troca fonte mas não toca automaticamente
    video.pause();
    phone.classList.remove('is-playing');
    video.src = src;
    video.load();
  }

  // clique na lista
  items.forEach(item => item.addEventListener('click', () => select(item)));

  // botão play: toggle pause/play
  playBtn && playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
      phone.classList.add('is-playing');
    } else {
      video.pause();
      phone.classList.remove('is-playing');
    }
  });

  video.addEventListener('ended', () => phone.classList.remove('is-playing'));

  // pausa ao sair da seção
  const section = document.getElementById('videos-educativos');
  if (section) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) {
        video.pause();
        video.currentTime = 0;
        phone.classList.remove('is-playing');
      }
    }, { threshold: 0 }).observe(section);
  }

  // ── botão mute ──
  const muteBtn   = document.getElementById('eduMuteBtn');
  const iconSound = muteBtn && muteBtn.querySelector('.edu-icon-sound');
  const iconMuted = muteBtn && muteBtn.querySelector('.edu-icon-muted');

  muteBtn && muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (iconSound) iconSound.style.display = video.muted ? 'none'  : '';
    if (iconMuted) iconMuted.style.display = video.muted ? ''      : 'none';
  });

  // ── modal premium ──
  const modal = document.createElement('div');
  modal.id = 'eduModal';
  modal.innerHTML = `
    <div class="edu-modal-backdrop"></div>
    <div class="edu-modal-inner">
      <video class="edu-modal-video" id="eduModalVideo" playsinline></video>
      <div class="edu-modal-controls">
        <button class="edu-modal-ctrl" id="eduModalMute" aria-label="Som">
          <svg class="edu-icon-sound" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          <svg class="edu-icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        </button>
        <button class="edu-modal-ctrl" id="eduModalClose" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalVideo  = document.getElementById('eduModalVideo');
  const modalClose  = document.getElementById('eduModalClose');
  const modalMute   = document.getElementById('eduModalMute');
  const modalSoundI = modalMute.querySelector('.edu-icon-sound');
  const modalMutedI = modalMute.querySelector('.edu-icon-muted');

  function openModal() {
    if (!video.src) return;
    modalVideo.src      = video.src;
    modalVideo.muted    = video.muted;
    modalVideo.currentTime = video.currentTime;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalVideo.play().catch(() => {});
    updateModalMuteIcon();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideo.src = '';
  }

  function updateModalMuteIcon() {
    modalSoundI.style.display = modalVideo.muted ? 'none' : '';
    modalMutedI.style.display = modalVideo.muted ? ''     : 'none';
  }

  modalMute.addEventListener('click', () => {
    modalVideo.muted = !modalVideo.muted;
    updateModalMuteIcon();
  });

  modalClose.addEventListener('click', closeModal);
  modal.querySelector('.edu-modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const fullBtn = document.getElementById('eduFullBtn');
  fullBtn && fullBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });

  // inicia com o primeiro item
  select(items[0]);
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

/* ====== VÍDEOS INSTITUCIONAIS — pausa ao sair da seção ====== */
const viSection = document.getElementById('videos-institucionais');
if (viSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) return;
      document.querySelectorAll('.vi-card-video-wrap').forEach(wrap => {
        const v = wrap.querySelector('.vi-player');
        if (v) { v.pause(); v.currentTime = 0; }
        wrap.classList.remove('is-playing');
      });
    });
  }, { threshold: 0.2 }).observe(viSection);
}

/* ====== VÍDEOS INSTITUCIONAIS — overlay play + controles ====== */
document.querySelectorAll('.vi-card-video-wrap').forEach((wrap) => {
  const video   = wrap.querySelector('.vi-player');
  const playBtn = wrap.querySelector('.vi-play-btn');
  const muteBtn = wrap.querySelector('.vi-mute-btn');
  const fsBtn   = wrap.querySelector('.vi-fullscreen-btn');
  const iconSound = wrap.querySelector('.vi-icon-sound');
  const iconMuted = wrap.querySelector('.vi-icon-muted');

  // Play / Pause toggle
  playBtn.addEventListener('click', () => {
    if (wrap.classList.contains('is-playing')) {
      video.pause();
      return;
    }
    document.querySelectorAll('.vi-card-video-wrap').forEach(other => {
      if (other === wrap) return;
      const v = other.querySelector('.vi-player');
      if (v) { v.pause(); v.currentTime = 0; }
      other.classList.remove('is-playing');
    });
    wrap.classList.add('is-playing');
    video.play();
  });

  video.addEventListener('pause', () => wrap.classList.remove('is-playing'));
  video.addEventListener('ended', () => wrap.classList.remove('is-playing'));

  // Som
  muteBtn && muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    iconSound.style.display = video.muted ? 'none' : '';
    iconMuted.style.display = video.muted ? ''     : 'none';
  });

  // Expandir → modal premium 9:16
  fsBtn && fsBtn.addEventListener('click', () => {
    const modal  = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    if (!modal || !player) return;

    const currentTime = video.currentTime;
    const isMuted     = video.muted;

    player.innerHTML = '';
    const clone = document.createElement('video');
    clone.src         = video.src;
    clone.currentTime = currentTime;
    clone.muted       = isMuted;
    clone.autoplay    = true;
    clone.controls    = true;
    clone.playsinline = true;
    player.appendChild(clone);

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

