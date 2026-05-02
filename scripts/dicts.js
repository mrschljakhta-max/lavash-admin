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

  const dictsState = {
    items: [
      { id: '1', title: 'БпЛА', icon: 'uav', total: 1248, status: 'active', type: 'dictionary' },
      { id: '2', title: 'Населені пункти', icon: 'settlement', total: 15892, status: 'active', type: 'dictionary' },
      { id: '3', title: 'Станції', icon: 'station', total: 3751, status: 'active', type: 'dictionary' },
      { id: '4', title: 'Підрозділи', icon: 'unit', total: 2156, status: 'active', type: 'dictionary' },
      { id: '5', title: 'Типи станцій', icon: 'stack', total: 142, status: 'active', type: 'dictionary' },
      { id: '6', title: 'Pending', icon: 'pending', total: 87, status: 'active', type: 'service' }
    ],
    activeIndex: 0
  };

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
          alert('Створення довідника');
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

  function setDictsViewMode(mode) {
    const normalizedMode = mode === 'schema' ? 'schema' : 'carousel';

    const page = document.getElementById('dictsPage');
    const carouselView = document.getElementById('dictsCarouselView');
    const schemaView = document.getElementById('dictsSchemaView');

    if (page) {
      page.classList.toggle('dicts-view--carousel', normalizedMode === 'carousel');
      page.classList.toggle('dicts-view--schema', normalizedMode === 'schema');
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

    if (normalizedMode === 'schema') {
      window.LAVASH_DICTS_SCHEMA?.initSchemaView?.();
    } else {
      renderCarousel();
    }
  }

  function initDictsPage() {
    bindControls();
    renderCarousel();
  }

  window.setDictsViewMode = setDictsViewMode;

  window.LAVASH_DICTS = {
    initDictsPage,
    renderCarousel,
    setDictsViewMode
  };
})();
