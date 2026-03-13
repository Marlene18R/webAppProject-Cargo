/* ============================================================
   MI ESCUELA PRIMERO — admin-dashboard.js  (v3)
   ============================================================ */
(function () {
  'use strict';

  /* ── AUTH GUARD ── */
  if (sessionStorage.getItem('mep_admin_auth') !== 'true') {
    window.location.href = 'admin-login.html';
    return;
  }

  var adminUser = sessionStorage.getItem('mep_admin_user') || 'admin@miescuela.org';
  document.getElementById('topbarUserName').textContent = adminUser.split('@')[0];

  /* ── DEFAULT DATA ── */
  var DEFAULT_SCHOOLS = [
    { id: '1', name: 'Escuela Rural La Esperanza', county: 'Zapopan', nivel: 'Primaria', students: 150, teachers: 10,
      description: 'Escuela rural que atiende a 150 estudiantes. Necesita materiales educativos y mejoras en infraestructura.',
      phone: '', email: 'esperanza@edu.mx', address: 'Av. Principal 100, Zapopan', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      needs: ['Libros', 'Computadoras', 'Útiles Escolares', 'Infraestructura'],
      donationTypes: ['Económica', 'En especie', 'Voluntariado'],
      fundingProgress: 65, materialsProgress: 40, volunteerHoursProgress: 80 },
    { id: '2', name: 'Escuela Comunidad Unida', county: 'San Juan de los Lagos', nivel: 'Secundaria', students: 200, teachers: 14,
      description: 'Enfocada en educación ambiental y desarrollo comunitario.',
      phone: '', email: 'comunidadunida@edu.mx', address: 'Calle Reforma 200, SJL', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
      needs: ['Tecnología', 'Equipo Deportivo', 'Materiales de Arte'],
      donationTypes: ['En especie', 'Talleres', 'Vinculación'],
      fundingProgress: 45, materialsProgress: 70, volunteerHoursProgress: 55 },
    { id: '3', name: 'Escuela Nueva Generación', county: 'San Juan de los Lagos', nivel: 'Primaria', students: 300, teachers: 20,
      description: 'Escuela urbana con más de 300 estudiantes de familias de bajos ingresos.',
      phone: '', email: 'nuevagen@edu.mx', address: 'Blvd. Independencia 50, SJL', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
      needs: ['Biblioteca', 'Laboratorio de Ciencias', 'Instrumentos Musicales'],
      donationTypes: ['Económica', 'Talleres', 'Voluntariado'],
      fundingProgress: 80, materialsProgress: 60, volunteerHoursProgress: 90 },
    { id: '4', name: 'Escuela Montaña Verde', county: 'Arandas', nivel: 'Preescolar', students: 80, teachers: 6,
      description: 'Escuela de montaña con énfasis en agricultura y sostenibilidad.',
      phone: '', email: 'montanaverde@edu.mx', address: 'Camino Real s/n, Arandas', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      needs: ['Herramientas de Jardinería', 'Semillas', 'Materiales Educativos'],
      donationTypes: ['En especie', 'Vinculación', 'Voluntariado'],
      fundingProgress: 30, materialsProgress: 25, volunteerHoursProgress: 40 },
    { id: '5', name: 'Escuela Futuro Brillante', county: 'Tlaquepaque', nivel: 'Primaria', students: 240, teachers: 16,
      description: 'Enfoque en integración tecnológica y alfabetización digital.',
      phone: '', email: 'futurobrillante@edu.mx', address: 'Calle Juárez 77, Tlaquepaque', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      needs: ['Tablets', 'Proyectores', 'Licencias de Software'],
      donationTypes: ['Económica', 'Talleres', 'En especie'],
      fundingProgress: 90, materialsProgress: 85, volunteerHoursProgress: 70 },
    { id: '6', name: 'Escuela Sol del Pacífico', county: 'Zapopan', nivel: 'Secundaria', students: 190, teachers: 13,
      description: 'Promueve el patrimonio cultural y las artes tradicionales.',
      phone: '', email: 'solpacifico@edu.mx', address: 'Paseo del Sol 33, Zapopan', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
      needs: ['Materiales de Arte', 'Materiales Culturales', 'Equipo Deportivo'],
      donationTypes: ['En especie', 'Talleres', 'Vinculación'],
      fundingProgress: 50, materialsProgress: 45, volunteerHoursProgress: 60 },
  ];

  var SAMPLE_SOLICITUDES = [
    { id: 's1', nombre: 'María González', institucion: 'Universidad de Guadalajara', municipio: 'Zapopan', tipo: 'Academia', forma: 'Como aliado/a', telefono: '331-555-0101', correo: 'mgonzalez@udg.mx', notas: '' },
    { id: 's2', nombre: 'Carlos Ramírez', institucion: 'Corporativo Ramirez SA', municipio: 'Guadalajara', tipo: 'Empresa', forma: 'Como voluntario', telefono: '331-555-0202', correo: 'carlos@corp.com', notas: 'Queremos apoyar con equipo de cómputo.' },
    { id: 's3', nombre: 'Ana Patricia Rojas', institucion: 'Comunidad Colonia Centro', municipio: 'Tlaquepaque', tipo: 'Comunidad', forma: 'Como líder comunitario', telefono: '331-555-0303', correo: 'anarojas@gmail.com', notas: '' },
  ];

  var RECENT_ACTIVITY = [
    { type: 'Nueva solicitud',     message: 'Solicitud de alianza de Empresa XYZ', time: 'Hace 2 horas' },
    { type: 'Escuela actualizada', message: 'Escuela La Esperanza actualizó su progreso', time: 'Hace 5 horas' },
    { type: 'Nueva necesidad',     message: 'Escuela Comunidad Unida agregó nueva necesidad', time: 'Hace 1 día' },
    { type: 'Aliado confirmado',   message: 'Fundación ABC confirmó apoyo', time: 'Hace 2 días' },
  ];

  /* ── STATE ── */
  var schools      = JSON.parse(localStorage.getItem('mep_schools') || 'null') || DEFAULT_SCHOOLS;
  var solicitudes  = JSON.parse(localStorage.getItem('mep_solicitudes') || 'null') || SAMPLE_SOLICITUDES;
  var needs        = [];
  var editingId    = null;
  var deleteTarget = null;
  var searchQuery  = '';

  function saveSchools() { localStorage.setItem('mep_schools', JSON.stringify(schools)); }

  /* ── SECTION NAVIGATION ── */
  var titleMap = { dashboard: 'Dashboard', escuelas: 'Gestión de Escuelas', 'school-form': 'Gestión de Escuelas', necesidades: 'Necesidades', solicitudes: 'Solicitudes' };
  var allSections = ['dashboard', 'escuelas', 'school-form', 'necesidades', 'solicitudes'];

  function showSection(name) {
    allSections.forEach(function (s) {
      document.getElementById('section-' + s).classList.toggle('hidden', s !== name);
    });
    document.getElementById('pageTitle').textContent = titleMap[name] || name;
    var activeKey = name === 'school-form' ? 'escuelas' : name;
    document.querySelectorAll('.admin-nav-link[data-section]').forEach(function (link) {
      link.classList.toggle('admin-nav-link--active', link.dataset.section === activeKey);
    });
    if (name === 'dashboard')   renderDashboard();
    if (name === 'escuelas')    renderEscuelas();
    if (name === 'necesidades') renderNecesidades();
    if (name === 'solicitudes') renderSolicitudes();
  }

  document.querySelectorAll('.admin-nav-link[data-section]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showSection(link.dataset.section);
      closeSidebar();
    });
  });

  /* ── SIDEBAR MOBILE ── */
  var sidebar = document.getElementById('adminSidebar');
  document.getElementById('sidebarToggle').addEventListener('click', function () { sidebar.classList.toggle('is-open'); });
  function closeSidebar() { sidebar.classList.remove('is-open'); }
  document.addEventListener('click', function (e) {
    if (sidebar.classList.contains('is-open') && !sidebar.contains(e.target) && e.target !== document.getElementById('sidebarToggle')) closeSidebar();
  });

  /* ── LOGOUT ── */
  document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('mep_admin_auth');
    sessionStorage.removeItem('mep_admin_user');
    window.location.href = 'admin-login.html';
  });

  /* ── DASHBOARD ── */
  function renderDashboard() {
    var activeSchools = schools.filter(function (s) { return s.fundingProgress < 100; }).length;
    var pendingNeeds  = schools.reduce(function (a, s) { return a + s.needs.length; }, 0);

    document.getElementById('dashboardMetrics').innerHTML =
      metricCard('Escuelas Activas', activeSchools, schoolIcon(), '+12% vs mes anterior') +
      metricCard('Necesidades Pendientes', pendingNeeds, listIcon(), '-8% vs mes anterior') +
      metricCard('Solicitudes Recibidas', solicitudes.length + 44, docIcon(), '+24% vs mes anterior') +
      metricCard('Aliados Activos', 23, usersIcon(), '+5% vs mes anterior');

    document.getElementById('recentActivity').innerHTML = RECENT_ACTIVITY.map(function (a) {
      return '<div class="activity-item"><div class="activity-dot"></div><div><div class="activity-type">' + a.type + '</div><div class="activity-message">' + a.message + '</div><div class="activity-time">' + a.time + '</div></div></div>';
    }).join('');

    document.getElementById('schoolProgress').innerHTML = schools.slice(0, 4).map(function (s) {
      return '<div class="progress-row"><div class="progress-row__header"><span class="progress-row__name">' + s.name + '</span><span class="progress-row__pct">' + s.fundingProgress + '%</span></div><div class="progress-track"><div class="progress-fill" style="width:' + s.fundingProgress + '%"></div></div></div>';
    }).join('');
  }

  function metricCard(label, value, iconSvg, trend) {
    return '<div class="metric-card"><div class="metric-card__left"><div class="metric-card__label">' + label + '</div><div class="metric-card__value">' + value + '</div><div class="metric-card__trend">' + trendArrow() + trend + '</div></div><div class="metric-card__icon">' + iconSvg + '</div></div>';
  }
  function trendArrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'; }
  function schoolIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'; }
  function listIcon()   { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'; }
  function docIcon()    { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'; }
  function usersIcon()  { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'; }

  /* ── ESCUELAS TABLE ── */
  function renderEscuelas() {
    var q = searchQuery.toLowerCase();
    var filtered = schools.filter(function (s) {
      return s.name.toLowerCase().includes(q) || s.county.toLowerCase().includes(q);
    });

    var tbody = document.getElementById('schoolsTableBody');
    var empty = document.getElementById('schoolsEmpty');
    empty.classList.toggle('hidden', filtered.length > 0);

    tbody.innerHTML = filtered.map(function (school) {
      return '<tr>' +
        '<td><div style="font-weight:600">' + school.name + '</div><div style="font-size:0.8125rem;color:var(--color-fg-muted);margin-top:2px">' + school.needs.length + ' necesidades</div></td>' +
        '<td>' + school.county + '</td>' +
        '<td style="font-size:0.8125rem">' + school.donationTypes.join(', ') + '</td>' +
        '<td>' + statusBadge(school.fundingProgress) + '</td>' +
        '<td><div class="tbl-progress"><div class="tbl-progress-track"><div class="tbl-progress-fill" style="width:' + school.fundingProgress + '%"></div></div><span style="font-size:0.8125rem;font-weight:600;min-width:36px">' + school.fundingProgress + '%</span></div></td>' +
        '<td><div class="tbl-actions">' +
          '<button class="tbl-btn" data-action="edit" data-id="' + school.id + '" title="Editar">' + editIcon() + '</button>' +
          '<button class="tbl-btn tbl-btn--danger" data-action="delete" data-id="' + school.id + '" title="Eliminar">' + trashIcon() + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    // Summary stats
    var avg = schools.length ? Math.round(schools.reduce(function (a, s) { return a + s.fundingProgress; }, 0) / schools.length) : 0;
    document.getElementById('schoolStats').innerHTML =
      '<div class="stat-card"><div class="stat-card__number">' + schools.length + '</div><div class="stat-card__label">Total de Escuelas</div></div>' +
      '<div class="stat-card"><div class="stat-card__number">' + schools.reduce(function (a, s) { return a + s.needs.length; }, 0) + '</div><div class="stat-card__label">Necesidades Registradas</div></div>' +
      '<div class="stat-card"><div class="stat-card__number">' + avg + '%</div><div class="stat-card__label">Progreso Promedio</div></div>';
  }

  function statusBadge(p) {
    if (p >= 80) return '<span class="tbl-badge tbl-badge--green">Casi completa</span>';
    if (p >= 50) return '<span class="tbl-badge tbl-badge--orange">En progreso</span>';
    return '<span class="tbl-badge tbl-badge--gray">Iniciando</span>';
  }
  function editIcon()  { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'; }
  function trashIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>'; }

  /* Search */
  document.getElementById('schoolSearch').addEventListener('input', function (e) {
    searchQuery = e.target.value;
    renderEscuelas();
  });

  /* Table click delegation */
  document.getElementById('schoolsTableBody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'edit')   openEditForm(btn.dataset.id);
    if (btn.dataset.action === 'delete') openDeleteModal(btn.dataset.id);
  });

  /* ── ADD / EDIT SCHOOL FORM ── */
  document.getElementById('showAddSchoolBtn').addEventListener('click', openAddForm);
  document.getElementById('cancelSchoolFormBtn').addEventListener('click',  function () { showSection('escuelas'); });
  document.getElementById('cancelSchoolFormBtn2').addEventListener('click', function () { showSection('escuelas'); });
  document.getElementById('saveSchoolBtnTop').addEventListener('click', function () { document.getElementById('schoolForm').requestSubmit(); });

  // Donation type checkbox styling
  document.getElementById('sf-donationTypes').addEventListener('change', function () {
    document.querySelectorAll('.donation-type-option').forEach(function (label) {
      label.classList.toggle('is-checked', label.querySelector('input').checked);
    });
  });

  // Image preview
  document.getElementById('sf-image').addEventListener('input', function () {
    var url = this.value.trim();
    var wrap = document.getElementById('imagePreviewWrap');
    var img  = document.getElementById('imagePreview');
    if (url) { img.src = url; wrap.style.display = 'block'; }
    else { wrap.style.display = 'none'; }
  });

  function openAddForm() {
    editingId = null; needs = [];
    document.getElementById('schoolFormTitle').textContent = 'Agregar Nueva Escuela';
    resetSchoolForm();
    showSection('school-form');
    window.scrollTo(0, 0);
  }

  function openEditForm(id) {
    var school = schools.find(function (s) { return s.id === id; });
    if (!school) return;
    editingId = id; needs = school.needs.slice();
    document.getElementById('schoolFormTitle').textContent = 'Editar Escuela';
    document.getElementById('sf-name').value        = school.name;
    document.getElementById('sf-county').value      = school.county;
    document.getElementById('sf-nivel').value       = school.nivel || '';
    document.getElementById('sf-students').value    = school.students || '';
    document.getElementById('sf-teachers').value    = school.teachers || '';
    document.getElementById('sf-phone').value       = school.phone || '';
    document.getElementById('sf-email').value       = school.email || '';
    document.getElementById('sf-address').value     = school.address || '';
    document.getElementById('sf-description').value = school.description;
    document.getElementById('sf-image').value       = school.image || '';
    document.getElementById('sf-funding').value     = school.fundingProgress;
    document.getElementById('sf-materials').value   = school.materialsProgress;
    document.getElementById('sf-volunteer').value   = school.volunteerHoursProgress;

    var imgUrl = school.image || '';
    document.getElementById('imagePreviewWrap').style.display = imgUrl ? 'block' : 'none';
    document.getElementById('imagePreview').src = imgUrl;

    document.querySelectorAll('#sf-donationTypes input[type=checkbox]').forEach(function (cb) {
      cb.checked = school.donationTypes.includes(cb.value);
      cb.closest('.donation-type-option').classList.toggle('is-checked', cb.checked);
    });
    renderNeeds();
    showSection('school-form');
    window.scrollTo(0, 0);
  }

  function resetSchoolForm() {
    document.getElementById('schoolForm').reset();
    document.getElementById('sf-funding').value   = 0;
    document.getElementById('sf-materials').value = 0;
    document.getElementById('sf-volunteer').value = 0;
    document.getElementById('imagePreviewWrap').style.display = 'none';
    document.querySelectorAll('.donation-type-option').forEach(function (l) { l.classList.remove('is-checked'); });
    needs = [];
    renderNeeds();
  }

  /* Needs */
  function renderNeeds() {
    var list = document.getElementById('needsList');
    var hint = document.getElementById('needsEmptyHint');
    hint.style.display = needs.length ? 'none' : 'block';
    list.innerHTML = needs.map(function (n, i) {
      return '<span class="need-chip">' + n +
        '<button type="button" class="need-chip__remove" data-idx="' + i + '" aria-label="Quitar ' + n + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button></span>';
    }).join('');
  }

  document.getElementById('needsList').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-idx]');
    if (!btn) return;
    needs.splice(Number(btn.dataset.idx), 1);
    renderNeeds();
  });

  function addNeed() {
    var input = document.getElementById('needsInput');
    var val   = input.value.trim();
    if (!val) return;
    val.split(',').forEach(function (v) {
      var t = v.trim();
      if (t && !needs.includes(t)) needs.push(t);
    });
    input.value = '';
    renderNeeds();
    input.focus();
  }

  document.getElementById('addNeedBtn').addEventListener('click', addNeed);
  document.getElementById('needsInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); addNeed(); }
  });

  /* Form submit */
  document.getElementById('schoolForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var donationTypes = Array.from(document.querySelectorAll('#sf-donationTypes input:checked')).map(function (cb) { return cb.value; });
    if (!donationTypes.length) { showToast('Selecciona al menos un tipo de apoyo.'); return; }

    var data = {
      name:                   document.getElementById('sf-name').value.trim(),
      county:                 document.getElementById('sf-county').value,
      nivel:                  document.getElementById('sf-nivel').value,
      students:               Number(document.getElementById('sf-students').value) || 0,
      teachers:               Number(document.getElementById('sf-teachers').value) || 0,
      phone:                  document.getElementById('sf-phone').value.trim(),
      email:                  document.getElementById('sf-email').value.trim(),
      address:                document.getElementById('sf-address').value.trim(),
      description:            document.getElementById('sf-description').value.trim(),
      image:                  document.getElementById('sf-image').value.trim() || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
      donationTypes:          donationTypes,
      needs:                  needs.slice(),
      fundingProgress:        Math.min(100, Math.max(0, Number(document.getElementById('sf-funding').value))),
      materialsProgress:      Math.min(100, Math.max(0, Number(document.getElementById('sf-materials').value))),
      volunteerHoursProgress: Math.min(100, Math.max(0, Number(document.getElementById('sf-volunteer').value))),
    };

    if (editingId) {
      var idx = schools.findIndex(function (s) { return s.id === editingId; });
      schools[idx] = Object.assign({}, schools[idx], data);
      showToast('Escuela actualizada correctamente.');
    } else {
      data.id = String(Date.now());
      schools.push(data);
      showToast('Escuela agregada correctamente.');
    }
    saveSchools();
    showSection('escuelas');
  });

  /* ── DELETE MODAL ── */
  function openDeleteModal(id) {
    var school = schools.find(function (s) { return s.id === id; });
    if (!school) return;
    deleteTarget = id;
    document.getElementById('deleteModalBody').textContent = '¿Estás seguro de que quieres eliminar "' + school.name + '"? Esta acción no se puede deshacer.';
    document.getElementById('deleteModal').classList.remove('hidden');
  }

  document.getElementById('cancelDeleteBtn').addEventListener('click', function () {
    document.getElementById('deleteModal').classList.add('hidden'); deleteTarget = null;
  });
  document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    if (!deleteTarget) return;
    schools = schools.filter(function (s) { return s.id !== deleteTarget; });
    saveSchools();
    document.getElementById('deleteModal').classList.add('hidden');
    deleteTarget = null;
    renderEscuelas();
    showToast('Escuela eliminada.');
  });
  document.getElementById('deleteModal').addEventListener('click', function (e) {
    if (e.target === document.getElementById('deleteModal')) {
      document.getElementById('deleteModal').classList.add('hidden'); deleteTarget = null;
    }
  });

  /* ── NECESIDADES ── */
  function renderNecesidades() {
    var container = document.getElementById('necesidadesContent');
    if (!schools.length) { container.innerHTML = '<p style="color:var(--color-fg-muted)">No hay escuelas registradas.</p>'; return; }
    container.innerHTML = schools.map(function (school) {
      return '<div class="needs-school-card">' +
        '<div class="needs-school-card__header">' +
          '<div><div class="needs-school-card__name">' + school.name + '</div><div class="needs-school-card__county">' + school.county + '</div></div>' +
          '<button class="btn btn--outline-neutral" style="padding:0.375rem 0.875rem;font-size:0.8125rem" data-edit-school="' + school.id + '">Editar necesidades</button>' +
        '</div>' +
        '<div class="needs-tags">' + (school.needs.length
          ? school.needs.map(function (n) { return '<span class="needs-tag">' + n + '</span>'; }).join('')
          : '<span style="font-size:0.875rem;color:var(--color-fg-muted)">Sin necesidades registradas</span>'
        ) + '</div></div>';
    }).join('');

    container.querySelectorAll('[data-edit-school]').forEach(function (btn) {
      btn.addEventListener('click', function () { openEditForm(btn.dataset.editSchool); });
    });
  }

  /* ── SOLICITUDES ── */
  function renderSolicitudes() {
    var container = document.getElementById('solicitudesContent');
    if (!solicitudes.length) { container.innerHTML = '<p style="color:var(--color-fg-muted)">No hay solicitudes recibidas.</p>'; return; }
    container.innerHTML = solicitudes.map(function (s) {
      return '<div class="solicitud-card">' +
        '<div>' +
          '<div class="solicitud-card__name">' + s.nombre + '</div>' +
          '<div class="solicitud-card__inst">' + s.institucion + ' · ' + s.municipio + '</div>' +
          '<div class="solicitud-card__detail"><strong>Tipo:</strong> ' + s.tipo + ' &nbsp;|&nbsp; <strong>Participación:</strong> ' + s.forma + '</div>' +
          '<div class="solicitud-card__detail"><strong>Contacto:</strong> ' + s.telefono + ' · ' + s.correo + '</div>' +
          (s.notas ? '<div class="solicitud-card__detail"><strong>Notas:</strong> ' + s.notas + '</div>' : '') +
        '</div>' +
        '<div class="solicitud-card__actions">' +
          '<button class="tbl-btn tbl-btn--danger" data-del-sol="' + s.id + '" title="Eliminar">' + trashIcon() + '</button>' +
        '</div></div>';
    }).join('');

    container.querySelectorAll('[data-del-sol]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        solicitudes = solicitudes.filter(function (s) { return s.id !== btn.dataset.delSol; });
        localStorage.setItem('mep_solicitudes', JSON.stringify(solicitudes));
        renderSolicitudes();
        showToast('Solicitud eliminada.');
      });
    });
  }

  /* ── TOAST ── */
  var toastTimer;
  function showToast(msg) {
    var toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = msg;
    toast.classList.remove('hidden', 'is-leaving');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.add('is-leaving');
      setTimeout(function () { toast.classList.add('hidden'); }, 250);
    }, 3000);
  }

  /* ── INIT ── */
  showSection('dashboard');

})();
