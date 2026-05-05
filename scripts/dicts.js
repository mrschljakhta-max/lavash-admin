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
    { id: 'uav', title: 'БпЛА', icon: 'uav', table: 'dict_uav', nameField: 'uav_name', normalizedField: 'normalized_name', status: 'active', type: 'dictionary' },
    { id: 'settlements', title: 'Населені пункти', icon: 'settlement', table: 'dict_settlements', nameField: 'name', normalizedField: 'normalized_name', status: 'active', type: 'dictionary' },
    { id: 'stations', title: 'Станції', icon: 'station', table: 'dict_stations', nameField: 'station_name', normalizedField: 'normalized_name', status: 'active', type: 'dictionary' },
    { id: 'units', title: 'Підрозділи', icon: 'unit', table: 'dict_units', nameField: 'unit_name', normalizedField: 'normalized_name', status: 'active', type: 'dictionary' },
    { id: 'cover_objects', title: 'Обʼєкти прикриття', icon: 'stack', table: 'dict_cover_objects', nameField: 'object_name', normalizedField: 'normalized_name', status: 'active', type: 'dictionary' },
    { id: 'station_types', title: 'Типи станцій', icon: 'stack', table: 'dict_station_types', nameField: 'type_name', normalizedField: 'normalized_name', status: 'active', type: 'dictionary' },
    { id: 'pending', title: 'Pending', icon: 'pending', table: 'dict_pending', nameField: 'raw_value', normalizedField: 'normalized_candidate', status: 'active', type: 'service' }
  ];

  const dictsState = {
    items: DICT_DEFS.map((item) => ({ ...item, total: 0, loaded: false, error: null })),
    activeIndex: 0,
    selectedTable: null,
    selectedRows: [],
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

  async function loadDictionaryRows(item) {
    const db = createSupabaseClient();
    if (!db || !item?.table || item.__create) return false;

    dictsState.isLoadingRows = true;
    dictsState.selectedTable = item;
    dictsState.selectedRows = [];

    try {
      let query = db
        .from(item.table)
        .select(pickColumnsForItem(item))
        .limit(50);

      if (item.table === 'dict_pending') {
        query = query.eq('decision_status', 'pending').order('created_at', { ascending: false });
      } else if (item.nameField) {
        query = query.order(item.nameField, { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      dictsState.selectedRows = data || [];
      return true;
    } catch (err) {
      dictsState.lastError = err?.message || String(err);
      console.warn(`Dictionary rows load error: ${item.table}`, err);
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
      card.addEventListener('click', () => {
        const index = Number(card.dataset.index);
        const item = items[index];

        if (item.__create) {
          openCreateDictionaryModal();
          return;
        }

        dictsState.activeIndex = index;
        renderCarousel();
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

    openCreateDictionaryModal();
  }

  function renderDictionaryPreview() {
    const item = dictsState.selectedTable || dictsState.items[dictsState.activeIndex];
    const rows = dictsState.selectedRows || [];

    if (!item || item.__create) return '';

    if (dictsState.isLoadingRows) {
      return `
        <div class="dicts-preview-shell">
          <div class="dicts-preview-empty">Завантажую записи з Supabase…</div>
        </div>
      `;
    }

    const rowsHtml = rows.length ? rows.map((row) => `
      <tr>
        <td>
          <strong>${escapeHtml(getPrimaryLabel(item, row))}</strong>
          <small>${escapeHtml(getSecondaryLabel(item, row))}</small>
        </td>
        <td><code>${escapeHtml(row.id || '—')}</code></td>
        <td>${escapeHtml(row.created_at ? new Date(row.created_at).toLocaleString('uk-UA') : '—')}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="3" class="dicts-preview-empty">Записів поки немає або немає доступу для читання.</td>
      </tr>
    `;

    return `
      <div class="dicts-preview-shell">
        <div class="dicts-preview-head">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.table)} · показано до 50 записів</p>
          </div>
          <button class="dicts-table__open" type="button" id="dictsPreviewRefreshBtn">Оновити записи</button>
        </div>
        <table class="dicts-table dicts-preview-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>ID</th>
              <th>Створено</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
  }

  function renderTable() {
    const body = document.getElementById('dictsTableBody');
    if (!body) return;

    const rows = dictsState.items.map((item, index) => `
      <tr data-index="${index}" class="${dictsState.selectedTable?.table === item.table ? 'is-selected' : ''}">
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

    let preview = document.getElementById('dictsPreviewMount');
    if (!preview) {
      preview = document.createElement('div');
      preview.id = 'dictsPreviewMount';
      document.getElementById('dictsTableView')?.appendChild(preview);
    }
    preview.innerHTML = renderDictionaryPreview();

    body.querySelectorAll('[data-table-index]').forEach((button) => {
      button.addEventListener('click', async () => {
        const index = Number(button.dataset.tableIndex);
        dictsState.activeIndex = index;
        const item = dictsState.items[index];
        await loadDictionaryRows(item);
        renderTable();
      });
    });

    document.getElementById('dictsPreviewRefreshBtn')?.addEventListener('click', async () => {
      if (dictsState.selectedTable) {
        await loadDictionaryRows(dictsState.selectedTable);
        renderTable();
      }
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
      if (!dictsState.selectedTable) {
        const item = dictsState.items[dictsState.activeIndex];
        loadDictionaryRows(item).then(renderTable);
      }
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
      await loadDictionaryRows(dictsState.items[dictsState.activeIndex]);
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
