/* ============================================================
   MI ESCUELA PRIMERO — explorar.js (versión API)
   Filter logic, card rendering, view toggle con datos dinámicos
   ============================================================ */

(function () {
  'use strict';

  const API_URL = 'http://localhost:5000/api';

  /* ── STATE ──────────────────────────────────────────────── */
  let schoolsData = [];           // Escuelas cargadas desde la API
  let isLoading = false;          // Para evitar múltiples peticiones simultáneas

  let state = {
    search: '',
    county: 'Todos los Municipios',
    donationType: 'Todos los Tipos',
    view: 'grid',
  };

  /* ── DOM REFS ───────────────────────────────────────────── */
  const searchInput       = document.getElementById('searchInput');
  const countySelect      = document.getElementById('countySelect');
  const donationTypeSelect= document.getElementById('donationTypeSelect');
  const clearFiltersBtn   = document.getElementById('clearFiltersBtn');
  const resultsCount      = document.getElementById('resultsCount');
  const resultsLabel      = document.getElementById('resultsLabel');
  const showingText       = document.getElementById('showingText');
  const schoolsGrid       = document.getElementById('schoolsGrid');
  const mapView           = document.getElementById('mapView');
  const mapCountText      = document.getElementById('mapCountText');
  const emptyState        = document.getElementById('emptyState');
  const gridViewBtn       = document.getElementById('gridViewBtn');
  const mapViewBtn        = document.getElementById('mapViewBtn');

  /* ── CARGAR ESCUELAS DESDE LA API CON FILTROS ───────────── */
  async function loadSchools() {
    if (isLoading) return;
    isLoading = true;

    // Mostrar indicador de carga (opcional)
    schoolsGrid.innerHTML = '<div class="loading-spinner">Cargando escuelas...</div>';

    try {
      const params = new URLSearchParams();
      if (state.search.trim()) params.append('search', state.search.trim());
      if (state.county !== 'Todos los Municipios') params.append('county', state.county);
      if (state.donationType !== 'Todos los Tipos') params.append('donationType', state.donationType);

      const url = `${API_URL}/schools${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar escuelas');
      schoolsData = await response.json();
    } catch (error) {
      console.error(error);
      schoolsData = [];
      schoolsGrid.innerHTML = '<div class="empty-state">Error al cargar escuelas. Intenta más tarde.</div>';
    } finally {
      isLoading = false;
      render(); // Renderiza con los datos obtenidos (o vacío)
    }
  }

  /* ── FILTROS (ya no se aplican localmente, se envían a la API) ── */
  // La función getFiltered ya no es necesaria porque los filtros se aplican en el backend.
  // Toda la lógica de render usa directamente schoolsData.

  /* ── CONSTRUCTOR DE TARJETAS (igual que antes) ──────────── */
  function buildProgressRow(label, value) {
    return `
      <div class="progress-row">
        <div class="progress-row__meta">
          <span class="progress-row__label">${label}</span>
          <span class="progress-row__value">${value}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${value}%"></div>
        </div>
      </div>`;
  }

  function buildCard(school) {
    const visibleNeeds = (school.needs || []).slice(0, 3);
    const extraNeeds   = (school.needs || []).length - 3;
    const tags = visibleNeeds.map(n => `<span class="tag">${escapeHtml(n)}</span>`).join('');
    const extra = extraNeeds > 0 ? `<span class="tag">+${extraNeeds} más</span>` : '';
    const donorUrl = `donante.html?school=${encodeURIComponent(school.name)}`;

    return `
      <article class="school-card fade-up">
        <div class="school-card__image-wrap">
          <img
            class="school-card__image"
            src="${school.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'}"
            alt="${escapeHtml(school.name)}"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'"
          />
          <span class="school-card__county-badge">${escapeHtml(school.county || '')}</span>
        </div>
        <div class="school-card__body">
          <div>
            <h3 class="school-card__title">${escapeHtml(school.name)}</h3>
            <p class="school-card__location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              ${escapeHtml(school.county || '')}
            </p>
          </div>
          <p class="school-card__desc">${escapeHtml(school.description || '')}</p>
          <div class="school-card__tags">${tags}${extra}</div>
          <div class="school-card__progress">
            ${buildProgressRow('Financiamiento', school.fundingProgress || 0)}
            ${buildProgressRow('Materiales', school.materialsProgress || 0)}
            ${buildProgressRow('Horas de Voluntariado', school.volunteerHoursProgress || 0)}
          </div>
          <a href="${donorUrl}" class="school-card__cta">Apoyar esta escuela</a>
        </div>
      </article>`;
  }

  // Función simple para escapar HTML (evitar XSS)
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
      return c;
    });
  }

  /* ── RENDER ─────────────────────────────────────────────── */
  function render() {
    const count = schoolsData.length;

    // Actualizar contadores
    resultsCount.textContent = count;
    resultsLabel.textContent = count === 1 ? 'Escuela coincide con tus criterios' : 'Escuelas coinciden con tus criterios';
    showingText.textContent  = `Mostrando ${count} ${count === 1 ? 'escuela' : 'escuelas'}`;
    mapCountText.innerHTML   = `Mapa interactivo que muestra ${count} ${count === 1 ? 'escuela' : 'escuelas'} en tu área seleccionada.<br>Esto mostraría una integración de mapa real en producción.`;

    // Mostrar/ocultar paneles según vista
    const isGrid = state.view === 'grid';
    schoolsGrid.classList.toggle('hidden', !isGrid);
    mapView.classList.toggle('hidden', isGrid);
    emptyState.classList.toggle('hidden', count > 0);

    if (count === 0) {
      schoolsGrid.innerHTML = '';
      return;
    }

    if (isGrid) {
      schoolsGrid.innerHTML = schoolsData.map(buildCard).join('');

      // Re-aplicar animaciones de entrada
      requestAnimationFrame(() => {
        schoolsGrid.querySelectorAll('.fade-up').forEach((el, i) => {
          el.style.transitionDelay = `${i * 60}ms`;
          requestAnimationFrame(() => el.classList.add('is-visible'));
        });
      });
    }
  }

  /* ── EVENT LISTENERS (actualizan filtros y recargan) ────── */
  let searchDebounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.search = searchInput.value;
      loadSchools();  // Recargar con nuevos filtros
    }, 300);
  });

  countySelect.addEventListener('change', () => {
    state.county = countySelect.value;
    loadSchools();
  });

  donationTypeSelect.addEventListener('change', () => {
    state.donationType = donationTypeSelect.value;
    loadSchools();
  });

  clearFiltersBtn.addEventListener('click', () => {
    state.search = '';
    state.county = 'Todos los Municipios';
    state.donationType = 'Todos los Tipos';
    searchInput.value = '';
    countySelect.value = 'Todos los Municipios';
    donationTypeSelect.value = 'Todos los Tipos';
    loadSchools();
  });

  // Cambio de vista (cuadrícula / mapa)
  gridViewBtn.addEventListener('click', () => {
    state.view = 'grid';
    gridViewBtn.classList.add('view-toggle__btn--active');
    gridViewBtn.setAttribute('aria-pressed', 'true');
    mapViewBtn.classList.remove('view-toggle__btn--active');
    mapViewBtn.setAttribute('aria-pressed', 'false');
    render();
  });

  mapViewBtn.addEventListener('click', () => {
    state.view = 'map';
    mapViewBtn.classList.add('view-toggle__btn--active');
    mapViewBtn.setAttribute('aria-pressed', 'true');
    gridViewBtn.classList.remove('view-toggle__btn--active');
    gridViewBtn.setAttribute('aria-pressed', 'false');
    render();
  });

  /* ── INICIALIZACIÓN ─────────────────────────────────────── */
  loadSchools();
})();