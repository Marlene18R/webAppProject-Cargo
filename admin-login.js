/* admin-login.js */
(function () {
  'use strict';

  const DEMO_EMAIL    = 'admin@miescuela.org';
  const DEMO_PASSWORD = 'admin123';

  const form          = document.getElementById('loginForm');
  const emailInput    = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const loginBtn      = document.getElementById('loginBtn');
  const loginBtnText  = document.getElementById('loginBtnText');
  const loginSpinner  = document.getElementById('loginSpinner');
  const loginError    = document.getElementById('loginError');
  const loginErrorText= document.getElementById('loginErrorText');
  const togglePwdBtn  = document.getElementById('togglePassword');
  const eyeIcon       = document.getElementById('eyeIcon');

  /* Redirect if already authenticated */
  if (sessionStorage.getItem('mep_admin_auth') === 'true') {
    window.location.href = 'admin-dashboard.html';
    return;
  }

  /* Password toggle */
  togglePwdBtn.addEventListener('click', function () {
    var isText = passwordInput.type === 'text';
    passwordInput.type = isText ? 'password' : 'text';
    eyeIcon.innerHTML = isText
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  });

  /* Submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    loginError.classList.add('hidden');

    var email    = emailInput.value.trim();
    var password = passwordInput.value;

    loginBtnText.textContent = 'Iniciando sesión...';
    loginSpinner.classList.remove('hidden');
    loginBtn.disabled = true;

    setTimeout(function () {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        sessionStorage.setItem('mep_admin_auth', 'true');
        sessionStorage.setItem('mep_admin_user', email);
        window.location.href = 'admin-dashboard.html';
      } else {
        loginBtnText.textContent = 'Iniciar Sesión';
        loginSpinner.classList.add('hidden');
        loginBtn.disabled = false;
        loginError.classList.remove('hidden');
        loginErrorText.textContent = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
        passwordInput.value = '';
        passwordInput.focus();
      }
    }, 500);
  });
})();
