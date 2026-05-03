const uploadState = {
  docxFiles: [],
  excelFiles: [],
  currentBatchId: null,
  lastSummary: null,
  lastError: null
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

function safeJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getInsertedRows(result) {
  if (!result || result.skipped) return 0;
  if (typeof result.inserted === 'number') return result.inserted;

  if (Array.isArray(result.files)) {
    return result.files.reduce((sum, item) => {
      const nested = item?.result || item;

      if (typeof nested?.inserted === 'number') {
        return sum + nested.inserted;
      }

      if (Array.isArray(nested?.files)) {
        return sum + nested.files.reduce((inner, fileResult) => {
          return inner + (Number(fileResult?.inserted) || 0);
        }, 0);
      }

      return sum;
    }, 0);
  }

  return 0;
}

function getProcessedFilesCount(result) {
  if (!result || result.skipped) return 0;
  if (typeof result.processed === 'number') return result.processed;
  if (Array.isArray(result.files)) return result.files.length;
  return 0;
}

function setOverlayActions(html = '') {
  const node = document.getElementById('uploadOverlayActions');
  if (node) node.innerHTML = html;
}

function clearUploadQueue() {
  uploadState.docxFiles = [];
  uploadState.excelFiles = [];
  uploadState.currentBatchId = null;
  renderFileList('docx');
  renderFileList('excel');
  updateQueueCounters();
}

function renderUploadSummaryHtml(summary) {
  if (!summary) {
    return `<div class="debug-empty">Поки немає даних останнього запуску</div>`;
  }

  const wordInserted = getInsertedRows(summary.word_result);
  const excelInserted = getInsertedRows(summary.excel_result);
  const wordProcessed = getProcessedFilesCount(summary.word_result);
  const excelProcessed = getProcessedFilesCount(summary.excel_result);

  return `
    <div class="debug-grid">
      <div class="debug-stat">
        <div class="debug-stat__value">${escapeHtml(summary.batch_id || '—')}</div>
        <div class="debug-stat__label">batch_id</div>
      </div>

      <div class="debug-columns">
        <div class="debug-panel">
          <div class="debug-panel__title">Word</div>
          <div class="debug-kv"><span>Завантажено файлів:</span><strong>${Number(summary.uploaded_docx) || 0}</strong></div>
          <div class="debug-kv"><span>Оброблено файлів:</span><strong>${wordProcessed}</strong></div>
          <div class="debug-kv"><span>RAW рядків:</span><strong>${wordInserted}</strong></div>
        </div>

        <div class="debug-panel">
          <div class="debug-panel__title">Excel</div>
          <div class="debug-kv"><span>Завантажено файлів:</span><strong>${Number(summary.uploaded_excel) || 0}</strong></div>
          <div class="debug-kv"><span>Оброблено файлів:</span><strong>${excelProcessed}</strong></div>
          <div class="debug-kv"><span>RAW рядків:</span><strong>${excelInserted}</strong></div>
        </div>
      </div>

      <div class="debug-panel">
        <div class="debug-panel__title">Технічний результат</div>
        <pre class="debug-pre">${escapeHtml(safeJson(summary))}</pre>
      </div>
    </div>
  `;
}

function showLastUploadSummary() {
  openUploadDebugModal('Останній batch', renderUploadSummaryHtml(uploadState.lastSummary));
}

function showUploadErrorDetails() {
  const err = uploadState.lastError;
  openUploadDebugModal('Остання помилка', `
    <div class="debug-panel">
      <div class="debug-panel__title">Деталі</div>
      <div class="debug-kv"><span>Етап:</span><strong>${escapeHtml(err?.stage || 'unknown')}</strong></div>
      <div class="debug-kv"><span>Повідомлення:</span><strong>${escapeHtml(err?.message || '—')}</strong></div>
      <pre class="debug-pre">${escapeHtml(safeJson(err || {}))}</pre>
    </div>
  `);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function fileExt(name) {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
}

function safeFileName(name) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.\-() ]+/g, '_')
    .replace(/\s+/g, '_');
}

function nowIso() {
  return new Date().toISOString();
}

function getUploadConfig() {
  const cfg = window.APP_CONFIG || {};

  return {
    supabaseUrl: cfg.supabaseUrl,
    supabaseAnonKey: cfg.supabaseAnonKey,

    // bucket для сирих файлів
    uploadBucket: cfg.uploadBucket || 'uploads',

    // edge functions / webhook endpoints
    edgeWordProcessUrl: cfg.edgeWordProcessUrl || '',
    edgeExcelProcessUrl: cfg.edgeExcelProcessUrl || '',
    edgeBatchFinalizeUrl: cfg.edgeBatchFinalizeUrl || '',

    // таблиця партій, якщо хочеш логувати фронтом
    batchTable: cfg.uploadBatchTable || 'upload_batches',
    uploadedFilesTable: cfg.uploadedFilesTable || 'uploaded_files'
  };
}

function getSupabaseClient() {
  if (!window.supabase?.createClient) {
    throw new Error('Supabase client не завантажений');
  }

  const cfg = getUploadConfig();

  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    throw new Error('Не задані supabaseUrl / supabaseAnonKey в config.js');
  }

  if (!window.__lavashUploadSb) {
    window.__lavashUploadSb = window.supabase.createClient(
      cfg.supabaseUrl,
      cfg.supabaseAnonKey,
      {
        auth: {
          storage: window.sessionStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  return window.__lavashUploadSb;
}

/* =========================
   QUEUE UI
========================= */

function updateQueueCounters() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;

  const sideNode = document.getElementById('uploadQueueCount');
  if (sideNode) sideNode.textContent = String(total);

  const stepQueueCount = document.getElementById('uploadStepQueueCount');
  if (stepQueueCount) stepQueueCount.textContent = String(total);

  const runCount = document.getElementById('uploadRunCount');
  if (runCount) runCount.textContent = total ? `${total} готово` : 'додай файл';

  const startBtn = document.getElementById('uploadStartSideBtn');
  if (startBtn) {
    startBtn.disabled = total === 0;
    startBtn.classList.toggle('is-ready', total > 0);
  }

  const queueStep = document.getElementById('uploadStepQueue');
  if (queueStep) {
    queueStep.classList.toggle('is-done', total > 0);
    queueStep.classList.toggle('is-active', total === 0);
  }

  const docxCount = document.getElementById('docxCount');
  if (docxCount) docxCount.textContent = String(uploadState.docxFiles.length);

  const excelCount = document.getElementById('excelCount');
  if (excelCount) excelCount.textContent = String(uploadState.excelFiles.length);
}

function renderFileList(type) {
  const listNode = document.getElementById(type === 'docx' ? 'docxList' : 'excelList');
  const files = type === 'docx' ? uploadState.docxFiles : uploadState.excelFiles;
  const icon = type === 'docx'
    ? '/lavash-admin/assets/icons/upload/file-word.svg'
    : '/lavash-admin/assets/icons/upload/file-xls.svg';

  if (!listNode) return;

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
    const lower = file.name.toLowerCase();
    const ok = type === 'docx'
      ? lower.endsWith('.docx')
      : lower.endsWith('.xlsx') || lower.endsWith('.xls');

    if (!ok) return;

    const exists = target.some(
      (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
    );

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
    pushUniqueFiles(type, files);
  });

  clearBtn.addEventListener('click', () => {
    if (type === 'docx') {
      uploadState.docxFiles = [];
      renderFileList('docx');
    } else {
      uploadState.excelFiles = [];
      renderFileList('excel');
    }
    updateQueueCounters();
  });
}

/* =========================
   STAGE UI
========================= */

function resetUploadRightStages() {
  [
    'uploadStageValidateBlock',
    'uploadStartSideBtn',
    'overlayStageValidate',
    'overlayStageParse',
    'overlayStageExtract',
    'overlayStageDb'
  ].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.classList.remove('is-active', 'is-done', 'is-error');
  });
  updateQueueCounters();
}

function activateUploadStage(name) {
  const map = {
    validate: {
      active: ['uploadStageValidateBlock', 'overlayStageValidate'],
      done: ['uploadStepQueue']
    },
    parse: {
      active: ['uploadStageValidateBlock', 'overlayStageParse'],
      done: ['uploadStepQueue', 'overlayStageValidate']
    },
    extract: {
      active: ['uploadStageValidateBlock', 'overlayStageExtract'],
      done: ['uploadStepQueue', 'overlayStageValidate', 'overlayStageParse']
    },
    db: {
      active: ['uploadStageValidateBlock', 'overlayStageDb'],
      done: [
        'uploadStepQueue',
        'overlayStageValidate',
        'overlayStageParse',
        'overlayStageExtract'
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

function setUploadStageError(name) {
  const map = {
    validate: ['uploadStageValidateBlock', 'overlayStageValidate'],
    parse: ['uploadStageValidateBlock', 'overlayStageParse'],
    extract: ['uploadStageValidateBlock', 'overlayStageExtract'],
    db: ['uploadStageValidateBlock', 'overlayStageDb']
  };

  const ids = map[name] || [];
  ids.forEach((id) => {
    const node = document.getElementById(id);
    if (node) {
      node.classList.remove('is-active', 'is-done');
      node.classList.add('is-error');
    }
  });
}

function finishUploadStages() {
  [
    'uploadStepQueue',
    'uploadStageValidateBlock',
    'uploadStartSideBtn',
    'overlayStageValidate',
    'overlayStageParse',
    'overlayStageExtract',
    'overlayStageDb'
  ].forEach((id) => {
    const node = document.getElementById(id);
    if (node) {
      node.classList.remove('is-active', 'is-error');
      node.classList.add('is-done');
    }
  });
}

/* =========================
   OVERLAY
========================= */

function showOverlay(title, subtitle) {
  const overlay = document.getElementById('uploadOverlay');
  const titleNode = document.getElementById('uploadOverlayTitle');
  const subtitleNode = document.getElementById('uploadOverlaySubtitle');

  if (overlay) {
    overlay.classList.remove('hidden', 'is-success', 'is-error');
    overlay.classList.add('is-processing');
  }
  if (titleNode) titleNode.textContent = title;
  if (subtitleNode) subtitleNode.textContent = subtitle;
}

function setOverlayMode(mode = 'processing') {
  const overlay = document.getElementById('uploadOverlay');
  if (!overlay) return;

  overlay.classList.remove('is-processing', 'is-success', 'is-error');

  if (mode === 'success') overlay.classList.add('is-success');
  else if (mode === 'error') overlay.classList.add('is-error');
  else overlay.classList.add('is-processing');
}

function hideOverlay() {
  const overlay = document.getElementById('uploadOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('is-processing', 'is-success', 'is-error');
  }
  setOverlayActions('');
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

    ${uploadState.lastSummary ? renderUploadSummaryHtml(uploadState.lastSummary) : ''}
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

/* =========================
   SUPABASE STORAGE / BATCH
========================= */

async function getCurrentUploadUser(sb) {
  const {
    data: { session },
    error
  } = await sb.auth.getSession();

  if (error) {
    throw new Error(`Не вдалося отримати сесію користувача: ${error.message}`);
  }

  if (!session?.user) {
    throw new Error('Користувач не авторизований. Увійди в систему перед завантаженням файлів.');
  }

  return {
    session,
    email: session.user.email || session.user.user_metadata?.email || null
  };
}

function getBatchType() {
  const hasWord = uploadState.docxFiles.length > 0;
  const hasExcel = uploadState.excelFiles.length > 0;

  if (hasWord && hasExcel) return 'mixed';
  if (hasWord) return 'word';
  if (hasExcel) return 'excel';
  return 'mixed';
}

function makeBatchNote(extra = {}) {
  const payload = {
    app: 'lavash-admin',
    page: 'upload',
    docx_files: uploadState.docxFiles.length,
    excel_files: uploadState.excelFiles.length,
    ...extra
  };

  return JSON.stringify(payload);
}

async function createBatchRecord(sb) {
  const cfg = getUploadConfig();
  const batchId = uid();
  const user = await getCurrentUploadUser(sb);

  const payload = {
    id: batchId,
    source_system: 'lavash-admin',
    batch_type: getBatchType(),
    uploaded_by: user.email,
    status: 'created',
    note: makeBatchNote({ stage: 'created' })
  };

  const { error } = await sb.from(cfg.batchTable).insert(payload);
  if (error) {
    throw new Error(`Не вдалося створити batch: ${error.message}`);
  }

  uploadState.currentBatchId = batchId;
  return batchId;
}

async function updateBatchStatus(sb, batchId, status, noteExtra = {}) {
  const cfg = getUploadConfig();

  if (!batchId) return;

  const payload = {
    status,
    note: makeBatchNote({
      stage: status,
      ...noteExtra
    })
  };

  if (status === 'processed' || status === 'completed' || status === 'error') {
    payload.processed_at = nowIso();
  }

  const { error } = await sb
    .from(cfg.batchTable)
    .update(payload)
    .eq('id', batchId);

  if (error) {
    console.warn('Не вдалося оновити статус batch:', error.message);
  }
}

async function uploadSingleFileToStorage(sb, file, batchId, type) {
  const cfg = getUploadConfig();
  const ext = fileExt(file.name);
  const fileId = uid();
  const folder = type === 'word' ? 'word' : 'excel';
  const path = `${batchId}/${folder}/${fileId}_${safeFileName(file.name)}`;

  const { error: storageError } = await sb.storage
    .from(cfg.uploadBucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined
    });

  if (storageError) {
    throw new Error(`Помилка завантаження ${file.name}: ${storageError.message}`);
  }

  const filePayload = {
    id: fileId,
    batch_id: batchId,
    file_name: file.name,
    file_ext: ext,
    mime_type: file.type || null,
    source_sheet: null,
    file_size_bytes: file.size,
    storage_path: path
  };

  const { data: fileRow, error: fileRowError } = await sb
    .from(cfg.uploadedFilesTable)
    .insert(filePayload)
    .select('id,batch_id,file_name,file_ext,mime_type,source_sheet,file_size_bytes,storage_path,created_at')
    .single();

  if (fileRowError) {
    throw new Error(`Помилка запису uploaded_files для ${file.name}: ${fileRowError.message}`);
  }

  return {
    id: fileRow?.id || fileId,
    file_id: fileRow?.id || fileId,
    batch_id: batchId,
    name: file.name,
    file_name: file.name,
    ext,
    path,
    storage_path: path,
    bucket: cfg.uploadBucket,
    type,
    file_kind: type,
    size: file.size,
    file_size_bytes: file.size,
    mime_type: file.type || null
  };
}

async function uploadAllFiles(sb, batchId) {
  const uploaded = {
    docx: [],
    excel: []
  };

  for (const file of uploadState.docxFiles) {
    uploaded.docx.push(await uploadSingleFileToStorage(sb, file, batchId, 'word'));
  }

  for (const file of uploadState.excelFiles) {
    uploaded.excel.push(await uploadSingleFileToStorage(sb, file, batchId, 'excel'));
  }

  return uploaded;
}

async function postJson(url, body, accessToken = '') {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const msg = data?.error || data?.message || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

async function triggerWordProcessing(sb, batchId, uploadedWordFiles) {
  const cfg = getUploadConfig();
  if (!uploadedWordFiles.length) return { ok: true, skipped: true, files: [] };

  if (!cfg.edgeWordProcessUrl) {
    throw new Error('Не задано edgeWordProcessUrl в config.js');
  }

  const { session } = await getCurrentUploadUser(sb);
  const results = [];

  // process-word-batch v2 приймає file_id.
  // Обробляємо Word файли по одному, щоб 5-10 файлів не вкладались
  // в один довгий Edge Function виклик і не ловили timeout.
  for (let i = 0; i < uploadedWordFiles.length; i += 1) {
    const file = uploadedWordFiles[i];

    showOverlay(
      'Парсинг Word',
      `Обробка ${i + 1}/${uploadedWordFiles.length}: ${file.file_name || file.name}`
    );

    const result = await postJson(
      cfg.edgeWordProcessUrl,
      {
        batch_id: batchId,
        file_id: file.file_id || file.id,
        file_type: 'word',
        file
      },
      session?.access_token || ''
    );

    results.push({
      file_id: file.file_id || file.id,
      file_name: file.file_name || file.name,
      result
    });
  }

  return {
    ok: true,
    mode: 'per-file',
    processed: results.length,
    files: results
  };
}

async function triggerExcelProcessing(sb, batchId, uploadedExcelFiles) {
  const cfg = getUploadConfig();
  if (!uploadedExcelFiles.length) return { ok: true, skipped: true, files: [] };

  if (!cfg.edgeExcelProcessUrl) {
    throw new Error('Не задано edgeExcelProcessUrl в config.js');
  }

  const { session } = await getCurrentUploadUser(sb);
  const results = [];

  // process-excel-batch приймає file_id.
  // Excel також обробляємо по одному файлу, щоб уникнути timeout
  // при великих таблицях або 5-10 файлах у batch.
  for (let i = 0; i < uploadedExcelFiles.length; i += 1) {
    const file = uploadedExcelFiles[i];

    showOverlay(
      'Парсинг Excel',
      `Обробка ${i + 1}/${uploadedExcelFiles.length}: ${file.file_name || file.name}`
    );

    const result = await postJson(
      cfg.edgeExcelProcessUrl,
      {
        batch_id: batchId,
        file_id: file.file_id || file.id,
        file_type: 'excel',
        file
      },
      session?.access_token || ''
    );

    results.push({
      file_id: file.file_id || file.id,
      file_name: file.file_name || file.name,
      result
    });
  }

  return {
    ok: true,
    mode: 'per-file',
    processed: results.length,
    files: results
  };
}

async function finalizeBatch(sb, batchId, summary) {
  const cfg = getUploadConfig();

  await updateBatchStatus(sb, batchId, 'processed', {
    summary
  });

  if (cfg.edgeBatchFinalizeUrl) {
    const { session } = await getCurrentUploadUser(sb);

    await postJson(
      cfg.edgeBatchFinalizeUrl,
      {
        batch_id: batchId,
        summary
      },
      session?.access_token || ''
    );
  }

  return true;
}

async function markBatchError(sb, batchId, errorMessage, stage = 'unknown') {
  if (!sb || !batchId) return;

  await updateBatchStatus(sb, batchId, 'error', {
    error_stage: stage,
    error_message: errorMessage
  });
}

/* =========================
   PIPELINE
========================= */

async function runRealUploadFlow() {
  const total = uploadState.docxFiles.length + uploadState.excelFiles.length;
  if (!total) {
    throw {
      stage: 'validate',
      message: 'Спочатку додай хоча б один Word або Excel файл.'
    };
  }

  const sb = getSupabaseClient();

  /* 1. VALIDATE */
  activateUploadStage('validate');
  showOverlay('Перевірка', 'Перевіряємо файли перед запуском');
  await sleep(250);

  const invalid = [
    ...uploadState.docxFiles.filter(f => !f.name.toLowerCase().endsWith('.docx')),
    ...uploadState.excelFiles.filter(f => {
      const n = f.name.toLowerCase();
      return !(n.endsWith('.xlsx') || n.endsWith('.xls'));
    })
  ];

  if (invalid.length) {
    throw {
      stage: 'validate',
      message: `Знайдено файли з недопустимим форматом: ${invalid.map(f => f.name).join(', ')}`
    };
  }

  /* 2. PARSE (тут у нас фактично upload + старт backend parsing) */
  activateUploadStage('parse');
  showOverlay('Завантаження в Supabase', 'Створюємо batch і відправляємо файли у Storage');

  let batchId = uploadState.currentBatchId;
  try {
    batchId = await createBatchRecord(sb);
  } catch (error) {
    throw {
      stage: 'parse',
      message: error.message || 'Помилка створення batch'
    };
  }

  let uploaded;
  try {
    uploaded = await uploadAllFiles(sb, batchId);
  } catch (error) {
    throw {
      stage: 'parse',
      message: error.message || 'Помилка завантаження файлів'
    };
  }

  /* 3. EXTRACT */
  activateUploadStage('extract');
  showOverlay('Парсинг / Виділення подій', 'Запускаємо backend-обробку Word та Excel');

  let wordResult = null;
  let excelResult = null;

  try {
    wordResult = await triggerWordProcessing(sb, batchId, uploaded.docx);
    excelResult = await triggerExcelProcessing(sb, batchId, uploaded.excel);
  } catch (error) {
    throw {
      stage: 'extract',
      message: error.message || 'Помилка backend-обробки'
    };
  }

  /* 4. DATABASE */
  activateUploadStage('db');
  showOverlay('Завершення', 'Фіксуємо результат batch у базі');

  const summary = {
    batch_id: batchId,
    uploaded_docx: uploaded.docx.length,
    uploaded_excel: uploaded.excel.length,
    word_result: wordResult,
    excel_result: excelResult
  };

  try {
    await finalizeBatch(sb, batchId, summary);
  } catch (error) {
    throw {
      stage: 'db',
      message: error.message || 'Помилка фіналізації batch'
    };
  }

  uploadState.lastSummary = summary;
  uploadState.lastError = null;

  finishUploadStages();

  const wordInserted = getInsertedRows(wordResult);
  const excelInserted = getInsertedRows(excelResult);

  showOverlay(
    'Готово',
    `Batch ${batchId} оброблено · Word RAW: ${wordInserted} · Excel RAW: ${excelInserted}`
  );
  setOverlayMode('success');

  setOverlayActions(`
    <button class="upload-overlay-action" type="button" id="uploadSummaryBtn">Деталі batch</button>
    <button class="upload-overlay-action primary" type="button" id="uploadCloseOverlayBtn">Закрити</button>
  `);

  document.getElementById('uploadSummaryBtn')?.addEventListener('click', showLastUploadSummary);
  document.getElementById('uploadCloseOverlayBtn')?.addEventListener('click', hideOverlay);

  clearUploadQueue();

  return summary;
}

async function startUploadFlow() {
  let sb = null;

  try {
    sb = getSupabaseClient();
    await runRealUploadFlow();
  } catch (err) {
    console.error('startUploadFlow error:', err);

    try {
      await markBatchError(
        sb,
        uploadState.currentBatchId,
        err.message || 'Щось пішло не так',
        err.stage || 'unknown'
      );
    } catch (markError) {
      console.warn('Не вдалося зафіксувати помилку batch:', markError);
    }

    uploadState.lastError = {
      stage: err.stage || 'unknown',
      message: err.message || 'Щось пішло не так',
      raw: err
    };

    setUploadStageError(err.stage || 'validate');
    showOverlay('Помилка', err.message || 'Щось пішло не так');
    setOverlayMode('error');

    setOverlayActions(`
      <button class="upload-overlay-action" type="button" id="uploadErrorDetailsBtn">Деталі</button>
      <button class="upload-overlay-action primary" type="button" id="uploadRetryBtn">Повторити</button>
      <button class="upload-overlay-action" type="button" id="uploadCloseOverlayBtn">Закрити</button>
    `);

    document.getElementById('uploadErrorDetailsBtn')?.addEventListener('click', showUploadErrorDetails);
    document.getElementById('uploadRetryBtn')?.addEventListener('click', () => {
      hideOverlay();
      startUploadFlow();
    });
    document.getElementById('uploadCloseOverlayBtn')?.addEventListener('click', hideOverlay);
  }
}

/* =========================
   BINDINGS
========================= */

function bindUploadActions() {
  const sideStartBtn = document.getElementById('uploadStartSideBtn');
  if (sideStartBtn) {
    sideStartBtn.addEventListener('click', startUploadFlow);
  }
}

async function initUploadPage() {
  uploadState.docxFiles = [];
  uploadState.excelFiles = [];
  uploadState.currentBatchId = null;

  setupDropZone('docx');
  setupDropZone('excel');

  renderFileList('docx');
  renderFileList('excel');
  updateQueueCounters();
  resetUploadRightStages();
  bindUploadActions();
  bindDebugActions();
}

// ВАЖЛИВО: router.js викликає саме window.LAVASH_UPLOAD.initUploadPage().
// Дублюємо старий глобальний initUploadPage для сумісності зі старими версіями роутера.
window.initUploadPage = initUploadPage;
window.LAVASH_UPLOAD = {
  initUploadPage,
  startUploadFlow,
  updateQueueCounters,
  showLastUploadSummary,
  getState: () => uploadState
};
/* =========================
   CARD PARALLAX (VISION FEEL)
========================= */

document.querySelectorAll('.upload-card').forEach(card => {

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      rotateX(${y * -6}deg)
      rotateY(${x * 6}deg)
      scale(1.02)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

});
