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
  return row.raw_value || row.value_raw || row.normalized_candidate || row.normalized_name || row.alias || 'Без назви';
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
      field
