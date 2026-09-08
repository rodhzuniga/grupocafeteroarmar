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
