// ═══════════════════════════════════════════════
//  NEXUS ERP — Dashboard Module
// ═══════════════════════════════════════════════

Router.register('dashboard', async () => {
  const el = document.getElementById('page-content');

  // Render skeleton first
  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>📊 <span data-i18n="dashboard_title">${t('dashboard_title')}</span></h1>
        <p id="dash-date" style="font-size:.88rem;color:var(--text-muted);margin-top:.2rem"></p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid" id="stats-grid">
      ${[1,2,3,4].map(() => `
        <div class="stat-card">
          <div class="skeleton" style="width:44px;height:44px;border-radius:10px"></div>
          <div class="skeleton" style="width:60%;height:28px;margin-top:.5rem"></div>
          <div class="skeleton" style="width:80%;height:14px;margin-top:.3rem"></div>
        </div>
      `).join('')}
    </div>

    <!-- Content Grid -->
    <div class="content-grid grid-2" id="dash-content" style="gap:1.25rem">
      <div class="card">
        <div class="card-header"><h3>🧾 آخر الفواتير</h3></div>
        <div class="card-body" id="recent-invoices">
          <div class="skeleton" style="height:200px;border-radius:8px"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>⚠️ أصناف تحت الحد الأدنى</h3></div>
        <div class="card-body" id="low-stock">
          <div class="skeleton" style="height:200px;border-radius:8px"></div>
        </div>
      </div>
    </div>
  `;

  // Set date
  document.getElementById('dash-date').textContent = fmt.datetime(new Date());

  // Load data
  try {
    const [statsData, invoicesData, stockData] = await Promise.allSettled([
      _loadStats(),
      _loadRecentInvoices(),
      _loadLowStock(),
    ]);

    _renderStats(statsData.value || {});
    _renderRecentInvoices(invoicesData.value || []);
    _renderLowStock(stockData.value || []);

  } catch (err) {
    console.error('Dashboard error:', err);
    Toast.error('خطأ في تحميل البيانات');
  }
});

// ── Load Stats ───────────────────────────────
async function _loadStats() {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [todaySales, monthSales, productsCount, lowStockCount] = await Promise.allSettled([
    sb.from('sales_invoices')
      .select('total_amount')
      .eq('status', 'confirmed')
      .gte('created_at', today),
    sb.from('sales_invoices')
      .select('total_amount')
      .eq('status', 'confirmed')
      .gte('created_at', monthStart),
    sb.from('products')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('is_active', true),
    sb.from('products')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('is_active', true),
      // TODO: join with product_stock for real low stock count
  ]);

  const todayTotal = (todaySales.value?.data || []).reduce((s, r) => s + Number(r.total_amount), 0);
  const monthTotal = (monthSales.value?.data || []).reduce((s, r) => s + Number(r.total_amount), 0);

  return {
    todaySales:    todayTotal,
    monthSales:    monthTotal,
    productsCount: productsCount.value?.count || 0,
    lowStockCount: 0,
  };
}

// ── Render Stats ─────────────────────────────
function _renderStats(data) {
  const statsEl = document.getElementById('stats-grid');
  const stats = [
    {
      icon: '💰', iconBg: '#e8eef8', iconColor: 'var(--navy)',
      value: fmt.currency(data.todaySales, 0),
      label: t('today_sales'),
    },
    {
      icon: '📅', iconBg: '#d4edda', iconColor: 'var(--green)',
      value: fmt.currency(data.monthSales, 0),
      label: t('month_sales'),
    },
    {
      icon: '📦', iconBg: '#fdf4df', iconColor: 'var(--gold-dark)',
      value: fmt.number(data.productsCount),
      label: t('products_count'),
    },
    {
      icon: '⚠️', iconBg: '#fde8e6', iconColor: 'var(--red)',
      value: fmt.number(data.lowStockCount),
      label: t('low_stock'),
    },
  ];

  statsEl.innerHTML = stats.map(s => `
    <div class="stat-card animate-fade">
      <div class="stat-icon" style="background:${s.iconBg};color:${s.iconColor}">${s.icon}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

// ── Load Recent Invoices ─────────────────────
async function _loadRecentInvoices() {
  const { data } = await sb.from('sales_invoices')
    .select('id, invoice_number, customer_name, total_amount, payment_status, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(6);
  return data || [];
}

// ── Render Recent Invoices ───────────────────
function _renderRecentInvoices(invoices) {
  const el = document.getElementById('recent-invoices');
  if (!invoices.length) {
    el.innerHTML = `<div class="empty-state" style="padding:2rem"><div class="empty-icon">🧾</div><h4>لا توجد فواتير بعد</h4></div>`;
    return;
  }

  const payBadge = {
    paid:    '<span class="badge badge-success">مدفوع</span>',
    partial: '<span class="badge badge-warning">جزئي</span>',
    unpaid:  '<span class="badge badge-danger">غير مدفوع</span>',
  };

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:.6rem">
      ${invoices.map(inv => `
        <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem .75rem;background:var(--bg);border-radius:var(--radius-md);cursor:pointer;transition:var(--transition)"
          onmouseover="this.style.background='var(--blue-light)'"
          onmouseout="this.style.background='var(--bg)'"
          onclick="Router.go('sales', {invoiceId:'${inv.id}'})">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:.88rem;color:var(--navy)">${esc(inv.invoice_number)}</div>
            <div style="font-size:.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(inv.customer_name)}</div>
          </div>
          <div style="text-align:left;flex-shrink:0">
            <div style="font-weight:700;font-size:.9rem">${fmt.currency(inv.total_amount, 0)}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">${fmt.shortDate(inv.created_at)}</div>
          </div>
          ${payBadge[inv.payment_status] || ''}
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:1rem">
      <button class="btn btn-ghost btn-sm" onclick="Router.go('sales')">عرض كل الفواتير ←</button>
    </div>
  `;
}

// ── Load Low Stock ───────────────────────────
async function _loadLowStock() {
  // Get products where stock_quantity <= min_stock
  const { data } = await sb.from('product_stock')
    .select(`
      quantity,
      products!inner(id, code, name, min_stock, unit),
      warehouses(name)
    `)
    .order('quantity', { ascending: true })
    .limit(6);
  return (data || []).filter(r => r.quantity <= (r.products?.min_stock || 0));
}

// ── Render Low Stock ─────────────────────────
function _renderLowStock(items) {
  const el = document.getElementById('low-stock');
  if (!items.length) {
    el.innerHTML = `<div class="empty-state" style="padding:2rem"><div class="empty-icon">✅</div><h4>كل الأصناف في المستوى الطبيعي</h4></div>`;
    return;
  }

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:.6rem">
      ${items.map(item => {
        const pct = item.products?.min_stock > 0
          ? Math.min(100, Math.round((item.quantity / item.products.min_stock) * 100))
          : 0;
        return `
          <div style="padding:.6rem .75rem;background:var(--bg);border-radius:var(--radius-md)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem">
              <span style="font-weight:600;font-size:.88rem">${esc(item.products?.name || '—')}</span>
              <span style="font-size:.82rem;font-weight:700;color:var(--red)">${item.quantity} ${esc(item.products?.unit || '')}</span>
            </div>
            <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:${pct < 25 ? 'var(--red)' : 'var(--orange)'};border-radius:2px;transition:.3s"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="text-align:center;margin-top:1rem">
      <button class="btn btn-ghost btn-sm" onclick="Router.go('inventory')">إدارة المخزن ←</button>
    </div>
  `;
}
