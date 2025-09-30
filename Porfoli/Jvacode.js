// Jvacode.js
// - Responsable de la interacción: menú, animación de skills y carousels.
/* global window, document */

let menuVisible = false;

/* ======================
   MENU (mostrar / ocultar)
   - mostrarOcultarMenu: alterna la clase 'responsive' en el nav
   - seleccionar: cierra el menú (útil en móvil tras click)
*/
function mostrarOcultarMenu() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  if (menuVisible) {
    nav.className = '';
    menuVisible = false;
  } else {
    nav.className = 'responsive';
    menuVisible = true;
  }
}

function seleccionar() {
  // oculta el menú una vez que selecciono una opción
  const nav = document.getElementById('nav');
  if (nav) nav.className = '';
  menuVisible = false;
}

// Función que aplica las animaciones de las habilidades
// Mejor: usar IntersectionObserver para detectar entrada/salida de la sección
// Esto permite animar las barras cuando la sección '#skills' entra en vista
// tanto al hacer scroll hacia abajo como hacia arriba.
/* ======================
  SKILLS: animación de barras
  - initEfectoHabilidades: aplica clases a .progreso cuando #skills entra en vista
  - actualmente usa IntersectionObserver (threshold 0.3)
*/
function initEfectoHabilidades() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const habilidades = Array.from(document.querySelectorAll('#skills .progreso'));
  if (!habilidades || habilidades.length === 0) return;

  const clasesTecnicas = [
    'HTMLCSSJavaScript', 'Bizagi', 'AutomationAnywhere', 'Python', 'SQL', 'R',
    'Excel', 'SAP', 'Oracle', 'PowerBI', 'PowerApps', 'PowerQuery', 'Macros',
    'PowerPivot', 'Dashboards', 'VSCode'
  ];

  const clasesBlandas = [
    'liderazgo', 'comunicacion', 'pensamiento', 'adaptabilidad', 'aprendizaje',
    'trabajo', 'orientacion', 'mejora', 'responsabilidad'
  ];

  function addClasses() {
    // Añadir clases técnicas a los primeros elementos
    for (let i = 0; i < clasesTecnicas.length && i < habilidades.length; i++) {
      habilidades[i].classList.add(clasesTecnicas[i]);
    }
    // Añadir clases blandas a los siguientes
    for (let j = 0; j < clasesBlandas.length && (clasesTecnicas.length + j) < habilidades.length; j++) {
      habilidades[clasesTecnicas.length + j].classList.add(clasesBlandas[j]);
    }
  }

  function removeClasses() {
    for (let i = 0; i < clasesTecnicas.length && i < habilidades.length; i++) {
      habilidades[i].classList.remove(clasesTecnicas[i]);
    }
    for (let j = 0; j < clasesBlandas.length && (clasesTecnicas.length + j) < habilidades.length; j++) {
      habilidades[clasesTecnicas.length + j].classList.remove(clasesBlandas[j]);
    }
  }

  // IntersectionObserver: ajusta threshold según cuando quieras activar (0.3 = 30% visible)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        addClasses();
      } else {
        // removemos para permitir que la animación se ejecute nuevamente al volver
        removeClasses();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}

// Inicializar efecto al cargar el script
/* ======================
   CAROUSEL
   - setupCarousel: inicializa un carousel (slides, indicadores y autoplay)
   - initCarousel: aplica setupCarousel a todos los elementos con clase
     '.carousel' y '.project-carousel'
*/
function initCarousel() {
  function setupCarousel(carousel) {
    const slidesEl = carousel.querySelector('.slides');
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelector('.carousel-indicators');
    const intervalAttr = parseInt(carousel.dataset.autoplayInterval, 10) || 3000;

    let current = 0;
    let timer = null;

    function goTo(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      current = index;
      if (slidesEl) slidesEl.style.transform = `translateX(-${current * 100}%)`;
      // indicators
      if (indicators) {
        Array.from(indicators.children).forEach((btn, i) => btn.classList.toggle('active', i === current));
      }
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // build indicators
    if (indicators) {
      indicators.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.addEventListener('click', () => { goTo(i); resetTimer(); });
        if (i === 0) btn.classList.add('active');
        indicators.appendChild(btn);
      });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

    function startTimer() {
      stopTimer();
      timer = setInterval(next, intervalAttr);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    function resetTimer() { stopTimer(); startTimer(); }

    // pause on hover/focus
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    carousel.addEventListener('focusin', stopTimer);
    carousel.addEventListener('focusout', startTimer);

    // init
    goTo(0);
    startTimer();
  }

  // Inicializar carousels generales y los carreteles por proyecto
  const carousels = Array.from(document.querySelectorAll('.carousel'));
  carousels.forEach(setupCarousel);
  const projectCarousels = Array.from(document.querySelectorAll('.project-carousel'));
  projectCarousels.forEach(setupCarousel);
}

// Inicialización al cargar la página
window.addEventListener('load', () => {
  initEfectoHabilidades();
  initCarousel();
});
