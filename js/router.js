// ═══════════════════════════════════════════════
//  NEXUS ERP — Router
// ═══════════════════════════════════════════════

const Router = (() => {
  const routes = {};
  let _current = null;
  let _container = null;

  // ── Register a route ─────────────────────────
  function register(name, loader) {
    routes[name] = loader;
  }

  // ── Navigate to a module ─────────────────────
  async function go(name, params = {}) {
    // Check permission
    if (!can(`module:${name}`)) {
      Toast.warning(t('no_permission') || 'ليس لديك صلاحية');
      return;
    }

    // Highlight active nav item
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === name);
    });

    // Update breadcrumb
    const navItem = document.querySelector(`.nav-item[data-route="${name}"]`);
    const label   = navItem?.querySelector('.nav-label')?.textContent || '';
    const breadEl = document.getElementById('header-breadcrumb-current');
    if (breadEl) breadEl.textContent = label;

    // Update URL hash
    window.location.hash = name;

    // Load module
    if (!_container) _container = document.getElementById('page-content');
    _container.innerHTML = `
      <div class="empty-state" style="padding:4rem">
        <div class="loader-spinner" style="width:36px;height:36px;border-width:3px;margin:0 auto 1rem;display:block"></div>
        <p>${t('loading')}</p>
      </div>
    `;

    _current = name;

    if (routes[name]) {
      try {
        await routes[name](params);
      } catch (err) {
        console.error(`Router error loading ${name}:`, err);
        _container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h4>خطأ في تحميل الصفحة</h4>
            <p>${err.message}</p>
            <button class="btn btn-outline" onclick="Router.go('${name}')">إعادة المحاولة</button>
          </div>
        `;
      }
    } else {
      _container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🚧</div>
          <h4>هذا الموديول قيد التطوير</h4>
          <p>سيكون متاحاً قريباً</p>
        </div>
      `;
    }
  }

  // ── Init: read hash and navigate ─────────────
  function init(containerEl) {
    _container = containerEl;
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    go(hash);
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '') || 'dashboard';
      if (h !== _current) go(h);
    });
  }

  return { register, go, init, get current() { return _current; } };
})();
