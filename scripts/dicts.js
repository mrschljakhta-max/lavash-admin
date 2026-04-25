(() => {

  const DICT_ICONS = {
    uav: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 11v5"/></svg>`,
    settlement: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/></svg>`,
    station: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20V14"/></svg>`,
    unit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l7 3"/></svg>`,
    stack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 4l8 4-8 4"/></svg>`,
    pending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>`
  };

  const dictsState = {
    items: [
      { id: '1', title: 'БпЛА', icon: 'uav', total: 1248 },
      { id: '2', title: 'Населені пункти', icon: 'settlement', total: 15892 },
      { id: '3', title: 'Станції', icon: 'station', total: 3751 },
      { id: '4', title: 'Підрозділи', icon: 'unit', total: 2156 },
      { id: '5', title: 'Типи станцій', icon: 'stack', total: 142 },
      { id: '6', title: 'Pending', icon: 'pending', total: 87 }
    ],
    activeIndex: 3
  };

  function formatNumber(v) {
    return new Intl.NumberFormat('uk-UA').format(v || 0);
  }

  function normalizeOffset(offset, total) {
    const half = Math.floor(total / 2);
    if (offset > half) return offset - total;
    if (offset < -half) return offset + total;
    return offset;
  }

  // 🔥 НОВА ГЕОМЕТРІЯ (3 РІВНІ)
  function computeTransform(offset) {
    const STEP = 230;

    const map = {
      "-3": { x: -STEP * 3, scale: 0.48, rotate: 11, depth: -420, opacity: 0.26, blur: 2.4 },
      "-2": { x: -STEP * 2, scale: 0.64, rotate: 8, depth: -280, opacity: 0.46, blur: 1.4 },
      "-1": { x: -STEP, scale: 0.82, rotate: 4, depth: -120, opacity: 0.72, blur: 0.45 },

      "0": { x: 0, scale: 1, rotate: 0, depth: 160, opacity: 1, blur: 0 },

      "1": { x: STEP, scale: 0.82, rotate: -4, depth: -120, opacity: 0.72, blur: 0.45 },
      "2": { x: STEP * 2, scale: 0.64, rotate: -8, depth: -280, opacity: 0.46, blur: 1.4 },
      "3": { x: STEP * 3, scale: 0.48, rotate: -11, depth: -420, opacity: 0.26, blur: 2.4 }
    };

    return map[String(offset)] || {
      x: offset < 0 ? -STEP * 4 : STEP * 4,
      scale: 0.4,
      rotate: offset < 0 ? 14 : -14,
      depth: -520,
      opacity: 0,
      blur: 3
    };
  }

  function getRenderItems() {
    return [
      ...dictsState.items,
      { id: 'create', title: 'Новий довідник', icon: 'plus', __create: true }
    ];
  }

  function getCardClass(offset) {
    const abs = Math.abs(offset);

    if (offset === 0) return 'dict-card is-center';
    if (abs === 1) return 'dict-card is-level-1';
    if (abs === 2) return 'dict-card is-level-2';
    if (abs === 3) return 'dict-card is-level-3';

    return 'dict-card is-hidden';
  }

  function renderCard(item, index, total) {
    const offset = normalizeOffset(index - dictsState.activeIndex, total);
    const t = computeTransform(offset);

    return `
      <button class="${getCardClass(offset)}"
        data-index="${index}"
        style="
          transform: translate3d(${t.x}px,0,${t.depth}px)
          scale(${t.scale})
          rotateY(${t.rotate}deg);
          opacity:${t.opacity};
          filter: blur(${t.blur}px);
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

    bindClicks(items);
    renderDots(items);
  }

  function renderDots(items) {
    const dots = document.getElementById('dictsDots');
    if (!dots) return;

    dots.innerHTML = items.map((_, i) =>
      `<div class="dict-dot ${i === dictsState.activeIndex ? 'is-active' : ''}" data-i="${i}"></div>`
    ).join('');

    dots.querySelectorAll('.dict-dot').forEach(d => {
      d.onclick = () => {
        dictsState.activeIndex = Number(d.dataset.i);
        renderCarousel();
      };
    });
  }

  function bindClicks(items) {
    document.querySelectorAll('.dict-card').forEach(card => {
      card.onclick = () => {
        const i = Number(card.dataset.index);
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

  function initDictsPage() {
    bindControls();
    renderCarousel();
  }

  window.LAVASH_DICTS = { initDictsPage };

})();
