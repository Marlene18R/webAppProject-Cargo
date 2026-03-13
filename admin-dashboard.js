/* ============================================================
   MI ESCUELA PRIMERO — admin-dashboard.js
   Admin panel: auth guard, nav, school CRUD, solicitudes
   ============================================================ */
(function () {
  'use strict';

  /* ── AUTH GUARD ─────────────────────────────────────────── */
  if (sessionStorage.getItem('mep_admin_auth') !== 'true') {
    window.location.href = 'admin-login.html';
    return;
  }

  const adminUser = sessionStorage.getItem('mep_admin_user') || 'admin@escuelasprimero.org';
  document.getElementById('topbarUserName').textContent = adminUser.split('@')[0];

  /* ── INITIAL DATA ───────────────────────────────────────── */
  const DEFAULT_SCHOOLS = [
    { id: '1', name: 'Escuela Rural La Esperanza', county: 'Zapopan', description: 'Escuela rural que atiende a 150 estudiantes necesitados de materiales educativos y mejoras en infraestructura.', needs: ['Libros', 'Computadoras', 'Útiles Escolares', 'Infraestructura'], fundingProgress: 65, materialsProgress: 40, volunteerHoursProgress: 80, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', donationTypes: ['Económica', 'En especie', 'Voluntariado'] },
    { id: '2', name: 'Escuela Comunidad Unida', county: 'San Juan de los Lagos', description: 'Escuela costera enfocada en educación ambiental y desarrollo comunitario.', needs: ['Tecnología', 'Equipo Deportivo', 'Materiales de Arte'], fundingProgress: 45, materialsProgress: 70, volunteerHoursProgress: 55, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', donationTypes: ['En especie', 'Talleres', 'Vinculación'] },
    { id: '3', name: 'Escuela Nueva Generación', county: 'San Juan de los Lagos', description: 'Escuela urbana que brinda educación de calidad a más de 300 estudiantes de familias de bajos ingresos.', needs: ['Biblioteca', 'Laboratorio de Ciencias', 'Instrumentos Musicales'], fundingProgress: 80, materialsProgress: 60, volunteerHoursProgress: 90, image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', donationTypes: ['Económica', 'Talleres', 'Voluntariado'] },
    { id: '4', name: 'Escuela Montaña Verde', county: 'Arandas', description: 'Escuela de montaña que enfatiza la agricultura y educación en sostenibilidad.', needs: ['Herramientas de Jardinería', 'Semillas', 'Materiales Educativos'], fundingProgress: 30, materialsProgress: 25, volunteerHoursProgress: 40, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', donationTypes: ['En especie', 'Vinculación', 'Voluntariado'] },
    { id: '5', name: 'Escuela Futuro Brillante', county: 'Tlaquepaque', description: 'Escuela progresista con enfoque en integración tecnológica y alfabetización digital.', needs: ['Tablets', 'Proyectores', 'Licencias de Software'], fundingProgress: 90, materialsProgress: 85, volunteerHoursProgress: 70, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', donationTypes: ['Económica', 'Talleres', 'En especie'] },
    { id: '6', name: 'Escuela Sol del Pacífico', county: 'Zapopan', description: 'Escuela de comunidad costera que promueve el patrimonio cultural y las artes tradicionales.', needs: ['Materiales de Arte', 'Materiales Culturales', 'Equipo Deportivo'], fundingProgress: 50, materialsProgress: 45, volunteerHoursProgress: 60, image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80', donationTypes: ['En especie', 'Talleres', 'Vinculación'] },
  ];

  const SAMPLE_SOLICITUDES = [
    { id: 's1', nombre: 'María González', institucion: 'Universidad de Guadalajara', municipio: 'Zapopan', tipo: 'Academia', forma: 'Como aliado/a', telefono: '331-555-0101', correo: 'mgonzalez@udg.mx', notas: '' },
    { id: 's2', nombre: 'Carlos Ramírez', institucion: 'Corporativo Ramirez SA', municipio: 'Guadalajara', tipo: 'Empresa', forma: 'Como voluntario', telefono: '331-555-0202', correo: 'carlos@corporativo.com', notas: 'Nos gustaría apoyar con material de cómputo.' },
    { id: 's3', nombre: 'Ana Patricia Rojas', institucion: 'Comunidad Colonia Centro', municipio: 'Tlaquepaque', tipo: 'Comunidad o sociedad en general', forma: 'Como líder comunitario', telefono: '331-555-0303', correo: 'anarojas@gmail.com', notas: '' },
  ];

  /* ── STATE ──────────────────────────────────────────────── */
  let schools = JSON.parse(localStorage.getItem('mep_schools') || 'null') || DEFAULT_SCHOOLS;
  let solicitudes = JSON.parse(localStorage.getItem('mep_solicitudes') || 'null') || SAMPLE_SOLICITUDES;
  let editingId   = null;
  let needs       = [];
  let deleteTarget = null;
  let searchQuery  = '';

  function saveSchools() {
    localStorage.setItem('mep_schools', JSON.stringify(schools));
  }

  /* ── SECTION NAVIGATION ─────────────────────────────────── */
  const sections = ['dashboard', 'escuelas', 'school-form', 'necesidades', 'solicitudes'];
  const pageTitleEl = document.getElementById('pageTitle');
  const titleMap = {
    dashboard: 'Dashboard',
    escuelas: 'Escuelas',
    'school-form': 'Escuelas',
    necesidades: 'Necesidades',
    solicitudes: 'Solicitudes',
  };

  function showSection(name) {
    sections.forEach(s => {
      document.getElementById(`section-${s}`).classList.toggle('hidden', s !== name);
    });
    pageTitleEl.textContent = titleMap[name] || name;

    // Update sidebar active state (skip school-form — parent is escuelas)
    const sidebarKey = name === 'school-form' ? 'escuelas' : name;
    document.querySelectorAll('.admin-nav-link[data-section]').forEach(link => {
      link.classList.toggle('admin-nav-link--active', link.dataset.section === sidebarKey);
    });

    // Render content
    if (name === 'dashboard')    renderDashboard();
    if (name === 'escuelas')     renderSchoolsTable();
    if (name === 'necesidades')  renderNecesidades();
    if (name === 'solicitudes')  renderSolicitudes();
  }

  document.querySelectorAll('.admin-nav-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.dataset.section);
      closeSidebar();
    });
  });

  /* ── SIDEBAR MOBILE TOGGLE ──────────────────────────────── */
  const sidebar     = document.getElementById('adminSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('is-open'));

  function closeSidebar() {
    sidebar.classList.remove('is-open');
  }

  document.addEventListener('click', e => {
    if (sidebar.classList.contains('is-open') &&
        !sidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)) {
      closeSidebar();
    }
  });

  /* ── LOGOUT ─────────────────────────────────────────────── */
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('mep_admin_auth');
    sessionStorage.removeItem('mep_admin_user');
    window.location.href = 'admin-login.html';
  });

  /* ── DASHBOARD ──────────────────────────────────────────── */
  function renderDashboard() {
    const avgProgress = Math.round(schools.reduce((a, s) => a + s.fundingProgress, 0) / (schools.length || 1));
    const totalNeeds  = schools.reduce((a, s) => a + s.needs.length, 0);

    document.getElementById('dashboardStats').innerHTML = `
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="stat-card__number">${schools.length}</div>
        <div class="stat-card__label">Escuelas registradas</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div class="stat-card__number">${totalNeeds}</div>
        <div class="stat-card__label">Necesidades registradas</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="stat-card__number">${solicitudes.length}</div>
        <div class="stat-card__label">Solicitudes recibidas</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
        <div class="stat-card__number">${avgProgress}%</div>
        <div class="stat-card__label">Progreso promedio</div>
      </div>`;
  }

  /* ── SCHOOLS TABLE ──────────────────────────────────────── */
  function getStatusBadge(progress) {
    if (progress >= 80) return `<span class="tbl-badge tbl-badge--green">Casi completa</span>`;
    if (progress >= 50) return `<span class="tbl-badge tbl-badge--orange">En progreso</span>`;
    return `<span class="tbl-badge tbl-badge--gray">Iniciando</span>`;
  }

  function renderSchoolsTable() {
    const q = searchQuery.toLowerCase();
    const filtered = schools.filter(s =>
      s.name.toLowerCase().includes(q) || s.county.toLowerCase().includes(q)
    );

    const tbody  = document.getElementById('schoolsTableBody');
    const empty  = document.getElementById('schoolsEmpty');

    empty.classList.toggle('hidden', filtered.length > 0);

    tbody.innerHTML = filtered.map(school => `
      <tr>
        <td>
          <div style="font-weight:600">${school.name}</div>
          <div style="font-size:0.8125rem;color:var(--color-fg-muted);margin-top:2px">${school.needs.length} necesidades</div>
        </td>
        <td>${school.county}</td>
        <td><div style="font-size:0.8125rem;line-height:1.5">${school.donationTypes.join(', ')}</div></td>
        <td>${getStatusBadge(school.fundingProgress)}</td>
        <td>
          <div class="tbl-progress">
            <div class="tbl-progress-track">
              <div class="tbl-progress-fill" style="width:${school.fundingProgress}%"></div>
            </div>
            <span style="font-size:0.8125rem;font-weight:600;min-width:36px">${school.fundingProgress}%</span>
          </div>
        </td>
        <td>
          <div class="tbl-actions">
            <button class="tbl-btn" title="Editar" data-action="edit" data-id="${school.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="tbl-btn tbl-btn--danger" title="Eliminar" data-action="delete" data-id="${school.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`).join('');

    // Stats
    const avgProg = schools.length
      ? Math.round(schools.reduce((a, s) => a + s.fundingProgress, 0) / schools.length)
      : 0;

    document.getElementById('schoolStats').innerHTML = `
      <div class="stat-card">
        <div class="stat-card__number" style="color:var(--color-primary)">${schools.length}</div>
        <div class="stat-card__label">Total de Escuelas</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__number" style="color:var(--color-primary)">${schools.reduce((a, s) => a + s.needs.length, 0)}</div>
        <div class="stat-card__label">Necesidades Registradas</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__number" style="color:var(--color-primary)">${avgProg}%</div>
        <div class="stat-card__label">Progreso Promedio</div>
      </div>`;
  }

  // Search
  document.getElementById('schoolSearch').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderSchoolsTable();
  });

  // Table click delegation
  document.getElementById('schoolsTableBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === 'edit')   openEditForm(id);
    if (action === 'delete') openDeleteModal(id);
  });

  /* ── ADD / EDIT FORM ────────────────────────────────────── */
  document.getElementById('showAddSchoolBtn').addEventListener('click', openAddForm);
  document.getElementById('cancelSchoolFormBtn').addEventListener('click',  () => showSection('escuelas'));
  document.getElementById('cancelSchoolFormBtn2').addEventListener('click', () => showSection('escuelas'));

  function openAddForm() {
    editingId = null;
    needs = [];
    document.getElementById('schoolFormTitle').textContent = 'Agregar Nueva Escuela';
    document.getElementById('saveSchoolBtn').innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Guardar Escuela`;
    resetForm();
    showSection('school-form');
  }

  function openEditForm(id) {
    const school = schools.find(s => s.id === id);
    if (!school) return;
    editingId = id;
    needs = [...school.needs];

    document.getElementById('schoolFormTitle').textContent = 'Editar Escuela';
    document.getElementById('saveSchoolBtn').innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Actualizar Escuela`;

    document.getElementById('sf-name').value        = school.name;
    document.getElementById('sf-county').value      = school.county;
    document.getElementById('sf-description').value = school.description;
    document.getElementById('sf-image').value       = school.image || '';
    document.getElementById('sf-funding').value     = school.fundingProgress;
    document.getElementById('sf-materials').value   = school.materialsProgress;
    document.getElementById('sf-volunteer').value   = school.volunteerHoursProgress;

    // Checkboxes
    document.querySelectorAll('#sf-donationTypes input[type=checkbox]').forEach(cb => {
      cb.checked = school.donationTypes.includes(cb.value);
    });

    renderNeeds();
    showSection('school-form');
  }

  function resetForm() {
    document.getElementById('schoolForm').reset();
    document.getElementById('sf-funding').value   = 0;
    document.getElementById('sf-materials').value = 0;
    document.getElementById('sf-volunteer').value = 0;
    needs = [];
    renderNeeds();
  }

  /* Needs builder */
  function renderNeeds() {
    const list = document.getElementById('needsList');
    list.innerHTML = needs.map((n, i) => `
      <span class="need-chip">
        ${n}
        <button type="button" class="need-chip__remove" data-index="${i}" aria-label="Quitar ${n}">×</button>
      </span>`).join('');
  }

  document.getElementById('needsList').addEventListener('click', e => {
    const btn = e.target.closest('[data-index]');
    if (!btn) return;
    needs.splice(Number(btn.dataset.index), 1);
    renderNeeds();
  });

  function addNeed() {
    const input = document.getElementById('needsInput');
    const val   = input.value.trim();
    if (!val) return;
    // Allow comma-separated entry
    val.split(',').forEach(v => {
      const trimmed = v.trim();
      if (trimmed && !needs.includes(trimmed)) needs.push(trimmed);
    });
    input.value = '';
    renderNeeds();
    input.focus();
  }

  document.getElementById('addNeedBtn').addEventListener('click', addNeed);
  document.getElementById('needsInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addNeed(); }
  });

  /* Form submit */
  document.getElementById('schoolForm').addEventListener('submit', e => {
    e.preventDefault();

    const donationTypes = [...document.querySelectorAll('#sf-donationTypes input:checked')].map(cb => cb.value);
    if (donationTypes.length === 0) {
      showToast('Selecciona al menos un tipo de apoyo.', true);
      return;
    }

    const data = {
      name:                  document.getElementById('sf-name').value.trim(),
      county:                document.getElementById('sf-county').value,
      description:           document.getElementById('sf-description').value.trim(),
      image:                 document.getElementById('sf-image').value.trim() || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
      donationTypes,
      needs:                 [...needs],
      fundingProgress:       Math.min(100, Math.max(0, Number(document.getElementById('sf-funding').value))),
      materialsProgress:     Math.min(100, Math.max(0, Number(document.getElementById('sf-materials').value))),
      volunteerHoursProgress:Math.min(100, Math.max(0, Number(document.getElementById('sf-volunteer').value))),
      location:              document.getElementById('sf-county').value,
    };

    if (editingId) {
      const idx = schools.findIndex(s => s.id === editingId);
      schools[idx] = { ...schools[idx], ...data };
      showToast('Escuela actualizada correctamente.');
    } else {
      data.id = String(Date.now());
      schools.push(data);
      showToast('Escuela agregada correctamente.');
    }

    saveSchools();
    showSection('escuelas');
  });

  /* ── DELETE MODAL ───────────────────────────────────────── */
  const deleteModal  = document.getElementById('deleteModal');
  const deleteBodyEl = document.getElementById('deleteModalBody');

  function openDeleteModal(id) {
    const school = schools.find(s => s.id === id);
    if (!school) return;
    deleteTarget = id;
    deleteBodyEl.textContent = `¿Estás seguro de que quieres eliminar "${school.name}"? Esta acción no se puede deshacer.`;
    deleteModal.classList.remove('hidden');
  }

  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    deleteTarget = null;
  });

  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (!deleteTarget) return;
    schools = schools.filter(s => s.id !== deleteTarget);
    saveSchools();
    deleteModal.classList.add('hidden');
    deleteTarget = null;
    renderSchoolsTable();
    showToast('Escuela eliminada.');
  });

  deleteModal.addEventListener('click', e => {
    if (e.target === deleteModal) {
      deleteModal.classList.add('hidden');
      deleteTarget = null;
    }
  });

  /* ── NECESIDADES ────────────────────────────────────────── */
  function renderNecesidades() {
    const container = document.getElementById('necesidadesContent');
    if (schools.length === 0) {
      container.innerHTML = `<p style="color:var(--color-fg-muted)">No hay escuelas registradas.</p>`;
      return;
    }
    container.innerHTML = `<div style="display:flex;flex-direction:column;gap:var(--space-4)">` +
      schools.map(school => `
        <div class="needs-school-card">
          <div class="needs-school-card__header">
            <div>
              <div class="needs-school-card__name">${school.name}</div>
              <div class="needs-school-card__county">${school.county}</div>
            </div>
            <button class="btn btn--outline-neutral btn--sm" data-action="edit-needs" data-id="${school.id}">
              Editar necesidades
            </button>
          </div>
          <div class="needs-tags">
            ${school.needs.length
              ? school.needs.map(n => `<span class="needs-tag">${n}</span>`).join('')
              : `<span style="font-size:0.875rem;color:var(--color-fg-muted)">Sin necesidades registradas</span>`}
          </div>
        </div>`).join('') + `</div>`;

    container.querySelectorAll('[data-action="edit-needs"]').forEach(btn => {
      btn.addEventListener('click', () => openEditForm(btn.dataset.id));
    });
  }

  /* ── SOLICITUDES ─────────────────────────────────────────── */
  function renderSolicitudes() {
    const container = document.getElementById('solicitudesContent');
    if (solicitudes.length === 0) {
      container.innerHTML = `<p style="color:var(--color-fg-muted)">No hay solicitudes recibidas.</p>`;
      return;
    }
    container.innerHTML = `<div style="display:flex;flex-direction:column;gap:var(--space-4)">` +
      solicitudes.map(s => `
        <div class="solicitud-card">
          <div>
            <div class="solicitud-card__name">${s.nombre}</div>
            <div class="solicitud-card__inst">${s.institucion} · ${s.municipio}</div>
            <div class="solicitud-card__detail">
              <strong>Tipo:</strong> ${s.tipo} &nbsp;|&nbsp;
              <strong>Participación:</strong> ${s.forma}
            </div>
            <div class="solicitud-card__detail">
              <strong>Contacto:</strong> ${s.telefono} · ${s.correo}
            </div>
            ${s.notas ? `<div class="solicitud-card__detail"><strong>Notas:</strong> ${s.notas}</div>` : ''}
          </div>
          <div class="solicitud-card__actions">
            <button class="tbl-btn tbl-btn--danger" data-del-sol="${s.id}" title="Eliminar solicitud">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>`).join('') + `</div>`;

    container.querySelectorAll('[data-del-sol]').forEach(btn => {
      btn.addEventListener('click', () => {
        solicitudes = solicitudes.filter(s => s.id !== btn.dataset.delSol);
        localStorage.setItem('mep_solicitudes', JSON.stringify(solicitudes));
        renderSolicitudes();
        showToast('Solicitud eliminada.');
      });
    });
  }

  /* ── TOAST ───────────────────────────────────────────────── */
  let toastTimer;
  function showToast(msg, isError = false) {
    const toast    = document.getElementById('toast');
    const toastTxt = document.getElementById('toastText');
    const toastIcon= toast.querySelector('.toast__icon');

    toastTxt.textContent = msg;
    toastIcon.style.color = isError ? '#f87171' : '#4ade80';
    toast.classList.remove('hidden', 'is-leaving');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.classList.add('hidden'), 250);
    }, 3000);
  }

  /* ── INIT ───────────────────────────────────────────────── */
  showSection('dashboard');

})();
