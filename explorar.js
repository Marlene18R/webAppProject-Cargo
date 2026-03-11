/* ============================================================
   MI ESCUELA PRIMERO — explorar.js
   Filter logic, card rendering, view toggle
   ============================================================ */

(function () {
  'use strict';

  /* ── DATA ───────────────────────────────────────────────── */
  const schools = [
    {
      id: '1',
      name: 'Escuela Rural La Esperanza',
      county: 'Zapopan',
      location: 'Zapopan',
      description: 'Escuela rural que atiende a 150 estudiantes necesitados de materiales educativos y mejoras en infraestructura.',
      needs: ['Libros', 'Computadoras', 'Útiles Escolares', 'Infraestructura'],
      fundingProgress: 65,
      materialsProgress: 40,
      volunteerHoursProgress: 80,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      donationTypes: ['Económica', 'En especie', 'Voluntariado'],
    },
    {
      id: '2',
      name: 'Escuela Comunidad Unida',
      county: 'San Juan de los Lagos',
      location: 'San Juan de los Lagos',
      description: 'Escuela costera enfocada en educación ambiental y desarrollo comunitario.',
      needs: ['Tecnología', 'Equipo Deportivo', 'Materiales de Arte'],
      fundingProgress: 45,
      materialsProgress: 70,
      volunteerHoursProgress: 55,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
      donationTypes: ['En especie', 'Talleres', 'Vinculación'],
    },
    {
      id: '3',
      name: 'Escuela Nueva Generación',
      county: 'San Juan de los Lagos',
      location: 'San Juan de los Lagos',
      description: 'Escuela urbana que brinda educación de calidad a más de 300 estudiantes de familias de bajos ingresos.',
      needs: ['Biblioteca', 'Laboratorio de Ciencias', 'Instrumentos Musicales'],
      fundingProgress: 80,
      materialsProgress: 60,
      volunteerHoursProgress: 90,
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
      donationTypes: ['Económica', 'Talleres', 'Voluntariado'],
    },
    {
      id: '4',
      name: 'Escuela Montaña Verde',
      county: 'Arandas',
      location: 'Arandas',
      description: 'Escuela de montaña que enfatiza la agricultura y educación en sostenibilidad.',
      needs: ['Herramientas de Jardinería', 'Semillas', 'Materiales Educativos'],
      fundingProgress: 30,
      materialsProgress: 25,
      volunteerHoursProgress: 40,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      donationTypes: ['En especie', 'Vinculación', 'Voluntariado'],
    },
    {
      id: '5',
      name: 'Escuela Futuro Brillante',
      county: 'Tlaquepaque',
      location: 'Tlaquepaque',
      description: 'Escuela progresista con enfoque en integración tecnológica y alfabetización digital.',
      needs: ['Tablets', 'Proyectores', 'Licencias de Software'],
      fundingProgress: 90,
      materialsProgress: 85,
      volunteerHoursProgress: 70,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      donationTypes: ['Económica', 'Talleres', 'En especie'],
    },
    {
      id: '6',
      name: 'Escuela Sol del Pacífico',
      county: 'Zapopan',
      location: 'Zapopan',
      description: 'Escuela de comunidad costera que promueve el patrimonio cultural y las artes tradicionales.',
      needs: ['Materiales de Arte', 'Materiales Culturales', 'Equipo Deportivo'],
      fundingProgress: 50,
      materialsProgress: 45,
      volunteerHoursProgress: 60,
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
      donationTypes: ['En especie', 'Talleres', 'Vinculación'],
    },
  ];

  /* ── STATE ──────────────────────────────────────────────── */
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

  /* ── FILTER LOGIC ───────────────────────────────────────── */
  function getFiltered() {
    return schools.filter(school => {
      const q = state.search.trim().toLowerCase();
      const matchesSearch = !q ||
        school.name.toLowerCase().includes(q) ||
        school.location.toLowerCase().includes(q);
      const matchesCounty = state.county === 'Todos los Municipios' ||
        school.county === state.county;
      const matchesDonation = state.donationType === 'Todos los Tipos' ||
        school.donationTypes.includes(state.donationType);
      return matchesSearch && matchesCounty && matchesDonation;
    });
  }

  /* ── CARD BUILDER ───────────────────────────────────────── */
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
    const visibleNeeds = school.needs.slice(0, 3);
    const extraNeeds   = school.needs.length - 3;
    const tags = visibleNeeds.map(n => `<span class="tag">${n}</span>`).join('');
    const extra = extraNeeds > 0 ? `<span class="tag">+${extraNeeds} más</span>` : '';
    const donorUrl = `donante.html?school=${encodeURIComponent(school.name)}`;

    return `
      <article class="school-card fade-up">
        <div class="school-card__image-wrap">
          <img
            class="school-card__image"
            src="${school.image}"
            alt="${school.name}"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'"
          />
          <span class="school-card__county-badge">${school.county}</span>
        </div>
        <div class="school-card__body">
          <div>
            <h3 class="school-card__title">${school.name}</h3>
            <p class="school-card__location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              ${school.location}
            </p>
          </div>
          <p class="school-card__desc">${school.description}</p>
          <div class="school-card__tags">${tags}${extra}</div>
          <div class="school-card__progress">
            ${buildProgressRow('Financiamiento', school.fundingProgress)}
            ${buildProgressRow('Materiales', school.materialsProgress)}
            ${buildProgressRow('Horas de Voluntariado', school.volunteerHoursProgress)}
          </div>
          <a href="${donorUrl}" class="school-card__cta">Apoyar esta escuela</a>
        </div>
      </article>`;
  }

  /* ── RENDER ─────────────────────────────────────────────── */
  function render() {
    const filtered = getFiltered();
    const count    = filtered.length;

    // Update counts
    resultsCount.textContent = count;
    resultsLabel.textContent = count === 1 ? 'Escuela coincide con tus criterios' : 'Escuelas coinciden con tus criterios';
    showingText.textContent  = `Mostrando ${count} ${count === 1 ? 'escuela' : 'escuelas'}`;
    mapCountText.innerHTML   = `Mapa interactivo que muestra ${count} ${count === 1 ? 'escuela' : 'escuelas'} en tu área seleccionada.<br>Esto mostraría una integración de mapa real en producción.`;

    // Show/hide panels
    const isGrid = state.view === 'grid';
    schoolsGrid.classList.toggle('hidden', !isGrid);
    mapView.classList.toggle('hidden', isGrid);
    emptyState.classList.toggle('hidden', count > 0);

    if (count === 0) {
      schoolsGrid.innerHTML = '';
      return;
    }

    if (isGrid) {
      schoolsGrid.innerHTML = filtered.map(buildCard).join('');

      // Trigger entrance animations on newly added cards
      requestAnimationFrame(() => {
        schoolsGrid.querySelectorAll('.fade-up').forEach((el, i) => {
          el.style.transitionDelay = `${i * 60}ms`;
          requestAnimationFrame(() => el.classList.add('is-visible'));
        });
      });
    }
  }

  /* ── EVENT LISTENERS ────────────────────────────────────── */
  let searchDebounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.search = searchInput.value;
      render();
    }, 220);
  });

  countySelect.addEventListener('change', () => {
    state.county = countySelect.value;
    render();
  });

  donationTypeSelect.addEventListener('change', () => {
    state.donationType = donationTypeSelect.value;
    render();
  });

  clearFiltersBtn.addEventListener('click', () => {
    state.search = '';
    state.county = 'Todos los Municipios';
    state.donationType = 'Todos los Tipos';
    searchInput.value = '';
    countySelect.value = 'Todos los Municipios';
    donationTypeSelect.value = 'Todos los Tipos';
    render();
  });

  // View toggle
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

  /* ── INIT ───────────────────────────────────────────────── */
  render();

})();
