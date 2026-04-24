(() => {
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

  const STORAGE_KEY = 'lavash_dicts_view_mode';

  const dictsState = {
    items: [
      {
        id: '1',
        title: 'БпЛА',
        slug: 'dict_uav',
        description: 'Довідник типів безпілотних літальних апаратів.',
        type: 'dictionary',
        icon: 'uav',
        total: 1248,
        status: 'active'
      },
      {
        id: '2',
        title: 'Населені пункти',
        slug: 'dict_settlements',
        description: 'Довідник населених пунктів.',
        type: 'dictionary',
        icon: 'settlement',
        total: 15892,
        status: 'active'
      },
      {
        id: '3',
        title: 'Станції',
        slug: 'dict_stations',
        description: 'Довідник радіоелектронних станцій.',
        type: 'dictionary',
        icon: 'station',
        total: 3751,
        status: 'active'
      },
      {
        id: '4',
        title: 'Підрозділи',
        slug: 'dict_units',
        description: 'Довідник структурних підрозділів компанії та їх ієрархія',
        type: 'dictionary',
        icon: 'unit',
        total: 2156,
        status: 'active'
      },
      {
        id: '5',
        title: 'Типи станцій',
        slug: 'dict_station_types',
        description: 'Типи станцій і категорії.',
        type: 'dictionary',
        icon: 'stack',
        total: 142,
        status: 'active'
      },
      {
        id: '6',
        title: 'Pending',
        slug: 'dict_pending',
        description: 'Службовий довідник невизначених значень.',
        type: 'service',
        icon: 'pending',
        total: 87,
        status: 'active'
      }
    ],
    activeIndex: 3,
    filteredItems: [],
    isModalOpen: false,
    viewMode: 'carousel',
    drag: {
      isDown: false,
      startX: 0,
      diffX: 0,
      lastX: 0,
      lastT: 0,
      velocity: 0,
      rafId: null
    },
    animating: false,
    isInitialized: false
  };

  function formatNumber(value) {
    return new Intl.NumberFormat('uk-UA').format(value || 0);
  }

  function saveMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.warn('dicts.js: failed to save mode', error);
    }
  }

  function loadMode() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'schema' ? 'schema' : 'carousel';
    } catch (error) {
      console.warn('dicts.js: failed to load mode', error);
      return 'carousel';
    }
  }

  function getVisibleDicts() {
    return dictsState.filteredItems.length ? dictsState.filteredItems : dictsState.items;
  }

  function getRenderItems() {
    const visible = getVisibleDicts();
    return [
      ...visible,
      {
        id: 'create',
        title: 'Новий довідник',
        slug: 'new_dictionary',
        description: 'Створити новий довідник системи.',
        type: 'service',
        icon: 'plus',
        total: 0,
        status: 'new',
        __create: true
      }
    ];
  }

  function normalizeOffset(offset, total) {
    if (!total) return 0;

    const half = Math.floor(total / 2);
    let normalized = offset;

    if (offset > half) normalized = offset - total;
    if (offset < -half) normalized = offset + total;

    return normalized;
  }

  function computeDepth(offset) {
    const abs = Math.abs(offset);
    if (abs === 0) return 130;
    if (abs === 1) return -20;
    if (abs === 2) return -120;
    return -240;
  }

  function computeTransform(offset, dragOffset = 0) {
  const abs = Math.abs(offset);

  const positions = {
    "-2": { x: -315, scale: 0.78, rotate: 7 },
    "-1": { x: -185, scale: 0.88, rotate: 5 },
    "0": { x: 0, scale: 1, rotate: 0 },
    "1": { x: 185, scale: 0.88, rotate: -5 },
    "2": { x: 315, scale: 0.78, rotate: -7 }
  };

  const fallback = {
    x: offset < 0 ? -430 : 430,
    scale: 0.62,
    rotate: offset < 0 ? 10 : -10
  };

  const preset = positions[String(offset)] || fallback;

  const x = preset.x + dragOffset;

  return {
    x,
    scale: preset.scale,
    rotate: preset.rotate,
    depth: computeDepth(offset)
  };
}
  function getCardClass(offset, item) {
    const abs = Math.abs(offset);
    let cls = 'dict-card';

    if (offset === 0) cls += ' is-active';
    else if (abs === 1) cls += ' is-near';
    else if (abs === 2) cls += ' is-far';
    else cls += ' is-hidden';

    if (item.__create) cls += ' dict-card--create';
    return cls;
  }

  function renderCenteredDictCard(item, index) {
    const visible = getRenderItems();
    const rawOffset = index - dictsState.activeIndex;
    const offset = normalizeOffset(rawOffset, visible.length);
    const abs = Math.abs(offset);
    const { x, scale, rotate, depth } = computeTransform(offset);
    const cls = getCardClass(offset, item);
    const opacity = abs > 2 ? 0 : 1;

    if (item.__create) {
      return `
        <button
          class="${cls}"
          type="button"
          data-index="${index}"
          data-offset="${offset}"
          style="transform: translate3d(${x}px, 0, ${depth}px) scale(${scale}) rotateY(${rotate}deg); opacity:${opacity};"
        >
          <span class="dict-card__magic-glow"></span>
          <span class="dict-card__magic-border"></span>
          <span class="dict-card__surface"></span>

          <div class="dict-card__content">
            <div class="dict-card__icon">
              ${DICT_ICONS.plus}
            </div>

            <div class="dict-card__body dict-card__body--centered">
              <div class="dict-card__title">${item.title}</div>
              <div class="dict-card__description dict-card__description--centered">${item.description}</div>
              <div class="dict-card__chips dict-card__chips--centered">
                <span class="dict-chip dict-chip--status">new</span>
                <span class="dict-chip">${item.type}</span>
              </div>
            </div>
          </div>
        </button>
      `;
    }

    return `
      <button
        class="${cls}"
        type="button"
        data-index="${index}"
        data-offset="${offset}"
        style="transform: translate3d(${x}px, 0, ${depth}px) scale(${scale}) rotateY(${rotate}deg); opacity:${opacity};"
      >
        <span class="dict-card__magic-glow"></span>
        <span class="dict-card__magic-border"></span>
        <span class="dict-card__surface"></span>

        <div class="dict-card__content">
          <div class="dict-card__icon dict-card__icon--top">
            ${DICT_ICONS[item.icon] || DICT_ICONS.stack}
          </div>

          <div class="dict-card__body dict-card__body--centered">
            <div class="dict-card__title">${item.title}</div>
            <div class="dict-card__description dict-card__description--centered">
              ${item.description}
            </div>

            <div class="dict-card__divider"></div>

            <div class="dict-card__metric dict-card__metric--centered">
              <div class="dict-card__metric-icon">
                ${DICT_ICONS.stack}
              </div>
              <div class="dict-card__metric-value">${formatNumber(item.total)}</div>
              <div class="dict-card__metric-label">записів</div>
            </div>

            <div class="dict-card__chips dict-card__chips--centered">
              <span class="dict-chip dict-chip--status">${item.status}</span>
              <span class="dict-chip">${item.type}</span>
            </div>
          </div>
        </div>
      </button>
    `;
  }

  function updateSpotlight() {
    const carousel = document.getElementById('dictsCarousel');
    if (!carousel) return;
    carousel.style.setProperty('--dicts-spotlight-x', '0px');
  }

  function renderDots(visible) {
    const dots = document.getElementById('dictsDots');
    if (!dots) return;

    dots.innerHTML = visible
      .map((_, index) => {
        return `<button class="dict-dot ${index === dictsState.activeIndex ? 'is-active' : ''}" type="button" data-dot-index="${index}"></button>`;
      })
      .join('');

    dots.querySelectorAll('.dict-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.dotIndex);
        const picked = visible[idx];

        if (picked?.__create) {
          openDictCreateModal();
          return;
        }

        goToDict(idx);
      });
    });
  }

  function renderDictsCarousel() {
    const wrap = document.getElementById('dictsCarousel');
    if (!wrap) return;

    const visible = getRenderItems();

    if (dictsState.activeIndex > visible.length - 1) {
      dictsState.activeIndex = 0;
    }

    wrap.innerHTML = visible.map((item, index) => renderCenteredDictCard(item, index)).join('');

    wrap.querySelectorAll('.dict-card').forEach((card) => {
      card.addEventListener('click', () => {
        if (dictsState.drag.isDown || Math.abs(dictsState.drag.diffX) > 8) return;

        const idx = Number(card.dataset.index);
        const picked = visible[idx];

        if (picked?.__create) {
          openDictCreateModal();
          return;
        }

        goToDict(idx);
      });
    });

    renderDots(visible);
    updateSpotlight();
    bindActiveCardHover();
  }

  function shiftDicts(step) {
    const visible = getVisibleDicts();
    if (!visible.length || dictsState.animating) return;

    const maxIndex = visible.length - 1;
    dictsState.activeIndex += step;

    if (dictsState.activeIndex < 0) dictsState.activeIndex = maxIndex;
    if (dictsState.activeIndex > maxIndex) dictsState.activeIndex = 0;

    dictsState.animating = true;
    renderDictsCarousel();

    window.clearTimeout(dictsState.__animTimer);
    dictsState.__animTimer = window.setTimeout(() => {
      dictsState.animating = false;
    }, 720);
  }

  function goToDict(index) {
    const visible = getVisibleDicts();
    if (!visible.length || dictsState.animating) return;
    if (index === dictsState.activeIndex) return;

    dictsState.activeIndex = index;
    dictsState.animating = true;
    renderDictsCarousel();

    window.clearTimeout(dictsState.__animTimer);
    dictsState.__animTimer = window.setTimeout(() => {
      dictsState.animating = false;
    }, 720);
  }

  function openDictCreateModal() {
    dictsState.isModalOpen = true;
    document.getElementById('dictCreateModal')?.classList.remove('hidden');
  }

  function closeDictCreateModal() {
    dictsState.isModalOpen = false;
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
        status: 'draft'
      });

      dictsState.filteredItems = [];
      dictsState.activeIndex = dictsState.items.length - 1;
      closeDictCreateModal();
      renderDictsCarousel();
    });
  }

  function buildDictsRightPanel() {
    return `
      <div class="tool-block tool-block--search">
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

      <button id="refreshBtn" class="tool-refresh-btn" type="button">Оновити</button>
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
  }

  function bindDictsRightPanel() {
    const panel = document.getElementById('layoutRightPanel');
    if (!panel) return;

    panel.innerHTML = buildDictsRightPanel();

    document.getElementById('dictSearchInput')?.addEventListener('input', applyDictFilters);
    document.getElementById('dictTypeFilter')?.addEventListener('change', applyDictFilters);
    document.getElementById('dictStatusFilter')?.addEventListener('change', applyDictFilters);
  }

  function setDictsViewMode(mode) {
    const normalizedMode = mode === 'schema' ? 'schema' : 'carousel';
    dictsState.viewMode = normalizedMode;

    const page = document.getElementById('dictsPage');
    if (page) {
      page.classList.toggle('dicts-view--carousel', normalizedMode === 'carousel');
      page.classList.toggle('dicts-view--schema', normalizedMode === 'schema');
      page.setAttribute('data-dicts-view-mode', normalizedMode);
    }

    let carouselView = document.getElementById('dictsCarouselView');
    if (!carouselView) {
      carouselView = document.querySelector('.dicts-hero');
    }

    let schemaView = document.getElementById('dictsSchemaView');
    if (!schemaView) {
      schemaView = document.querySelector('.dicts-schema-view');
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

    document.querySelectorAll('#dictsModeDialog [data-dicts-mode]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.dictsMode === normalizedMode);
    });

    saveMode(normalizedMode);
  }

  function openAddDictionaryModal() {
    openDictCreateModal();
  }

  function bindActiveCardHover() {
    const activeCard = document.querySelector('.dict-card.is-active');
    if (!activeCard) return;

    const reset = () => {
      activeCard.classList.remove('is-hovering');
      activeCard.style.setProperty('--mx', '0px');
      activeCard.style.setProperty('--my', '0px');
      activeCard.style.setProperty('--glare-x', '50%');
      activeCard.style.setProperty('--glare-y', '50%');

      const offset = Number(activeCard.dataset.offset || 0);
      const { x, scale, rotate, depth } = computeTransform(offset);

      activeCard.style.transform =
        `translate3d(${x}px, 0, ${depth}px) scale(${scale}) rotateX(0deg) rotateY(${rotate}deg)`;
    };

    activeCard.addEventListener('mousemove', (e) => {
      if (dictsState.drag.isDown) return;

      const rect = activeCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateYExtra = (px - 0.5) * 12;
      const rotateXExtra = (0.5 - py) * 9;

      const moveX = (px - 0.5) * 14;
      const moveY = (py - 0.5) * 12;

      const offset = Number(activeCard.dataset.offset || 0);
      const { x, scale, rotate, depth } = computeTransform(offset);

      activeCard.classList.add('is-hovering');
      activeCard.style.setProperty('--mx', `${moveX}px`);
      activeCard.style.setProperty('--my', `${moveY}px`);
      activeCard.style.setProperty('--glare-x', `${px * 100}%`);
      activeCard.style.setProperty('--glare-y', `${py * 100}%`);

      activeCard.style.transform =
        `translate3d(${x}px, 0, ${depth}px) scale(${scale}) rotateX(${rotateXExtra}deg) rotateY(${rotate + rotateYExtra}deg)`;
    });

    activeCard.addEventListener('mouseleave', reset);
  }

  function updateDragVisual(diffX) {
    const carousel = document.getElementById('dictsCarousel');
    if (!carousel) return;

    const limited = Math.max(-120, Math.min(120, diffX));
    carousel.style.setProperty('--dicts-drag-x', `${limited}px`);

    carousel.querySelectorAll('.dict-card').forEach((card) => {
      const offset = Number(card.dataset.offset || 0);
      const dragWeight = Math.max(0.18, 1 - Math.abs(offset) * 0.18);
      const dragOffset = limited * dragWeight;
      const { x, scale, rotate, depth } = computeTransform(offset, dragOffset);

      card.style.transform =
        `translate3d(${x}px, 0, ${depth}px) scale(${scale}) rotateY(${rotate}deg)`;
    });
  }

  function resetDragVisual() {
    const carousel = document.getElementById('dictsCarousel');
    if (!carousel) return;

    carousel.classList.remove('is-dragging');
    carousel.style.setProperty('--dicts-drag-x', '0px');

    carousel.querySelectorAll('.dict-card').forEach((card) => {
      const offset = Number(card.dataset.offset || 0);
      const { x, scale, rotate, depth } = computeTransform(offset);

      card.style.transform =
        `translate3d(${x}px, 0, ${depth}px) scale(${scale}) rotateY(${rotate}deg)`;
    });
  }

  function bindDragCarousel() {
    const carousel = document.getElementById('dictsCarousel');
    if (!carousel) return;

    carousel.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;

      dictsState.drag.isDown = true;
      dictsState.drag.startX = e.clientX;
      dictsState.drag.diffX = 0;
      dictsState.drag.lastX = e.clientX;
      dictsState.drag.lastT = performance.now();
      dictsState.drag.velocity = 0;

      carousel.classList.add('is-dragging');
      carousel.setPointerCapture?.(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      if (!dictsState.drag.isDown) return;

      const now = performance.now();
      const dt = Math.max(1, now - dictsState.drag.lastT);
      const dx = e.clientX - dictsState.drag.lastX;

      dictsState.drag.diffX = e.clientX - dictsState.drag.startX;
      dictsState.drag.velocity = dx / dt;

      dictsState.drag.lastX = e.clientX;
      dictsState.drag.lastT = now;

      if (dictsState.drag.rafId) cancelAnimationFrame(dictsState.drag.rafId);
      dictsState.drag.rafId = requestAnimationFrame(() => {
        updateDragVisual(dictsState.drag.diffX);
      });
    });

    window.addEventListener('pointerup', () => {
      if (!dictsState.drag.isDown) return;

      const diff = dictsState.drag.diffX;
      const velocity = dictsState.drag.velocity;

      dictsState.drag.isDown = false;
      dictsState.drag.diffX = 0;

      resetDragVisual();

      if (Math.abs(diff) > 44 || Math.abs(velocity) > 0.32) {
        if (diff < 0 || velocity < -0.32) shiftDicts(1);
        else shiftDicts(-1);
      }
    });
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

    bindDragCarousel();
  }

  function bindDictsModeDialogBridge() {
    const dialog = document.getElementById('dictsModeDialog');
    if (!dialog) return;

    dialog.querySelectorAll('[data-dicts-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.dictsMode;
        setDictsViewMode(mode);
      });
    });

    const addBtn = document.getElementById('dictsAddDictionaryBtn');
    addBtn?.addEventListener('click', () => {
      openAddDictionaryModal();
    });
  }

  async function initDictsPage() {
    const page = document.getElementById('dictsPage');
    if (!page) return;

    dictsState.viewMode = loadMode();

    bindDictsPageEvents();
    bindDictCreateModal();
    bindDictsRightPanel();
    bindDictsModeDialogBridge();

    renderDictsCarousel();
    setDictsViewMode(dictsState.viewMode);

    dictsState.isInitialized = true;
  }

  window.LAVASH_DICTS = {
    initDictsPage,
    setDictsViewMode,
    openAddDictionaryModal,
    renderDictsCarousel
  };
})();
