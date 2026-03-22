// ═══════════════════════════════════════════════
//  NEXUS ERP — UI Utilities
//  Toast · Modal · Confirm · Loader
// ═══════════════════════════════════════════════

// ════════════════════════════════
//  TOAST
// ════════════════════════════════
const Toast = (() => {
  let container;

  function init() {
    if (container) return;
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  function show(msg, type = 'info', duration = 3500, title = '') {
    init();
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${esc(title)}</div>` : ''}
        <div class="toast-msg">${esc(msg)}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
    `;
    container.appendChild(toast);
    if (duration > 0) setTimeout(() => toast.remove(), duration);
    return toast;
  }

  return {
    success: (msg, title = '')  => show(msg, 'success', 3500, title),
    error:   (msg, title = '')  => show(msg, 'error', 5000, title),
    warning: (msg, title = '')  => show(msg, 'warning', 4000, title),
    info:    (msg, title = '')  => show(msg, 'info', 3000, title),
  };
})();


// ════════════════════════════════
//  MODAL
// ════════════════════════════════
const Modal = (() => {
  const stack = [];

  function create({ id, title, icon, body, footer, size = 'modal-md', onClose } = {}) {
    // Remove existing with same id
    if (id) document.getElementById(`modal-${id}`)?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    if (id) overlay.id = `modal-${id}`;

    overlay.innerHTML = `
      <div class="modal ${size}">
        <div class="modal-header">
          <div class="d-flex align-center gap-3">
            ${icon ? `<div class="modal-icon">${icon}</div>` : ''}
            <h3>${title || ''}</h3>
          </div>
          <button class="modal-close" data-modal-close>✕</button>
        </div>
        <div class="modal-body">${body || ''}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    function close() {
      overlay.classList.remove('show');
      setTimeout(() => { overlay.remove(); onClose?.(); }, 280);
      stack.pop();
    }

    overlay.querySelector('[data-modal-close]')?.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    stack.push({ overlay, close });
    return { overlay, close, el: overlay.querySelector('.modal') };
  }

  function close(id) {
    const el = id ? document.getElementById(`modal-${id}`) : stack[stack.length - 1]?.overlay;
    if (!el) return;
    el.classList.remove('show');
    setTimeout(() => el.remove(), 280);
  }

  return { create, close };
})();


// ════════════════════════════════
//  CONFIRM DIALOG
// ════════════════════════════════
function Confirm({ title, message, confirmText, cancelText, type = 'danger' } = {}) {
  return new Promise((resolve) => {
    const icons = { danger: '🗑️', warning: '⚠️', info: 'ℹ️', success: '✅' };
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box animate-scale">
        <div class="confirm-icon">${icons[type] || icons.warning}</div>
        <h3>${esc(title || t('confirm_delete'))}</h3>
        <p>${esc(message || t('confirm_delete_msg'))}</p>
        <div class="confirm-actions">
          <button class="btn btn-ghost" id="confirm-cancel">${cancelText || t('cancel')}</button>
          <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'}" id="confirm-ok">
            ${confirmText || t('confirm')}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function done(val) { overlay.remove(); resolve(val); }
    overlay.querySelector('#confirm-ok').addEventListener('click', () => done(true));
    overlay.querySelector('#confirm-cancel').addEventListener('click', () => done(false));
    overlay.addEventListener('click', e => { if (e.target === overlay) done(false); });
  });
}


// ════════════════════════════════
//  PAGE LOADER
// ════════════════════════════════
const Loader = {
  show(msg = '') {
    let el = document.getElementById('page-loader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'page-loader';
      el.className = 'page-loader';
      el.innerHTML = `
        <div class="loader-logo">Nexus<span>ERP</span></div>
        <div class="loader-spinner"></div>
        <div class="loader-msg" style="color:rgba(255,255,255,.4);font-size:.85rem"></div>
      `;
      document.body.appendChild(el);
    }
    el.classList.remove('hidden');
    if (msg) el.querySelector('.loader-msg').textContent = msg;
  },
  hide() {
    const el = document.getElementById('page-loader');
    if (el) el.classList.add('hidden');
  },
};


// ════════════════════════════════
//  INLINE LOADING
// ════════════════════════════════
function setLoading(btn, loading = true) {
  if (!btn) return;
  if (loading) {
    btn._originalText = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = `<span class="loader-spinner" style="width:16px;height:16px;border-width:2px;display:inline-block"></span>`;
  } else {
    btn.disabled = false;
    btn.classList.remove('loading');
    if (btn._originalText) btn.innerHTML = btn._originalText;
  }
}


// ════════════════════════════════
//  FORM HELPERS
// ════════════════════════════════
const Form = {
  // Get all form values as object
  values(formEl) {
    const data = {};
    new FormData(formEl).forEach((v, k) => { data[k] = v; });
    return data;
  },

  // Set error on field
  setError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.classList.add('is-invalid');
    let err = el.parentElement.querySelector('.form-error');
    if (!err) { err = document.createElement('div'); err.className = 'form-error'; el.after(err); }
    err.textContent = msg;
  },

  // Clear all errors
  clearErrors(formEl) {
    formEl.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    formEl.querySelectorAll('.form-error').forEach(el => el.remove());
  },

  // Fill form fields from object
  fill(formEl, data) {
    Object.entries(data).forEach(([k, v]) => {
      const el = formEl.querySelector(`[name="${k}"]`);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!v;
      else el.value = v ?? '';
    });
  },
};


// ════════════════════════════════
//  TABLE HELPERS
// ════════════════════════════════
function renderTableLoading(tbody, cols = 6) {
  tbody.innerHTML = Array.from({ length: 5 }, () => `
    <tr>${Array.from({ length: cols }, () =>
      `<td><div class="skeleton" style="height:18px;border-radius:4px"></div></td>`
    ).join('')}</tr>
  `).join('');
}

function renderTableEmpty(tbody, cols = 6, msg = '') {
  tbody.innerHTML = `
    <tr>
      <td colspan="${cols}">
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h4>${msg || t('no_data')}</h4>
        </div>
      </td>
    </tr>
  `;
}


// ════════════════════════════════
//  CLICK OUTSIDE
// ════════════════════════════════
function onClickOutside(el, callback) {
  function handler(e) {
    if (!el.contains(e.target)) {
      callback();
      document.removeEventListener('click', handler, true);
    }
  }
  setTimeout(() => document.addEventListener('click', handler, true), 10);
  return () => document.removeEventListener('click', handler, true);
}


// ════════════════════════════════
//  DROPDOWN TOGGLE
// ════════════════════════════════
function toggleDropdown(menuEl) {
  const isOpen = menuEl.classList.contains('show');
  document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  if (!isOpen) {
    menuEl.classList.add('show');
    onClickOutside(menuEl.closest('.dropdown'), () => menuEl.classList.remove('show'));
  }
}
