const sb = supabase.createClient(
  window.APP_CONFIG.supabaseUrl,
  window.APP_CONFIG.supabaseAnonKey
);

let dataCache = [];
let selectedKey = null;

function setStatus(text, ok=false){
  const el = document.getElementById('status');
  el.textContent = text;
  el.classList.toggle('ok', ok);
}

async function loadData(){
  setStatus('Завантаження...');

  const { data, error } = await sb
    .from('dict_pending')
    .select('*')
    .limit(200);

  if(error){
    setStatus('Помилка');
    console.error(error);
    return;
  }

  dataCache = data;
  renderList();
  setStatus('Підключено', true);
}

function group(data){
  const map = {};
  data.forEach(r=>{
    const key = (r.raw_value||r.value_raw||'')+'_'+(r.field_name||'');
    if(!map[key]) map[key]=[];
    map[key].push(r);
  });
  return Object.entries(map);
}

function renderList(){
  const mount = document.getElementById('pendingGroups');
  const groups = group(dataCache);

  mount.innerHTML = groups.map(([key,rows])=>{
    return `
      <div class="card ${selectedKey===key?'active':''}" data-key="${key}">
        <b>${rows[0].raw_value||'---'}</b><br>
        ${rows[0].field_name||''}<br>
        ${rows.length} записів
      </div>
    `;
  }).join('');

  document.querySelectorAll('.card').forEach(el=>{
    el.onclick = ()=>{
      selectedKey = el.dataset.key;
      renderList();
      renderRight();
    };
  });
}

function renderRight(){
  const mount = document.getElementById('candidates');
  const rows = dataCache.filter(r=>{
    return (r.raw_value||r.value_raw||'')+'_'+(r.field_name||'') === selectedKey;
  });

  mount.innerHTML = rows.map(r=>{
    return `<div class="card">${r.normalized_candidate||'—'}</div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const { data } = await sb.auth.getUser();
  if(!data.user){
    location.href = 'index.html';
    return;
  }

  document.getElementById('userAvatar').textContent =
    data.user.email[0].toUpperCase();

  document.getElementById('refreshBtn').onclick = loadData;

  loadData();
});
