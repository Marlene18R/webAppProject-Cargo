/* ============================================================
   MI ESCUELA PRIMERO — donante.js
   Letter form: validation, inline field styling, submit flow
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM REFS ───────────────────────────────────────────── */
  const form             = document.getElementById('donorForm');
  const formState        = document.getElementById('formState');
  const successState     = document.getElementById('successState');
  const successName      = document.getElementById('successName');
  const submitBtn        = document.getElementById('submitBtn');

  const fields = {
    nombreContacto:   document.getElementById('nombreContacto'),
    nombreInstitucion:document.getElementById('nombreInstitucion'),
    municipio:        document.getElementById('municipio'),
    tipoInstitucion:  document.getElementById('tipoInstitucion'),
    formaParticipacion:document.getElementById('formaParticipacion'),
    telefono:         document.getElementById('telefono'),
    correo:           document.getElementById('correo'),
    notasAdicionales: document.getElementById('notasAdicionales'),
  };

  const required = ['nombreContacto','nombreInstitucion','municipio',
                    'tipoInstitucion','formaParticipacion','telefono','correo'];

  /* ── PRE-FILL FROM URL PARAMS ───────────────────────────── */
  function prefillFromParams() {
    const params = new URLSearchParams(window.location.search);

    // ?school=Escuela+Rural+La+Esperanza  or  ?category=Material+Educativo
    const school   = params.get('school');
    const category = params.get('category');

    if (!school && !category) return;

    const banner = document.createElement('div');
    banner.className = 'context-banner';

    if (school) {
      banner.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Apoyando a: <strong>${school}</strong>`;
      // Pre-fill notas
      fields.notasAdicionales.value = `Me gustaría apoyar específicamente a la escuela: ${school}.`;
    } else if (category) {
      banner.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        Área de interés: <strong>${category}</strong>`;
      fields.notasAdicionales.value = `Me interesa apoyar en el área de: ${category}.`;
    }

    // Insert banner before the letter body
    const letterBody = document.querySelector('.letter-body');
    letterBody.parentNode.insertBefore(banner, letterBody);

    // Update filled state for notes field
    markFilled(fields.notasAdicionales);
  }

  /* ── VALIDATION ─────────────────────────────────────────── */
  function isValid() {
    return required.every(key => {
      const el = fields[key];
      return el && el.value.trim() !== '';
    });
  }

  function updateSubmitBtn() {
    submitBtn.disabled = !isValid();
  }

  /* ── FILLED STATE STYLING ───────────────────────────────── */
  function markFilled(el) {
    if (el.value.trim()) {
      el.classList.add('is-filled');
    } else {
      el.classList.remove('is-filled');
    }
  }

  /* ── WIRE UP FIELDS ─────────────────────────────────────── */
  Object.values(fields).forEach(el => {
    if (!el) return;
    const events = el.tagName === 'SELECT' ? ['change'] : ['input', 'change'];
    events.forEach(ev => {
      el.addEventListener(ev, () => {
        markFilled(el);
        updateSubmitBtn();
      });
    });
  });

  /* ── SUBMIT ─────────────────────────────────────────────── */
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!isValid()) return;

    const name = fields.nombreContacto.value.trim();

    // Persist to localStorage so admin/solicitudes.html can display it
    try {
      const payload = {};
      Object.entries(fields).forEach(([k, el]) => { if (el) payload[k] = el.value.trim(); });
      const list = JSON.parse(localStorage.getItem('mep_submissions') || '[]');
      list.unshift({ ...payload, id: Date.now(), receivedAt: new Date().toLocaleString('es-MX') });
      localStorage.setItem('mep_submissions', JSON.stringify(list));
    } catch (e) {}

    // Show success
    formState.classList.add('hidden');
    successName.textContent = name;
    successState.classList.remove('hidden');

    // Reset form after a delay (ready for another submission)
    setTimeout(() => {
      form.reset();
      Object.values(fields).forEach(el => el && el.classList.remove('is-filled'));
      updateSubmitBtn();
    }, 500);
  });

  /* ── INIT ───────────────────────────────────────────────── */
  prefillFromParams();
  updateSubmitBtn();

})();
