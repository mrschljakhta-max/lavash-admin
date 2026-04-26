(() => {
  const records = [
    {
      id: '98a7f2e1',
      title: 'БПЛА Shahed-136',
      status: 'new',
      createdAt: '08.05.2024 10:24',
      station: 'Radar_01',
      settlement: 'с. Гора',
      region: 'Київська обл.',
      coordinates: '50.3489° N, 30.9590° E',
      type: 'Ударний БПЛА',
      model: 'Shahed-136',
      altitude: '2200 м',
      speed: '185 км/год',
      source: 'raw_word_events',
      confidence: 72
    }
  ];

  const state = {
    active: 0,
    xp: 842,
    xpMax: 1000,
    todayXp: 222,
    level: 12,
    rank: 'Аналітик II',
    streak: 7,
    accuracy: 92,
    isResolving: false
  };

  function qs(selector) {
    return document.querySelector(selector);
  }

  function getRoot() {
    return qs('.workspace-body') || qs('.workspace-body--page') || qs('#app');
  }

  function getStatusLabel(status) {
    return {
      new: 'Новий',
      warning: 'Сумнівний',
      error: 'Помилка',
      valid: 'Валідний',
      skipped: 'Пропущений',
      fixed: 'Виправлений'
    }[status] || 'Новий';
  }

  function getStatusColor(status) {
    return {
      new: '#37e6b2',
      warning: '#f5a524',
      error: '#ff4d6d',
      valid: '#25d889',
      skipped: '#8d58ff',
      fixed: '#55dfff'
    }[status] || '#55dfff';
  }

  function getChevron(level) {
    if (level <= 10) return '▰';
    if (level <= 20) return '▰▰';
    if (level <= 30) return '▰▰▰';
    if (level <= 40) return '▰▰▰▰';
    return '⚡';
  }

  function getTier(level) {
    if (level <= 10) return 'blue';
    if (level <= 20) return 'green';
    if (level <= 30) return 'orange';
    if (level <= 40) return 'red';
    return 'violet';
  }

  function getVisibleRecords() {
    const total = records.length;

    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (state.active + offset + total) % total;
      return {
        record: records[index],
        index,
        slot: offset
      };
    });
  }

  function renderRightRankList() {
    const ranks = [
      { level: 10, title: 'Ведучий оператор' },
      { level: 11, title: 'Спеціаліст' },
      { level: 12, title: 'Аналітик II' },
      { level: 13, title: 'Аналітик III рівня' },
      { level: 14, title: 'Аналітик II рівня' }
    ];

    return ranks.map((rank) => `
      <div class="pg-right-rank-row ${rank.level === state.level ? 'is-current' : ''}">
        <span>${getChevron(rank.level)}</span>
        <b>${rank.level}</b>
        <em>${rank.title}</em>
      </div>
    `).join('');
  }

  function renderRightPanel() {
    const rightTools =
      document.querySelector('.right-tools__inner') ||
      document.querySelector('.right-tools');

    if (!rightTools) return;

    const progress = Math.round((state.xp / state.xpMax) * 100);
    const oldPanel = document.getElementById('pendingGameRightPanel');
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'pendingGameRightPanel';
    panel.className = 'pg-right-panel';

    panel.innerHTML = `
      <section class="pg-right-card">
        <h3>Ваш прогрес</h3>

        <div class="pg-right-user">
          <div class="pg-right-avatar">OP</div>
          <div>
            <strong>Operator_07</strong>
            <span>ID: OP-7721</span>
          </div>
        </div>

        <div class="pg-right-rank">
          <span>${getChevron(state.level)}</span>
          <strong>${state.rank}</strong>
        </div>

        <div class="pg-right-track">
          <div style="width:${progress}%"></div>
        </div>

        <div class="pg-right-stats">
          <div><b>+${state.todayXp}</b><span>XP сьогодні</span></div>
          <div><b>${state.accuracy}%</b><span>точність</span></div>
          <div><b>${state.streak}</b><span>streak</span></div>
        </div>
      </section>

      <section class="pg-right-card">
        <h3>Обробка</h3>
        <div class="pg-right-counter">
          <strong>${state.active + 1}</strong>
          <span>/</span>
          <strong>${records.length}</strong>
        </div>
        <p class="pg-right-note">Поточний запис / всього у черзі</p>
      </section>

      <section class="pg-right-card">
        <h3>Гарячі клавіші</h3>
        <div class="pg-right-hotkeys">
          <span>← →</span><p>перемотка карток</p>
          <span>Shift+A</span><p>ігнор</p>
          <span>Shift+S</span><p>пропуск</p>
          <span>Shift+D</span><p>підтвердити</p>
          <span>Space</span><p>flip / edit</p>
          <span>Esc</span><p>скасувати</p>
        </div>
      </section>

      <section class="pg-right-card">
        <h3>Ранги</h3>
        <div class="pg-right-ranks">
          ${renderRightRankList()}
        </div>
      </section>

      <section class="pg-right-card">
        <h3>Досягнення</h3>
        <div class="pg-right-achievements">
          <p>✅ 10 записів без помилки</p>
          <p>✅ 100 підтверджених записів</p>
          <p>✅ 5 виправлень підряд</p>
          <p>✅ Точність понад 90%</p>
        </div>
      </section>
    `;

    rightTools.appendChild(panel);
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const progress = Math.round((state.xp / state.xpMax) * 100);
    const activeRecord = records[state.active];
    document.documentElement.style.setProperty('--pg-accent-status', getStatusColor(activeRecord.status));

    root.innerHTML = `
      <section class="pg-page pg-page--clean" id="pendingGamePage">
        <div class="pg-bg-orb pg-bg-orb--left"></div>
        <div class="pg-bg-orb pg-bg-orb--right"></div>

        <header class="pg-rankbar">
          <div class="pg-rankbadge pg-tier-${getTier(state.level)}">
            <div class="pg-rankbadge__chevron">${getChevron(state.level)}</div>
            <div>
              <div class="pg-rankbadge__label">Ранг: ${state.rank}</div>
              <div class="pg-rankbadge__sub">Рівень ${state.level}</div>
            </div>
          </div>

          <div class="pg-xp">
            <div class="pg-xp__top">
              <span>XP ${state.xp} / ${state.xpMax}</span>
              <span>До наступного рангу: ${state.xpMax - state.xp} XP</span>
            </div>
            <div class="pg-xp__track">
              <div class="pg-xp__fill" style="width:${progress}%"></div>
            </div>
          </div>

          <div class="pg-today">
            <span>Сьогодні</span>
            <strong>+${state.todayXp} XP</strong>
          </div>
        </header>

        <main class="pg-stage">
          <section class="pg-carousel-wrap" data-pg-carousel-wrap>
            <div class="pg-carousel">
              ${getVisibleRecords().map(({ record, index, slot }) => renderCard(record, index, slot)).join('')}
            </div>
          </section>
        </main>

        <div class="pg-xp-pop" id="pgXpPop">+10 XP</div>
      </section>
    `;

    renderRightPanel();
    bind();
  }

  function renderCard(record, index, slot) {
    const active = slot === 0 ? 'is-active' : '';

    return `
      <article class="pg-card ${active} pg-card--${record.status}" data-index="${index}" data-slot="${slot}">
        <div class="pg-card__inner">
          <div class="pg-card__face pg-card__front">
            <div class="pg-card__topline">
              <div class="pg-card__status">${getStatusLabel(record.status)}</div>
              <button class="pg-card__star" type="button" aria-label="Позначити">☆</button>
            </div>

            <div class="pg-card__content">
              <div>
                <h2>${record.title}</h2>
                <p class="pg-card__date">${record.createdAt}</p>
                <div class="pg-card__meta">
                  <span>📡 ${record.station}</span>
                  <span>📍 ${record.settlement}</span>
                </div>
                <div class="pg-card__chip">${record.type}</div>
              </div>

              <div class="pg-visual pg-visual--uav">
                <div class="pg-drone">
                  <div class="pg-drone__body"></div>
                  <div class="pg-drone__wing pg-drone__wing--l"></div>
                  <div class="pg-drone__wing pg-drone__wing--r"></div>
                </div>
              </div>
            </div>

            <small>Клік — редагувати / Space — flip</small>
          </div>

          <div class="pg-card__face pg-card__back">
            <div class="pg-edit-head">
              <h3>Редагування запису</h3>
              <span>${record.source}</span>
            </div>

            <div class="pg-edit-grid">
              <label><span>Модель</span><input value="${record.model}" /></label>
              <label><span>Тип</span><input value="${record.type}" /></label>
              <label><span>Дата / час</span><input value="${record.createdAt}" /></label>
              <label><span>Станція</span><input value="${record.station}" /></label>
              <label><span>Населений пункт</span><input value="${record.settlement}" /></label>
              <label><span>Координати</span><input value="${record.coordinates}" /></label>
              <label><span>Висота</span><input value="${record.altitude}" /></label>
              <label><span>Швидкість</span><input value="${record.speed}" /></label>
            </div>

            <label class="pg-edit-note">
              <span>Примітка</span>
              <textarea>Система пропонує: ${record.model}. Confidence: ${record.confidence}%</textarea>
            </label>

            <button class="pg-save-btn" type="button">Зберегти зміни</button>
          </div>
        </div>
      </article>
    `;
  }

  function bindCardDrag(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    card.addEventListener('pointerdown', (event) => {
      if (event.target.closest('input, textarea, button')) return;
      if (card.classList.contains('is-flipped')) return;

      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      currentX = 0;
      currentY = 0;

      card.dataset.dragAction = '';
      card.setPointerCapture(event.pointerId);
      card.classList.add('is-dragging');
    });

    card.addEventListener('pointermove', (event) => {
      if (!isDragging) return;

      currentX = event.clientX - startX;
      currentY = event.clientY - startY;

      const rotate = currentX / 28;
      card.style.transform = `perspective(1200px) translate(${currentX}px, ${currentY}px) rotate(${rotate}deg) scale(1)`;

      if (currentX > 120) {
        card.dataset.dragAction = 'confirm';
      } else if (currentX < -120) {
        card.dataset.dragAction = 'ignore';
      } else if (currentY > 110) {
        card.dataset.dragAction = 'skip';
      } else {
        card.dataset.dragAction = '';
      }
    });

    card.addEventListener('pointerup', (event) => {
      if (!isDragging) return;

      isDragging = false;
      card.releasePointerCapture(event.pointerId);
      card.classList.remove('is-dragging');

      const dragAction = card.dataset.dragAction;
      card.dataset.dragAction = '';

      if (currentX > 160 || dragAction === 'confirm') {
        handleAction('confirm');
        return;
      }

      if (currentX < -160 || dragAction === 'ignore') {
        handleAction('ignore');
        return;
      }

      if (currentY > 140 || dragAction === 'skip') {
        handleAction('skip');
        return;
      }

      card.style.transform = '';
      currentX = 0;
      currentY = 0;
    });

    card.addEventListener('pointercancel', () => {
      isDragging = false;
      card.classList.remove('is-dragging');
      card.dataset.dragAction = '';
      card.style.transform = '';
    });
  }

  function bind() {
    document.querySelectorAll('.pg-card.is-active').forEach((card) => {
      bindCardDrag(card);

      card.addEventListener('click', (event) => {
        if (event.target.closest('input, textarea, button')) return;
        if (card.classList.contains('is-dragging')) return;
        card.classList.toggle('is-flipped');
      });
    });

    const carousel = qs('[data-pg-carousel-wrap]');
    if (carousel) {
      let wheelLock = false;

      carousel.addEventListener('wheel', (event) => {
        event.preventDefault();

        if (wheelLock || state.isResolving) return;
        wheelLock = true;

        if (event.deltaY > 0 || event.deltaX > 0) {
          next();
        } else {
          prev();
        }

        setTimeout(() => {
          wheelLock = false;
        }, 360);
      }, { passive: false });
    }
  }

  function prev() {
    if (state.isResolving) return;
    state.active = (state.active - 1 + records.length) % records.length;
    render();
  }

  function next() {
    if (state.isResolving) return;
    state.active = (state.active + 1) % records.length;
    render();
  }

  function getActionLabel(action) {
    return {
      ignore: 'ПРОІГНОРОВАНО',
      confirm: 'ПОГОДЖЕНО',
      skip: 'ПРОПУСКАЄМО'
    }[action] || '';
  }

  function handleAction(action) {
    if (state.isResolving) return;

    const xpMap = {
      ignore: 8,
      confirm: 10,
      skip: 5
    };

    const xp = xpMap[action] || 5;
    const activeCard = qs('.pg-card.is-active');
    const page = qs('#pendingGamePage');

    state.isResolving = true;
    state.xp = Math.min(state.xpMax, state.xp + xp);
    state.todayXp += xp;

    if (page) {
      page.dataset.actionFlash = action;
      page.dataset.actionLabel = getActionLabel(action);
    }

    if (activeCard) {
      activeCard.style.transform = '';
      
      activeCard.classList.remove(
        'is-key-ignore',
        'is-key-confirm',
        'is-key-skip',
        'is-resolving-ignore',
        'is-resolving-confirm',
        'is-resolving-skip'
      );

      void activeCard.offsetWidth;
      activeCard.classList.add(`is-key-${action}`);
    }

    showXpPop(xp);

    setTimeout(() => {
      state.active = (state.active + 1) % records.length;
      state.isResolving = false;

      if (page) {
        page.dataset.actionFlash = '';
        page.dataset.actionLabel = '';
      }

      render();
    }, 620);
  }

  function showXpPop(xp) {
    const pop = qs('#pgXpPop');
    if (!pop) return;

    pop.textContent = `+${xp} XP`;
    pop.classList.remove('is-visible');
    void pop.offsetWidth;
    pop.classList.add('is-visible');
  }

  function bindHotkeys() {
  document.addEventListener('keydown', (event) => {
    if (!qs('#pendingGamePage')) return;

    const isTyping = event.target?.closest?.('input, textarea');

    if (isTyping) {
      if (event.key === 'Escape') {
        event.preventDefault();
        qs('.pg-card.is-active')?.classList.remove('is-flipped');
      }
      return;
    }

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      prev();
      return;
    }

    if (event.code === 'ArrowRight') {
      event.preventDefault();
      next();
      return;
    }

    if (event.shiftKey && event.code === 'KeyA') {
      event.preventDefault();
      handleAction('ignore');
      return;
    }

    if (event.shiftKey && event.code === 'KeyS') {
      event.preventDefault();
      handleAction('skip');
      return;
    }

    if (event.shiftKey && event.code === 'KeyD') {
      event.preventDefault();
      handleAction('confirm');
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      qs('.pg-card.is-active')?.classList.toggle('is-flipped');
      return;
    }

    if (event.code === 'Escape') {
      event.preventDefault();
      qs('.pg-card.is-active')?.classList.remove('is-flipped');
    }
  });
}

  function init() {
    render();

    if (!window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__) {
      window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__ = true;
      bindHotkeys();
    }
  }

  window.LAVASH_PENDING_GAME = {
    init
  };
})();
