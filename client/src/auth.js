// src/auth.js
(function(){
  const API = window.API || 'http://localhost:5000/api';

  // Dónde quedó guardado (local o session)
  function getStore(){
    const pref = localStorage.getItem('moon_storage') || 'local';
    return pref === 'session' ? sessionStorage : localStorage;
  }

  function getToken(){ return getStore().getItem('moon_token') || null; }
  function getUser(){
    const raw = getStore().getItem('moon_user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  function clearAuth(){
    // limpiamos ambos por si acaso
    for (const s of [localStorage, sessionStorage]){
      s.removeItem('moon_token');
      s.removeItem('moon_user');
    }
  }

  // fetch con Authorization si hay token
  async function apiFetch(url, opts = {}){
    const token = getToken();
    const headers = new Headers(opts.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const res = await fetch(url, { ...opts, headers });
    // Refresh de token opcional si backend devuelve 401/419…
    return res;
  }

  // Forzar login si no hay token
  function requireAuth(redirectBack = true){
    if (!getToken()){
      const back = redirectBack ? `?returnUrl=${encodeURIComponent(location.pathname + location.search)}` : '';
      location.href = `login.html${back}`;
    }
  }

  // Render del link de sesión en el header si existe el contenedor
  function renderAuthUI(){
    const cont = document.querySelector('.actions');
    if (!cont) return;

    const token = getToken();
    const user = getUser();

    // limpiar estado previo
    cont.querySelectorAll('.auth-slot').forEach(n => n.remove());

    if (!token){
      const a = document.createElement('a');
      a.className = 'login auth-slot';
      a.href = 'login.html';
      a.innerHTML = '<i class="bi bi-person-circle"></i>Iniciar sesión';
      cont.appendChild(a);
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'auth-slot';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '10px';

    const name = (user && (user.nombre || user.name)) ? (user.nombre || user.name) : 'Mi cuenta';
    const badge = document.createElement('span');
    badge.className = 'muted';
    badge.textContent = name;

    const btnOut = document.createElement('a');
    btnOut.href = '#';
    btnOut.title = 'Cerrar sesión';
    btnOut.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
    btnOut.onclick = (e)=>{ e.preventDefault(); clearAuth(); location.reload(); };

    wrap.appendChild(badge);
    wrap.appendChild(btnOut);
    cont.appendChild(wrap);
  }

  // Exponer en window para que lo uses en otros archivos
  window.auth = { getToken, getUser, clearAuth, apiFetch, requireAuth, renderAuthUI, API };
})();
