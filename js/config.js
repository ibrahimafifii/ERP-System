// ═══════════════════════════════════════════════
//  NEXUS ERP — Config & Supabase Client
// ═══════════════════════════════════════════════

const NEXUS_CONFIG = {
  supabaseUrl:  'https://htyfgxjovmzrisqfqdmh.supabase.co',
  supabaseKey:  'sb_publishable_3erjAs6TaPosf1ZI25G8bw_dEhG5CAp',
  appName:      'Nexus ERP',
  version:      '2.0.0',
  currency:     'ج.م',
  dateLocale:   'ar-EG',
};

// ── Supabase Client ──────────────────────────────
const { createClient } = supabase;
const sb = createClient(NEXUS_CONFIG.supabaseUrl, NEXUS_CONFIG.supabaseKey);

// ── Role Permissions ─────────────────────────────
const ROLE_PERMISSIONS = {
  owner: {
    label: 'المالك', label_en: 'Owner',
    canViewCost: true, canDelete: true,
    modules: ['dashboard','inventory','inventory-count','sales','purchases',
              'customers','suppliers','accounting','expenses','hr','reports','settings'],
  },
  manager: {
    label: 'المدير', label_en: 'Manager',
    canViewCost: false, canDelete: false,
    modules: ['dashboard','inventory','inventory-count','sales','purchases',
              'customers','suppliers','expenses','reports','settings'],
  },
  accountant: {
    label: 'المحاسب', label_en: 'Accountant',
    canViewCost: true, canDelete: false,
    modules: ['dashboard','sales','purchases','customers','suppliers',
              'accounting','expenses','reports'],
  },
  sales: {
    label: 'المبيعات', label_en: 'Sales',
    canViewCost: false, canDelete: false,
    modules: ['dashboard','sales','customers'],
  },
  warehouse: {
    label: 'المخزن', label_en: 'Warehouse',
    canViewCost: false, canDelete: false,
    modules: ['dashboard','inventory','inventory-count'],
  },
  packer: {
    label: 'التجهيز', label_en: 'Packer',
    canViewCost: false, canDelete: false,
    modules: ['sales'],
  },
  hr: {
    label: 'الموارد البشرية', label_en: 'HR',
    canViewCost: false, canDelete: false,
    modules: ['dashboard','hr'],
  },
};

// ── Utility: Check permission ────────────────────
function can(action) {
  const role = window.__USER_ROLE__ || 'sales';
  const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.sales;
  if (action === 'viewCost')   return perms.canViewCost;
  if (action === 'delete')     return perms.canDelete;
  if (action.startsWith('module:')) return perms.modules.includes(action.replace('module:', ''));
  return false;
}

// ── Number/Date Formatters ───────────────────────
const fmt = {
  currency: (n, decimals = 2) => {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('ar-EG', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + ' ' + NEXUS_CONFIG.currency;
  },

  number: (n, decimals = 0) => {
    if (n == null || isNaN(n)) return '—';
    return Number(n).toLocaleString('ar-EG', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  date: (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  },

  datetime: (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  },

  shortDate: (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
  },
};

// ── Local Storage helpers ────────────────────────
const store = {
  get:    (k, def = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set:    (k, v)          => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove: (k)             => { try { localStorage.removeItem(k); } catch {} },
};

// ── Debounce ─────────────────────────────────────
function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── Generate UUID (client-side fallback) ─────────
function uuid() {
  return crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ── Escape HTML ───────────────────────────────────
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

// ── Sleep ─────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
