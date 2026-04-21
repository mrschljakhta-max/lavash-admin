const uploadState = {
  docxFiles: [],
  excelFiles: []
};

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

function updateQueueCounters() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;
  const sideNode = document.getElementById('uploadQueueCount');
  if (sideNode) sideNode.textContent = String(total);
}

function renderFileList(type) {
  const listNode = document.getElementById(type === 'docx' ? 'docxList' : 'excelList');
  const countNode = document.getElementById(type === 'docx' ? 'docxCount' : 'excelCount');
  const files = type === 'docx' ? uploadState.docxFiles : uploadState.excelFiles;
  const icon = type === 'docx'
    ? '/lavash-admin/assets/icons/upload/file-word.svg'
    : '/lavash-admin/assets/icons/upload/file-xls.svg';

  if (!listNode || !countNode) return;

  countNode.textContent = String(files.length);

  if (!files.length) {
    listNode.innerHTML = `<div class="upload-list__empty">${type === 'docx' ? 'Word' : 'Excel'} файли ще не додані</div>`;
    updateQueueCounters();
    return;
  }

  listNode.innerHTML = files.map((file, index) => `
    <div class="upload-file-item">
      <div class="upload-file-item__left">
        <img src="${icon}" class="icon-sm" alt="">
        <div>
          <div class="upload-file-item__name">${escapeHtml(file.name)}</div>
          <div class="upload-file-item__meta">${bytesToSize(file.size)}</div>
        </div>
      </div>

      <button class="upload-file-item__remove" type="button" data-type="${type}" data-index="${index}">
        <img src="/lavash-admin/assets/icons/upload/x.svg" class="icon-xs" alt="">
      </button>
    </div>
  `).join('');

  listNode.querySelectorAll('.upload-file-item__remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.type;
      const idx = Number(btn.dataset.index);

      if (t === 'docx') {
        uploadState.docxFiles.splice(idx, 1);
        renderFileList('docx');
      } else {
        uploadState.excelFiles.splice(idx, 1);
        renderFileList('excel');
      }

      updateQueueCounters();
    });
  });

  updateQueueCounters();
}

function pushUniqueFiles(type, fileList) {
  const incoming = Array.from(fileList || []);
  const target = type === 'docx' ? uploadState.docxFiles : uploadState.excelFiles;

  incoming.forEach((file) => {
    const exists = target.some(
      (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
    );
    if (!exists) target.push(file);
  });

  renderFileList(type);
}

function setupDropZone(type) {
  const drop = document.getElementById(type === 'docx' ? 'docxDrop' : 'excelDrop');
  const input = document.getElementById(type === 'docx' ? 'docxInput' : 'excelInput');
  const btn = document.getElementById(type === 'docx' ? 'docxBtn' : 'excelBtn');
  const clearBtn = document.getElementById(type === 'docx' ? 'clearDocxBtn' : 'clearExcelBtn');

  if (!drop || !input || !btn || !clearBtn) return;

  btn.addEventListener('click', () => input.click());

  input.addEventListener('change', (e) => {
    pushUniqueFiles(type, e.target.files);
    input.value = '';
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    drop.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.add('drag');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    drop.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      drop.classList.remove('drag');
    });
  });

  drop.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files || []);
    const filtered = files.filter((file) => {
      const lower = file.name.toLowerCase();
      if (type === 'docx') return lower.endsWith('.docx');
      return lower.endsWith('.xlsx') || lower.endsWith('.xls');
    });

    pushUniqueFiles(type, filtered);
  });

  clearBtn.addEventListener('click', () => {
    if (type === 'docx') {
      uploadState.docxFiles = [];
    } else {
      uploadState.excelFiles = [];
    }
    renderFileList(type);
  });
}

function resetUploadRightStages() {
  [
    'uploadStageValidateBlock',
    'uploadStageParseBlock',
    'uploadStageExtractBlock',
    'uploadStageDbBlock',
    'overlayStageValidate',
    'overlayStageParse',
    'overlayStageExtract',
    'overlayStageDb'
  ].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.classList.remove('is-active', 'is-done');
  });
}

function activateUploadStage(name) {
  const map = {
    validate: {
      active: ['uploadStageValidateBlock', 'overlayStageValidate'],
      done: []
    },
    parse: {
      active: ['uploadStageParseBlock', 'overlayStageParse'],
      done: ['uploadStageValidateBlock', 'overlayStageValidate']
    },
    extract: {
      active: ['uploadStageExtractBlock', 'overlayStageExtract'],
      done: ['uploadStageValidateBlock', 'overlayStageValidate', 'uploadStageParseBlock', 'overlayStageParse']
    },
    db: {
      active: ['uploadStageDbBlock', 'overlayStageDb'],
      done: [
        'uploadStageValidateBlock', 'overlayStageValidate',
        'uploadStageParseBlock', 'overlayStageParse',
        'uploadStageExtractBlock', 'overlayStageExtract'
      ]
    }
  };

  resetUploadRightStages();

  const state = map[name];
  if (!state) return;

  state.done.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.classList.add('is-done');
  });

  state.active.forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.classList.add('is-active');
  });
}

function finishUploadStages() {
  [
    'uploadStageValidateBlock',
    'uploadStageParseBlock',
    'uploadStageExtractBlock',
    'uploadStageDbBlock',
    'overlayStageValidate',
    'overlayStageParse',
    'overlayStageExtract',
    'overlayStageDb'
  ].forEach((id) => {
    const node = document.getElementById(id);
    if (node) {
      node.classList.remove('is-active');
      node.classList.add('is-done');
    }
  });
}

function showOverlay(title, subtitle) {
  const overlay = document.getElementById('uploadOverlay');
  const titleNode = document.getElementById('uploadOverlayTitle');
  const subtitleNode = document.getElementById('uploadOverlaySubtitle');

  if (overlay) overlay.classList.remove('hidden');
  if (titleNode) titleNode.textContent = title;
  if (subtitleNode) subtitleNode.textContent = subtitle;
}

function hideOverlay() {
  const overlay = document.getElementById('uploadOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* =========================
   DEBUG MODAL
========================= */

function openUploadDebugModal(title, html) {
  const modal = document.getElementById('uploadDebugModal');
  const titleNode = document.getElementById('uploadDebugTitle');
  const bodyNode = document.getElementById('uploadDebugBody');

  if (!modal || !titleNode || !bodyNode) return;

  titleNode.textContent = title;
  bodyNode.innerHTML = html;
  modal.classList.remove('hidden');
}

function closeUploadDebugModal() {
  const modal = document.getElementById('uploadDebugModal');
  if (modal) modal.classList.add('hidden');
}

function renderDebugFileRows(files, iconPath) {
  if (!files.length) {
    return `<div class="debug-empty">Файлів поки немає</div>`;
  }

  return files.map((file) => `
    <div class="debug-file-row">
      <div class="debug-file-row__left">
        <img src="${iconPath}" class="icon-sm" alt="">
        <div>
          <div class="debug-file-row__name">${escapeHtml(file.name)}</div>
          <div class="debug-file-row__meta">${bytesToSize(file.size)}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function showDebugQueue() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;

  openUploadDebugModal('Черга файлів', `
    <div class="debug-grid">
      <div class="debug-stat">
        <div class="debug-stat__value">${total}</div>
        <div class="debug-stat__label">усього файлів у черзі</div>
      </div>

      <div class="debug-columns">
        <div class="debug-panel">
          <div class="debug-panel__title">Word файли (${uploadState.docxFiles.length})</div>
          <div class="debug-file-list">
            ${renderDebugFileRows(uploadState.docxFiles, '/lavash-admin/assets/icons/upload/file-word.svg')}
          </div>
        </div>

        <div class="debug-panel">
          <div class="debug-panel__title">Excel файли (${uploadState.excelFiles.length})</div>
          <div class="debug-file-list">
            ${renderDebugFileRows(uploadState.excelFiles, '/lavash-admin/assets/icons/upload/file-xls.svg')}
          </div>
        </div>
      </div>
    </div>
  `);
}

function showDebugValidate() {
  const files = [...uploadState.docxFiles, ...uploadState.excelFiles];

  const rows = files.length
    ? files.map((file) => {
        const lower = file.name.toLowerCase();
        const validType = lower.endsWith('.docx') || lower.endsWith('.xlsx') || lower.endsWith('.xls');
        const validSize = file.size > 0;

        return `
          <div class="debug-check-row">
            <div class="debug-check-row__name">${escapeHtml(file.name)}</div>
            <div class="debug-check-row__chips">
              <span class="debug-chip ${validType ? 'ok' : 'bad'}">формат: ${validType ? 'ok' : 'bad'}</span>
              <span class="debug-chip ${validSize ? 'ok' : 'bad'}">розмір: ${validSize ? 'ok' : 'bad'}</span>
            </div>
          </div>
        `;
      }).join('')
    : `<div class="debug-empty">Немає файлів для перевірки</div>`;

  openUploadDebugModal('Перевірка', `
    <div class="debug-panel">
      <div class="debug-panel__title">Попередня валідація файлів</div>
      <div class="debug-check-list">${rows}</div>
    </div>
  `);
}

function showDebugParse() {
  const docxCount = uploadState.docxFiles.length;
  const excelCount = uploadState.excelFiles.length;

  openUploadDebugModal('Парсинг', `
    <div class="debug-columns">
      <div class="debug-panel">
        <div class="debug-panel__title">Word parser</div>
        <div class="debug-kv"><span>Файлів:</span><strong>${docxCount}</strong></div>
        <div class="debug-kv"><span>Очікувана дія:</span><strong>витяг таблиць / тексту</strong></div>
        <div class="debug-kv"><span>Ціль:</span><strong>події, типи БпЛА, НП, результат</strong></div>
      </div>

      <div class="debug-panel">
        <div class="debug-panel__title">Excel parser</div>
        <div class="debug-kv"><span>Файлів:</span><strong>${excelCount}</strong></div>
        <div class="debug-kv"><span>Очікувана дія:</span><strong>читання рядків і колонок</strong></div>
        <div class="debug-kv"><span>Ціль:</span><strong>імпорт табличних записів</strong></div>
      </div>
    </div>
  `);
}

function showDebugEvents() {
  const docxCount = uploadState.docxFiles.length;
  const excelCount = uploadState.excelFiles.length;
  const estimated = (docxCount * 12) + (excelCount * 20);

  openUploadDebugModal('Події', `
    <div class="debug-columns">
      <div class="debug-panel">
        <div class="debug-panel__title">Попередня оцінка</div>
        <div class="debug-kv"><span>Word файли:</span><strong>${docxCount}</strong></div>
        <div class="debug-kv"><span>Excel файли:</span><strong>${excelCount}</strong></div>
        <div class="debug-kv"><span>Орієнтовно подій:</span><strong>${estimated}</strong></div>
      </div>

      <div class="debug-panel">
        <div class="debug-panel__title">Що буде формуватись</div>
        <ul class="debug-list">
          <li>нормалізовані записи</li>
          <li>pending-сутності</li>
          <li>службові логи</li>
          <li>зв'язки між джерелом і результатом</li>
        </ul>
      </div>
    </div>
  `);
}

function showDebugDatabase() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;

  openUploadDebugModal('Supabase', `
    <div class="debug-panel">
      <div class="debug-panel__title">План запису в базу</div>
      <div class="debug-kv"><span>Файлів до обробки:</span><strong>${total}</strong></div>
      <div class="debug-kv"><span>Етап:</span><strong>batch upload</strong></div>
      <div class="debug-kv"><span>Очікувані операції:</span><strong>insert / normalize / log</strong></div>
      <div class="debug-kv"><span>Ціль:</span><strong>Supabase tables + processing logs</strong></div>
    </div>
  `);
}

function bindDebugActions() {
  const closeBtn = document.getElementById('uploadDebugClose');
  const backdrop = document.getElementById('uploadDebugBackdrop');

  closeBtn?.addEventListener('click', closeUploadDebugModal);
  backdrop?.addEventListener('click', closeUploadDebugModal);

  document.querySelector('[data-upload-tool="queue"]')?.addEventListener('click', showDebugQueue);
  document.querySelector('[data-upload-tool="validate"]')?.addEventListener('click', showDebugValidate);
  document.querySelector('[data-upload-tool="parse"]')?.addEventListener('click', showDebugParse);
  document.querySelector('[data-upload-tool="extract"]')?.addEventListener('click', showDebugEvents);
  document.querySelector('[data-upload-tool="database"]')?.addEventListener('click', showDebugDatabase);
}

async function runFakeUploadFlow() {
  showOverlay('Підготовка...', 'Ініціалізуємо процес обробки файлів');

  activateUploadStage('validate');
  await sleep(700);
  showOverlay('Перевірка файлів', 'Аналізуємо формат, структуру і допустимість файлів');

  activateUploadStage('parse');
  await sleep(900);
  showOverlay('Парсинг документів', 'Розбираємо вміст Word і Excel файлів');

  activateUploadStage('extract');
  await sleep(900);
  showOverlay('Виділення подій', 'Формуємо події, сутності та службові записи');

  activateUploadStage('db');
  await sleep(900);
  showOverlay('Запис у Supabase', 'Передаємо результати обробки в базу даних');

  finishUploadStages();

  showOverlay('Готово', 'Файли оброблено. Можна переходити до наступного етапу.');
  await sleep(900);
  hideOverlay();
}

async function startUploadFlow() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;

  if (!total) {
    alert('Спочатку додай хоча б один Word або Excel файл.');
    return;
  }

  await runFakeUploadFlow();
}

function bindUploadActions() {
  const sideStartBtn = document.getElementById('uploadStartSideBtn');
  if (sideStartBtn) {
    sideStartBtn.addEventListener('click', startUploadFlow);
  }
}

window.initUploadPage = async function initUploadPage() {
  uploadState.docxFiles = [];
  uploadState.excelFiles = [];

  setupDropZone('docx');
  setupDropZone('excel');

  renderFileList('docx');
  renderFileList('excel');
  updateQueueCounters();
  resetUploadRightStages();
  bindUploadActions();
  bindDebugActions();
};
