/* ============================================================
   MI ESCUELA PRIMERO — formas-apoyar.js
   Renders quick-nav buttons and expandable category cards
   ============================================================ */

(function () {
  'use strict';

  /* ── SVG ICONS (inline strings) ─────────────────────────── */
  const icons = {
    bookOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    dumbbell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h3v5H3zM18 9.5h3v5h-3z"/></svg>`,
    laptop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    armchair: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0z"/><line x1="5" y1="18" x2="5" y2="22"/><line x1="19" y1="18" x2="19" y2="22"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>`,
    graduationCap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    bike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`,
    heartPulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5.5-2h3.5"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    handHeart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 14H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"/><path d="M21 11.5a2.5 2.5 0 0 1 0 5h-.5"/><path d="M18 11h1a2 2 0 1 1 0 4h-1"/><path d="m14 17.5 4-1.5V11l-4-1.5A1.5 1.5 0 0 0 12.5 11v5A1.5 1.5 0 0 0 14 17.5z"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`,
  };

  /* ── DATA ───────────────────────────────────────────────── */
  const categories = [
    {
      id: 'material-educativo',
      icon: 'bookOpen',
      title: 'Material Educativo',
      phrase: 'El material es indispensable para aprender con creatividad y aprovechar cada clase al máximo.',
      items: ['Hojas blancas y de colores', 'Marcadores', 'Plastilina', 'Juegos de geometría', 'Libros infantiles', 'Regletas', 'Memoramas educativos', 'Fichas con fracciones'],
      priority: 'Alta prioridad',
      impactStatement: 'Impacta directamente a más de 100 estudiantes por escuela.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    },
    {
      id: 'material-deportivo',
      icon: 'dumbbell',
      title: 'Material Deportivo',
      phrase: 'El deporte es aprendizaje en movimiento: cada balón abre oportunidades para crecer.',
      items: ['Balones', 'Conos', 'Aros grandes', 'Porterías', 'Cuerdas', 'Pelotas pequeñas'],
      priority: 'Impacto inmediato',
      impactStatement: 'Fomenta el desarrollo físico y social de toda la comunidad escolar.',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    },
    {
      id: 'material-tecnologico',
      icon: 'laptop',
      title: 'Material Tecnológico',
      phrase: 'La tecnología abre puertas al conocimiento y prepara a los estudiantes para el futuro.',
      items: ['Computadoras', 'Impresoras', 'Proyectores', 'Repetidores de señal', 'Cables HDMI', 'Tóner', 'Extensiones'],
      priority: 'Alta prioridad',
      impactStatement: 'Prepara a los estudiantes para el mundo digital y laboral.',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    },
    {
      id: 'mobiliario',
      icon: 'armchair',
      title: 'Mobiliario',
      phrase: 'El espacio donde aprenden también enseña.',
      items: ['Sillas y mesas', 'Pizarrones', 'Escritorios para maestros', 'Lockers', 'Bancas exteriores', 'Botes de basura', 'Comedores'],
      priority: 'Impacto duradero',
      impactStatement: 'Crea espacios dignos y funcionales para el aprendizaje.',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    },
    {
      id: 'infraestructura',
      icon: 'building',
      title: 'Infraestructura',
      phrase: 'Un entorno seguro y digno es la base para que la escuela sea un verdadero espacio de aprendizaje.',
      items: ['Pintura', 'Impermeabilizante', 'Ventanas', 'Puertas', 'Lámparas', 'Cableado', 'Cemento', 'Malla sombra'],
      priority: 'Alta prioridad',
      impactStatement: 'Garantiza seguridad y condiciones óptimas para aprender.',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    },
    {
      id: 'formacion-docentes',
      icon: 'graduationCap',
      title: 'Formación a Docentes',
      phrase: 'Un maestro que aprende, multiplica aprendizajes.',
      items: ['Convivencia escolar', 'Manejo de emociones', 'Disciplina positiva', 'Uso de TIC e IA', 'Liderazgo', 'Primeros auxilios'],
      priority: 'Impacto multiplicador',
      impactStatement: 'Un docente formado transforma la experiencia de todos sus estudiantes.',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    },
    {
      id: 'formacion-estudiantes',
      icon: 'users',
      title: 'Formación a Estudiantes',
      phrase: 'Ofrecer formación impulsa habilidades y abre caminos.',
      items: ['Prevención de drogas', 'Sexualidad responsable', 'Proyecto de vida', 'Lectoescritura', 'Operaciones básicas', 'Hábitos de higiene'],
      priority: 'Impacto inmediato',
      impactStatement: 'Desarrolla habilidades para la vida y el futuro de cada estudiante.',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    },
    {
      id: 'formacion-familias',
      icon: 'heart',
      title: 'Formación a Familias',
      phrase: 'La educación también florece en casa.',
      items: ['Crianza positiva', 'Derechos y obligaciones', 'Nutrición infantil', 'Manejo de emociones', 'Convivencia y valores'],
      priority: 'Impacto comunitario',
      impactStatement: 'Fortalece el ecosistema educativo desde el hogar.',
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
    },
    {
      id: 'acceso',
      icon: 'bike',
      title: 'Acceso',
      phrase: 'Llegar a la escuela no debería ser un obstáculo.',
      items: ['Bicicletas', 'Patines', 'Portabicicletas', 'Bombas y parches', 'Grava', 'Tierra'],
      priority: 'Impacto inmediato',
      impactStatement: 'Elimina barreras físicas para que todos puedan llegar a aprender.',
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    },
    {
      id: 'salud',
      icon: 'heartPulse',
      title: 'Salud',
      phrase: 'Sin bienestar físico y emocional, no hay aprendizaje pleno.',
      items: ['Filtros de agua', 'Psicólogos', 'Médicos generales', 'Nutriólogos', 'Oftalmólogos'],
      priority: 'Alta prioridad',
      impactStatement: 'Cuida la salud integral de toda la comunidad educativa.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    },
    {
      id: 'gestion',
      icon: 'briefcase',
      title: 'Gestión',
      phrase: 'Coordinar con autoridades garantiza que las escuelas puedan funcionar y crecer.',
      items: ['Vinculación con CFE', 'Obras Públicas', 'Transporte', 'Autoridades municipales'],
      priority: 'Impacto estructural',
      impactStatement: 'Facilita procesos administrativos para que las escuelas operen mejor.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    },
    {
      id: 'voluntariado',
      icon: 'handHeart',
      title: 'Voluntariado y Apoyos Especiales',
      phrase: 'Cada talento puede convertirse en impacto.',
      items: ['Voluntarios para pintar', 'Arquitectos', 'Ingenieros', 'Educadores', 'Fletes', 'Podadores', 'Topógrafos'],
      priority: 'Impacto diverso',
      impactStatement: 'Transforma habilidades profesionales en apoyo directo a las escuelas.',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    },
  ];

  /* ── QUICK NAV ───────────────────────────────────────────── */
  const quickNavGrid = document.getElementById('quickNavGrid');

  quickNavGrid.innerHTML = categories.map(cat => `
    <a href="#${cat.id}" class="qnav-btn" data-target="${cat.id}">
      <div class="qnav-btn__icon">${icons[cat.icon]}</div>
      <span class="qnav-btn__label">${cat.title}</span>
    </a>
  `).join('');

  // Smooth scroll on click
  quickNavGrid.querySelectorAll('.qnav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── CATEGORY CARDS ──────────────────────────────────────── */
  const categoriesGrid = document.getElementById('categoriesGrid');
  const VISIBLE_COUNT = 5;

  function buildItems(items, isExtra = false) {
    return items.map(item => `
      <li class="cat-card__item">
        <span class="cat-card__item-dot">•</span>
        <span>${item}</span>
      </li>`).join('');
  }

  categoriesGrid.innerHTML = categories.map(cat => {
    const visibleItems = cat.items.slice(0, VISIBLE_COUNT);
    const extraItems   = cat.items.slice(VISIBLE_COUNT);
    const hasExtra     = extraItems.length > 0;

    return `
      <article class="cat-card fade-up" id="${cat.id}">
        <div class="cat-card__image-wrap">
          <img
            class="cat-card__image"
            src="${cat.imageUrl}"
            alt="${cat.title}"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'"
          />
          <div class="cat-card__image-gradient" aria-hidden="true"></div>
        </div>
        <div class="cat-card__body">
          <div class="cat-card__header">
            <div class="cat-card__icon-wrap">${icons[cat.icon]}</div>
            <div class="cat-card__title-group">
              <h3 class="cat-card__title">${cat.title}</h3>
              <span class="cat-card__badge">${cat.priority}</span>
            </div>
          </div>
          <p class="cat-card__phrase">"${cat.phrase}"</p>
          <div class="cat-card__impact">
            <p>${cat.impactStatement}</p>
          </div>
          <div>
            <ul class="cat-card__items">${buildItems(visibleItems)}</ul>
            ${hasExtra ? `
              <ul class="cat-card__extra" id="extra-${cat.id}">${buildItems(extraItems)}</ul>
              <button class="cat-card__expand-btn" data-card="${cat.id}" aria-expanded="false">
                Ver ${extraItems.length} más ${icons.chevronDown}
              </button>
            ` : ''}
          </div>
          <a href="donante.html?category=${encodeURIComponent(cat.title)}" class="cat-card__cta">
            Quiero apoyar aquí
          </a>
        </div>
      </article>`;
  }).join('');

  /* ── EXPAND TOGGLE ───────────────────────────────────────── */
  categoriesGrid.addEventListener('click', e => {
    const btn = e.target.closest('.cat-card__expand-btn');
    if (!btn) return;

    const cardId    = btn.dataset.card;
    const extraList = document.getElementById(`extra-${cardId}`);
    const isOpen    = extraList.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));

    const extraCount = extraList.querySelectorAll('.cat-card__item').length;
    btn.innerHTML = isOpen
      ? `Ver menos ${icons.chevronDown}`
      : `Ver ${extraCount} más ${icons.chevronDown}`;
  });

  /* ── ENTRANCE ANIMATIONS ────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.cat-card.fade-up, .qnav-btn').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.cat-card, .qnav-btn').forEach(el => el.classList.add('is-visible'));
  }

})();
