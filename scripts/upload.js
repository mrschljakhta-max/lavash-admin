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

function updateTotalFilesCount() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;
  const node = document.getElementById('totalFilesCount');
  if (node) node.textContent = String(total);
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
    updateTotalFilesCount();
    return;
  }

  listNode.innerHTML = files.map((file, index) => `
    <div class="upload-file-item">
      <div class="upload-file-item__left">
        <img src="${icon}" class="icon-sm" alt="">
        <div>
          <div class="upload-file-item__name">${file.name}</div>
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

      updateTotalFilesCount();
    });
  });

  updateTotalFilesCount();
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

function resetPipelineStates() {
  const ids = [
    'pipelineStepValidate',
    'pipelineStepParse',
    'pipelineStepExtract',
    'pipelineStepDb',
    'overlayStageValidate',
    'overlayStageParse',
    'overlayStageExtract',
    'overlayStageDb'
  ];

  ids.forEach((id) => {
    const node = document.getElementById(id);
    if (node) {
      node.classList.remove('is-active', 'is-done');
    }
  });
}

function markStageActive(stepId, overlayId) {
  resetPipelineStates();

  const allDone = {
    pipelineStepValidate: [],
    pipelineStepParse: ['pipelineStepValidate', 'overlayStageValidate'],
    pipelineStepExtract: ['pipelineStepValidate', 'pipelineStepParse', 'overlayStageValidate', 'overlayStageParse'],
    pipelineStepDb: ['pipelineStepValidate', 'pipelineStepParse', 'pipelineStepExtract', 'overlayStageValidate', 'overlayStageParse', 'overlayStageExtract']
  };

  (allDone[stepId] || []).forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.classList.add('is-done');
  });

  const step = document.getElementById(stepId);
  const overlay = document.getElementById(overlayId);

  if (step) step.classList.add('is-active');
  if (overlay) overlay.classList.add('is-active');
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

async function runFakeUploadFlow() {
  showOverlay('Підготовка...', 'Ініціалізуємо процес обробки файлів');

  markStageActive('pipelineStepValidate', 'overlayStageValidate');
  await sleep(700);
  showOverlay('Перевірка файлів', 'Аналізуємо формат, структуру і допустимість файлів');

  markStageActive('pipelineStepParse', 'overlayStageParse');
  await sleep(900);
  showOverlay('Парсинг документів', 'Розбираємо вміст Word і Excel файлів');

  markStageActive('pipelineStepExtract', 'overlayStageExtract');
  await sleep(900);
  showOverlay('Виділення подій', 'Формуємо події, сутності та службові записи');

  markStageActive('pipelineStepDb', 'overlayStageDb');
  await sleep(900);
  showOverlay('Запис у Supabase', 'Передаємо результати обробки в базу даних');

  ['pipelineStepValidate', 'pipelineStepParse', 'pipelineStepExtract', 'pipelineStepDb',
   'overlayStageValidate', 'overlayStageParse', 'overlayStageExtract', 'overlayStageDb'
  ].forEach((id) => {
    const node = document.getElementById(id);
    if (node) {
      node.classList.remove('is-active');
      node.classList.add('is-done');
    }
  });

  showOverlay('Готово', 'Файли оброблено. Можна переходити до наступного етапу.');
  await sleep(900);
  hideOverlay();
}

function bindUploadActions() {
  const startBtn = document.getElementById('startUpload');
  if (!startBtn) return;

  startBtn.addEventListener('click', async () => {
    const total = uploadState.docxFiles.length + uploadState.excelFiles.length;

    if (!total) {
      alert('Спочатку додай хоча б один Word або Excel файл.');
      return;
    }

    await runFakeUploadFlow();
  });
}

window.initUploadPage = async function initUploadPage() {
  uploadState.docxFiles = [];
  uploadState.excelFiles = [];

  setupDropZone('docx');
  setupDropZone('excel');

  renderFileList('docx');
  renderFileList('excel');
  updateTotalFilesCount();
  bindUploadActions();
};
