const pendingSb = supabase.createClient(
  window.APP_CONFIG.supabaseUrl,
  window.APP_CONFIG.supabaseAnonKey,
  {
    auth: {
      storage: window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

const uiState = {
  rows: [],
  filteredRows: [],
  groups: [],
  selectedGroupKey: null,
  search: '',
  status: 'all',
  field: 'all',
  source: 'all'
};

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
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

function setStatusBadge(text) {
  const node = $('#statusBadge');
  if (!node) return;
  node.textContent = text;
}

function getRowTitle(row) {
  return (
    row.raw_value ||
    row.value_raw ||
    row.normalized_candidate ||
    row.normalized_name ||
    row.alias ||
    'Без назви'
  );
}

function getRowStatus(row) {
  return row.decision_status || row.status || row.parse_status || 'pending';
}

function getRowField(row) {
  return row.field_name || row.entity_type || 'unknown';
}

function getRowSource(row) {
  return row.source_table || row.source_name || 'unknown';
}

function buildGroupKey(row) {
  return [
    getRowTitle(row).trim().toLowerCase(),
    getRowField(row).trim().toLowerCase(),
    getRowSource(row).trim().toLowerCase()
  ].join('||');
}

function groupRows(rows) {
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

function applyFilters() {
  const searchNeedle = uiState.search.trim().toLowerCase();

  uiState.filteredRows = uiState.rows.filter((row) => {
    const status = getRowStatus(row);
    const field = getRowField(row);
    const source = getRowSource(row);

    const blob = [
      getRowTitle(row),
      row.raw_value,
      row.value_raw,
      row.normalized_candidate,
      row.normalized_name,
      row.alias,
      row.operator_comment,
      status,
      field,
      source
    ].join(' ').toLowerCase();

    if (uiState.status !== 'all' && status !== uiState.status) return false;
    if (uiState.field !== 'all' && field !== uiState.field) return false;
    if (uiState.source !== 'all' && source !== uiState.source) return false;
    if (searchNeedle && !blob.includes(searchNeedle)) return false;

    return true;
  });

  uiState.groups = groupRows(uiState.filteredRows);

  if (!uiState.groups.length) {
    uiState.selectedGroupKey = null;
    return;
  }

  const stillExists = uiState.groups.some((g) => g.key === uiState.selectedGroupKey);
  if (!stillExists) {
    uiState.selectedGroupKey = uiState.groups[0].key;
  }
}

function populateSelect(selectId, values, defaultLabel) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const prevValue = select.value || 'all';

  select.innerHTML = [
    `<option value="all">${escapeHtml(defaultLabel)}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
  ].join('');

  if (values.includes(prevValue)) {
    select.value = prevValue;
  } else {
    select.value = 'all';
  }
}

function hydrateFilterOptions() {
  const statuses = Array.from(new Set(uiState.rows.map(getRowStatus))).sort();
  const fields = Array.from(new Set(uiState.rows.map(getRowField))).sort();
  const sources = Array.from(new Set(uiState.rows.map(getRowSource))).sort();

  populateSelect('statusFilter', statuses, 'усі статуси');
  populateSelect('fieldFilter', fields, 'усі поля');
  populateSelect('sourceFilter', sources, 'усі джерела');

  $('#statusFilter').value = statuses.includes(uiState.status) ? uiState.status : 'all';
  $('#fieldFilter').value = fields.includes(uiState.field) ? uiState.field : 'all';
  $('#sourceFilter').value = sources.includes(uiState.source) ? uiState.source : 'all';
}

function renderRecords() {
  const mount = $('#pendingGroups');
  if (!mount) return;

  if (!uiState.groups.length) {
    mount.innerHTML = `<div class="placeholder-card">Нічого не знайдено за поточними фільтрами.</div>`;
    return;
  }

  mount.innerHTML = uiState.groups.map((group) => {
    const activeClass = group.key === uiState.selectedGroupKey ? ' is-active' : '';

    return `
      <article class="record-card${activeClass}" data-group-key="${escapeHtml(group.key)}">
        <h3 class="record-card__title">${escapeHtml(group.title)}</h3>
        <div class="record-card__meta">
          ${escapeHtml(group.field)}<br>
          ${escapeHtml(group.source)}<br>
          Записів: ${group.rows.length}
        </div>
      </article>
    `;
  }).join('');

  $all('.record-card', mount).forEach((card) => {
    card.addEventListener('click', () => {
      uiState.selectedGroupKey = card.dataset.groupKey;
      renderRecords();
      renderDetails();
    });
  });
}

function renderDetails() {
  const mount = $('#candidates');
  if (!mount) return;

  const group = uiState.groups.find((g) => g.key === uiState.selectedGroupKey);

  if (!group) {
    mount.innerHTML = `<div class="placeholder-card">Оберіть запис ліворуч</div>`;
    return;
  }

  const uniqueRows = Array.from(
    new Map(group.rows.map((row) => [row.id || JSON.stringify(row), row])).values()
  );

  mount.innerHTML = uniqueRows.map((row) => `
    <article class="detail-card">
      <h3 class="detail-card__title">${escapeHtml(row.normalized_candidate || getRowTitle(row))}</h3>
      <div class="detail-card__meta">
        ID: ${escapeHtml(row.id || '—')}<br>
        Статус: ${escapeHtml(getRowStatus(row))}<br>
        Поле: ${escapeHtml(getRowField(row))}<br>
        Джерело: ${escapeHtml(getRowSource(row))}
      </div>
    </article>
  `).join('');
}

function syncUiFromControls() {
  uiState.search = $('#searchInput')?.value || '';
  uiState.status = $('#statusFilter')?.value || 'all';
  uiState.field = $('#fieldFilter')?.value || 'all';
  uiState.source = $('#sourceFilter')?.value || 'all';
}

function rerenderAll() {
  syncUiFromControls();
  applyFilters();
  renderRecords();
  renderDetails();
}

async function loadPendingRows() {
  try {
    setStatusBadge('Завантаження...');

    const { data, error } = await pendingSb
      .from('dict_pending')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('dict_pending load error:', error);
      setStatusBadge('Помилка завантаження');
      return;
    }

    uiState.rows = data || [];
    hydrateFilterOptions();
    rerenderAll();
    setStatusBadge('Підключено');
  } catch (error) {
    console.error('loadPendingRows fatal:', error);
    setStatusBadge('Критична помилка');
  }
}

function bindFilterControls() {
  $('#searchInput')?.addEventListener('input', rerenderAll);
  $('#statusFilter')?.addEventListener('change', rerenderAll);
  $('#fieldFilter')?.addEventListener('change', rerenderAll);
  $('#sourceFilter')?.addEventListener('change', rerenderAll);
  $('#refreshBtn')?.addEventListener('click', loadPendingRows);
}

function buildPendingContent() {
  return `
    <section class="records-panel" aria-label="Список записів">
      <div class="records-panel__body" id="pendingGroups">
        <div class="placeholder-card">Завантаження записів...</div>
      </div>
    </section>

    <section class="details-panel" aria-label="Деталі запису">
      <div class="details-panel__body" id="candidates">
        <div class="placeholder-card">Оберіть запис ліворуч</div>
      </div>
    </section>
  `;
}

async function protectPage() {
  if (!window.LAVASH_AUTH?.protectAppPage) {
    window.location.replace('/lavash-admin/pages/index.html');
    return null;
  }

  const user = await window.LAVASH_AUTH.protectAppPage();
  if (!user) return null;

  return user;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const user = await protectPage();
    if (!user) return;

    initLavashLayout({
      pageKey: 'editor',
      title: 'Черга перевірки',
      statusText: 'Підключено',
      content: buildPendingContent(),
      useRightTools: true
    });

    await hydrateLavashUser();
    bindFilterControls();
    await loadPendingRows();
  } catch (error) {
    console.error('pending_v3 init error:', error);
    setStatusBadge('Критична помилка');
  }
});
