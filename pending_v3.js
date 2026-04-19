const pendingSb = supabase.createClient(window.APP_CONFIG.supabaseUrl, window.APP_CONFIG.supabaseAnonKey);
let connectionRetryTimer = null;
let isCheckingConnection = false;
let pendingDataCache = [];

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

function renderPendingGroups(rows) {
  const mount = document.getElementById('pendingGroups');
  if (!mount) return;
  if (!rows.length) {
    mount.innerHTML = '<div class="placeholder">Немає записів для відображення</div>';
    return;
  }
  mount.innerHTML = rows.slice(0, 200).map((row) => {
    const title = row.raw_value || row.value_raw || row.normalized_name || row.id || 'Запис';
    const field = row.field_name || row.entity_type || 'невідоме поле';
    const source = row.source_table || row.source_name || 'джерело';
    return `
      <article class="pending-card">
        <div style="font-size:20px;font-weight:800;margin-bottom:8px">${escapeHtml(String(title))}</div>
        <div class="small">${escapeHtml(String(field))}</div>
        <div class="small">${escapeHtml(String(source))}</div>
      </article>
    `;
  }).join('');
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
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
    renderPendingGroups(pendingDataCache);
  } catch (err) {
    console.error('loadPendingData failed:', err);
    setConnectionBadge('Помилка завантаження даних', 'error');
  }
}

async function bootPendingPage() {
  const ok = await checkSupabaseConnection();
  if (!ok) {
    if (connectionRetryTimer) clearTimeout(connectionRetryTimer);
    connectionRetryTimer = setTimeout(() => bootPendingPage(), 5000);
    return;
  }
  await loadPendingData();
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
    document.getElementById('refreshBtn')?.addEventListener('click', loadPendingData);
    await bootPendingPage();
  } catch (err) {
    console.error('pending init failed:', err);
    setConnectionBadge('Критична помилка запуску', 'error');
  }
});
