/* =====================================================
   AgriPulse v2 – Shared Utilities (app.js)
   ===================================================== */
'use strict';

const KEYS = {
  QUERIES: 'agripulse_queries',
  SESSION: 'agripulse_session',
};

const OFFICER_CREDS = { username: 'admin', password: 'officer123' };

/* ---- Storage ---- */
function getQueries() {
  try { return JSON.parse(localStorage.getItem(KEYS.QUERIES)) || []; }
  catch { return []; }
}
function saveQueries(q) { localStorage.setItem(KEYS.QUERIES, JSON.stringify(q)); }

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(KEYS.SESSION)) || null; }
  catch { return null; }
}
function saveSession(s) { sessionStorage.setItem(KEYS.SESSION, JSON.stringify(s)); }
function clearSession()  { sessionStorage.removeItem(KEYS.SESSION); }

/* ---- IDs ---- */
function generateQueryId() {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `QRY-${ts}-${rand}`;
}

/* ---- Date Format ---- */
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/* ---- Toast ---- */
function showToast(msg, type = 'default', ms = 3200) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, ms);
}

/* ---- Error Helper ---- */
function showFieldError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---- Redirect ---- */
function redirectTo(page) { window.location.href = page; }

/* ---- Session Guard ---- */
function requireSession(role) {
  const s = getSession();
  if (!s || (role && s.role !== role)) { redirectTo('index.html'); return null; }
  return s;
}

/* ---- HTML Escape ---- */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\n/g, '<br>');
}

/* ---- Badge Helpers ---- */
function getStatusBadge(status) {
  const cfg = {
    'Pending':     { cls: 'badge-pending',  icon: '⏳' },
    'In Progress': { cls: 'badge-progress', icon: '🔄' },
    'Resolved':    { cls: 'badge-resolved', icon: '✅' },
  };
  const c = cfg[status] || { cls: 'badge-pending', icon: '⏳' };
  return `<span class="badge ${c.cls}">${c.icon} ${status}</span>`;
}

function getPriorityBadge(priority) {
  const cfg = {
    'Low':      { cls: 'badge-low',      icon: '🟢' },
    'Moderate': { cls: 'badge-moderate', icon: '🟡' },
    'Critical': { cls: 'badge-critical', icon: '🔴' },
  };
  const c = cfg[priority] || { cls: 'badge-low', icon: '🟢' };
  return `<span class="badge ${c.cls}">${c.icon} ${priority}</span>`;
}

/* ==================================================
   LOGIN PAGE
   ================================================== */
function initLoginPage() {
  const farmerForm  = document.getElementById('farmer-login-form');
  const officerForm = document.getElementById('officer-login-form');
  if (!farmerForm && !officerForm) return;

  if (farmerForm) {
    farmerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('farmer-name').value.trim();
      const id   = document.getElementById('farmer-id').value.trim();
      const err  = document.getElementById('farmer-error');
      err.classList.add('hidden');
      if (!name) { showFieldError(err, 'Please enter your full name.'); return; }
      if (!id)   { showFieldError(err, 'Please enter your Farmer ID.'); return; }
      if (!/^[a-zA-Z0-9\-]{2,20}$/.test(id)) {
        showFieldError(err, 'Farmer ID should be 2–20 alphanumeric characters (e.g. F-1001).');
        return;
      }
      saveSession({ role: 'farmer', name, farmerId: id.toUpperCase() });
      redirectTo('farmer.html');
    });
  }

  if (officerForm) {
    officerForm.addEventListener('submit', e => {
      e.preventDefault();
      const user = document.getElementById('officer-username').value.trim();
      const pass = document.getElementById('officer-password').value;
      const err  = document.getElementById('officer-error');
      err.classList.add('hidden');
      if (!user || !pass) { showFieldError(err, 'Enter both username and password.'); return; }
      if (user !== OFFICER_CREDS.username || pass !== OFFICER_CREDS.password) {
        showFieldError(err, 'Incorrect credentials. Try: admin / officer123');
        return;
      }
      saveSession({ role: 'officer', name: 'Agricultural Officer' });
      redirectTo('officer.html');
    });
  }
}

/* ---- Logout ---- */
function initLogout() {
  const btn = document.getElementById('logout-btn');
  if (btn) btn.addEventListener('click', () => { clearSession(); redirectTo('index.html'); });
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  initLogout();
});
