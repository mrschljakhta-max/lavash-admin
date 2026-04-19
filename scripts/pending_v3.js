
const supabase = window.supabase.createClient(
  window.APP_CONFIG.supabaseUrl,
  window.APP_CONFIG.supabaseAnonKey
);

async function loadData() {
  const { data, error } = await supabase
    .from('norm_word_events')
    .select('*')
    .limit(50);

  if (error) {
    console.error(error);
    return;
  }

  render(data);
}

function render(rows) {
  const el = document.getElementById('pendingGroups');
  el.innerHTML = rows.map(r => `
    <div style="margin-bottom:20px; padding:20px; background:#102060; border-radius:12px;">
      ${r.normalized_name || 'Без назви'}
    </div>
  `).join('');
}

function reloadData() {
  loadData();
}

loadData();
