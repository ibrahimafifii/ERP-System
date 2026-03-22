// ═══════════════════════════════════════════════
//  NEXUS ERP — Auth Module
// ═══════════════════════════════════════════════

const Auth = (() => {
  let _user    = null;
  let _profile = null;

  // ── Login ────────────────────────────────────
  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    _user = data.user;
    await _loadProfile();
    return _profile;
  }

  // ── Logout ───────────────────────────────────
  async function logout() {
    await sb.auth.signOut();
    _user    = null;
    _profile = null;
    window.__USER_ROLE__ = null;
    store.remove('nexus_lang');
    window.location.href = '/index.html';
  }

  // ── Load Profile ─────────────────────────────
  async function _loadProfile() {
    if (!_user) return null;
    const { data } = await sb.from('user_profiles').select('*').eq('id', _user.id).single();
    _profile = data;
    window.__USER_ROLE__ = _profile?.role || 'sales';
    // Update last_login
    await sb.from('user_profiles').update({ last_login: new Date().toISOString() }).eq('id', _user.id);
    return _profile;
  }

  // ── Get current session ───────────────────────
  async function getSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return null;
    _user = session.user;
    if (!_profile) await _loadProfile();
    return { user: _user, profile: _profile };
  }

  // ── Guard: redirect if not logged in ─────────
  async function requireAuth() {
    const session = await getSession();
    if (!session) {
      window.location.href = '/index.html';
      return null;
    }
    return session;
  }

  // ── Guard: redirect if already logged in ──────
  async function requireGuest() {
    const session = await getSession();
    if (session) {
      window.location.href = '/app.html';
    }
  }

  return {
    login,
    logout,
    getSession,
    requireAuth,
    requireGuest,
    get user()    { return _user; },
    get profile() { return _profile; },
    get role()    { return _profile?.role || 'sales'; },
  };
})();
