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
