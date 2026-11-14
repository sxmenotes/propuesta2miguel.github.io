import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ============================================================================
 * CONFIGURACIÓN PRINCIPAL - FALDEOS LA LAJUELA
 * Cambia el número de WhatsApp en la constante WHATSAPP_NUMBER (solo dígitos,
 * incluyendo código de país 569...). Se actualizará en toda la página.
 * ============================================================================
 */
const WHATSAPP_NUMBER = "56900000000";

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatDateCL(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function addDaysISO(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + Number(days));
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function calcNights(llegada, salida) {
  if (!llegada || !salida) return 0;
  const d1 = new Date(`${llegada}T00:00:00`);
  const d2 = new Date(`${salida}T00:00:00`);
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function buildWhatsAppUrl(text) {
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/* --------------------------------------------------------------------------
   1. ENLACES DIRECTOS DE WHATSAPP Y AÑO ACTUAL
   -------------------------------------------------------------------------- */
function initDirectWhatsAppLinks() {
  const defaultMsg =
    'Hola Faldeos La Lajuela, quisiera consultar disponibilidad y tarifas de las cabañas para una estadía.';
  const url = buildWhatsAppUrl(defaultMsg);

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.setAttribute('href', url);
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/* --------------------------------------------------------------------------
   2. HEADER STICKY Y MENÚ MÓVIL
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('[data-header]');
  const toggleBtn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (!toggleBtn || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    if (header) header.classList.remove('nav-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    if (header) header.classList.toggle('nav-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));

    if (isOpen && !prefersReducedMotion) {
      const links = menu.querySelectorAll('a');
      gsap.fromTo(
        links,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.28, stagger: 0.035, ease: 'power2.out', overwrite: true }
      );
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   3. GALERÍA INTERACTIVA (FILTRO CON GSAP + LIGHTBOX)
   -------------------------------------------------------------------------- */
function initGallery() {
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const groups = document.querySelectorAll('[data-gallery-group]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-gallery-filter');

      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      groups.forEach((group) => {
        const groupName = group.getAttribute('data-gallery-group');
        const show = target === 'all' || target === groupName;
        group.hidden = !show;

        if (show && !prefersReducedMotion) {
          const items = group.querySelectorAll('figure, .gallery-card, .gallery-item, .photo-tile');
          gsap.fromTo(
            items,
            { opacity: 0, y: 18, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.42,
              stagger: 0.06,
              ease: 'power3.out',
              clearProps: 'transform'
            }
          );
        }
      });

      ScrollTrigger.refresh();
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (src, alt, captionText) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Fotografía de Faldeos La Lajuela';
    if (lightboxCaption) lightboxCaption.textContent = captionText || alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion) {
      gsap.fromTo(
        lightboxImg,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-lightbox-src]').forEach((item) => {
    const trigger = () => {
      const src = item.getAttribute('data-lightbox-src');
      const img = item.querySelector('img');
      const cap = item.querySelector('figcaption');
      openLightbox(
        src,
        img ? img.alt : '',
        cap ? cap.textContent.replace(/\s+/g, ' ').trim() : ''
      );
    };

    item.addEventListener('click', trigger);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   4. SISTEMA DE RESERVAS (BARRA HERO + SERVICIOS + FORMULARIO CONTACTO)
   -------------------------------------------------------------------------- */
function initBookingSystem() {
  const formHero = document.getElementById('form-hero');
  const heroLlegada = document.getElementById('hero-llegada');
  const heroNoches = document.getElementById('hero-noches');
  const heroPersonas = document.getElementById('hero-personas');
  const heroStatus = document.getElementById('hero-bar-status');

  const formContacto = document.getElementById('form-contacto');
  const inputNombre = document.getElementById('nombre');
  const inputPersonas = document.getElementById('personas');
  const inputLlegada = document.getElementById('llegada');
  const inputSalida = document.getElementById('salida');
  const inputMensaje = document.getElementById('mensaje');
  const staySummary = document.getElementById('stay-summary');
  const waPreview = document.getElementById('wa-preview-text');
  const formStatus = formContacto ? formContacto.querySelector('.form-status') : null;

  const chipBtns = document.querySelectorAll('.chip-btn[data-service]');
  const serviceToggleBtns = document.querySelectorAll('[data-add-service]');
  const selectedServices = new Set();

  const todayISO = new Date().toISOString().split('T')[0];
  if (heroLlegada) heroLlegada.min = todayISO;
  if (inputLlegada) inputLlegada.min = todayISO;
  if (inputSalida) inputSalida.min = todayISO;

  function syncServicesUI(changedService) {
    chipBtns.forEach((chip) => {
      const s = chip.getAttribute('data-service');
      const active = selectedServices.has(s);
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
      if (s === changedService && !prefersReducedMotion) {
        gsap.fromTo(chip, { scale: 1.06 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }
    });

    serviceToggleBtns.forEach((btn) => {
      const s = btn.getAttribute('data-add-service');
      const active = selectedServices.has(s);
      btn.classList.toggle('is-added', active);
      btn.setAttribute('aria-pressed', String(active));
      btn.textContent = active ? '✓ Sumado a tu consulta' : '+ Sumar a mi consulta';
      if (s === changedService && !prefersReducedMotion) {
        gsap.fromTo(btn, { scale: 1.05 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }
    });

    updateLiveSummaryAndPreview();
  }

  chipBtns.forEach((chip) => {
    chip.addEventListener('click', () => {
      const s = chip.getAttribute('data-service');
      if (!s) return;
      if (selectedServices.has(s)) selectedServices.delete(s);
      else selectedServices.add(s);
      syncServicesUI(s);
    });
  });

  serviceToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = btn.getAttribute('data-add-service');
      if (!s) return;
      if (selectedServices.has(s)) selectedServices.delete(s);
      else selectedServices.add(s);
      syncServicesUI(s);
    });
  });

  function buildFullReservationMessage() {
    const nombre = inputNombre ? inputNombre.value.trim() : '';
    const personas = inputPersonas ? inputPersonas.value.trim() : '';
    const llegada = inputLlegada ? inputLlegada.value : '';
    const salida = inputSalida ? inputSalida.value : '';
    const mensaje = inputMensaje ? inputMensaje.value.trim() : '';
    const noches = calcNights(llegada, salida);
    const serviciosArr = Array.from(selectedServices);

    const lines = [
      'Hola Faldeos La Lajuela, quiero consultar disponibilidad para reservar una cabaña:',
      '',
      `• *Nombre:* ${nombre || '[Por completar]'}`,
      `• *Cantidad de personas:* ${personas || '[Por completar]'}`,
      `• *Fecha de llegada:* ${llegada ? formatDateCL(llegada) : '[Por completar]'}`,
      `• *Fecha de salida:* ${salida ? formatDateCL(salida) : '[Por completar]'}`
    ];

    if (noches > 0) {
      lines.push(
        `• *Estadía estimada:* Del ${formatDateCL(llegada)} al ${formatDateCL(salida)} (${noches} ${
          noches === 1 ? 'noche' : 'noches'
        })`
      );
    }

    if (serviciosArr.length > 0) {
      lines.push(`• *Servicios adicionales de interés:* ${serviciosArr.join(', ')}`);
    }

    if (mensaje) {
      lines.push(`• *Consulta adicional:* ${mensaje}`);
    }

    lines.push('', 'Quedo atento(a) a la disponibilidad y tarifas directas. ¡Muchas gracias!');
    return lines.join('\n');
  }

  function updateLiveSummaryAndPreview() {
    if (staySummary && inputLlegada && inputSalida) {
      const l = inputLlegada.value;
      const s = inputSalida.value;
      const noches = calcNights(l, s);
      if (noches > 0) {
        staySummary.hidden = false;
        staySummary.textContent = `Estadía estimada: ${noches} ${
          noches === 1 ? 'noche' : 'noches'
        } · Del ${formatDateCL(l)} al ${formatDateCL(s)}`;
      } else {
        staySummary.hidden = true;
        staySummary.textContent = '';
      }
    }

    if (waPreview) {
      waPreview.textContent = buildFullReservationMessage();
    }
  }

  function syncHeroToMainForm() {
    if (!heroLlegada || !inputLlegada) return;
    const llegadaVal = heroLlegada.value;
    const nochesVal = heroNoches ? Number(heroNoches.value) || 2 : 2;
    const personasVal = heroPersonas ? heroPersonas.value : '2';

    if (inputPersonas && personasVal) {
      inputPersonas.value = personasVal;
    }

    if (llegadaVal) {
      inputLlegada.value = llegadaVal;
      if (inputSalida) {
        inputSalida.value = addDaysISO(llegadaVal, nochesVal);
      }
    }

    updateLiveSummaryAndPreview();
  }

  document.querySelectorAll('.qb-more').forEach((link) => {
    link.addEventListener('click', () => {
      syncHeroToMainForm();
    });
  });

  if (formHero) {
    formHero.addEventListener('submit', (e) => {
      e.preventDefault();
      const llegadaVal = heroLlegada ? heroLlegada.value : '';
      const nochesVal = heroNoches ? Number(heroNoches.value) || 1 : 2;
      const personasVal = heroPersonas ? Number(heroPersonas.value) || 2 : 2;

      if (!llegadaVal) {
        if (heroStatus) {
          heroStatus.textContent = 'Por favor selecciona tu fecha estimada de llegada para consultar.';
        }
        if (heroLlegada) heroLlegada.focus();
        return;
      }

      if ( nochesVal < 1 ) {
        if (heroStatus) {
          heroStatus.textContent = 'Indica al menos 1 noche de estadía.';
        }
        return;
      }

      const salidaISO = addDaysISO(llegadaVal, nochesVal);
      const quickLines = [
        'Hola Faldeos La Lajuela, quisiera consultar disponibilidad de cabaña:',
        '',
        `• *Fecha de llegada:* ${formatDateCL(llegadaVal)}`,
        `• *Estadía:* ${nochesVal} ${nochesVal === 1 ? 'noche' : 'noches'} (salida estimada ${formatDateCL(salidaISO)})`,
        `• *Cantidad de personas:* ${personasVal}`,
        '',
        '¿Tienen disponibilidad y tarifa directa para esas fechas?'
      ];

      const waUrl = buildWhatsAppUrl(quickLines.join('\n'));
      if (heroStatus) {
        heroStatus.innerHTML = `Redirigiendo a WhatsApp... <a class="wa-fallback" href="${waUrl}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp manualmente</a>`;
      }

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (formContacto) {
    [inputNombre, inputPersonas, inputLlegada, inputSalida, inputMensaje].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => {
        clearFieldError(el);
        updateLiveSummaryAndPreview();
      });
      el.addEventListener('change', () => {
        clearFieldError(el);
        if (el === inputLlegada && inputSalida && inputLlegada.value) {
          inputSalida.min = inputLlegada.value;
          if (inputSalida.value && inputSalida.value <= inputLlegada.value) {
            inputSalida.value = addDaysISO(inputLlegada.value, 2);
          }
        }
        updateLiveSummaryAndPreview();
      });
    });

    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nombre = inputNombre ? inputNombre.value.trim() : '';
      const personas = inputPersonas ? Number(inputPersonas.value) : 0;
      const llegada = inputLlegada ? inputLlegada.value : '';
      const salida = inputSalida ? inputSalida.value : '';

      if (!nombre || nombre.length < 2) {
        setFieldError(inputNombre, 'error-nombre', 'Ingresa tu nombre completo.');
        isValid = false;
      }

      if (!personas || personas < 1 || personas > 30) {
        setFieldError(inputPersonas, 'error-personas', 'Ingresa una cantidad válida de huéspedes (mínimo 1).');
        isValid = false;
      }

      if (!llegada) {
        setFieldError(inputLlegada, 'error-llegada', 'Selecciona la fecha estimada de llegada.');
        isValid = false;
      }

      if (!salida) {
        setFieldError(inputSalida, 'error-salida', 'Selecciona la fecha estimada de salida.');
        isValid = false;
      } else if (llegada && salida <= llegada) {
        setFieldError(inputSalida, 'error-salida', 'La fecha de salida debe ser posterior a la fecha de llegada.');
        isValid = false;
      }

      if (!isValid) {
        if (formStatus) {
          formStatus.textContent = 'Por favor revisa los campos destacados antes de enviar.';
        }
        const firstInvalid = formContacto.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const fullMsg = buildFullReservationMessage();
      const waUrl = buildWhatsAppUrl(fullMsg);
      if (formStatus) {
        formStatus.innerHTML = `¡Listo! Abriendo WhatsApp... <a class="wa-fallback" href="${waUrl}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp directo</a>`;
      }

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  updateLiveSummaryAndPreview();
}

function setFieldError(inputEl, errorId, message) {
  if (inputEl) {
    inputEl.classList.add('is-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
  }
  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.textContent = message;
  }
}

function clearFieldError(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove('is-invalid');
  inputEl.removeAttribute('aria-invalid');
  const errId = inputEl.getAttribute('aria-describedby');
  if (errId) {
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  }
}

/* --------------------------------------------------------------------------
   5. COREOGRAFÍA DE ANIMACIONES CON GSAP + SCROLLTRIGGER
   -------------------------------------------------------------------------- */
function initGSAPAnimations() {
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // 1. Hero Entrance Choreography
  const heroTitle = document.getElementById('hero-title');
  const heroSub = document.querySelector('.hero-sub');
  const heroActions = document.querySelector('.hero-actions');
  const heroBookingBar = document.querySelector('.hero-booking-bar');
  const inlinePills = document.querySelectorAll('.inline-photo-pill');

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (heroTitle) {
    heroTl.fromTo(
      heroTitle,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.75, clearProps: 'transform' }
    );
  }

  if (inlinePills.length > 0) {
    heroTl.fromTo(
      inlinePills,
      { scale: 0.75, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'back.out(1.8)', clearProps: 'transform' },
      '-=0.45'
    );
  }

  if (heroSub) {
    heroTl.fromTo(
      heroSub,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, clearProps: 'transform' },
      '-=0.4'
    );
  }

  if (heroActions) {
    heroTl.fromTo(
      heroActions,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform' },
      '-=0.35'
    );
  }

  if (heroBookingBar) {
    heroTl.fromTo(
      heroBookingBar,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.65, clearProps: 'transform' },
      '-=0.3'
    );
  }

  // 2. ScrollTrigger Reveals for [data-reveal]
  revealEls.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
             overwrite: 'auto',
            clearProps: 'transform'
          }
        );
      }
    });
  });

  // 3. Subtle Image Parallax for [data-parallax]
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // 4. Perpetual Micro-Motion for [data-float]
  const floatEls = document.querySelectorAll('[data-float]');
  if (floatEls.length > 0) {
    gsap.to(floatEls, {
      y: -5,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3
    });
  }
}

function initStaticStockFotosFallback() {
  document.querySelectorAll('img[src^="./stock-fotos/"]').forEach((img) => {
    const swapToParent = () => {
      const current = img.getAttribute('src');
      if (current && current.startsWith('./stock-fotos/')) {
        img.setAttribute('src', current.replace('./stock-fotos/', '../stock-fotos/'));
      }
    };
    img.addEventListener('error', swapToParent, { once: true });
    if (img.complete && img.naturalWidth === 0) {
      swapToParent();
    }
  });
}

function boot() {
  initStaticStockFotosFallback();
  initDirectWhatsAppLinks();
  initNavigation();
  initGallery();
  initBookingSystem();
  initGSAPAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
