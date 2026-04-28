(() => {
  const records = [
    {
      id: 'uav-001',
      title: 'БПЛА Shahed-136',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'Shahed-136',
      unknownType: 'uav',
      createdAt: '08.05.2024 10:24',
      station: 'Radar_01',
      settlement: 'с. Гора',
      region: 'Київська обл.',
      coordinates: '50.3489° N, 30.9590° E',
      type: 'Ударний БПЛА',
      model: 'Shahed-136',
      ownership: 'ворожий',
      source: 'raw_word_events',
      confidence: 72
    },
    {
      id: 'uav-002',
      title: 'БПЛА Lancet-3',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'Ланцет-3',
      unknownType: 'uav',
      createdAt: '08.05.2024 11:45',
      station: 'Radar_05',
      settlement: 'м. Харків',
      region: 'Харківська обл.',
      coordinates: '49.9935° N, 36.2304° E',
      type: 'Баражуючий боєприпас',
      model: 'Lancet-3',
      ownership: 'ворожий',
      source: 'raw_word_events',
      confidence: 64
    },
    {
      id: 'uav-003',
      title: 'БПЛА Zala 421',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'Zala 421',
      unknownType: 'uav',
      createdAt: '08.05.2024 12:10',
      station: 'Radar_04',
      settlement: 'с. Іванівка',
      region: 'Чернігівська обл.',
      coordinates: '51.2380° N, 31.2980° E',
      type: 'Розвідувальний БПЛА',
      model: 'Zala 421',
      ownership: 'ворожий',
      source: 'raw_excel_events',
      confidence: 81
    },
    {
      id: 'settlement-001',
      title: 'НП Часів Яр',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Часів Яр',
      unknownType: 'settlement',
      createdAt: '08.05.2024 09:15',
      station: 'Radar_02',
      settlement: 'Часів Яр',
      hromada: 'Часовоярська',
      district: 'Бахмутський',
      region: 'Донецька обл.',
      lat: '48.5937',
      lon: '37.8572',
      source: 'dict_pending',
      confidence: 58
    },
    {
      id: 'settlement-002',
      title: 'НП Кудрівка',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Кудрівка',
      unknownType: 'settlement',
      createdAt: '08.05.2024 13:22',
      station: 'Radar_03',
      settlement: 'Кудрівка',
      hromada: 'Сосницька',
      district: 'Корюківський',
      region: 'Чернігівська обл.',
      lat: '51.6351',
      lon: '32.7164',
      source: 'dict_pending',
      confidence: 62
    },
    {
      id: 'settlement-003',
      title: 'НП Новоєгорівка',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Новоєгорівка',
      unknownType: 'settlement',
      createdAt: '08.05.2024 14:05',
      station: 'Radar_01',
      settlement: 'Новоєгорівка',
      hromada: 'Коломийчиська',
      district: 'Сватівський',
      region: 'Луганська обл.',
      lat: '49.4750',
      lon: '37.8900',
      source: 'raw_word_events',
      confidence: 51
    },
    {
      id: 'unit-001',
      title: 'Підрозділ 2 АДн',
      status: 'unknown',
      dataType: 'Підрозділ',
      mainValue: '2 АДн',
      unknownType: 'unit',
      createdAt: '08.05.2024 19:48',
      station: '—',
      settlement: 'м. Бахмут',
      parentUnit: '45 оабр',
      source: 'telegram_parse',
      confidence: 67
    },
    {
      id: 'unit-002',
      title: 'Підрозділ 1 батарея',
      status: 'unknown',
      dataType: 'Підрозділ',
      mainValue: '1 батарея',
      unknownType: 'unit',
      createdAt: '08.05.2024 20:11',
      station: '—',
      settlement: '—',
      parentUnit: '2 АДн',
      source: 'raw_excel_events',
      confidence: 74
    },
    {
      id: 'unit-003',
      title: 'Підрозділ РЕБ-група',
      status: 'unknown',
      dataType: 'Підрозділ',
      mainValue: 'РЕБ-група',
      unknownType: 'unit',
      createdAt: '08.05.2024 21:02',
      station: '—',
      settlement: '—',
      parentUnit: 'служба РЕБ',
      source: 'manual_import',
      confidence: 49
    },
    {
      id: 'station-001',
      title: 'Станція Radar_07',
      status: 'unknown',
      dataType: 'Станція',
      mainValue: 'Radar_07',
      unknownType: 'station',
      createdAt: '08.05.2024 15:33',
      station: 'Radar_07',
      settlement: 'с. Гора',
      region: 'Київська обл.',
      source: 'raw_word_events',
      confidence: 61
    },
    {
      id: 'station-002',
      title: 'Станція Халк',
      status: 'unknown',
      dataType: 'Станція',
      mainValue: 'Халк',
      unknownType: 'station',
      createdAt: '08.05.2024 16:07',
      station: 'Халк',
      settlement: 'м. Словʼянськ',
      region: 'Донецька обл.',
      source: 'raw_word_events',
      confidence: 77
    },
    {
      id: 'station-003',
      title: 'Станція Медельїн',
      status: 'unknown',
      dataType: 'Станція',
      mainValue: 'Медельїн',
      unknownType: 'station',
      createdAt: '08.05.2024 16:42',
      station: 'Медельїн',
      settlement: 'м. Ізюм',
      region: 'Харківська обл.',
      source: 'raw_word_events',
      confidence: 69
    },
    {
      id: 'object-001',
      title: 'Обʼєкт прикриття ОКП',
      status: 'unknown',
      dataType: 'Обʼєкт прикриття',
      mainValue: 'ОКП',
      unknownType: 'object',
      createdAt: '08.05.2024 17:12',
      station: 'Radar_06',
      settlement: 'с. Гора',
      unitOwner: '2 АДн',
      source: 'request_form',
      confidence: 83
    },
    {
      id: 'object-002',
      title: 'Обʼєкт прикриття ПУ',
      status: 'unknown',
      dataType: 'Обʼєкт прикриття',
      mainValue: 'ПУ дивізіону',
      unknownType: 'object',
      createdAt: '08.05.2024 17:38',
      station: 'Radar_01',
      settlement: 'м. Краматорськ',
      unitOwner: '1 АДн',
      source: 'request_form',
      confidence: 57
    },
    {
      id: 'object-003',
      title: 'Обʼєкт прикриття склад БК',
      status: 'unknown',
      dataType: 'Обʼєкт прикриття',
      mainValue: 'Склад БК',
      unknownType: 'object',
      createdAt: '08.05.2024 18:20',
      station: 'Radar_08',
      settlement: 'м. Дружківка',
      unitOwner: '45 оабр',
      source: 'request_form',
      confidence: 66
    },
    {
      id: 'record-001',
      title: 'Невідомий запис #117',
      status: 'unknown',
      dataType: 'Запис',
      mainValue: '323 10 30.04.2026 BMuIK0I',
      unknownType: 'record',
      createdAt: '08.05.2024 22:18',
      station: '—',
      settlement: '—',
      source: 'ocr_fragment',
      confidence: 22
    },
    {
      id: 'record-002',
      title: 'Невідомий запис #118',
      status: 'unknown',
      dataType: 'Запис',
      mainValue: 'E3BT / KponHBa / Aenbra',
      unknownType: 'record',
      createdAt: '08.05.2024 22:31',
      station: '—',
      settlement: '—',
      source: 'ocr_fragment',
      confidence: 18
    },
    {
      id: 'record-003',
      title: 'Невідомий запис #119',
      status: 'unknown',
      dataType: 'Запис',
      mainValue: 'рядок не класифіковано',
      unknownType: 'record',
      createdAt: '08.05.2024 22:44',
      station: '—',
      settlement: '—',
      source: 'raw_text',
      confidence: 12
    },
    {
      id: 'uav-004',
      title: 'БПЛА SuperCam',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'SuperCam',
      unknownType: 'uav',
      createdAt: '08.05.2024 23:05',
      station: 'Radar_09',
      settlement: 'м. Купʼянськ',
      type: 'Розвідувальний БПЛА',
      model: 'SuperCam',
      ownership: 'ворожий',
      source: 'raw_word_events',
      confidence: 73
    },
    {
      id: 'settlement-004',
      title: 'НП Новоселівка',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Новоселівка',
      unknownType: 'settlement',
      createdAt: '08.05.2024 23:31',
      station: 'Radar_10',
      settlement: 'Новоселівка',
      hromada: 'Лиманська',
      district: 'Краматорський',
      region: 'Донецька обл.',
      lat: '48.9880',
      lon: '37.8090',
      source: 'dict_pending',
      confidence: 47
    }
  ];


  const state = {
    active: 0,
    xp: 842,
    xpMax: 1000,
    todayXp: 222,
    level: 12,
    rank: 'Аналітик II',
    isResolving: false
  };

  const unknownConfigs = {
    uav: {
      label: 'Невідомий БПЛА',
      shortLabel: 'БПЛА',
      iconUrl: '../assets/icons/unknown/uav.svg',
      visualUrl: '../assets/img/uav/shahed-136.png',
      color: '#38dfff',
      bg1: 'rgba(18, 78, 190, .94)',
      bg2: 'rgba(6, 26, 80, .98)'
    },
    settlement: {
      label: 'Невідомий населений пункт',
      shortLabel: 'НП',
      iconUrl: '../assets/icons/unknown/settlement.svg',
      color: '#f5b84b',
      bg1: 'rgba(128, 86, 8, .94)',
      bg2: 'rgba(54, 38, 13, .98)'
    },
    unit: {
      label: 'Невідомий підрозділ',
      shortLabel: 'Підрозділ',
      iconUrl: '../assets/icons/unknown/unit.svg',
      color: '#ff5f7e',
      bg1: 'rgba(112, 22, 50, .94)',
      bg2: 'rgba(55, 14, 34, .98)'
    },
    station: {
      label: 'Невідома станція',
      shortLabel: 'Станція',
      iconUrl: '../assets/icons/unknown/station.svg',
      color: '#37e6b2',
      bg1: 'rgba(8, 96, 84, .94)',
      bg2: 'rgba(6, 44, 54, .98)'
    },
    object: {
      label: 'Невідомий об’єкт прикриття',
      shortLabel: 'Об’єкт',
      iconUrl: '../assets/icons/unknown/object.svg',
      color: '#9b7cff',
      bg1: 'rgba(76, 45, 158, .94)',
      bg2: 'rgba(34, 24, 76, .98)'
    },
    record: {
      label: 'Невідомий запис',
      shortLabel: 'Запис',
      iconUrl: '../assets/icons/unknown/record.svg',
      color: '#d8dfff',
      bg1: 'rgba(72, 80, 110, .90)',
      bg2: 'rgba(22, 28, 48, .98)'
    }
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function getRoot() {
    return qs('.workspace-body') || qs('.workspace-body--page') || qs('#app');
  }

  function safeValue(value, fallback = '—') {
    return value === undefined || value === null || value === '' ? fallback : value;
  }

  function escapeAttr(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function getChevron(level) {
    if (level <= 10) return '▰';
    if (level <= 20) return '▰▰';
    if (level <= 30) return '▰▰▰';
    if (level <= 40) return '▰▰▰▰';
    return '⚡';
  }

  function getConfig(type) {
    return unknownConfigs[type] || unknownConfigs.record;
  }

  function getVisibleRecords() {
    return [-2, -1, 0, 1, 2].map((slot) => {
      const index = (state.active + slot + records.length) % records.length;
      return { record: records[index], index, slot };
    });
  }

  function getOptions(name, includeEmpty = false) {
    const options = {
      unknownType: [
        ['uav', 'БПЛА'],
        ['settlement', 'Населений пункт'],
        ['object', 'Обʼєкт прикриття'],
        ['unit', 'Підрозділ'],
        ['station', 'Станція'],
        ['record', 'Невідомий запис']
      ],
      ownership: [
        ['ворожий', 'Ворожий'],
        ['україна', 'Україна'],
        ['спільний', 'Спільний']
      ],
      unit: [
        ['45 оабр', '45 оабр'],
        ['служба РЕБ', 'служба РЕБ'],
        ['1 АДн', '1 АДн'],
        ['2 АДн', '2 АДн'],
        ['3 АДн', '3 АДн'],
        ['1 батарея', '1 батарея'],
        ['2 батарея', '2 батарея'],
        ['РЕБ-група', 'РЕБ-група']
      ]
    }[name] || [];

    return includeEmpty ? [['', 'Не обрано'], ...options] : options;
  }

  function renderCustomSelect(field, options, selectedValue, placeholder = 'Не обрано') {
    const selected = options.find(([value]) => value === selectedValue);
    const currentValue = selected ? selected[0] : '';
    const currentLabel = selected ? selected[1] : placeholder;

    return `
      <div class="pg-select" data-field="${field}" data-value="${escapeAttr(currentValue)}" tabindex="0" role="button">
        <div class="pg-select__head">
          <span>${currentLabel}</span>
          <b>⌄</b>
        </div>
        <div class="pg-select__dropdown">
          ${options.map(([value, label]) => `
            <button type="button" class="pg-select__item ${value === currentValue ? 'is-selected' : ''}" data-value="${escapeAttr(value)}">
              ${label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderTypeFields(record, type) {
    if (type === 'uav') {
      return `
        <label>
          <span>Приналежність</span>
          ${renderCustomSelect('ownership', getOptions('ownership'), record.ownership || 'ворожий')}
        </label>
      `;
    }

    if (type === 'settlement') {
      return `
        <label><span>Громада</span><input data-field="hromada" value="${escapeAttr(safeValue(record.hromada, ''))}"></label>
        <label><span>Район</span><input data-field="district" value="${escapeAttr(safeValue(record.district, ''))}"></label>
        <label><span>Область</span><input data-field="region" value="${escapeAttr(safeValue(record.region, ''))}"></label>
        <label><span>Lat</span><input data-field="lat" value="${escapeAttr(safeValue(record.lat, ''))}"></label>
        <label><span>Lon</span><input data-field="lon" value="${escapeAttr(safeValue(record.lon, ''))}"></label>
      `;
    }

    if (type === 'object') {
      return `
        <label>
          <span>Підрозділ-власник</span>
          ${renderCustomSelect('unitOwner', getOptions('unit', true), record.unitOwner || '')}
        </label>
      `;
    }

    if (type === 'unit') {
      return `
        <label>
          <span>Батьківський підрозділ</span>
          ${renderCustomSelect('parentUnit', getOptions('unit', true), record.parentUnit || '')}
        </label>
      `;
    }

    return '';
  }

  function getVisualUrl(record, config) {
    if (record.unknownType === 'uav') return config.visualUrl;
    return config.iconUrl;
  }

  function renderCard(record, index, slot) {
    const type = record.unknownType || 'record';
    const config = getConfig(type);
    const activeClass = slot === 0 ? 'is-active' : '';
    const mainValue = record.mainValue || record.model || record.settlement || record.title || 'Невідоме значення';
    const dataType = record.dataType || config.shortLabel;
    const visualUrl = getVisualUrl(record, config);

    return `
      <article
        class="pg-card ${activeClass}"
        data-index="${index}"
        data-slot="${slot}"
        data-unknown-type="${type}"
        style="--pg-card-accent:${config.color}; --pg-card-bg-1:${config.bg1}; --pg-card-bg-2:${config.bg2};"
      >
        <div class="pg-card__inner">
          <section class="pg-card__face pg-card__front">
            <header class="pg-card__top">
              <span class="pg-card__status">
                <img src="${config.iconUrl}" alt="" loading="lazy">
                ${config.label}
              </span>
              <button class="pg-card__star" type="button" aria-label="Позначити">☆</button>
            </header>

            <div class="pg-card__body">
              <div class="pg-data">
                <span class="pg-data__type">${dataType}</span>
                <h2>${mainValue}</h2>
              </div>

              <figure class="pg-visual pg-visual--${type}">
                <div class="pg-radar-core"></div>
                <img class="pg-visual__img" src="${visualUrl}" alt="${escapeAttr(mainValue)}" loading="lazy">
              </figure>
            </div>

            <small class="pg-card__hint">Клік — редагувати / Space — flip</small>
          </section>

          <section class="pg-card__face pg-card__back">
            <header class="pg-edit-head">
              <h3>Редагування запису</h3>
              <span>${safeValue(record.source, 'unknown_source')}</span>
            </header>

            <div class="pg-edit-grid">
              <label>
                <span>Тип обʼєкта</span>
                ${renderCustomSelect('unknownType', getOptions('unknownType'), type)}
              </label>

              <div class="pg-readonly-field">
                <span>Поточне значення</span>
                <strong>${mainValue}</strong>
              </div>

              <label class="pg-edit-wide">
                <span>Правильна назва</span>
                <input data-field="mainValue" value="${escapeAttr(mainValue)}" placeholder="Введи правильну назву">
              </label>

              ${renderTypeFields(record, type)}
            </div>

            <button class="pg-save-btn" type="button">Зберегти зміни</button>
          </section>
        </div>
      </article>
    `;
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const activeRecord = records[state.active];
    const config = getConfig(activeRecord.unknownType || 'record');
    const progress = Math.round((state.xp / state.xpMax) * 100);

    document.documentElement.style.setProperty('--pg-accent-status', config.color);

    root.innerHTML = `
      <section class="pg-page pg-page--game" id="pendingGamePage">
        <div class="pg-bg-orb pg-bg-orb--left"></div>
        <div class="pg-bg-orb pg-bg-orb--right"></div>

        <div class="pg-game-hud" aria-hidden="true">
          <aside class="pg-hud-rank-card">
            <span>Ранг</span>
            <strong>${state.rank}</strong>
            <small>Рівень ${state.level}</small>
          </aside>

          <aside class="pg-hud-xp-ring" style="--pg-ring-progress:${progress * 3.6}deg; --pg-ring-accent:${config.color};">
            <div class="pg-hud-xp-ring__core">
              <strong>${state.xp}</strong>
              <span>XP</span>
            </div>
          </aside>
        </div>

        <main class="pg-stage">
          <section class="pg-carousel-wrap" data-pg-carousel-wrap>
            <div class="pg-carousel">
              ${getVisibleRecords().map(({ record, index, slot }) => renderCard(record, index, slot)).join('')}
            </div>
          </section>
        </main>

        <div class="pg-hotkey-strip">
          <span>← → перемотка</span>
          <span>A ігнор</span>
          <span>S пропуск</span>
          <span>D підтвердити</span>
          <span>Space редагувати</span>
        </div>

        <div class="pg-xp-pop" id="pgXpPop">+10 XP</div>
      </section>
    `;

    bind();
  }

  function updateActiveType(value) {
    const record = records[state.active];
    if (!record) return;

    const config = getConfig(value);
    record.unknownType = value;
    record.dataType = config.shortLabel;
    record.status = 'unknown';
  }

  function saveActiveCardEdits(card) {
    const record = records[state.active];
    if (!record) return;

    qsa('[data-field]', card).forEach((field) => {
      const key = field.dataset.field;
      record[key] = field.dataset.value !== undefined ? field.dataset.value : field.value;
    });

    if (record.mainValue) {
      record.title = `${record.dataType || getConfig(record.unknownType).shortLabel} ${record.mainValue}`;
      if (record.unknownType === 'uav') record.model = record.mainValue;
      if (record.unknownType === 'settlement') record.settlement = record.mainValue;
      if (record.unknownType === 'station') record.station = record.mainValue;
    }

    card.classList.remove('is-saved-pulse');
    void card.offsetWidth;
    card.classList.add('is-saved-pulse');
  }

  function bindCustomSelects(card) {
    qsa('.pg-select', card).forEach((select) => {
      const head = qs('.pg-select__head', select);
      const label = qs('.pg-select__head span', select);
      const items = qsa('.pg-select__item', select);

      const closeAll = () => qsa('.pg-select.is-open', card).forEach((node) => {
        if (node !== select) node.classList.remove('is-open');
      });

      head?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeAll();
        select.classList.toggle('is-open');
      });

      select.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          event.preventDefault();
          closeAll();
          select.classList.toggle('is-open');
        }

        if (event.code === 'Escape') {
          event.preventDefault();
          select.classList.remove('is-open');
        }
      });

      items.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const value = item.dataset.value || '';
          const text = item.textContent.trim();

          select.dataset.value = value;
          if (label) label.textContent = text;

          items.forEach((node) => node.classList.remove('is-selected'));
          item.classList.add('is-selected');
          select.classList.remove('is-open');

          select.dispatchEvent(new CustomEvent('pg-select-change', {
            bubbles: true,
            detail: { field: select.dataset.field, value, label: text }
          }));
        });
      });
    });
  }

  function bindCardDrag(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let dragging = false;

    card.addEventListener('pointerdown', (event) => {
      if (event.target.closest('input, textarea, button, label, .pg-select')) return;
      if (card.classList.contains('is-flipped')) return;

      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      currentX = 0;
      currentY = 0;
      card.dataset.dragAction = '';
      card.setPointerCapture(event.pointerId);
      card.classList.add('is-dragging');
    });

    card.addEventListener('pointermove', (event) => {
      if (!dragging) return;

      currentX = event.clientX - startX;
      currentY = event.clientY - startY;

      const rotate = currentX / 28;
      card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

      if (currentX > 120) card.dataset.dragAction = 'confirm';
      else if (currentX < -120) card.dataset.dragAction = 'ignore';
      else if (currentY > 110) card.dataset.dragAction = 'skip';
      else card.dataset.dragAction = '';
    });

    card.addEventListener('pointerup', (event) => {
      if (!dragging) return;

      dragging = false;
      card.releasePointerCapture(event.pointerId);
      card.classList.remove('is-dragging');

      const action = card.dataset.dragAction;
      card.dataset.dragAction = '';

      if (currentX > 160 || action === 'confirm') return handleAction('confirm');
      if (currentX < -160 || action === 'ignore') return handleAction('ignore');
      if (currentY > 140 || action === 'skip') return handleAction('skip');

      card.style.transform = '';
    });

    card.addEventListener('pointercancel', () => {
      dragging = false;
      card.classList.remove('is-dragging');
      card.dataset.dragAction = '';
      card.style.transform = '';
    });
  }

  function bind() {
    const card = qs('.pg-card.is-active');
    if (!card) return;

    bindCardDrag(card);
    bindCustomSelects(card);

    card.addEventListener('click', (event) => {
      if (event.target.closest('input, textarea, button, label, .pg-select')) return;
      if (card.classList.contains('is-dragging')) return;
      card.classList.toggle('is-flipped');
    });

    qs('[data-field="unknownType"]', card)?.addEventListener('pg-select-change', (event) => {
      event.stopPropagation();
      updateActiveType(event.detail.value);
      render();
      qs('.pg-card.is-active')?.classList.add('is-flipped');
    });

    qs('.pg-save-btn', card)?.addEventListener('click', (event) => {
      event.stopPropagation();
      saveActiveCardEdits(card);
    });

    const carousel = qs('[data-pg-carousel-wrap]');
    if (!carousel) return;

    let wheelLock = false;
    carousel.addEventListener('wheel', (event) => {
      event.preventDefault();
      if (wheelLock || state.isResolving) return;

      wheelLock = true;
      event.deltaY > 0 || event.deltaX > 0 ? next() : prev();
      setTimeout(() => { wheelLock = false; }, 360);
    }, { passive: false });
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

  function handleAction(action) {
    if (state.isResolving) return;

    const xp = { ignore: 8, confirm: 10, skip: 5 }[action] || 5;
    const card = qs('.pg-card.is-active');

    state.isResolving = true;
    state.xp = Math.min(state.xpMax, state.xp + xp);
    state.todayXp += xp;

    card?.classList.add(`is-key-${action}`);
    showXpPop(xp);

    setTimeout(() => {
      state.active = (state.active + 1) % records.length;
      state.isResolving = false;
      render();
    }, 560);
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

      const typing = event.target?.closest?.('input, textarea, .pg-select');
      if (typing) {
        if (event.key === 'Escape') {
          event.preventDefault();
          qs('.pg-card.is-active')?.classList.remove('is-flipped');
        }
        return;
      }

      if (event.code === 'ArrowLeft') return event.preventDefault(), prev();
      if (event.code === 'ArrowRight') return event.preventDefault(), next();
      if (event.code === 'KeyA' && !event.shiftKey && !event.ctrlKey && !event.altKey) return event.preventDefault(), handleAction('ignore');
      if (event.code === 'KeyS' && !event.shiftKey && !event.ctrlKey && !event.altKey) return event.preventDefault(), handleAction('skip');
      if (event.code === 'KeyD' && !event.shiftKey && !event.ctrlKey && !event.altKey) return event.preventDefault(), handleAction('confirm');
      if (event.code === 'Space') return event.preventDefault(), qs('.pg-card.is-active')?.classList.toggle('is-flipped');
      if (event.code === 'Escape') return event.preventDefault(), qs('.pg-card.is-active')?.classList.remove('is-flipped');
    });
  }

  function init() {
    render();

    if (!window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__) {
      window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__ = true;
      bindHotkeys();
    }

    if (!window.__LAVASH_PENDING_SELECT_CLOSE_BOUND__) {
      window.__LAVASH_PENDING_SELECT_CLOSE_BOUND__ = true;
      document.addEventListener('click', () => {
        qsa('.pg-select.is-open').forEach((select) => select.classList.remove('is-open'));
      });
    }
  }

  window.LAVASH_PENDING_GAME = { init };
})();
