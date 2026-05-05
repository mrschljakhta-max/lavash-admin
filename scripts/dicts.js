(() => {
  const DICT_ICON_PATH = '../assets/icons/dicts/';

  const DICT_ICONS = {
    uav: 'uav.svg',
    settlement: 'settlement.svg',
    station: 'station.svg',
    unit: 'unit.svg',
    stack: 'stack.svg',
    pending: 'pending.svg',
    plus: 'plus.svg'
  };

  const DICT_DEFS = [
    { id: 'units', title: 'Підрозділи', icon: 'unit', table: 'dict_units', nameField: 'unit_name', normalizedField: 'normalized_name', status: 'active', type: 'core' },
    { id: 'coverObjects', title: 'Обʼєкти прикриття', icon: 'stack', table: 'dict_cover_objects', nameField: 'object_name', normalizedField: 'normalized_name', status: 'active', type: 'core' },
    { id: 'stations', title: 'Станції РЕБ', icon: 'station', table: 'dict_stations', nameField: 'station_name', normalizedField: 'normalized_name', status: 'active', type: 'core' },
    { id: 'uav', title: 'БпЛА', icon: 'uav', table: 'dict_uav', nameField: 'uav_name', normalizedField: 'normalized_name', status: 'active', type: 'core' },
    { id: 'settlements', title: 'Населені пункти', icon: 'settlement', table: 'dict_settlements', nameField: 'name', normalizedField: 'normalized_name', status: 'active', type: 'core' },
    { id: 'contact', title: 'Персонал / контакти', icon: 'unit', table: 'dict_contact', nameField: 'full_name', normalizedField: 'normalized_name', status: 'active', type: 'core' },

    { id: 'uavAliases', title: 'Аліаси БпЛА', icon: 'stack', table: 'dict_uav_aliases', nameField: 'alias', normalizedField: 'normalized_alias', status: 'active', type: 'aux' },
    { id: 'stationAliases', title: 'Аліаси станцій', icon: 'stack', table: 'dict_station_aliases', nameField: 'alias', normalizedField: 'normalized_alias', status: 'active', type: 'aux' },
    { id: 'settlementAliases', title: 'Аліаси НП', icon: 'settlement', table: 'dict_settlement_aliases', nameField: 'alias', normalizedField: 'normalized_alias', status: 'active', type: 'aux' },
    { id: 'unitAliases', title: 'Аліаси підрозділів', icon: 'unit', table: 'dict_unit_aliases', nameField: 'alias', normalizedField: 'normalized_alias', status: 'active', type: 'aux' },
    { id: 'stationTypes', title: 'Типи станцій', icon: 'station', table: 'dict_station_types', nameField: 'type_name', normalizedField: 'normalized_name', status: 'active', type: 'aux' },
    { id: 'stationTypeBands', title: 'Діапазони станцій', icon: 'station', table: 'dict_station_type_bands', nameField: 'band_name', normalizedField: 'normalized_name', status: 'active', type: 'aux' },
    { id: 'objectTypes', title: 'Типи обʼєктів', icon: 'stack', table: 'dict_object_types', nameField: 'type_name', normalizedField: 'normalized_name', status: 'active', type: 'aux' },
    { id: 'navigation', title: 'Навігація', icon: 'stack', table: 'dict_navigation', nameField: 'nav_name', normalizedField: 'normalized_name', status: 'active', type: 'aux' },
    { id: 'civilFreq', title: 'Частоти', icon: 'stack', table: 'dict_civil_freq', nameField: 'name', normalizedField: 'normalized_name', status: 'active', type: 'aux' },
    { id: 'valueMap', title: 'Статуси / значення', icon: 'stack', table: 'dict_value_map', nameField: 'raw_value', normalizedField: 'normalized_value', status: 'active', type: 'aux' },
    { id: 'pending', title: 'Pending', icon: 'pending', table: 'dict_pending', nameField: 'raw_value', normalizedField: 'normalized_candidate', status: 'active', type: 'service' }
  ];

  const dictsState = {
    items: DICT_DEFS.map((item) => ({ ...item, total: 0, loaded: false, error: null })),
    activeIndex: 0,
    selectedTable: null,
    selectedRows: [],
    selectedOffset: 0,
    selectedPageSize: 100,
    selectedHasMore: false,
    selectedTotalLoaded: 0,
    tableMode: 'list',
    isLoadingCounts: false,
    isLoadingRows: false,
    lastError: null
  };

  const dictsRuntime = {
    db: null
  };

  function createSupabaseClient() {
    if (dictsRuntime.db) return dictsRuntime.db;

    const cfg = window.APP_CONFIG || {};
    const url = cfg.supabaseUrl;
    const key = cfg.supabaseAnonKey;

    if (!url || !key || !window.supabase?.createClient) {
      dictsState.lastError = 'Supabase config/client missing';
      return null;
    }

    dictsRuntime.db = window.supabase.createClient(url, key, {
      auth: {
        storage: window.sessionStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    return dictsRuntime.db;
  }

  function getDictByIndex(index) {
    const items = getRenderItems();
    return items[index] || null;
  }

  async function loadDictionaryCounts() {
    const db = createSupabaseClient();
    if (!db) return false;

    dictsState.isLoadingCounts = true;
    dictsState.lastError = null;

    try {
      const loadedItems = await Promise.all(dictsState.items.map(async (item) => {
        try {
          let query = db.from(item.table).select('id', { count: 'exact', head: true });

          if (item.table === 'dict_pending') {
            query = db.from(item.table).select('id', { count: 'exact', head: true }).eq('decision_status', 'pending');
          }

          const { count, error } = await query;
          if (error) throw error;

          return { ...item, total: count || 0, loaded: true, error: null };
        } catch (err) {
          console.warn(`Dictionary count load error: ${item.table}`, err);
          return { ...item, loaded: false, error: err?.message || String(err) };
        }
      }));

      dictsState.items = loadedItems;
      return true;
    } catch (err) {
      dictsState.lastError = err?.message || String(err);
      console.warn('Dictionary counts load error:', err);
      return false;
    } finally {
      dictsState.isLoadingCounts = false;
    }
  }

  function pickColumnsForItem(item) {
    const base = ['id'];
    if (item.nameField) base.push(item.nameField);
    if (item.normalizedField && item.normalizedField !== item.nameField) base.push(item.normalizedField);

    if (item.table === 'dict_pending') {
      return 'id,field_name,raw_value,normalized_candidate,decision_status,resolved_table,created_at';
    }

    base.push('created_at');
    return [...new Set(base)].join(',');
  }

  function getPrimaryLabel(item, row) {
    if (!row) return '—';
    return row[item.nameField] || row.name || row.uav_name || row.station_name || row.unit_name || row.object_name || row.raw_value || row.normalized_name || row.id || '—';
  }

  function getSecondaryLabel(item, row) {
    if (!row) return '';
    if (item.table === 'dict_pending') {
      return [row.field_name, row.resolved_table, row.decision_status].filter(Boolean).join(' · ');
    }
    return row[item.normalizedField] || row.normalized_name || '';
  }

  async function loadDictionaryRows(item, options = {}) {
    const db = createSupabaseClient();
    if (!db || !item?.table || item.__create) return false;

    const append = Boolean(options.append);
    const pageSize = Number(options.pageSize || dictsState.selectedPageSize || 100);
    const from = append ? dictsState.selectedOffset : 0;
    const to = from + pageSize - 1;

    dictsState.isLoadingRows = true;
    dictsState.selectedTable = item;
    dictsState.tableMode = 'detail';

    if (!append) {
      dictsState.selectedRows = [];
      dictsState.selectedOffset = 0;
      dictsState.selectedHasMore = false;
      dictsState.selectedTotalLoaded = 0;
    }

    try {
      // select('*') — довідники мають різні колонки, тому не звужуємо вибірку.
      let query = db
        .from(item.table)
        .select('*')
        .range(from, to);

      if (item.table === 'dict_pending') {
        query = query.eq('decision_status', 'pending').order('created_at', { ascending: false });
      } else if (item.nameField) {
        query = query.order(item.nameField, { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      const nextRows = data || [];
      dictsState.selectedRows = append ? [...dictsState.selectedRows, ...nextRows] : nextRows;
      dictsState.selectedOffset = from + nextRows.length;
      dictsState.selectedTotalLoaded = dictsState.selectedRows.length;
      dictsState.selectedHasMore = nextRows.length === pageSize && dictsState.selectedRows.length < Number(item.total || Infinity);
      return true;
    } catch (err) {
      dictsState.lastError = err?.message || String(err);
      console.warn(`Dictionary rows load error: ${item.table}`, err);
      if (!append) dictsState.selectedRows = [];
      return false;
    } finally {
      dictsState.isLoadingRows = false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('uk-UA').format(value || 0);
  }

  function renderDictIcon(iconName) {
    const fileName = DICT_ICONS[iconName] || DICT_ICONS.stack;

    return `
      <img
        class="dict-card__icon-img"
        src="${DICT_ICON_PATH}${fileName}"
        alt=""
        aria-hidden="true"
        loading="lazy"
        draggable="false"
      />
    `;
  }

  function getRenderItems() {
    return [
      ...dictsState.items,
      {
        id: 'create',
        title: 'Новий довідник',
        icon: 'plus',
        total: 0,
        status: 'new',
        type: 'service',
        __create: true
      }
    ];
  }

  function normalizeIndex(index, total) {
    return ((index % total) + total) % total;
  }

  function getVisibleSlots(items) {
    const total = items.length;

    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = normalizeIndex(dictsState.activeIndex + offset, total);

      return {
        item: items[index],
        index,
        offset
      };
    });
  }

  function computeTransform(offset) {
    const STEP = 260;

    const map = {
      '-2': { x: -STEP * 2, scale: 0.62, depth: -260, opacity: 0.42, blur: 1.2 },
      '-1': { x: -STEP, scale: 0.82, depth: -120, opacity: 0.72, blur: 0.35 },
      '0': { x: 0, scale: 1, depth: 120, opacity: 1, blur: 0 },
      '1': { x: STEP, scale: 0.82, depth: -120, opacity: 0.72, blur: 0.35 },
      '2': { x: STEP * 2, scale: 0.62, depth: -260, opacity: 0.42, blur: 1.2 }
    };

    return map[String(offset)];
  }

  function getCardClass(offset, item) {
    const abs = Math.abs(offset);
    let cls = 'dict-card';

    if (offset === 0) cls += ' is-center is-active';
    else if (abs === 1) cls += ' is-level-1';
    else if (abs === 2) cls += ' is-level-2';

    if (offset < 0) cls += ' is-left';
    if (offset > 0) cls += ' is-right';
    if (item.__create) cls += ' dict-card--create';

    return cls;
  }

  function renderCard(slot) {
    const { item, index, offset } = slot;
    const t = computeTransform(offset);

    return `
      <button
        class="${getCardClass(offset, item)}"
        type="button"
        data-index="${index}"
        data-offset="${offset}"
        style="
          transform: translate3d(${t.x}px, 0, ${t.depth}px) scale(${t.scale}) rotateX(0deg) rotateY(0deg);
          opacity: ${t.opacity};
          --card-blur: ${t.blur}px;
          --glare-x: 50%;
          --glare-y: 50%;
        "
      >
        <span class="dict-card__magic-glow"></span>
        <span class="dict-card__magic-border"></span>
        <span class="dict-card__surface"></span>

        <div class="dict-card__content">
          <div class="dict-card__icon">
            ${renderDictIcon(item.icon)}
          </div>

          <div class="dict-card__title">${item.title}</div>

          ${item.__create ? '' : `
            <div class="dict-card__metric">
              <div class="dict-card__metric-value">${formatNumber(item.total)}</div>
              <div class="dict-card__metric-label">записів</div>
            </div>
          `}

          <div class="dict-card__chips">
            <span class="dict-chip dict-chip--status">${item.status || 'active'}</span>
            <span class="dict-chip">${item.type || 'dictionary'}</span>
          </div>
        </div>
      </button>
    `;
  }

  function renderCarousel() {
    const root = document.getElementById('dictsCarousel');
    if (!root) return;

    const items = getRenderItems();
    const visibleSlots = getVisibleSlots(items);

    root.innerHTML = visibleSlots.map(renderCard).join('');

    bindCardClicks(items);
    bindCenterCardTilt();
    renderDots(items);
  }

  function renderDots(items) {
    const dots = document.getElementById('dictsDots');
    if (!dots) return;

    dots.innerHTML = items.map((_, i) => `
      <button
        class="dict-dot ${i === dictsState.activeIndex ? 'is-active' : ''}"
        type="button"
        data-i="${i}"
        aria-label="Перейти до картки ${i + 1}"
      ></button>
    `).join('');

    dots.querySelectorAll('.dict-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        dictsState.activeIndex = Number(dot.dataset.i);
        renderCarousel();
      });
    });
  }

  function bindCardClicks(items) {
    document.querySelectorAll('.dict-card').forEach((card) => {
      card.addEventListener('click', async () => {
        const index = Number(card.dataset.index);
        const offset = Number(card.dataset.offset);
        const item = items[index];

        if (item.__create) {
          openCreateDictionaryModal();
          return;
        }

        // 1-й клік по боковій картці — просто робимо її центральною.
        if (offset !== 0) {
          dictsState.activeIndex = index;
          renderCarousel();
          return;
        }

        // Клік по центральній картці — відкриваємо конкретний довідник у табличному режимі.
        dictsState.activeIndex = index;
        await openDictionary(item);
      });
    });
  }

  function bindCenterCardTilt() {
    const card = document.querySelector('.dict-card.is-center');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 10;

      card.style.setProperty('--glare-x', `${px * 100}%`);
      card.style.setProperty('--glare-y', `${py * 100}%`);

      const t = computeTransform(0);

      card.style.transform = `
        translate3d(${t.x}px, 0, ${t.depth}px)
        scale(${t.scale})
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--glare-x', '50%');
      card.style.setProperty('--glare-y', '50%');

      const t = computeTransform(0);

      card.style.transform = `
        translate3d(${t.x}px, 0, ${t.depth}px)
        scale(${t.scale})
        rotateX(0deg)
        rotateY(0deg)
      `;
    });
  }

  function shift(step) {
    const items = getRenderItems();
    const max = items.length - 1;

    dictsState.activeIndex += step;

    if (dictsState.activeIndex < 0) dictsState.activeIndex = max;
    if (dictsState.activeIndex > max) dictsState.activeIndex = 0;

    renderCarousel();
  }

  function bindControls() {
    document.getElementById('dictsPrevBtn')?.addEventListener('click', () => shift(-1));
    document.getElementById('dictsNextBtn')?.addEventListener('click', () => shift(1));

    if (!window.__lavashDictOpenEventBound) {
      window.__lavashDictOpenEventBound = true;
      window.addEventListener('lavash:open-dictionary', async (event) => {
        const detail = event.detail || {};
        const item = dictsState.items.find((entry) =>
          entry.id === detail.id || entry.table === detail.table
        );
        if (!item) return;
        dictsState.activeIndex = Math.max(0, dictsState.items.findIndex((entry) => entry.id === item.id));
        await openDictionary(item);
      });
    }

    const carousel = document.getElementById('dictsCarousel');

    if (carousel && !carousel.dataset.wheelBound) {
      carousel.dataset.wheelBound = '1';

      carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
        shift(e.deltaY > 0 ? 1 : -1);
      }, { passive: false });
    }
  }

  function openCreateDictionaryModal() {
    const modal = document.getElementById('dictCreateModal');
    if (modal) {
      modal.classList.remove('hidden');
      return;
    }

    alert('Створення довідника');
  }

  function getRowCreatedAt(row) {
    return row?.created_at || row?.updated_at || row?.verified_at || row?.resolved_at || null;
  }

  function getRowExtraText(row) {
    if (!row) return '';

    const ignore = new Set([
      'id', 'created_at', 'updated_at', 'verified_at', 'resolved_at',
      'name', 'normalized_name', 'uav_name', 'station_name', 'unit_name', 'object_name',
      'raw_value', 'normalized_candidate'
    ]);

    return Object.entries(row)
      .filter(([key, value]) => !ignore.has(key) && value !== null && value !== undefined && value !== '')
      .slice(0, 4)
      .map(([key, value]) => `${key}: ${String(value).slice(0, 70)}`)
      .join(' · ');
  }


  async function updateDictionaryRow(item, rowId, nextName, nextNormalizedName) {
    const db = createSupabaseClient();
    if (!db || !item?.table || !rowId) throw new Error('Немає підключення або ID запису');
    if (item.table === 'dict_pending') throw new Error('Pending-записи редагуються на сторінці Редактор');

    const name = String(nextName || '').trim();
    const normalizedName = String(nextNormalizedName || name).trim().toLowerCase();
    if (!name) throw new Error('Назва не може бути порожньою');

    const patch = {};
    if (item.nameField) patch[item.nameField] = name;
    if (item.normalizedField) patch[item.normalizedField] = normalizedName;
    patch.updated_at = new Date().toISOString();

    const { data, error } = await db
      .from(item.table)
      .update(patch)
      .eq('id', rowId)
      .select('*')
      .single();

    if (error) throw error;
    dictsState.selectedRows = dictsState.selectedRows.map((row) => row.id === rowId ? { ...row, ...data } : row);
    return data;
  }

  function openDictionaryEditModal(item, row) {
    const old = document.getElementById('dictsEditModal');
    if (old) old.remove();

    const primary = getPrimaryLabel(item, row);
    const secondary = getSecondaryLabel(item, row) || String(primary).toLowerCase();

    const modal = document.createElement('div');
    modal.id = 'dictsEditModal';
    modal.className = 'dicts-edit-modal';
    modal.innerHTML = `
      <div class="dicts-edit-modal__backdrop" data-close="1"></div>
      <section class="dicts-edit-modal__card" role="dialog" aria-modal="true">
        <button class="dicts-edit-modal__close" type="button" data-close="1">×</button>
        <p class="dicts-edit-modal__kicker">${escapeHtml(item.title)}</p>
        <h3>Редагування запису</h3>
        <label><span>Назва</span><input id="dictsEditName" value="${escapeHtml(primary)}" autocomplete="off" /></label>
        <label><span>Нормалізована назва</span><input id="dictsEditNormalized" value="${escapeHtml(secondary)}" autocomplete="off" /></label>
        <div class="dicts-edit-modal__meta">ID: <code>${escapeHtml(row.id || '—')}</code></div>
        <div class="dicts-edit-modal__actions">
          <button type="button" class="dicts-edit-modal__ghost" data-close="1">Скасувати</button>
          <button type="button" class="dicts-edit-modal__save" id="dictsEditSaveBtn">Зберегти</button>
        </div>
      </section>`;

    document.body.appendChild(modal);
    modal.querySelectorAll('[data-close]').forEach((node) => node.addEventListener('click', () => modal.remove()));
    modal.querySelector('#dictsEditSaveBtn')?.addEventListener('click', async () => {
      const btn = modal.querySelector('#dictsEditSaveBtn');
      const name = modal.querySelector('#dictsEditName')?.value || '';
      const normalizedName = modal.querySelector('#dictsEditNormalized')?.value || '';
      try {
        btn.disabled = true;
        btn.textContent = 'Зберігаю…';
        await updateDictionaryRow(item, row.id, name, normalizedName);
        modal.remove();
        renderTable();
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Зберегти';
        alert(`Не вдалося зберегти: ${err?.message || err}`);
      }
    });
    setTimeout(() => modal.querySelector('#dictsEditName')?.focus(), 50);
  }

  async function openDictionary(item) {
    if (!item || item.__create) {
      openCreateDictionaryModal();
      return;
    }

    await loadDictionaryRows(item);
    setDictsViewMode('table');
    renderTable();
  }

  function renderDictionaryPreview() {
    const item = dictsState.selectedTable;
    const rows = dictsState.selectedRows || [];

    if (!item || item.__create) return '';

    if (dictsState.isLoadingRows) {
      return `
        <div class="dicts-preview-shell">
          <div class="dicts-preview-empty">Завантажую записи з Supabase…</div>
        </div>
      `;
    }

    const rowsHtml = rows.length ? rows.map((row, idx) => {
      const createdAt = getRowCreatedAt(row);
      const extra = getRowExtraText(row);

      return `
        <tr>
          <td class="dicts-preview-table__num">${idx + 1}</td>
          <td>
            <strong>${escapeHtml(getPrimaryLabel(item, row))}</strong>
            <small>${escapeHtml(getSecondaryLabel(item, row) || extra)}</small>
          </td>
          <td><code>${escapeHtml(row.id || '—')}</code></td>
          <td>${escapeHtml(createdAt ? new Date(createdAt).toLocaleString('uk-UA') : '—')}</td>
          <td>${item.table === 'dict_pending' ? '<span class="dicts-muted">—</span>' : `<button class="dicts-row-edit" type="button" data-edit-row="${escapeHtml(row.id || '')}">Редагувати</button>`}</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="5" class="dicts-preview-empty">Записів поки немає або немає доступу для читання.</td>
      </tr>
    `;

    return `
      <div class="dicts-preview-shell dicts-preview-shell--full">
        <div class="dicts-preview-head">
          <div>
            <button class="dicts-back-btn" type="button" id="dictsBackToListBtn">‹ До списку довідників</button>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.table)} · показано ${formatNumber(dictsState.selectedRows.length)} з ${formatNumber(item.total || dictsState.selectedRows.length)} записів</p>
          </div>
          <div class="dicts-preview-actions"><button class="dicts-table__open" type="button" id="dictsPreviewRefreshBtn">Оновити записи</button>${dictsState.selectedHasMore ? '<button class="dicts-table__open dicts-table__open--secondary" type="button" id="dictsLoadMoreBtn">Показати ще</button>' : ''}</div>
        </div>
        <div class="dicts-table-shell dicts-table-shell--records">
          <table class="dicts-table dicts-preview-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Назва / дані</th>
                <th>ID</th>
                <th>Дата</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderTable() {
    const tableView = document.getElementById('dictsTableView');
    const body = document.getElementById('dictsTableBody');
    if (!tableView || !body) return;

    let preview = document.getElementById('dictsPreviewMount');
    if (!preview) {
      preview = document.createElement('div');
      preview.id = 'dictsPreviewMount';
      tableView.appendChild(preview);
    }

    const listHead = tableView.querySelector('.dicts-table-view__head');
    const listShell = tableView.querySelector('.dicts-table-shell:not(.dicts-table-shell--records)');

    if (dictsState.tableMode === 'detail' && dictsState.selectedTable) {
      if (listHead) listHead.hidden = true;
      if (listShell) listShell.hidden = true;
      preview.hidden = false;
      preview.innerHTML = renderDictionaryPreview();

      document.getElementById('dictsBackToListBtn')?.addEventListener('click', () => {
        dictsState.tableMode = 'list';
        dictsState.selectedTable = null;
        dictsState.selectedRows = [];
        renderTable();
      });

      document.getElementById('dictsPreviewRefreshBtn')?.addEventListener('click', async () => {
        if (dictsState.selectedTable) {
          await loadDictionaryRows(dictsState.selectedTable);
          renderTable();
        }
      });

      document.getElementById('dictsLoadMoreBtn')?.addEventListener('click', async () => {
        if (dictsState.selectedTable) {
          await loadDictionaryRows(dictsState.selectedTable, { append: true });
          renderTable();
        }
      });

      preview.querySelectorAll('[data-edit-row]').forEach((button) => {
        button.addEventListener('click', () => {
          const row = dictsState.selectedRows.find((item) => item.id === button.dataset.editRow);
          if (row && dictsState.selectedTable) openDictionaryEditModal(dictsState.selectedTable, row);
        });
      });

      return;
    }

    dictsState.tableMode = 'list';
    if (listHead) listHead.hidden = false;
    if (listShell) listShell.hidden = false;
    preview.hidden = true;
    preview.innerHTML = '';

    const rows = dictsState.items.map((item, index) => `
      <tr data-index="${index}">
        <td>
          <button class="dicts-table__name" type="button" data-table-index="${index}">
            <span class="dicts-table__icon">${renderDictIcon(item.icon)}</span>
            <span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.table)}${item.error ? ' · помилка доступу' : ''}</small>
            </span>
          </button>
        </td>
        <td><span class="dicts-table__pill">${escapeHtml(item.type || 'dictionary')}</span></td>
        <td><span class="dicts-table__pill dicts-table__pill--status">${escapeHtml(item.status || 'active')}</span></td>
        <td class="dicts-table__count">${item.loaded ? formatNumber(item.total) : '—'}</td>
        <td>
          <button class="dicts-table__open" type="button" data-table-index="${index}">Відкрити</button>
        </td>
      </tr>
    `).join('');

    body.innerHTML = rows;

    body.querySelectorAll('[data-table-index]').forEach((button) => {
      button.addEventListener('click', async () => {
        const index = Number(button.dataset.tableIndex);
        dictsState.activeIndex = index;
        const item = dictsState.items[index];
        await openDictionary(item);
      });
    });

    document.getElementById('dictsTableCreateBtn')?.addEventListener('click', openCreateDictionaryModal);
  }

  function setDictsViewMode(mode) {
    const normalizedMode = ['carousel', 'schema', 'table'].includes(mode) ? mode : 'carousel';

    const page = document.getElementById('dictsPage');
    const carouselView = document.getElementById('dictsCarouselView');
    const schemaView = document.getElementById('dictsSchemaView');
    const tableView = document.getElementById('dictsTableView');

    if (page) {
      page.classList.toggle('dicts-view--carousel', normalizedMode === 'carousel');
      page.classList.toggle('dicts-view--schema', normalizedMode === 'schema');
      page.classList.toggle('dicts-view--table', normalizedMode === 'table');
      page.setAttribute('data-dicts-view-mode', normalizedMode);
    }

    if (carouselView) {
      carouselView.classList.toggle('hidden', normalizedMode !== 'carousel');
      carouselView.hidden = normalizedMode !== 'carousel';
      carouselView.setAttribute('aria-hidden', normalizedMode !== 'carousel' ? 'true' : 'false');
    }

    if (schemaView) {
      schemaView.classList.toggle('hidden', normalizedMode !== 'schema');
      schemaView.hidden = normalizedMode !== 'schema';
      schemaView.setAttribute('aria-hidden', normalizedMode !== 'schema' ? 'true' : 'false');
    }

    if (tableView) {
      tableView.classList.toggle('hidden', normalizedMode !== 'table');
      tableView.hidden = normalizedMode !== 'table';
      tableView.setAttribute('aria-hidden', normalizedMode !== 'table' ? 'true' : 'false');
    }

    if (normalizedMode === 'schema') {
      window.LAVASH_DICTS_SCHEMA?.initSchemaView?.();
    } else if (normalizedMode === 'table') {
      renderTable();
    } else {
      renderCarousel();
    }
  }

  async function initDictsPage() {
    bindControls();
    renderCarousel();

    await loadDictionaryCounts();
    renderCarousel();

    if (document.getElementById('dictsPage')?.dataset.dictsViewMode === 'table') {
      renderTable();
    }
  }

  window.setDictsViewMode = setDictsViewMode;

  window.LAVASH_DICTS = {
    initDictsPage,
    renderCarousel,
    setDictsViewMode,
    renderTable,
    loadDictionaryCounts,
    loadDictionaryRows
  };
})();
