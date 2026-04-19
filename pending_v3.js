const sb = supabase.createClient(
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

let dataCache = [];
let selectedKey = null;

function setStatus(text, ok = false) {
  const el = document.getElementById('status');
  if (!el) return;

  el.textContent = text;
  el.classList.toggle('ok', ok);
}

async function loadData() {
  setStatus('Завантаження...');

  const { data, error } = await sb
    .from('dict_pending')
    .select('*')
    .limit(200);

  if (error) {
    setStatus('Помилка');
    console.error(error);
    return;
  }

  dataCache = data || [];
  populateFilters(dataCache);
  renderList();
  renderRight();
  setStatus('Підключено', true);
}

function group(data) {
  const map = {};

  data.forEach((r) => {
    const key = `${r.raw_value || r.value_raw || ''}_${r.field_name || ''}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return Object.entries(map);
}

function getFilteredData() {
  const statusValue = document.getElementById('statusFilter')?.value || 'all';
  const fieldValue = document.getElementById('fieldFilter')?.value || 'all';
  const sourceValue = document.getElementById('sourceFilter')?.value || 'all';
  const searchValue = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();

  return dataCache.filter((row) => {
    const rowStatus = row.decision_status || row.status || row.parse_status || 'pending';
    const rowField = row.field_name || 'unknown';
    const rowSource = row.source_table || row.source_name || 'unknown';
    const title = (row.raw_value || row.value_raw || row.normalized_candidate || '').toLowerCase();

    if (statusValue !== 'all' && rowStatus !== statusValue) return false;
    if (fieldValue !== 'all' && rowField !== fieldValue) return false;
    if (sourceValue !== 'all' && rowSource !== sourceValue) return false;
    if (searchValue && !title.includes(searchValue)) return false;

    return true;
  });
}

function renderList() {
  const mount = document.getElementById('pendingGroups');
  if (!mount) return;

  const groups = group(getFilteredData());

  if (!groups.length) {
    mount.innerHTML = `<div class="placeholder">Немає записів</div>`;
    selectedKey = null;
    return;
  }

  if (!selectedKey || !groups.some(([key]) => key === selectedKey)) {
    selectedKey = groups[0][0];
  }

  mount.innerHTML = groups.map(([key, rows]) => `
    <div class="card ${selectedKey === key ? 'active' : ''}" data-key="${escapeHtml(key)}">
      <b>${escapeHtml(rows[0].raw_value || rows[0].value_raw || '---')}</b><br>
      ${escapeHtml(rows[0].field_name || '')}<br>
      ${escapeHtml(rows[0].source_table || rows[0].source_name || '')}<br>
      Записів: ${rows.length}
    </div>
  `).join('');

  document.querySelectorAll('.card').forEach((card) => {
    card.onclick = () => {
      selectedKey = card.dataset.key;
      renderList();
      renderRight();
    };
  });
}

function renderRight() {
  const mount = document.getElementById('candidates');
  if (!mount) return;

  if (!selectedKey) {
    mount.innerHTML = 'Обери запис зліва';
    return;
  }

  const rows = getFilteredData().filter((r) => {
    return `${r.raw_value || r.value_raw || ''}_${r.field_name || ''}` === selectedKey;
  });

  if (!rows.length) {
    mount.innerHTML = 'Немає даних';
    return;
  }

  mount.innerHTML = rows.map((r) => `
    <div class="card">
      <b>${escapeHtml(r.normalized_candidate || r.raw_value || '—')}</b><br>
      ID: ${escapeHtml(r.id || '—')}<br>
      Статус: ${escapeHtml(r.decision_status || r.status || r.parse_status || 'pending')}<br>
      Поле: ${escapeHtml(r.field_name || '—')}<br>
      Джерело: ${escapeHtml(r.source_table || r.source_name || '—')}
    </div>
  `).join('');
}

function populateFilters(data) {
  const statusFilter = document.getElementById('statusFilter');
  const fieldFilter = document.getElementById('fieldFilter');
  const sourceFilter = document.getElementById('sourceFilter');

  if (!statusFilter || !fieldFilter || !sourceFilter) return;

  const statuses = Array.from(new Set(data.map((r) => r.decision_status || r.status || r.parse_status || 'pending'))).sort();
  const fields = Array.from(new Set(data.map((r) => r.field_name || 'unknown'))).sort();
  const sources = Array.from(new Set(data.map((r) => r.source_table || r.source_name || 'unknown'))).sort();

  statusFilter.innerHTML = `<option value="all">усі статуси</option>` +
    statuses.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  fieldFilter.innerHTML = `<option value="all">усі поля</option>` +
    fields.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');

  sourceFilter.innerHTML = `<option value="all">усі джерела</option>` +
    sources.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
}

function bindUi() {
  document.getElementById('refreshBtn')?.addEventListener('click', loadData);
  document.getElementById('statusFilter')?.addEventListener('change', () => {
    renderList();
    renderRight();
  });
  document.getElementById('fieldFilter')?.addEventListener('change', () => {
    renderList();
    renderRight();
  });
  document.getElementById('sourceFilter')?.addEventListener('change', () => {
    renderList();
    renderRight();
  });
  document.getElementById('searchInput')?.addEventListener('input', () => {
    renderList();
    renderRight();
  });

  document.getElementById('userAvatar')?.addEventListener('click', async () => {
    if (window.LAVASH_AUTH?.logout) {
      await window.LAVASH_AUTH.logout();
    }
  });
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

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!window.LAVASH_AUTH?.protectAppPage) {
      location.href = 'index.html';
      return;
    }

    const user = await window.LAVASH_AUTH.protectAppPage();
    if (!user) return;

    const avatar = document.getElementById('userAvatar');
    if (avatar) {
      avatar.textContent = (user.email?.[0] || 'U').toUpperCase();
      avatar.title = 'Вийти';
      avatar.style.cursor = 'pointer';
    }

    bindUi();
    await loadData();
  } catch (err) {
    console.error(err);
    setStatus('Критична помилка');
  }
});
