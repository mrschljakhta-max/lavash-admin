const pendingSb = supabase.createClient(
  window.APP_CONFIG.supabaseUrl,
  window.APP_CONFIG.supabaseAnonKey
);

let connectionRetryTimer = null;
let isCheckingConnection = false;
let pendingDataCache = [];

const uiState = {
  selectedGroupKey: null,
  status: 'pending',
  field: 'all',
  source: 'all',
  search: ''
};

function setConnectionBadge(text, mode = 'idle') {
  const badge = document.querySelector('.top-status');
  if (!badge) return;

  badge.textContent = text;
  badge.classList.remove('ok', 'warn', 'error');

  if (mode === 'ok') badge.classList.add('ok');
  if (mode === 'warn') badge.classList.add('warn');
  if (mode === 'error') badge.classList.add('error');
}

async function checkSupabaseConnection() {
  if (isCheckingConnection) return false;
  isCheckingConnection = true;

  try {
    setConnectionBadge('Перевірка підключення...', 'warn');

    const { error } = await pendingSb.auth.getSession();
    if (error) throw error;

    setConnectionBadge('Supabase підключено', 'ok');
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err);
    setConnectionBadge('Помилка підключення до Supabase', 'error');
    return false;
  } finally {
    isCheckingConnection = false;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

function getRowStatus(row) {
  return (
    row.decision_status ||
    row.status ||
    row.parse_status ||
    'pending'
  );
}

function getRowField(row) {
  return row.field_name || row.entity_type || 'unknown';
}

function getRowSource(row) {
  return row.source_table || row.source_name || 'unknown';
}

function getRowTitle(row) {
  return (
    row.raw_value ||
    row.value_raw ||
    row.normalized_candidate ||
    row.normalized_name ||
    row.alias ||
    row.id ||
    'Без назви'
  );
}

function buildGroupKey(row) {
  return [
    getRowTitle(row).trim().toLowerCase(),
    getRowField(row).trim().toLowerCase(),
    getRowSource(row).trim().toLowerCase()
  ].join('||');
}

function groupPendingRows(rows) {
  const map = new Map();

  for (const row of rows) {
    const key = buildGroupKey(row);

    if (!map.has(key)) {
      map.set(key, {
        key,
        title: getRowTitle(row),
        field: getRowField(row),
        source: getRowSource(row),
        rows: []
      });
    }

    map.get(key).rows.push(row);
  }

  return Array.from(map.values());
}

function getFilteredRows(rows) {
  return rows.filter((row) => {
    const rowStatus = getRowStatus(row);
    const rowField = getRowField(row);
    const rowSource = getRowSource(row);
    const title = getRowTitle(row);
    const searchBlob = [
      title,
      rowField,
      rowSource,
      row.raw_value,
      row.normalized_candidate,
      row.operator_comment
    ].join(' ').toLowerCase();

    if (uiState.status !== 'all' && rowStatus !== uiState.status) return false;
    if (uiState.field !== 'all' && rowField !== uiState.field) return false;
    if (uiState.source !== 'all' && rowSource !== uiState.source) return false;
    if (uiState.search && !searchBlob.includes(uiState.search.toLowerCase())) return false;

    return true;
  });
}

function renderPendingGroups(rows) {
  const mount = document.getElementById('pendingGroups');
  if (!mount) return;

  const grouped = groupPendingRows(getFilteredRows(rows));

  if (!grouped.length) {
    mount.innerHTML = '<div class="placeholder">Немає записів для відображення</div>';
    renderCandidatesPanel(null);
    return;
  }

  if (!uiState.selectedGroupKey || !grouped.some((g) => g.key === uiState.selectedGroupKey)) {
    uiState.selectedGroupKey = grouped[0].key;
  }

  mount.innerHTML = grouped.map((group) => {
    const isActive = group.key === uiState.selectedGroupKey;

    return `
      <article
        class="pending-card ${isActive ? 'active' : ''}"
        data-group-key="${escapeHtml(group.key)}"
        tabindex="0"
        role="button"
      >
        <div class="pending-card-title">${escapeHtml(group.title)}</div>
        <div class="small">${escapeHtml(group.field)}</div>
        <div class="small">${escapeHtml(group.source)}</div>
        <div class="small">Записів: ${group.rows.length}</div>
      </article>
    `;
  }).join('');

  bindGroupCardEvents(grouped);
  renderCandidatesPanel(grouped.find((g) => g.key === uiState.selectedGroupKey) || null);
}

function renderCandidatesPanel(group) {
  const panel = document.querySelector('.panel-candidates');
  if (!panel) return;

  const title = panel.querySelector('.panel-title');
  if (!title) return;

  const existingBody = panel.querySelector('.panel-candidates-body');
  if (existingBody) existingBody.remove();

  const body = document.createElement('div');
  body.className = 'panel-candidates-body';

  if (!group) {
    body.innerHTML = '<div class="placeholder">Оберіть групу ліворуч</div>';
    panel.appendChild(body);
    return;
  }

  const uniqueCandidates = Array.from(new Map(
    group.rows.map((row) => [row.id, row])
  ).values());

  body.innerHTML = `
    <div class="candidate-summary">
      <div class="candidate-summary-title">${escapeHtml(group.title)}</div>
      <div class="candidate-summary-meta">${escapeHtml(group.field)} · ${escapeHtml(group.source)}</div>
    </div>

    <div class="candidate-list">
      ${uniqueCandidates.map((row) => `
        <article class="candidate-card">
          <div class="candidate-main">${escapeHtml(getRowTitle(row))}</div>
          <div class="small">ID: ${escapeHtml(row.id || '—')}</div>
          <div class="small">Статус: ${escapeHtml(getRowStatus(row))}</div>
          <div class="small">normalized_candidate: ${escapeHtml(row.normalized_candidate || '—')}</div>
        </article>
      `).join('')}
    </div>
  `;

  panel.appendChild(body);
}

function bindGroupCardEvents(grouped) {
  document.querySelectorAll('.pending-card').forEach((card) => {
    const handler = () => {
      const key = card.dataset.groupKey;
      uiState.selectedGroupKey = key;
      renderPendingGroups(pendingDataCache);
    };

    card.addEventListener('click', handler);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handler();
      }
    });
  });
}

function populateFilterOptions(rows) {
  const fieldSelect = document.getElementById('fieldFilter');
  const sourceSelect = document.getElementById('sourceFilter');
  const statusSelect = document.getElementById('statusFilter');

  if (!fieldSelect || !sourceSelect || !statusSelect) return;

  const fields = Array.from(new Set(rows.map(getRowField))).sort();
  const sources = Array.from(new Set(rows.map(getRowSource))).sort();
  const statuses = Array.from(new Set(rows.map(getRowStatus))).sort();

  fieldSelect.innerHTML = `<option value="all">усі поля</option>` +
    fields.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  sourceSelect.innerHTML = `<option value="all">усі джерела</option>` +
    sources.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  statusSelect.innerHTML = `<option value="all">усі статуси</option>` +
    statuses.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  statusSelect.value = statuses.includes(uiState.status) ? uiState.status : 'all';
  fieldSelect.value = fields.includes(uiState.field) ? uiState.field : 'all';
  sourceSelect.value = sources.includes(uiState.source) ? uiState.source : 'all';
}

async function loadPendingData() {
  try {
    const { data, error } = await pendingSb
      .from('dict_pending')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    pendingDataCache = data || [];
    populateFilterOptions(pendingDataCache);
    renderPendingGroups(pendingDataCache);
    setConnectionBadge('Supabase підключено', 'ok');
  } catch (err) {
    console.error('loadPendingData failed:', err);
    setConnectionBadge('Помилка завантаження даних', 'error');
  }
}

async function bootPendingPage() {
  if (connectionRetryTimer) {
    clearTimeout(connectionRetryTimer);
    connectionRetryTimer = null;
  }

  const ok = await checkSupabaseConnection();

  if (!ok) {
    connectionRetryTimer = setTimeout(() => {
      bootPendingPage();
    }, 5000);
    return;
  }

  await loadPendingData();
}

function bindToolbarEvents() {
  const statusFilter = document.getElementById('statusFilter');
  const fieldFilter = document.getElementById('fieldFilter');
  const sourceFilter = document.getElementById('sourceFilter');
  const searchInput = document.getElementById('searchInput');
  const refreshBtn = document.getElementById('refreshBtn');

  statusFilter?.addEventListener('change', () => {
    uiState.status = statusFilter.value;
    renderPendingGroups(pendingDataCache);
  });

  fieldFilter?.addEventListener('change', () => {
    uiState.field = fieldFilter.value;
    renderPendingGroups(pendingDataCache);
  });

  sourceFilter?.addEventListener('change', () => {
    uiState.source = sourceFilter.value;
    renderPendingGroups(pendingDataCache);
  });

  searchInput?.addEventListener('input', () => {
    uiState.search = searchInput.value.trim();
    renderPendingGroups(pendingDataCache);
  });

  refreshBtn?.addEventListener('click', async () => {
    await bootPendingPage();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!window.LAVASH_AUTH?.protectAppPage) {
      console.error('protectAppPage is missing');
      window.location.replace('./index.html');
      return;
    }

    const user = await window.LAVASH_AUTH.protectAppPage();
    if (!user) return;

    await window.LAVASH_AUTH.hydrateAppUserBadge();
    bindToolbarEvents();
    await bootPendingPage();
  } catch (err) {
    console.error('pending init failed:', err);
    setConnectionBadge('Критична помилка запуску', 'error');
  }
});
