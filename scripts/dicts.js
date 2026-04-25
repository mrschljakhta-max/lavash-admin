(() => {

  // =========================
  // ICONS
  // =========================
  const DICT_ICONS = {
    uav: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 11v5"/></svg>`,
    settlement: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/></svg>`,
    station: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20V14"/></svg>`,
    unit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l7 3"/></svg>`,
    stack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4l8 4-8 4"/></svg>`,
    pending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>`
  };

  // =========================
  // STATE
  // =========================
  const dictsState = {
    items: [
      { id: '1', title: 'БпЛА', icon: 'uav', total: 1248, status: 'active', type: 'dictionary' },
      { id: '2', title: 'Населені пункти', icon: 'settlement', total: 15892, status: 'active', type: 'dictionary' },
      { id: '3', title: 'Станції', icon: 'station', total: 3751, status: 'active', type: 'dictionary' },
      { id: '4', title: 'Підрозділи', icon: 'unit', total: 2156, status: 'active', type: 'dictionary' },
      { id: '5', title: 'Типи станцій', icon: 'stack', total: 142, status: 'active', type: 'dictionary' },
      { id: '6', title: 'Pending', icon: 'pending', total: 87, status: 'active', type: 'service' }
    ],
    activeIndex: 3,
    animating: false
  };

  // =========================
  // HELPERS
  // =========================
  function formatNumber(value) {
    return new Intl.NumberFormat('uk-UA').format(value || 0);
  }

  function normalizeOffset(offset, total) {
    const half = Math.floor(total / 2);
    if (offset > half) return offset - total;
    if (offset < -half) return offset + total;
    return offset;
  }

  function computeTransform(offset) {
    const map = {
      "-2": { x: -430, scale: 0.7, rotate: 8, depth: -260 },
      "-1": { x: -220, scale: 0.88, rotate: 5, depth: -120 },
      "0":  { x: 0, scale: 1, rotate: 0, depth: 140 },
      "1":  { x: 220, scale: 0.88, rotate: -5, depth: -120 },
      "2":  { x: 430, scale: 0.7, rotate: -8, depth: -260 }
    };

    return map[String(offset)] || {
      x: offset < 0 ? -560 : 560,
      scale: 0.6,
      rotate: offset < 0 ? 12 : -12,
      depth: -320
    };
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

  // =========================
  // RENDER
  // =========================
  function renderCard(item, index, total) {

    const offset = normalizeOffset(index - dictsState.activeIndex, total);
    const { x, scale, rotate, depth } = computeTransform(offset);

    return `
      <button class="${getCardClass(offset, item)}"
        data-index="${index}"
        style="
          transform:
            translate3d(${x}px,0,${depth}px)
            scale(${scale})
            rotateY(${rotate}deg);
        ">

        <div class="dict-card__content">
          <div class="dict-card__icon">
            ${DICT_ICONS[item.icon]}
          </div>

          <div class="dict-card__title">${item.title}</div>

          ${item.__create ? '' : `
            <div class="dict-card__metric">
              ${formatNumber(item.total)}
            </div>
          `}
        </div>

      </button>
    `;
  }

  function renderCarousel() {
    const root = document.getElementById('dictsCarousel');
    if (!root) return;

    const items = getRenderItems();

    root.innerHTML = items
      .map((item, i) => renderCard(item, i, items.length))
      .join('');

    bindCardClicks(items);
    renderDots(items);
  }

  // =========================
  // DOTS
  // =========================
  function renderDots(items) {
    const dots = document.getElementById('dictsDots');
    if (!dots) return;

    dots.innerHTML = items.map((_, i) => `
      <div class="dict-dot ${i === dictsState.activeIndex ? 'is-active' : ''}" data-i="${i}"></div>
    `).join('');

    dots.querySelectorAll('.dict-dot').forEach(dot => {
      dot.onclick = () => {
        dictsState.activeIndex = Number(dot.dataset.i);
        renderCarousel();
      };
    });
  }

  // =========================
  // EVENTS
  // =========================
  function bindCardClicks(items) {
    document.querySelectorAll('.dict-card').forEach(card => {
      card.onclick = () => {
        const i = Number(card.dataset.index);
        const item = items[i];

        if (item.__create) {
          alert("Створення довідника");
          return;
        }

        dictsState.activeIndex = i;
        renderCarousel();
      };
    });
  }

  function shift(step) {
    const max = getRenderItems().length - 1;

    dictsState.activeIndex += step;

    if (dictsState.activeIndex < 0) dictsState.activeIndex = max;
    if (dictsState.activeIndex > max) dictsState.activeIndex = 0;

    renderCarousel();
  }

  function bindControls() {
    document.getElementById('dictsPrevBtn')?.addEventListener('click', () => shift(-1));
    document.getElementById('dictsNextBtn')?.addEventListener('click', () => shift(1));

    document.getElementById('dictsCarousel')?.addEventListener('wheel', (e) => {
      e.preventDefault();
      shift(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });
  }

  // =========================
  // INIT
  // =========================
  function initDictsPage() {
    bindControls();
    renderCarousel();
  }

  window.LAVASH_DICTS = {
    initDictsPage
  };

})();
