(() => {

  const DICT_ICONS = {
    uav: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 11l-2.5-2.5M12 11l2.5-2.5M12 11v5"/></svg>`,
    settlement: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/></svg>`,
    station: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20V14"/></svg>`,
    unit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v5"/></svg>`,
    stack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4l8 4-8 4-8-4Z"/></svg>`,
    pending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 5v14M5 12h14"/></svg>`
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

  function computeTransform(offset) {
    const map = {
      "-2": { x: -420, scale: 0.7, rotate: 10, depth: -280 },
      "-1": { x: -220, scale: 0.9, rotate: 6, depth: -120 },
      "0":  { x: 0, scale: 1, rotate: 0, depth: 120 },
      "1":  { x: 220, scale: 0.9, rotate: -6, depth: -120 },
      "2":  { x: 420, scale: 0.7, rotate: -10, depth: -280 }
    };
    return map[String(offset)] || {
      x: offset < 0 ? -520 : 520,
      scale: 0.6,
      rotate: offset < 0 ? 12 : -12,
      depth: -320
    };
  }

  function renderCard(item, index) {
    const visible = dictsState.items;
    const rawOffset = index - dictsState.activeIndex;
    const offset = normalizeOffset(rawOffset, visible.length);

    const { x, scale, rotate, depth } = computeTransform(offset);

    return `
      <div class="dict-card ${offset === 0 ? 'is-active' : ''}"
        data-index="${index}"
        style="transform:
          translate3d(${x}px,0,${depth}px)
          scale(${scale})
          rotateY(${rotate}deg);">

        <div class="dict-card__icon">
          ${DICT_ICONS[item.icon]}
        </div>

        <div class="dict-card__title">${item.title}</div>

        <div class="dict-card__value">
          ${formatNumber(item.total)}
        </div>

      </div>
    `;
  }

  function render() {
    const root = document.getElementById('dictsCarousel');
    if (!root) return;

    root.innerHTML = dictsState.items
      .map((item, i) => renderCard(item, i))
      .join('');

    bindClicks();
    renderDots();
  }

  function renderDots() {
    const dots = document.getElementById('dictsDots');
    if (!dots) return;

    dots.innerHTML = dictsState.items.map((_, i) =>
      `<div class="dict-dot ${i === dictsState.activeIndex ? 'is-active' : ''}" data-i="${i}"></div>`
    ).join('');

    dots.querySelectorAll('.dict-dot').forEach(d => {
      d.onclick = () => {
        dictsState.activeIndex = Number(d.dataset.i);
        render();
      };
    });
  }

  function bindClicks() {
    document.querySelectorAll('.dict-card').forEach(card => {
      card.onclick = () => {
        const i = Number(card.dataset.index);
        dictsState.activeIndex = i;
        render();
      };
    });
  }

  function shift(step) {
    const max = dictsState.items.length - 1;
    dictsState.activeIndex += step;
    if (dictsState.activeIndex < 0) dictsState.activeIndex = max;
    if (dictsState.activeIndex > max) dictsState.activeIndex = 0;
    render();
  }

  function bindControls() {
    document.getElementById('dictsPrevBtn')?.addEventListener('click', () => shift(-1));
    document.getElementById('dictsNextBtn')?.addEventListener('click', () => shift(1));

    document.getElementById('dictsCarousel')?.addEventListener('wheel', (e) => {
      e.preventDefault();
      shift(e.deltaY > 0 ? 1 : -1);
    });
  }

  function init() {
    bindControls();
    render();
  }

  window.addEventListener('DOMContentLoaded', init);

})();
