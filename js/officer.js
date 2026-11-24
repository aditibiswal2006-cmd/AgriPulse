/* =====================================================
   AgriPulse v2 – Officer Dashboard (officer.js)
   ===================================================== */
'use strict';

let currentFilter = 'All';
let searchTerm    = '';
let activeQueryId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireSession('officer')) return;

  updateStats();
  initTabs();
  initSearch();
  initModal();
  initRefresh();
  renderOfficerQueries();
});

/* ==================================================
   Stats
   ================================================== */
function updateStats() {
  const qs = getQueries();
  document.getElementById('stat-pending').textContent    = qs.filter(q => q.status === 'Pending').length;
  document.getElementById('stat-inprogress').textContent = qs.filter(q => q.status === 'In Progress').length;
  document.getElementById('stat-resolved').textContent   = qs.filter(q => q.status === 'Resolved').length;
  document.getElementById('stat-total').textContent      = qs.length;
}

/* ==================================================
   Tabs
   ================================================== */
function initTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderOfficerQueries();
    });
  });
}

/* ==================================================
   Search
   ================================================== */
function initSearch() {
  const inp = document.getElementById('search-input');
  if (!inp) return;
  inp.addEventListener('input', function () {
    searchTerm = this.value.toLowerCase().trim();
    renderOfficerQueries();
  });
}

/* ==================================================
   Refresh Button
   ================================================== */
function initRefresh() {
  const btn = document.getElementById('refresh-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    updateStats();
    renderOfficerQueries();
    showToast('Refreshed!', 'success', 1500);
  });
}

/* ==================================================
   Render Queries (officer)
   ================================================== */
function renderOfficerQueries() {
  const container = document.getElementById('officer-queries-list');
  if (!container) return;

  let queries = getQueries();
  if (currentFilter !== 'All') queries = queries.filter(q => q.status === currentFilter);
  if (searchTerm) queries = queries.filter(q =>
    q.farmerId.toLowerCase().includes(searchTerm) ||
    q.farmerName.toLowerCase().includes(searchTerm) ||
    q.subject.toLowerCase().includes(searchTerm) ||
    q.id.toLowerCase().includes(searchTerm) ||
    q.category.toLowerCase().includes(searchTerm)
  );

  if (queries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${getQueries().length === 0 ? '📭' : '🔍'}</div>
        <h3>${getQueries().length === 0 ? 'No queries yet' : 'No results found'}</h3>
        <p>${getQueries().length === 0
          ? 'Farmer queries will appear here once submitted.'
          : 'Try adjusting your filter or search term.'}</p>
      </div>`;
    return;
  }

  container.innerHTML = queries.map(buildOfficerQueryCard).join('');
  container.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', function () { openReplyModal(this.dataset.id); });
  });
}

/* ==================================================
   Build Officer Query Card
   ================================================== */
function buildOfficerQueryCard(q) {
  const pc = `priority-${q.priority.toLowerCase()}`;
  const responseHTML = q.response
    ? `<div class="query-response">
         <div class="response-label">✍️ Your Response</div>
         <p>${escapeHtml(q.response)}</p>
       </div>`
    : '';

  return `
    <div class="query-card ${pc}">
      <div class="query-top">
        <div class="query-subject">${escapeHtml(q.subject)}</div>
        <div class="query-badges">
          ${getPriorityBadge(q.priority)}
          ${getStatusBadge(q.status)}
        </div>
      </div>
      <div class="query-meta">
        <span>🆔 ${q.id}</span>
        <span>👨‍🌾 ${escapeHtml(q.farmerName)} · ${q.farmerId}</span>
        <span>📂 ${q.category}</span>
        <span>🕐 ${formatDate(q.createdAt)}</span>
      </div>
      <div class="query-desc">${escapeHtml(q.description)}</div>
      ${responseHTML}
      <div class="query-actions">
        <button class="btn btn-officer btn-xs reply-btn" data-id="${q.id}">
          ✍️ ${q.response ? 'Update Response' : 'Respond'}
        </button>
      </div>
    </div>`;
}

/* ==================================================
   Modal
   ================================================== */
function initModal() {
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('cancel-reply-btn').addEventListener('click', closeModal);
  document.getElementById('submit-reply-btn').addEventListener('click', submitReply);
  document.getElementById('reply-modal').addEventListener('click', e => {
    if (e.target.id === 'reply-modal') closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openReplyModal(queryId) {
  const q = getQueries().find(x => x.id === queryId);
  if (!q) return;
  activeQueryId = queryId;

  document.getElementById('modal-query-id').textContent = `Query ID: ${q.id}`;
  document.getElementById('modal-query-info').innerHTML = `
    <div class="preview-row"><span class="preview-label">Farmer</span><span class="preview-val">${escapeHtml(q.farmerName)} (${q.farmerId})</span></div>
    <div class="preview-row"><span class="preview-label">Category</span><span class="preview-val">${q.category}</span></div>
    <div class="preview-row"><span class="preview-label">Priority</span><span class="preview-val">${getPriorityBadge(q.priority)}</span></div>
    <div class="preview-row"><span class="preview-label">Subject</span><span class="preview-val">${escapeHtml(q.subject)}</span></div>
    <div class="preview-row"><span class="preview-label">Issue</span><span class="preview-val">${escapeHtml(q.description)}</span></div>
  `;

  document.getElementById('officer-reply').value = q.response || '';
  document.getElementById('reply-error').classList.add('hidden');

  // Set status radio
  const radios = document.querySelectorAll('input[name="modal-status"]');
  radios.forEach(r => { r.checked = (r.value === q.status); });

  document.getElementById('reply-modal').classList.remove('hidden');
  document.getElementById('officer-reply').focus();
}

function closeModal() {
  document.getElementById('reply-modal').classList.add('hidden');
  activeQueryId = null;
}

function submitReply() {
  const reply  = document.getElementById('officer-reply').value.trim();
  const statusEl = document.querySelector('input[name="modal-status"]:checked');
  const status = statusEl ? statusEl.value : '';
  const errEl  = document.getElementById('reply-error');
  errEl.classList.add('hidden');

  if (!reply)        { showFieldError(errEl, '⚠️ Please write a response before saving.'); return; }
  if (reply.length < 5) { showFieldError(errEl, '⚠️ Response is too short.'); return; }
  if (!status)       { showFieldError(errEl, '⚠️ Please select a status.'); return; }

  const queries = getQueries();
  const idx = queries.findIndex(q => q.id === activeQueryId);
  if (idx === -1) { showFieldError(errEl, '⚠️ Query not found.'); return; }

  queries[idx].response  = reply;
  queries[idx].status    = status;
  queries[idx].updatedAt = new Date().toISOString();
  saveQueries(queries);

  closeModal();
  updateStats();
  renderOfficerQueries();
  showToast(`Response saved · Status: ${status}`, 'success');
}
