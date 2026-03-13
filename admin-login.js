/* ============================================================
   MI ESCUELA PRIMERO — admin-login.js
   ============================================================ */
(function () {
  'use strict';

  const DEMO_EMAIL    = 'admin@escuelasprimero.org';
  const DEMO_PASSWORD = 'admin123';

  const form         = document.getElementById('loginForm');
  const emailInput   = document.getElementById('loginEmail');
  const passwordInput= document.getElementById('loginPassword');
  const loginBtn     = document.getElementById('loginBtn');
  const loginBtnText = document.getElementById('loginBtnText');
  const loginSpinner = document.getElementById('loginSpinner');
  const loginError   = document.getElementById('loginError');
  const loginErrorText = document.getElementById('loginErrorText');
  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon      = document.getElementById('eyeIcon');

  /* Password visibility toggle */
  togglePassword.addEventListener('click', () => {
    const isText = passwordInput.type === 'text';
    passwordInput.type = isText ? 'password' : 'text';
    eyeIcon.innerHTML = isText
      ? `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`
      : `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  });

  /* Form submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');

    const email    = emailInput.value.trim();
    const password = passwordInput.value;

    // Show loading
    loginBtnText.textContent = 'Verificando...';
    loginSpinner.classList.remove('hidden');
    loginBtn.disabled = true;

    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        // Store session flag
        sessionStorage.setItem('mep_admin_auth', 'true');
        sessionStorage.setItem('mep_admin_user', email);
        window.location.href = 'admin-dashboard.html';
      } else {
        loginBtnText.textContent = 'Entrar al Panel';
        loginSpinner.classList.add('hidden');
        loginBtn.disabled = false;
        loginError.classList.remove('hidden');
        loginErrorText.textContent = 'Correo o contraseña incorrectos. Intenta con las credenciales demo.';
        passwordInput.value = '';
        passwordInput.focus();
      }
    }, 900);
  });

  /* Redirect if already logged in */
  if (sessionStorage.getItem('mep_admin_auth') === 'true') {
    window.location.href = 'admin-dashboard.html';
  }
})();
