// ═══════════════════════════════════════════════
//  NEXUS ERP — i18n (Multi-language)
// ═══════════════════════════════════════════════

const TRANSLATIONS = {
  ar: {
    // App
    app_name: 'Nexus ERP',
    loading: 'جاري التحميل...',

    // Auth
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    email_placeholder: 'example@email.com',
    password_placeholder: 'أدخل كلمة المرور',
    login_btn: 'دخول',
    login_loading: 'جاري الدخول...',
    login_error: 'البريد أو كلمة المرور غلط',
    welcome_back: 'مرحباً بعودتك',
    login_subtitle: 'سجّل دخولك للمتابعة',

    // Nav
    nav_dashboard: 'الرئيسية',
    nav_inventory: 'المخزن',
    nav_inventory_count: 'الجرد',
    nav_sales: 'المبيعات',
    nav_customers: 'العملاء',
    nav_purchases: 'المشتريات',
    nav_suppliers: 'الموردين',
    nav_accounting: 'المحاسبة',
    nav_expenses: 'المصروفات',
    nav_hr: 'الموظفين',
    nav_reports: 'التقارير',
    nav_settings: 'الإعدادات',

    // Sections
    section_main: 'الرئيسي',
    section_sales_purchasing: 'المبيعات والمشتريات',
    section_finance: 'المالية',
    section_operations: 'العمليات',
    section_system: 'النظام',

    // Common
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    confirm: 'تأكيد',
    search: 'بحث',
    filter: 'فلتر',
    export: 'تصدير',
    print: 'طباعة',
    refresh: 'تحديث',
    back: 'رجوع',
    next: 'التالي',
    prev: 'السابق',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    clear: 'مسح',
    select: 'اختر',
    all: 'الكل',
    none: 'لا شيء',
    details: 'التفاصيل',
    view: 'عرض',
    actions: 'الإجراءات',
    status: 'الحالة',
    date: 'التاريخ',
    notes: 'ملاحظات',
    total: 'الإجمالي',
    amount: 'المبلغ',
    quantity: 'الكمية',
    price: 'السعر',
    cost: 'التكلفة',
    name: 'الاسم',
    code: 'الكود',
    phone: 'الهاتف',
    address: 'العنوان',
    required: 'مطلوب',
    optional: 'اختياري',

    // Status
    status_active: 'نشط',
    status_inactive: 'غير نشط',
    status_draft: 'مسودة',
    status_confirmed: 'مؤكد',
    status_cancelled: 'ملغي',
    status_returned: 'مرتجع',
    status_paid: 'مدفوع',
    status_partial: 'جزئي',
    status_unpaid: 'غير مدفوع',
    status_received: 'مستلم',
    status_open: 'مفتوح',
    status_closed: 'مغلق',

    // Messages
    saved_ok: 'تم الحفظ بنجاح',
    deleted_ok: 'تم الحذف',
    error_generic: 'حدث خطأ، حاول مرة أخرى',
    confirm_delete: 'هل أنت متأكد من الحذف؟',
    confirm_delete_msg: 'هذا الإجراء لا يمكن التراجع عنه.',
    no_data: 'لا توجد بيانات',
    no_results: 'لا توجد نتائج',
    loading_data: 'جاري تحميل البيانات...',

    // Dashboard
    dashboard_title: 'لوحة التحكم',
    today_sales: 'مبيعات اليوم',
    month_sales: 'مبيعات الشهر',
    products_count: 'إجمالي الأصناف',
    low_stock: 'أصناف تحت الحد',

    // Modules (placeholders)
    inventory_title: 'إدارة المخزن',
    sales_title: 'المبيعات والفواتير',
    purchases_title: 'المشتريات',
    customers_title: 'العملاء',
    accounting_title: 'المحاسبة',
    reports_title: 'التقارير',
    settings_title: 'الإعدادات',
    hr_title: 'الموارد البشرية',
    expenses_title: 'المصروفات',
  },

  en: {
    app_name: 'Nexus ERP',
    loading: 'Loading...',

    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    email_placeholder: 'example@email.com',
    password_placeholder: 'Enter password',
    login_btn: 'Sign In',
    login_loading: 'Signing in...',
    login_error: 'Invalid email or password',
    welcome_back: 'Welcome Back',
    login_subtitle: 'Sign in to continue',

    nav_dashboard: 'Dashboard',
    nav_inventory: 'Inventory',
    nav_inventory_count: 'Stock Count',
    nav_sales: 'Sales',
    nav_customers: 'Customers',
    nav_purchases: 'Purchases',
    nav_suppliers: 'Suppliers',
    nav_accounting: 'Accounting',
    nav_expenses: 'Expenses',
    nav_hr: 'HR',
    nav_reports: 'Reports',
    nav_settings: 'Settings',

    section_main: 'Main',
    section_sales_purchasing: 'Sales & Purchasing',
    section_finance: 'Finance',
    section_operations: 'Operations',
    section_system: 'System',

    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save',
    cancel: 'Cancel', close: 'Close', confirm: 'Confirm',
    search: 'Search', filter: 'Filter', export: 'Export',
    print: 'Print', refresh: 'Refresh', back: 'Back',
    next: 'Next', prev: 'Previous', yes: 'Yes', no: 'No',
    ok: 'OK', clear: 'Clear', select: 'Select', all: 'All',
    none: 'None', details: 'Details', view: 'View',
    actions: 'Actions', status: 'Status', date: 'Date',
    notes: 'Notes', total: 'Total', amount: 'Amount',
    quantity: 'Qty', price: 'Price', cost: 'Cost',
    name: 'Name', code: 'Code', phone: 'Phone',
    address: 'Address', required: 'Required', optional: 'Optional',

    status_active: 'Active', status_inactive: 'Inactive',
    status_draft: 'Draft', status_confirmed: 'Confirmed',
    status_cancelled: 'Cancelled', status_returned: 'Returned',
    status_paid: 'Paid', status_partial: 'Partial', status_unpaid: 'Unpaid',
    status_received: 'Received', status_open: 'Open', status_closed: 'Closed',

    saved_ok: 'Saved successfully',
    deleted_ok: 'Deleted',
    error_generic: 'Something went wrong, please try again',
    confirm_delete: 'Are you sure you want to delete?',
    confirm_delete_msg: 'This action cannot be undone.',
    no_data: 'No data', no_results: 'No results found',
    loading_data: 'Loading data...',

    dashboard_title: 'Dashboard',
    today_sales: "Today's Sales",
    month_sales: "Month's Sales",
    products_count: 'Total Products',
    low_stock: 'Low Stock Items',

    inventory_title: 'Inventory Management',
    sales_title: 'Sales & Invoices',
    purchases_title: 'Purchases',
    customers_title: 'Customers',
    accounting_title: 'Accounting',
    reports_title: 'Reports',
    settings_title: 'Settings',
    hr_title: 'Human Resources',
    expenses_title: 'Expenses',
  },
};

// ── Active language ───────────────────────────────
let _lang = store.get('nexus_lang', 'ar');

const i18n = {
  get lang() { return _lang; },

  t(key, params = {}) {
    let str = TRANSLATIONS[_lang]?.[key] || TRANSLATIONS.ar?.[key] || key;
    Object.entries(params).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
    return str;
  },

  setLang(lang) {
    _lang = lang;
    store.set('nexus_lang', lang);
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.lang = lang;
    // Re-render all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = i18n.t(key);
      } else {
        el.textContent = i18n.t(key);
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = i18n.t(el.dataset.i18nTitle);
    });
  },

  toggle() {
    this.setLang(_lang === 'ar' ? 'en' : 'ar');
    window.dispatchEvent(new CustomEvent('nexus:langchange', { detail: { lang: _lang } }));
  },

  init() {
    this.setLang(_lang);
  },
};

// Shorthand
const t = (key, params) => i18n.t(key, params);
