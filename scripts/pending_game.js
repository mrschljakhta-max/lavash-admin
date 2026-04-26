(() => {
  const records = [
    {
      id: '98a7f2e1',
      title: 'БПЛА Shahed-136',
      status: 'new',
      createdAt: '08.05.2024 10:24',
      station: 'Radar_01',
      settlement: 'с. Гора',
      region: 'Київська обл., Бориспільський р-н',
      coordinates: '50.3489° N, 30.9590° E',
      type: 'Ударний БПЛА',
      model: 'Shahed-136',
      altitude: '2200 м',
      speed: '185 км/год',
      source: 'raw_word_events',
      confidence: 72
    },
    {
      id: 'a12f77c9',
      title: 'БПЛА SuperCam',
      status: 'warning',
      createdAt: '08.05.2024 09:41',
      station: 'Radar_03',
      settlement: 'с. Слобожанське',
      region: 'Харківська обл.',
      coordinates: '49.9912° N, 36.2311° E',
      type: 'Розвідувальний БПЛА',
      model: 'SuperCam',
      altitude: '1600 м',
      speed: '95 км/год',
      source: 'raw_excel_events',
      confidence: 45
    },
    {
      id: 'b41c90aa',
      title: 'БПЛА Орлан-10',
      status: 'error',
      createdAt: '08.05.2024 08:12',
      station: 'Radar_02',
      settlement: 'м. Чернігів',
      region: 'Чернігівська обл.',
      coordinates: '51.4982° N, 31.2893° E',
      type: 'Розвідувальний БПЛА',
      model: 'Орлан-10',
      altitude: '1800 м',
      speed: '110 км/год',
      source: 'raw_word_events',
      confidence: 38
    },
    {
      id: 'c88e11f0',
      title: 'БПЛА Zala 421',
      status: 'valid',
      createdAt: '08.05.2024 11:02',
      station: 'Radar_04',
      settlement: 'с. Іванівка',
      region: 'Донецька обл.',
      coordinates: '48.0121° N, 37.8022° E',
      type: 'Розвідувальний БПЛА',
      model: 'Zala 421',
      altitude: '1300 м',
      speed: '105 км/год',
      source: 'norm_word_events',
      confidence: 91
    },
    {
      id: 'd91f22ab',
      title: 'БПЛА Ланцет-3',
      status: 'skipped',
      createdAt: '08.05.2024 11:45',
      station: 'Radar_05',
      settlement: 'м. Харків',
      region: 'Харківська обл.',
      coordinates: '49.9935° N, 36.2304° E',
      type: 'Баражуючий боєприпас',
      model: 'Ланцет-3',
      altitude: '900 м',
      speed: '140 км/год',
      source: 'raw_word_events',
      confidence: 63
    }
  ];

  const state = {
    active: 0,
    xp: 740,
    xpMax: 1000,
    todayXp: 120,
    level: 12,
    rank: 'Аналітик II',
    streak: 7,
    accuracy: 92
  };

  const rankTitles = [
    'Рекрут', 'Новобранець', 'Курсант', 'Стажер', 'Молодший оператор',
    'Оператор III класу', 'Оператор II класу', 'Оператор I класу', 'Старший оператор', 'Ведучий оператор',
    'Спеціаліст', 'Старший спеціаліст', 'Аналітик III рівня', 'Аналітик II рівня', 'Аналітик I рівня',
    'Старший аналітик', 'Ведучий аналітик', 'Оператор-розвідник', 'Аналітик РЕР', 'Оператор РЕБ',
    'Старший оператор РЕБ', 'Спеціаліст РЕР', 'Ведучий спеціаліст РЕР', 'Тактичний аналітик', 'Старший тактичний аналітик',
    'Інженер РЕБ', 'Старший інженер РЕБ', 'Фахівець подавлення', 'Координатор аналізу', 'Офіцер обробки даних',
    'Старший офіцер аналізу', 'Куратор зміни', 'Начальник групи', 'Старший координатор', 'Тактичний офіцер',
    'Офіцер РЕБ', 'Старший офіцер РЕБ', 'Начальник секції', 'Офіцер ситуаційного центру', 'Старший офіцер управління',
    'Начальник зміни', 'Куратор системи', 'Офіцер оперативного центру', 'Старший офіцер штабу', 'Начальник аналітики',
    'Координатор операцій', 'Керівник РЕБ/РЕР', 'Начальник управління', 'Архітектор системи', 'Командир цифрового фронту'
  ];

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

  function getVisibleRecords() {
    const total = records.length;
    const indexes = [-2, -1, 0, 1, 2].map((offset) => {
      return (state.active + offset + total) % total;
    });

    return indexes.map((index, position) => ({
      record: records[index],
      index,
      slot: position - 2
    }));
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const progress = Math.round((state.xp / state.xpMax) * 100);
    const activeRecord = records[state.active];

    root.innerHTML = `
      <section class="pg-page" id="pendingGamePage">
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

          <button class="pg-top-btn" type="button">🏆 ТОП операторів</button>
        </header>

        <div class="pg-progressline">
          <span>Прогрес обробки записів</span>
          <div class="pg-progressline__track">
            <div class="pg-progressline__fill" style="width:${Math.round(((state.active + 1) / records.length) * 100)}%"></div>
          </div>
          <strong>Запис ${state.active + 1} із ${records.length}</strong>
        </div>

        <main class="pg-layout">
          <aside class="pg-hotkeys">
            <h3>Гарячі клавіші</h3>
            <p><b>← →</b> перемикання</p>
            <p><b>1</b> ігнорувати</p>
            <p><b>2</b> підтвердити</p>
            <p><b>3</b> пропустити</p>
            <p><b>Space</b> flip / edit</p>
            <p><b>Esc</b> скасувати</p>
          </aside>

          <section class="pg-carousel-wrap">
            <button class="pg-nav-btn pg-nav-btn--left" type="button" data-pg-prev>‹</button>

            <div class="pg-carousel">
              ${getVisibleRecords().map(({ record, index, slot }) => renderCard(record, index, slot)).join('')}
            </div>

            <button class="pg-nav-btn pg-nav-btn--right" type="button" data-pg-next>›</button>
          </section>

          <aside class="pg-side">
            <section class="pg-user">
              <h3>Ваш прогрес</h3>
              <div class="pg-user__row">
                <div class="pg-avatar">OP</div>
                <div>
                  <strong>Operator_07</strong>
                  <span>ID: OP-7721</span>
                </div>
              </div>
              <div class="pg-side-rank">${getChevron(state.level)} ${state.rank}</div>
              <div class="pg-mini-track">
                <div style="width:${progress}%"></div>
              </div>
              <div class="pg-stats">
                <div><b>+${state.todayXp}</b><span>XP сьогодні</span></div>
                <div><b>${state.accuracy}%</b><span>точність</span></div>
                <div><b>${state.streak}</b><span>streak</span></div>
              </div>
            </section>

            <section class="pg-ranks">
              <h3>Ранги</h3>
              ${renderRankList()}
            </section>

            <section class="pg-achievements">
              <h3>Досягнення</h3>
              <p>✅ 10 записів без помилки</p>
              <p>✅ 100 підтверджених записів</p>
              <p>✅ 5 виправлень підряд</p>
              <p>✅ Точність понад 90%</p>
            </section>
          </aside>
        </main>

        <footer class="pg-wheel">
          <button class="pg-wheel__sector pg-wheel__sector--ignore" type="button" data-pg-action="ignore">
            <span>1</span>
            <strong>Ігнорувати</strong>
            <small>Відхилити запис</small>
          </button>

          <div class="pg-wheel__center">
            <small>Поточний запис</small>
            <strong>${state.active + 1} / ${records.length}</strong>
          </div>

          <button class="pg-wheel__sector pg-wheel__sector--confirm" type="button" data-pg-action="confirm">
            <span>2</span>
            <strong>Підтвердити</strong>
            <small>Дані вірні</small>
          </button>

          <button class="pg-wheel__skip" type="button" data-pg-action="skip">
            <span>3</span>
            <strong>Пропустити</strong>
          </button>
        </footer>

        <div class="pg-xp-pop" id="pgXpPop">+10 XP</div>
      </section>
    `;

    bind();
    setActiveInfo(activeRecord);
  }

  function renderCard(record, index, slot) {
    const active = slot === 0 ? 'is-active' : '';
    return `
      <article class="pg-card ${active} pg-card--${record.status}" data-index="${index}" data-slot="${slot}">
        <div class="pg-card__inner">
          <div class="pg-card__face pg-card__front">
            <div class="pg-card__status">${getStatusLabel(record.status)}</div>
            <button class="pg-card__star" type="button">☆</button>

            <h2>${record.title}</h2>
            <p class="pg-card__date">${record.createdAt}</p>

            <div class="pg-card__meta">
              <span>📡 ${record.station}</span>
              <span>📍 ${record.settlement}</span>
            </div>

            <div class="pg-drone">
              <div class="pg-drone__body"></div>
              <div class="pg-drone__wing pg-drone__wing--l"></div>
              <div class="pg-drone__wing pg-drone__wing--r"></div>
            </div>

            <div class="pg-card__chip">${record.type}</div>
            <small>Натисніть, щоб переглянути деталі</small>
          </div>

          <div class="pg-card__face pg-card__back">
            <h3>Редагування запису</h3>

            <label>Модель</label>
            <input value="${record.model}" />

            <label>Станція</label>
            <input value="${record.station}" />

            <label>Населений пункт</label>
            <input value="${record.settlement}" />

            <label>Координати</label>
            <input value="${record.coordinates}" />

            <label>Опис</label>
            <textarea>Система пропонує: ${record.model}. Confidence: ${record.confidence}%</textarea>

            <button class="pg-save-btn" type="button">Зберегти зміни</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderRankList() {
    const current = state.level;
    const from = Math.max(1, current - 2);
    const to = Math.min(50, current + 2);

    let html = '';
    for (let level = from; level <= to; level++) {
      html += `
        <div class="pg-rank-row ${level === current ? 'is-current' : ''}">
          <span>${getChevron(level)}</span>
          <b>${level}</b>
          <em>${rankTitles[level - 1]}</em>
        </div>
      `;
    }
    return html;
  }

  function getTier(level) {
    if (level <= 10) return 'blue';
    if (level <= 20) return 'green';
    if (level <= 30) return 'orange';
    if (level <= 40) return 'red';
    return 'violet';
  }

  function getChevron(level) {
    if (level <= 10) return '▰';
    if (level <= 20) return '▰▰';
    if (level <= 30) return '▰▰▰';
    if (level <= 40) return '▰▰▰▰';
    return '⚡';
  }

  function setActiveInfo(record) {
    document.documentElement.style.setProperty('--pg-accent-status', getStatusColor(record.status));
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

  function bind() {
    qs('[data-pg-prev]')?.addEventListener('click', prev);
    qs('[data-pg-next]')?.addEventListener('click', next);

    document.querySelectorAll('.pg-card.is-active').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('input, textarea, button')) return;
        card.classList.toggle('is-flipped');
      });
    });

    document.querySelectorAll('[data-pg-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        handleAction(btn.dataset.pgAction);
      });
    });
  }

  function prev() {
    state.active = (state.active - 1 + records.length) % records.length;
    render();
  }

  function next() {
    state.active = (state.active + 1) % records.length;
    render();
  }

  function handleAction(action) {
    const xpMap = {
      ignore: 8,
      confirm: 10,
      skip: 5
    };

    const xp = xpMap[action] || 5;
    state.xp = Math.min(state.xpMax, state.xp + xp);
    state.todayXp += xp;

    showXpPop(xp);
    setTimeout(next, 280);
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

      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();

      if (event.key === '1') handleAction('ignore');
      if (event.key === '2') handleAction('confirm');
      if (event.key === '3') handleAction('skip');

      if (event.code === 'Space') {
        event.preventDefault();
        qs('.pg-card.is-active')?.classList.toggle('is-flipped');
      }

      if (event.key === 'Enter') handleAction('confirm');

      if (event.key === 'Escape') {
        qs('.pg-card.is-active')?.classList.remove('is-flipped');
      }
    });
  }

  function init() {
    render();
    bindHotkeys();
  }

  window.LAVASH_PENDING_GAME = {
    init
  };
})();
