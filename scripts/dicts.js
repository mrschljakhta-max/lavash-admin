const DICT_ICONS = {
  uav: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 11l-2.5-2.5M12 11l2.5-2.5M12 11v5M7 8l-3 1.5M17 8l3 1.5M8.5 13H5.5M18.5 13h-3M9 6.5l3-2 3 2" />
    </svg>
  `,
  settlement: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"/>
      <circle cx="12" cy="11" r="2.2"/>
    </svg>
  `,
  station: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20V14M9 20h6M10 14l2-8 2 8M5.5 10.5a6.5 6.5 0 0 1 13 0M8 12a4 4 0 0 1 8 0"/>
    </svg>
  `,
  unit: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l7 3v5c0 5-3.4 8.1-7 10-3.6-1.9-7-5-7-10V6l7-3Z"/>
    </svg>
  `,
  stack: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 4l8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4"/>
    </svg>
  `,
  pending: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  `,
  plus: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  `
};

const dictsState = {
  items: [
    {
      id: '1',
      title: 'БпЛА',
      slug: 'dict_uav',
      description: 'Довідник типів безпілотних літальних апаратів для нормалізації подій і запитів.',
      type: 'dictionary',
      icon: 'uav',
      total: 1248,
      active: 1206,
      links: 5,
      updated: '28.05.2024',
      status: 'active'
    },
    {
      id: '2',
      title: 'Населені пункти',
      slug: 'dict_settlements',
      description: 'Довідник населених пунктів, координат, районів, областей і службових ознак.',
      type: 'dictionary',
      icon: 'settlement',
      total: 15892,
      active: 15431,
      links: 8,
      updated: '29.05.2024',
      status: 'active'
    },
    {
      id: '3',
      title: 'Станції',
      slug: 'dict_stations',
      description: 'Довідник радіоелектронних станцій та комплексів, які використовуються у запитах та подіях.',
      type: 'dictionary',
      icon: 'station',
      total: 3751,
      active: 3489,
      links: 6,
      updated: '28.05.2024',
      status: 'active'
    },
    {
      id: '4',
      title: 'Підрозділи',
      slug: 'dict_units',
      description: 'Ієрархія підрозділів, скорочень, parent-child зв’язків та службових ознак.',
      type: 'dictionary',
      icon: 'unit',
      total: 2156,
      active: 2098,
      links: 4,
      updated: '27.05.2024',
      status: 'active'
    },
    {
      id: '5',
      title: 'Типи станцій',
      slug: 'dict_station_types',
      description: 'Типи станцій, band-групи, категорії та частотні характеристики.',
      type: 'dictionary',
      icon: 'stack',
      total: 142,
      active: 137,
      links: 3,
      updated: '25.05.2024',
      status: 'active'
    },
    {
      id: '6',
      title: 'Pending',
      slug: 'dict_pending',
      description: 'Службовий довідник невизначених або спірних значень для ручної нормалізації.',
      type: 'service',
      icon: 'pending',
      total: 87,
      active: 87,
      links: 2,
      updated: '29.05.2024',
      status: 'active'
    }
  ],
  activeIndex: 2,
  filteredItems: []
};

function formatNumber(value) {
  return new Intl.NumberFormat('uk-UA').format(value || 0);
}

function getVisibleDicts() {
  return dictsState.filteredItems.length ? dictsState.filteredItems : dictsState.items;
}

function getActiveDict() {
  const visible = getVisibleDicts();
  return visible[dictsState.activeIndex] || visible[0] || null;
}

function renderDictCard(item, index, total) {
  const offset = index - dictsState.activeIndex;
  const abs = Math.abs(offset);

  let cls = 'dict-card';
  if (offset === 0) cls += ' is-active';
  if (abs === 1) cls += ' is-near';
  if (abs >= 2) cls += ' is-far';
  if (item.__create) cls += ' dict-card--create';

  const transformX = offset * 220;
  const scale = offset === 0 ? 1 : abs === 1 ? 0.92 : 0.84;
  const rotate = offset === 0 ? 0 : offset < 0 ? -6 : 6;
  const opacity = abs > 2 ? 0 : 1;

  return `
    <button
      class="${cls}"
      type="button"
      data-index="${index}"
      style="transform: translateX(${transformX}px) scale(${scale}) rotateY(${rotate}deg); opacity:${opacity}; z-index:${total - abs};"
    >
      <div class="dict-card__icon">
        ${item.__create ? DICT_ICONS.plus : (DICT_ICONS[item.icon] || DICT_ICONS.stack)}
      </div>

      <div class="dict-card__body">
        <div class="dict-card__title">${item.__create ? 'Новий довідник' : item.title}</div>

        ${
          item.__create
            ? `<div class="dict-card__description">Створити новий довідник системи</div>`
            : `
              <div class="dict-card__meta">${formatNumber(item.total)} записів</div>
              <div class="dict-card__chips">
                <span class="dict-chip dict-chip--status">${item.status}</span>
                <span class="dict-chip">${item.type}</span>
              </div>
            `
        }
      </div>
    </button>
  `;
}

function renderDictsCarousel() {
  const wrap = document.getElementById('dictsCarousel');
  const dots = document.getElementById('dictsDots');
  if (!wrap || !dots) return;

  const visible = [...getVisibleDicts(), { __create: true, id: '__create__', icon: 'plus' }];

  if (dictsState.activeIndex > visible.length - 1) {
    dictsState.activeIndex = 0;
  }

  wrap.innerHTML = visible.map((item, index) => renderDictCard(item, index, visible.length)).join('');

  dots.innerHTML = visible
    .map((_, index) => `<button class="dict-dot ${index === dictsState.activeIndex ? 'is-active' : ''}" type="button" data-dot-index="${index}"></button>`)
    .join('');

  wrap.querySelectorAll('.dict-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number(card.dataset.index);
      const picked = visible[idx];

      if (picked?.__create) {
        openDictCreateModal();
        return;
      }

      dictsState.activeIndex = idx;
      renderDictsCarousel();
      renderDictFocus();
    });
  });

  dots.querySelectorAll('.dict-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.dotIndex);
      const picked = visible[idx];

      if (picked?.__create) {
        openDictCreateModal();
        return;
      }

      dictsState.activeIndex = idx;
      renderDictsCarousel();
      renderDictFocus();
    });
  });
}

function renderDictFocus() {
  const active = getActiveDict();
  if (!active) return;

  const icon = document.getElementById('dictFocusIcon');
  const title = document.getElementById('dictFocusTitle');
  const type = document.getElementById('dictFocusType');
  const slug = document.getElementById('dictFocusSlug');
  const description = document.getElementById('dictFocusDescription');
  const statusText = document.getElementById('dictFocusStatusText');
  const total = document.getElementById('dictFocusTotal');
  const activeCount = document.getElementById('dictFocusActive');
  const links = document.getElementById('dictFocusLinks');
  const updated = document.getElementById('dictFocusUpdated');

  if (icon) icon.innerHTML = DICT_ICONS[active.icon] || DICT_ICONS.stack;
  if (title) title.textContent = active.title;
  if (type) type.textContent = active.type;
  if (slug) slug.textContent = `slug: ${active.slug}`;
  if (description) description.textContent = active.description;
  if (statusText) statusText.textContent = active.status === 'active' ? 'Активний довідник' : 'Чернетка';
  if (total) total.textContent = formatNumber(active.total);
  if (activeCount) activeCount.textContent = formatNumber(active.active);
  if (links) links.textContent = formatNumber(active.links);
  if (updated) updated.textContent = active.updated;

  const openRecordsBtn = document.getElementById('dictOpenRecordsBtn');
  const openSchemaBtn = document.getElementById('dictOpenSchemaBtn');
  const editBtn = document.getElementById('dictEditBtn');
  const syncBtn = document.getElementById('dictSyncBtn');
  const exportBtn = document.getElementById('dictExportBtn');

  if (openRecordsBtn) {
    openRecordsBtn.onclick = () => {
      alert(`Тут відкриємо табличний режим для: ${active.title}`);
    };
  }

  if (openSchemaBtn) {
    openSchemaBtn.onclick = () => {
      alert(`Тут відкриємо режим схеми для: ${active.title}`);
    };
  }

  if (editBtn) {
    editBtn.onclick = () => {
      alert(`Редагування довідника: ${active.title}`);
    };
  }

  if (syncBtn) {
    syncBtn.onclick = () => {
      alert(`Sync для: ${active.slug}`);
    };
  }

  if (exportBtn) {
    exportBtn.onclick = () => {
      alert(`Експорт довідника: ${active.slug}`);
    };
  }
}

function shiftDicts(step) {
  const visible = getVisibleDicts();
  if (!visible.length) return;

  const maxIndex = visible.length - 1;
  dictsState.activeIndex += step;

  if (dictsState.activeIndex < 0) dictsState.activeIndex = 0;
  if (dictsState.activeIndex > maxIndex) dictsState.activeIndex = maxIndex;

  renderDictsCarousel();
  renderDictFocus();
}

function openDictCreateModal() {
  document.getElementById('dictCreateModal')?.classList.remove('hidden');
}

function closeDictCreateModal() {
  document.getElementById('dictCreateModal')?.classList.add('hidden');
}

function bindDictCreateModal() {
  document.getElementById('dictCreateClose')?.addEventListener('click', closeDictCreateModal);
  document.getElementById('dictCreateBackdrop')?.addEventListener('click', closeDictCreateModal);
  document.getElementById('dictCreateCancel')?.addEventListener('click', closeDictCreateModal);

  document.getElementById('dictCreateSubmit')?.addEventListener('click', () => {
    const title = document.getElementById('newDictTitle')?.value.trim();
    const slug = document.getElementById('newDictSlug')?.value.trim();
    const type = document.getElementById('newDictType')?.value;
    const icon = document.getElementById('newDictIcon')?.value;
    const description = document.getElementById('newDictDescription')?.value.trim();

    if (!title || !slug) {
      alert('Заповни хоча б назву і slug.');
      return;
    }

    dictsState.items.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      slug,
      description: description || 'Новий довідник системи.',
      type: type || 'dictionary',
      icon: icon || 'stack',
      total: 0,
      active: 0,
      links: 0,
      updated: new Date().toLocaleDateString('uk-UA'),
      status: 'draft'
    });

    dictsState.activeIndex = dictsState.items.length - 1;
    closeDictCreateModal();
    renderDictsCarousel();
    renderDictFocus();
  });
}

function buildDictsRightPanel() {
  return `
    <div class="tool-block">
      <label class="tool-block__label" for="dictSearchInput">Пошук</label>
      <input id="dictSearchInput" class="tool-input" type="text" placeholder="Пошук довідника..." />
    </div>

    <div class="tool-block">
      <label class="tool-block__label" for="dictTypeFilter">Тип довідника</label>
      <select id="dictTypeFilter" class="tool-select">
        <option value="all">Всі типи</option>
        <option value="dictionary">dictionary</option>
        <option value="alias">alias</option>
        <option value="service">service</option>
      </select>
    </div>

    <div class="tool-block">
      <label class="tool-block__label" for="dictStatusFilter">Статус</label>
      <select id="dictStatusFilter" class="tool-select">
        <option value="all">Всі</option>
        <option value="active">active</option>
        <option value="draft">draft</option>
      </select>
    </div>

    <button id="dictAddBtn" class="tool-refresh-btn" type="button">+ Новий довідник</button>
    <button id="dictSchemaBtn" class="tool-refresh-btn" type="button">Схема</button>
    <button id="dictResetBtn" class="tool-refresh-btn" type="button">Скинути фільтри</button>
  `;
}

function applyDictFilters() {
  const search = (document.getElementById('dictSearchInput')?.value || '').trim().toLowerCase();
  const type = document.getElementById('dictTypeFilter')?.value || 'all';
  const status = document.getElementById('dictStatusFilter')?.value || 'all';

  dictsState.filteredItems = dictsState.items.filter((item) => {
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.slug.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);

    const matchType = type === 'all' || item.type === type;
    const matchStatus = status === 'all' || item.status === status;

    return matchSearch && matchType && matchStatus;
  });

  dictsState.activeIndex = 0;
  renderDictsCarousel();
  renderDictFocus();
}

function resetDictFilters() {
  const search = document.getElementById('dictSearchInput');
  const type = document.getElementById('dictTypeFilter');
  const status = document.getElementById('dictStatusFilter');

  if (search) search.value = '';
  if (type) type.value = 'all';
  if (status) status.value = 'all';

  dictsState.filteredItems = [];
  dictsState.activeIndex = 0;
  renderDictsCarousel();
  renderDictFocus();
}

function bindDictsRightPanel() {
  const panel = document.getElementById('layoutRightPanel');
  if (!panel) return;

  panel.innerHTML = buildDictsRightPanel();

  document.getElementById('dictSearchInput')?.addEventListener('input', applyDictFilters);
  document.getElementById('dictTypeFilter')?.addEventListener('change', applyDictFilters);
  document.getElementById('dictStatusFilter')?.addEventListener('change', applyDictFilters);

  document.getElementById('dictAddBtn')?.addEventListener('click', openDictCreateModal);
  document.getElementById('dictSchemaBtn')?.addEventListener('click', () => {
    alert('Наступним кроком тут відкриємо режим схеми взаємозв’язків.');
  });
  document.getElementById('dictResetBtn')?.addEventListener('click', resetDictFilters);
}

function bindDictsPageEvents() {
  document.getElementById('dictsPrevBtn')?.addEventListener('click', () => shiftDicts(-1));
  document.getElementById('dictsNextBtn')?.addEventListener('click', () => shiftDicts(1));

  const carousel = document.getElementById('dictsCarousel');
  if (carousel) {
    carousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      shiftDicts(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });
  }
}

window.initDictsPage = async function initDictsPage() {
  bindDictsPageEvents();
  bindDictCreateModal();
  bindDictsRightPanel();
  renderDictsCarousel();
  renderDictFocus();
};
