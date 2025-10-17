// src/auth.js
(function () {
  const API = window.API || 'http://localhost:5000/api';

  // Helpers de storage
  function readFrom(storage) {
    return {
      token: storage.getItem('moon_token') || null,
      userRaw: storage.getItem('moon_user') || null,
      storage,
    };
  }

  function chooseStorage() {
    // 1) Preferencia guardada
    const pref = (localStorage.getItem('moon_storage') || 'local').toLowerCase();
    const prefStore = pref === 'session' ? sessionStorage : localStorage;

    // 2) Miramos ambos storages por si la preferencia quedó desfasada
    const a = readFrom(localStorage);
    const b = readFrom(sessionStorage);

    // Si hay token en la preferencia, listo
    if (prefStore.getItem('moon_token')) return prefStore;

    // Si no, elegimos el que sí tenga token (si alguno tiene)
    if (a.token && !b.token) {
      localStorage.setItem('moon_storage', 'local');
      return localStorage;
    }
    if (b.token && !a.token) {
      localStorage.setItem('moon_storage', 'session');
      return sessionStorage;
    }

    // Si ninguno tiene token, mantenemos preferencia (por consistencia)
    return prefStore;
  }

  function getStore() {
    return chooseStorage();
  }

  function getToken() {
    // Busca en el store elegido; si no encuentra, prueba el otro
    const main = chooseStorage();
    let token = main.getItem('moon_token');
    if (token) return token;

    const other = main === localStorage ? sessionStorage : localStorage;
    token = other.getItem('moon_token');
    if (token) {
      // Reparemos la preferencia para futuros accesos
      localStorage.setItem('moon_storage', other === localStorage ? 'local' : 'session');
      return token;
    }
    return null;
  }

  function getUser() {
    const main = chooseStorage();
    let raw = main.getItem('moon_user');
    if (!raw) {
      const other = main === localStorage ? sessionStorage : localStorage;
      raw = other.getItem('moon_user');
      if (raw) localStorage.setItem('moon_storage', other === localStorage ? 'local' : 'session');
    }
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }

  function clearAuth() {
    for (const s of [localStorage, sessionStorage]) {
      s.removeItem('moon_token');
      s.removeItem('moon_user');
    }
    // dejamos la preferencia como 'local' por defecto
    localStorage.setItem('moon_storage', 'local');
  }

  // fetch con Bearer
  async function apiFetch(url, opts = {}) {
    const token = getToken();
    const headers = new Headers(opts.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...opts, headers });
  }

  // Redirección si no hay token
  function requireAuth(redirectBack = true) {
    if (!getToken()) {
      const back = redirectBack ? `?returnUrl=${encodeURIComponent(location.pathname + location.search)}` : '';
      location.href = `login.html${back}`;
    }
  }

  // Pintar “Hola, {nombre}”
  function renderAuthUI() {
    const cont = document.querySelector('.actions');
    if (!cont) return;

    // Quitar restos previos
    cont.querySelectorAll('.auth-slot').forEach(n => n.remove());

    const token = getToken();
    const user = getUser();

    if (!token) {
      // Ocultar cualquier saludo anterior y asegurar link de login
      let login = cont.querySelector('a.login');
      if (!login) {
        login = document.createElement('a');
        login.className = 'login';
        login.href = 'login.html';
        login.innerHTML = '<i class="bi bi-person-circle"></i>Iniciar sesión';
        cont.appendChild(login);
      }
      return;
    }

    // Si hay token, removemos el link de login
    const loginLink = cont.querySelector('a.login');
    if (loginLink) loginLink.remove();

    const wrap = document.createElement('div');
    wrap.className = 'auth-slot';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '10px';

    const name = (user && (user.nombre || user.name || user.apellidos))
      ? (user.nombre || user.name || user.apellidos)
      : 'Mi cuenta';

    // Botón cerrar sesión
    const btnOut = document.createElement('a');
    btnOut.href = '#';
    btnOut.title = 'Cerrar sesión';
    btnOut.setAttribute('aria-label', 'Cerrar sesión');
    btnOut.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
    btnOut.onclick = (e) => { e.preventDefault(); clearAuth(); location.reload(); };

    const badge = document.createElement('span');
    badge.className = 'muted';
    badge.textContent = name;

    wrap.appendChild(badge);
    wrap.appendChild(btnOut);
    cont.appendChild(wrap);
  }

  // Exponer
  window.auth = { API, getToken, getUser, clearAuth, apiFetch, requireAuth, renderAuthUI };
})();
