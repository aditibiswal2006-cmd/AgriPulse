/* =====================================================
   AgriPulse v2 – Farmer Dashboard (farmer.js)
   ===================================================== */
'use strict';

let currentFilter  = 'All';
let currentSession = null;

document.addEventListener('DOMContentLoaded', () => {
  currentSession = requireSession('farmer');
  if (!currentSession) return;

  // Welcome
  const wel = document.getElementById('farmer-welcome');
  if (wel) wel.textContent = `${currentSession.name} · ${currentSession.farmerId}`;
  const sub = document.getElementById('farmer-id-display');
  if (sub) sub.textContent = `Showing queries for Farmer ID: ${currentSession.farmerId}`;

  initQueryForm();
  initTabs();
  initCharCounter();
  renderQueries();
});

/* ==================================================
   Character counter
   ================================================== */
function initCharCounter() {
  const ta = document.getElementById('q-description');
  const cc = document.getElementById('char-counter');
  if (!ta || !cc) return;
  ta.addEventListener('input', () => { cc.textContent = ta.value.length; });
}

/* ==================================================
   Query Form
   ================================================== */
function initQueryForm() {
  const form      = document.getElementById('query-form');
  const errEl     = document.getElementById('query-error');
  const successEl = document.getElementById('query-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    errEl.classList.add('hidden');
    successEl.classList.add('hidden');

    const category    = document.getElementById('q-category').value;
    const priorityEl  = form.querySelector('input[name="q-priority"]:checked');
    const priority    = priorityEl ? priorityEl.value : '';
    const subject     = document.getElementById('q-subject').value.trim();
    const description = document.getElementById('q-description').value.trim();

    if (!category)         { showFieldError(errEl, '⚠️ Please select a category.'); return; }
    if (!priority)         { showFieldError(errEl, '⚠️ Please choose a priority level.'); return; }
    if (!subject)          { showFieldError(errEl, '⚠️ Please enter a subject.'); return; }
    if (description.length < 10) { showFieldError(errEl, '⚠️ Description is too short — please add more details.'); return; }

    const q = {
      id:          generateQueryId(),
      farmerId:    currentSession.farmerId,
      farmerName:  currentSession.name,
      category, priority, subject, description,
      status:      'Pending',
      response:    '',
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };

    const queries = getQueries();
    queries.unshift(q);
    saveQueries(queries);

    // Reset
    form.reset();
    document.getElementById('char-counter').textContent = '0';

    successEl.innerHTML = `✅ Query submitted! Your Query ID is <strong>${q.id}</strong>`;
    successEl.classList.remove('hidden');
    setTimeout(() => successEl.classList.add('hidden'), 7000);

    showToast('Query submitted successfully!', 'success');
    renderQueries();
  });

  const clearBtn = document.getElementById('clear-form-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    errEl.classList.add('hidden');
    successEl.classList.add('hidden');
    document.getElementById('char-counter').textContent = '0';
  });
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
      renderQueries();
    });
  });
}

/* ==================================================
   Render Queries
   ================================================== */
function renderQueries() {
  const container = document.getElementById('queries-list');
  const countEl   = document.getElementById('query-count');
  if (!container) return;

  const mine      = getQueries().filter(q => q.farmerId === currentSession.farmerId);
  const filtered  = currentFilter === 'All' ? mine : mine.filter(q => q.status === currentFilter);

  if (countEl) countEl.textContent = mine.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${currentFilter === 'All' ? '📭' : '🔍'}</div>
        <h3>${currentFilter === 'All' ? 'No queries yet' : `No ${currentFilter} queries`}</h3>
        <p>${currentFilter === 'All'
          ? 'Submit your first query using the form on the left.'
          : 'Try selecting a different filter above.'}</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(buildQueryCard).join('');
}

/* ==================================================
   Build Query Card
   ================================================== */
function buildQueryCard(q) {
  const pc = `priority-${q.priority.toLowerCase()}`;
  const responseHTML = q.response
    ? `<div class="query-response">
         <div class="response-label">🏛️ Officer Response</div>
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
        <span>📂 ${q.category}</span>
        <span>🕐 ${formatDate(q.createdAt)}</span>
        ${q.response ? `<span>🔄 ${formatDate(q.updatedAt)}</span>` : ''}
      </div>
      <div class="query-desc">${escapeHtml(q.description)}</div>
      ${responseHTML}
    </div>`;
}
