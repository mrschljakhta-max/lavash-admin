const uploadState = {
  docxFiles: [],
  excelFiles: []
};

/* =========================
   HELPERS
========================= */

function bytesToSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / (1024 ** i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* =========================
   QUEUE UI
========================= */

function updateQueueCounters() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;
  const sideNode = document.getElementById('uploadQueueCount');
  if (sideNode) sideNode.textContent = total;
}

function renderFileList(type) {
  const listNode = document.getElementById(type === 'docx' ? 'docxList' : 'excelList');
  const countNode = document.getElementById(type === 'docx' ? 'docxCount' : 'excelCount');
  const files = type === 'docx' ? uploadState.docxFiles : uploadState.excelFiles;

  if (!listNode || !countNode) return;

  countNode.textContent = files.length;

  if (!files.length) {
    listNode.innerHTML = `<div class="upload-list__empty">${type === 'docx' ? 'Word' : 'Excel'} файли ще не додані</div>`;
    updateQueueCounters();
    return;
  }

  listNode.innerHTML = files.map((file, index) => `
    <div class="upload-file-item">
      <div class="upload-file-item__left">
        <div>
          <div class="upload-file-item__name">${escapeHtml(file.name)}</div>
          <div class="upload-file-item__meta">${bytesToSize(file.size)}</div>
        </div>
      </div>

      <button class="upload-file-item__remove" data-type="${type}" data-index="${index}">
        ✕
      </button>
    </div>
  `).join('');

  listNode.querySelectorAll('.upload-file-item__remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);

      if (type === 'docx') uploadState.docxFiles.splice(idx, 1);
      else uploadState.excelFiles.splice(idx, 1);

      renderFileList(type);
    });
  });

  updateQueueCounters();
}

function pushFiles(type, fileList) {
  const incoming = Array.from(fileList || []);
  const target = type === 'docx' ? uploadState.docxFiles : uploadState.excelFiles;

  incoming.forEach(file => {
    const exists = target.some(f => f.name === file.name && f.size === file.size);
    if (!exists) target.push(file);
  });

  renderFileList(type);
}

/* =========================
   DROP ZONES
========================= */

function setupDropZone(type) {
  const drop = document.getElementById(type === 'docx' ? 'docxDrop' : 'excelDrop');
  const input = document.getElementById(type === 'docx' ? 'docxInput' : 'excelInput');
  const btn = document.getElementById(type === 'docx' ? 'docxBtn' : 'excelBtn');

  if (!drop) return;

  btn?.addEventListener('click', () => input.click());

  input?.addEventListener('change', (e) => {
    pushFiles(type, e.target.files);
    input.value = '';
  });

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('drag');
  });

  drop.addEventListener('dragleave', () => drop.classList.remove('drag'));

  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('drag');

    const files = Array.from(e.dataTransfer.files);
    pushFiles(type, files);
  });
}

/* =========================
   STAGES (RIGHT PANEL)
========================= */

function resetUploadRightStages() {
  document.querySelectorAll('.tool-item--upload').forEach(el => {
    el.classList.remove('is-active', 'is-done', 'is-error');
  });
}

function activateUploadStage(name) {
  resetUploadRightStages();

  const el = document.querySelector(`[data-upload-tool="${name}"]`);
  if (el) el.classList.add('is-active');
}

function setUploadStageDone(name) {
  const el = document.querySelector(`[data-upload-tool="${name}"]`);
  if (el) {
    el.classList.remove('is-active');
    el.classList.add('is-done');
  }
}

function setUploadStageError(name) {
  const el = document.querySelector(`[data-upload-tool="${name}"]`);
  if (el) {
    el.classList.remove('is-active');
    el.classList.add('is-error');
  }
}

/* =========================
   OVERLAY
========================= */

function showOverlay(title, subtitle) {
  const o = document.getElementById('uploadOverlay');
  if (!o) return;

  o.classList.remove('hidden');
  document.getElementById('uploadOverlayTitle').textContent = title;
  document.getElementById('uploadOverlaySubtitle').textContent = subtitle;
}

function hideOverlay() {
  document.getElementById('uploadOverlay')?.classList.add('hidden');
}

/* =========================
   DEBUG BUTTONS
========================= */

function bindDebug() {
  document.querySelector('[data-upload-tool="queue"]')?.addEventListener('click', () => {
    console.log('QUEUE:', uploadState);
  });

  document.querySelector('[data-upload-tool="validate"]')?.addEventListener('click', () => {
    console.log('VALIDATE DEBUG');
  });

  document.querySelector('[data-upload-tool="parse"]')?.addEventListener('click', () => {
    console.log('PARSE DEBUG');
  });

  document.querySelector('[data-upload-tool="extract"]')?.addEventListener('click', () => {
    console.log('EXTRACT DEBUG');
  });

  document.querySelector('[data-upload-tool="database"]')?.addEventListener('click', () => {
    console.log('DB DEBUG');
  });
}

/* =========================
   MAIN FLOW (ВАЖЛИВО)
========================= */

async function runUploadFlow() {
  try {
    showOverlay('Підготовка...', 'Ініціалізація');

    /* 1. VALIDATE */
    activateUploadStage('validate');
    await sleep(700);

    if (!uploadState.docxFiles.length && !uploadState.excelFiles.length) {
      throw { stage: 'validate', message: 'Немає файлів' };
    }

    setUploadStageDone('validate');

    /* 2. PARSE */
    activateUploadStage('parse');
    await sleep(900);

    // 🔴 тест помилки (можеш прибрати)
    // throw { stage: 'parse', message: 'Помилка парсингу' };

    setUploadStageDone('parse');

    /* 3. EXTRACT */
    activateUploadStage('extract');
    await sleep(900);

    setUploadStageDone('extract');

    /* 4. DATABASE */
    activateUploadStage('database');
    await sleep(900);

    setUploadStageDone('database');

    showOverlay('Готово', 'Успішно оброблено');
    await sleep(800);
    hideOverlay();

  } catch (err) {
    console.error(err);

    setUploadStageError(err.stage || 'validate');

    showOverlay('Помилка', err.message || 'Щось пішло не так');
  }
}

/* =========================
   INIT
========================= */

window.initUploadPage = function () {
  setupDropZone('docx');
  setupDropZone('excel');

  renderFileList('docx');
  renderFileList('excel');

  updateQueueCounters();

  bindDebug();

  document.getElementById('uploadStartSideBtn')?.addEventListener('click', runUploadFlow);
};
