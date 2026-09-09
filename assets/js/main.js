/**
 * Grupo Cafetero Armar S.A. de C.V. - JavaScript Principal
 * Ubicación: Huatusco, Veracruz, México
 */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initMobileMenu();
  initHeaderScrollEffect();
  initActiveNavObserver();
  initFormspreeHandler();
  initFaqAccordion();
  initLightbox();
  initDynamicContentLoader();
});

/**
 * Control del Menú Móvil
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('mobile-menu-overlay');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    if (menuOverlay) menuOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    if (menuOverlay) menuOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', openMenu);

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar menú con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

/**
 * Efecto de cabecera fija con sombra en scroll
 */
function initHeaderScrollEffect() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-xl', 'py-3');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('shadow-xl');
      header.classList.add('py-5');
      header.classList.remove('py-3');
    }
  });
}

/**
 * Observador de secciones para resaltar enlace activo en navegación
 */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');

  if (!sections.length || !desktopLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-amber-400', 'font-semibold');
            link.classList.remove('text-white/80');
          } else {
            link.classList.remove('text-amber-400', 'font-semibold');
            link.classList.add('text-white/80');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Manejo AJAX del Formulario de Contacto (Formspree)
 */
function initFormspreeHandler() {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!form || !formStatus) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Estado de enviando
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Enviando...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.className = 'mt-4 p-4 rounded-xl text-center text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-300';
        formStatus.innerHTML = '<i class="fas fa-check-circle text-lg mr-2"></i> ¡Gracias! Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo muy pronto.';
        formStatus.classList.remove('hidden');
        form.reset();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (error) {
      formStatus.className = 'mt-4 p-4 rounded-xl text-center text-sm font-medium bg-rose-100 text-rose-800 border border-rose-300';
      formStatus.innerHTML = `<i class="fas fa-exclamation-triangle text-lg mr-2"></i> Hubo un inconveniente al enviar tu mensaje. Por favor intenta llamarnos o enviarnos un WhatsApp directamente.`;
      formStatus.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Inicialización de Animaciones AOS (Animate On Scroll)
 */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80
    });
  }
}

/**
 * Acordeón Interactivo para Preguntas Frecuentes (FAQ)
 */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  if (!faqHeaders.length) return;

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.closest('.faq-item');
      const currentContent = currentItem.querySelector('.faq-content');
      const currentIcon = currentItem.querySelector('.faq-icon');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás ítems del acordeón
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== currentItem) {
          const itemHeader = item.querySelector('.faq-header');
          const itemContent = item.querySelector('.faq-content');
          const itemIcon = item.querySelector('.faq-icon');

          if (itemHeader) itemHeader.setAttribute('aria-expanded', 'false');
          if (itemContent) itemContent.classList.add('hidden');
          if (itemIcon) itemIcon.classList.remove('rotate-180', 'bg-gold', 'text-espresso');
          item.classList.remove('border-gold/60', 'shadow-lg');
        }
      });

      // Alternar estado del ítem seleccionado
      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        currentContent.classList.add('hidden');
        if (currentIcon) currentIcon.classList.remove('rotate-180', 'bg-gold', 'text-espresso');
        currentItem.classList.remove('border-gold/60', 'shadow-lg');
      } else {
        header.setAttribute('aria-expanded', 'true');
        currentContent.classList.remove('hidden');
        if (currentIcon) currentIcon.classList.add('rotate-180', 'bg-gold', 'text-espresso');
        currentItem.classList.add('border-gold/60', 'shadow-lg');
      }
    });
  });
}

/**
 * Inicialización y Configuración de Lightbox para "Nuestra Galería"
 */
function initLightbox() {
  // Configuración de Fancybox v5 cuando la librería está cargada
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind("[data-fancybox='galeria']", {
      loop: true,
      protect: true,
      wheel: 'slide',
      hideScrollbar: true,
      autoFocus: false,
      trapFocus: true,
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: [],
          right: ['iterateZoom', 'fullscreen', 'close']
        }
      },
      Images: {
        zoom: true
      },
      Thumbs: false,
      keyboard: {
        Escape: 'close',
        Delete: 'close',
        Backspace: 'close',
        PageUp: 'next',
        PageDown: 'prev',
        ArrowUp: 'prev',
        ArrowDown: 'next',
        ArrowRight: 'next',
        ArrowLeft: 'prev'
      }
    });
  } else {
    // Respaldo (Fallback) nativo ligero en caso de que falle la CDN externa
    const galleryLinks = document.querySelectorAll("[data-fancybox='galeria']");
    if (!galleryLinks.length) return;

    // Crear elementos de modal fallback dinámico
    const modal = document.createElement('div');
    modal.id = 'native-gallery-lightbox';
    modal.className = 'fixed inset-0 z-[9999] bg-[#0E140E]/95 backdrop-blur-md hidden flex items-center justify-center p-4 transition-all duration-300';
    modal.innerHTML = `
      <button type="button" id="lightbox-close" class="absolute top-5 right-5 text-gold hover:text-white text-3xl font-bold p-2 z-10 transition-colors focus:outline-none" aria-label="Cerrar">
        <i class="fas fa-times"></i>
      </button>
      <button type="button" id="lightbox-prev" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-darkcard/80 border border-gold/40 text-gold hover:text-white flex items-center justify-center text-xl z-10 transition-colors focus:outline-none" aria-label="Anterior">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button type="button" id="lightbox-next" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-darkcard/80 border border-gold/40 text-gold hover:text-white flex items-center justify-center text-xl z-10 transition-colors focus:outline-none" aria-label="Siguiente">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="relative max-w-5xl max-h-[85vh] flex flex-col items-center select-none">
        <img id="lightbox-img" src="" alt="Ampliación" class="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-gold/30">
        <div id="lightbox-caption" class="mt-4 text-center text-white font-serif text-base sm:text-lg"></div>
      </div>
    `;
    document.body.appendChild(modal);

    let currentIndex = 0;
    const items = Array.from(galleryLinks);

    function showImage(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;

      const target = items[currentIndex];
      const imgSrc = target.getAttribute('href');
      const caption = target.getAttribute('data-caption') || '';

      const modalImg = modal.querySelector('#lightbox-img');
      const modalCaption = modal.querySelector('#lightbox-caption');

      modalImg.src = imgSrc;
      modalCaption.textContent = caption;
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }

    items.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showImage(idx);
      });
    });

    modal.querySelector('#lightbox-close').addEventListener('click', closeModal);
    modal.querySelector('#lightbox-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
    modal.querySelector('#lightbox-next').addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    // Cerrar al hacer clic fuera de la imagen
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'native-gallery-lightbox') {
        closeModal();
      }
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      }
    });
  }
}

/**
 * Carga dinámica y reactiva de contenidos desde data/content.json (Decap CMS)
 */
async function initDynamicContentLoader() {
  try {
    const response = await fetch(`data/content.json?t=${Date.now()}`, { cache: 'no-cache' });
    if (!response.ok) return;
    const data = await response.json();

    // 1. Mapeo de elementos de texto simples con data-cms="seccion.campo"
    document.querySelectorAll('[data-cms]').forEach(el => {
      const keyPath = el.getAttribute('data-cms');
      const val = getNestedValue(data, keyPath);
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        el.textContent = val;
      }
    });

    // 2. Mapeo de elementos con soporte HTML con data-cms-html="seccion.campo"
    document.querySelectorAll('[data-cms-html]').forEach(el => {
      const keyPath = el.getAttribute('data-cms-html');
      const val = getNestedValue(data, keyPath);
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        el.innerHTML = val;
      }
    });

    // 3. Actualización de Contacto (Teléfonos, WhatsApp, Correo)
    if (data.contacto) {
      if (data.contacto.phone) {
        document.querySelectorAll('[data-cms-phone]').forEach(el => {
          el.textContent = data.contacto.phone;
          if (el.tagName === 'A') el.href = `tel:${data.contacto.phone.replace(/[^0-9+]/g, '')}`;
        });
      }
      if (data.contacto.whatsapp_number) {
        const cleanWa = data.contacto.whatsapp_number.replace(/[^0-9]/g, '');
        document.querySelectorAll('[data-cms-whatsapp]').forEach(el => {
          if (el.tagName === 'A') el.href = `https://wa.me/${cleanWa}`;
        });
      }
      if (data.contacto.email) {
        document.querySelectorAll('[data-cms-email]').forEach(el => {
          el.textContent = data.contacto.email;
          if (el.tagName === 'A') el.href = `mailto:${data.contacto.email}`;
        });
      }
    }

    // 4. Actualizar Servicios dinámicamente si fueron editados en el CMS
    if (data.servicios && Array.isArray(data.servicios.items)) {
      renderDynamicServices(data.servicios.items, data.contacto?.whatsapp_number);
    }

    // 5. Actualizar Galería de Fotos si fueron editadas en el CMS
    if (data.galeria && Array.isArray(data.galeria.fotos)) {
      renderDynamicGallery(data.galeria.fotos);
    }

    // 6. Actualizar Preguntas Frecuentes si fueron editadas en el CMS
    if (data.faqs && Array.isArray(data.faqs.items)) {
      renderDynamicFaqs(data.faqs.items);
    }

    console.log("%c[Decap CMS Data]%c Contenido sincronizado exitosamente desde data/content.json", "color: #C4A462; font-weight: bold;", "color: #1C241B;");
  } catch (err) {
    console.debug('Aviso: Ejecutando en modo estático predeterminado (data/content.json no cargó):', err);
  }
}

function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
}

function renderDynamicServices(items, whatsappNumber) {
  const container = document.getElementById('servicios-grid');
  if (!container || !items.length) return;

  const waNumber = (whatsappNumber || '522717390957').replace(/[^0-9]/g, '');

  container.innerHTML = items.map((item, idx) => {
    const delay = ((idx % 3) + 1) * 100;
    const waText = encodeURIComponent(item.whatsapp_text || `Hola, solicito cotización de ${item.title}`);
    const isGreenTheme = idx % 2 !== 0;
    const badgeBg = isGreenTheme ? 'bg-[#2D5A27] text-white' : 'gold-badge text-darkbg';
    const iconBg = isGreenTheme ? 'bg-[#2D5A27]/15 text-[#2D5A27] border-[#2D5A27]/30 group-hover:bg-[#2D5A27] group-hover:text-white' : 'bg-[#C4A462]/15 text-[#C4A462] border-[#C4A462]/30 group-hover:bg-[#C4A462] group-hover:text-darkbg';

    return `
      <div class="product-card bg-cream-card rounded-2xl overflow-hidden shadow-md border border-cream-accent hover:border-[#C4A462] flex flex-col justify-between transition-all duration-300 group" data-aos="fade-up" data-aos-delay="${delay}">
        <div>
          <div class="relative h-52 overflow-hidden">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover img-zoom" loading="lazy">
            <span class="absolute top-3 right-3 ${badgeBg} font-bold px-3 py-1 rounded-full text-xs shadow-md">
              ${item.badge || 'Calidad de Altura'}
            </span>
          </div>
          <div class="p-6">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border transition-colors duration-300 ${iconBg}">
                <i class="fas ${item.icon || 'fa-coffee'}"></i>
              </div>
              <h3 class="text-xl font-bold text-[#1C241B] font-serif leading-tight">
                ${item.title}
              </h3>
            </div>
            <p class="text-stone-600 text-sm leading-relaxed mb-2">
              ${item.description}
            </p>
          </div>
        </div>
        <div class="px-6 pb-6">
          <a href="https://wa.me/${waNumber}?text=${waText}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-4 bg-roast hover:bg-leaf text-white font-semibold text-sm rounded-xl text-center flex items-center justify-center space-x-2 transition-colors shadow-sm">
            <i class="fab fa-whatsapp text-base"></i>
            <span>${item.button_text || 'Cotizar Perfiles'}</span>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function renderDynamicGallery(fotos) {
  const container = document.getElementById('galeria-grid');
  if (!container || !fotos.length) return;

  container.innerHTML = fotos.map((foto, idx) => {
    const delay = ((idx % 7) + 1) * 100;
    const isSpan = idx === 6 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : '';
    return `
      <a href="${foto.image}" data-fancybox="galeria" data-caption="${foto.title} - ${foto.tag || ''}" class="gallery-card-link group relative block overflow-hidden rounded-lg bg-[#F4F2EC] border border-[#C4A462]/30 hover:border-[#C4A462] shadow-md cursor-pointer transition-all duration-300 ${isSpan}" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="relative h-64 overflow-hidden">
          <img src="${foto.image}" alt="${foto.alt || foto.title}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0E140E]/95 via-[#0E140E]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div class="w-8 h-8 rounded-full bg-[#0E140E]/70 text-[#C4A462] border border-[#C4A462]/50 flex items-center justify-center text-xs mb-2 group-hover:scale-110 group-hover:bg-[#C4A462] group-hover:text-[#0E140E] transition-all duration-300 shadow">
              <i class="fas fa-magnifying-glass-plus"></i>
            </div>
            <span class="text-[#C4A462] text-xs font-bold uppercase tracking-wider mb-1 font-sans">${foto.tag || 'Huatusco'}</span>
            <h3 class="text-white font-serif font-bold text-base">${foto.title}</h3>
          </div>
        </div>
      </a>
    `;
  }).join('');

  if (typeof initLightbox === 'function') {
    initLightbox();
  }
}

function renderDynamicFaqs(items) {
  const container = document.getElementById('faq-accordion');
  if (!container || !items.length) return;

  container.innerHTML = items.map((item, idx) => {
    return `
      <div class="faq-item bg-white rounded-2xl shadow-md border border-cream-accent overflow-hidden transition-all duration-300">
        <button type="button" class="faq-header w-full px-6 py-5 text-left flex items-center justify-between space-x-4 hover:bg-stone-50 transition-colors focus:outline-none" aria-expanded="false">
          <span class="font-serif font-bold text-darktext text-base sm:text-lg flex items-center space-x-3">
            <span class="w-8 h-8 rounded-full bg-gold/20 text-darkbg flex items-center justify-center text-sm shrink-0 font-bold">${item.number || (idx + 1)}</span>
            <span>${item.question}</span>
          </span>
          <span class="faq-icon w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 transition-transform duration-300">
            <i class="fas fa-chevron-down text-sm"></i>
          </span>
        </button>
        <div class="faq-content hidden px-6 pb-6 pt-2 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
          ${item.answer}
        </div>
      </div>
    `;
  }).join('');

  if (typeof initFaqAccordion === 'function') {
    initFaqAccordion();
  }
}
