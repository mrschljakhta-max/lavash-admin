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
    streak: 7,
    accuracy: 92,
    combo: 0,
    bestCombo: 0,
    sessionTotal: 0,
    sessionCorrect: 0,
    sessionErrors: 0,
    lastActionAt: 0,
    lastCardShownAt: Date.now(),
    recentActions: [],
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
      unknown: 'Невідомий',
      warning: 'Сумнівний',
      error: 'Невідомий запис',
      valid: 'Валідний',
      skipped: 'Пропущений',
      fixed: 'Виправлений'
    }[status] || 'Новий';
  }

  function getStatusColor(status) {
    return {
      new: '#55dfff',
      unknown: '#f5a524',
      warning: '#f5a524',
      error: '#f5a524',
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
    const oldPanel = document.getElementById('pendingGameRightPanel');
    if (oldPanel) oldPanel.remove();

    document.querySelectorAll('.pg-right-panel, #pendingGameRightPanel').forEach((panel) => {
      panel.remove();
    });
  }

  function getXpProgress() {
    return Math.max(0, Math.min(100, Math.round((state.xp / state.xpMax) * 100)));
  }

  function getXpMultiplier() {
    if (state.combo >= 20) return 2;
    if (state.combo >= 10) return 1.5;
    if (state.combo >= 5) return 1.25;
    return 1;
  }

  function renderGameHud() {
    const progress = getXpProgress();
    const dash = Math.round((progress / 100) * 360);
    const leftXp = Math.max(0, state.xpMax - state.xp);

    return `
      <aside class="pg-game-hud" aria-label="Гейміфікація оператора">
        <div class="pg-rank-ring" style="--pg-ring-progress:${dash}deg;">
          <div class="pg-rank-ring__core">
            <span>Ранг</span>
            <b>${getChevron(state.level)}</b>
            <strong>${state.rank}</strong>
          </div>
        </div>

        <div class="pg-hud-stack">
          <div class="pg-hud-pill pg-hud-pill--xp">
            <span>XP</span>
            <strong>${state.xp} / ${state.xpMax}</strong>
            <small>до наступного: ${leftXp} XP</small>
          </div>

          <div class="pg-hud-grid">
            <div class="pg-hud-mini">
              <span>сьогодні</span>
              <strong>+${state.todayXp}</strong>
            </div>
            <div class="pg-hud-mini">
              <span>streak</span>
              <strong>${state.streak}</strong>
            </div>
            <div class="pg-hud-mini">
              <span>combo</span>
              <strong>x${Math.max(1, state.combo)}</strong>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  function renderOperatorFooter() {
    const accuracy = state.sessionTotal
      ? Math.round((state.sessionCorrect / state.sessionTotal) * 100)
      : state.accuracy;

    return `
      <section class="pg-operator-strip" aria-label="Поточна сесія">
        <div><span>Оброблено</span><strong>${state.sessionTotal}</strong></div>
        <div><span>Точність</span><strong>${accuracy}%</strong></div>
        <div><span>Комбо</span><strong>x${Math.max(1, state.combo)}</strong></div>
        <div><span>Найкраще</span><strong>x${Math.max(1, state.bestCombo)}</strong></div>
      </section>
    `;
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const progress = Math.round((state.xp / state.xpMax) * 100);
    const activeRecord = records[state.active];
    const activeUnknownConfig = getUnknownConfig(activeRecord.unknownType || 'record');
    document.documentElement.style.setProperty('--pg-accent-status', activeUnknownConfig.color || getStatusColor(activeRecord.status));

    root.innerHTML = `
      <section class="pg-page pg-page--clean" id="pendingGamePage">
        <div class="pg-bg-orb pg-bg-orb--left"></div>
        <div class="pg-bg-orb pg-bg-orb--right"></div>

        ${renderGameHud()}

        <main class="pg-stage">
          <section class="pg-carousel-wrap" data-pg-carousel-wrap>
            <div class="pg-carousel">
              ${getVisibleRecords().map(({ record, index, slot }) => renderCard(record, index, slot)).join('')}
            </div>
          </section>
        </main>

        ${renderOperatorFooter()}

        <div class="pg-xp-pop" id="pgXpPop">+10 XP</div>
      </section>
    `;

    renderRightPanel();
    bind();
  }

  function getUnknownConfig(type) {
    const configs = {
      uav: {
        label: 'Невідомий БПЛА',
        shortLabel: 'БПЛА',
        iconUrl: '../assets/icons/unknown/uav.svg',
        color: '#38dfff',
        bg1: 'rgba(18, 78, 190, .92)',
        bg2: 'rgba(8, 28, 82, .96)'
      },
      settlement: {
        label: 'Невідомий населений пункт',
        shortLabel: 'НП',
        iconUrl: '../assets/icons/unknown/settlement.svg',
        color: '#f5b84b',
        bg1: 'rgba(128, 86, 8, .92)',
        bg2: 'rgba(54, 38, 13, .96)'
      },
      unit: {
        label: 'Невідомий підрозділ',
        shortLabel: 'Підрозділ',
        iconUrl: '../assets/icons/unknown/unit.svg',
        color: '#ff5f7e',
        bg1: 'rgba(112, 22, 50, .92)',
        bg2: 'rgba(55, 14, 34, .96)'
      },
      station: {
        label: 'Невідома станція',
        shortLabel: 'Станція',
        iconUrl: '../assets/icons/unknown/station.svg',
        color: '#37e6b2',
        bg1: 'rgba(8, 96, 84, .92)',
        bg2: 'rgba(6, 44, 54, .96)'
      },
      object: {
        label: 'Невідомий об’єкт прикриття',
        shortLabel: 'Об’єкт',
        iconUrl: '../assets/icons/unknown/object.svg',
        color: '#9b7cff',
        bg1: 'rgba(76, 45, 158, .92)',
        bg2: 'rgba(34, 24, 76, .96)'
      },
      record: {
        label: 'Невідомий запис',
        shortLabel: 'Запис',
        iconUrl: '../assets/icons/unknown/record.svg',
        color: '#d8dfff',
        bg1: 'rgba(72, 80, 110, .88)',
        bg2: 'rgba(22, 28, 48, .96)'
      }
    };

    return configs[type] || configs.record;
  }

  function getUnknownIconUrl(type) {
    return getUnknownConfig(type).iconUrl;
  }

  function getUnknownLabel(type) {
    return getUnknownConfig(type).label;
  }

  function getDataIcon(type) {
    return getUnknownConfig(type).shortLabel;
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

  function renderCustomSelect(field, options, selectedValue, placeholder = 'Не обрано') {
    const normalizedOptions = options || [];
    const selected = normalizedOptions.find(([value]) => value === selectedValue);
    const currentValue = selected ? selected[0] : '';
    const currentLabel = selected ? selected[1] : placeholder;

    return `
      <div
        class="pg-select"
        data-field="${field}"
        data-value="${escapeAttr(currentValue)}"
        tabindex="0"
        role="button"
        aria-label="${escapeAttr(currentLabel)}"
      >
        <div class="pg-select__head">
          <span>${currentLabel}</span>
          <b>⌄</b>
        </div>

        <div class="pg-select__dropdown">
          ${normalizedOptions.map(([value, label]) => `
            <button
              type="button"
              class="pg-select__item ${value === currentValue ? 'is-selected' : ''}"
              data-value="${escapeAttr(value)}"
            >${label}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function getUnknownTypeOptionList() {
    return [
      ['uav', 'БПЛА'],
      ['settlement', 'Населений пункт'],
      ['object', 'Обʼєкт прикриття'],
      ['unit', 'Підрозділ'],
      ['station', 'Станція'],
      ['record', 'Невідомий запис']
    ];
  }

  function getOwnershipOptionList() {
    return [
      ['ворожий', 'Ворожий'],
      ['україна', 'Україна'],
      ['спільний', 'Спільний']
    ];
  }

  function getUnitOptionList(includeEmpty = true) {
    const values = [
      '45 оабр',
      'служба РЕБ',
      '1 АДн',
      '2 АДн',
      '3 АДн',
      '1 батарея',
      '2 батарея',
      'РЕБ-група'
    ].map((value) => [value, value]);

    return includeEmpty ? [['', 'Не обрано'], ...values] : values;
  }

  function getUnknownTypeOptions(selectedType) {
    const types = [
      ['uav', 'БПЛА'],
      ['settlement', 'Населений пункт'],
      ['object', 'Обʼєкт прикриття'],
      ['unit', 'Підрозділ'],
      ['station', 'Станція'],
      ['record', 'Невідомий запис']
    ];

    return types.map(([value, label]) => `
      <option value="${value}" ${value === selectedType ? 'selected' : ''}>${label}</option>
    `).join('');
  }

  function renderOwnershipOptions(selectedValue) {
    const values = [
      ['ворожий', 'Ворожий'],
      ['україна', 'Україна'],
      ['спільний', 'Спільний']
    ];

    return values.map(([value, label]) => `
      <option value="${value}" ${value === selectedValue ? 'selected' : ''}>${label}</option>
    `).join('');
  }

  function renderUnitOptions(selectedValue) {
    const values = [
      '45 оабр',
      'служба РЕБ',
      '1 АДн',
      '2 АДн',
      '3 АДн',
      '1 батарея',
      '2 батарея',
      'РЕБ-група'
    ];

    const selected = selectedValue || '';
    const options = values.map((value) => `
      <option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>
    `).join('');

    return `<option value="" ${!selected ? 'selected' : ''}>Не обрано</option>${options}`;
  }

  function renderTypeSpecificEditFields(record, unknownType) {
    if (unknownType === 'uav') {
      return `
        <label>
          <span>Приналежність</span>
          ${renderCustomSelect('ownership', getOwnershipOptionList(), record.ownership || 'ворожий')}
        </label>
      `;
    }

    if (unknownType === 'settlement') {
      return `
        <label><span>Громада</span><input data-field="hromada" value="${safeValue(record.hromada, '')}" /></label>
        <label><span>Район</span><input data-field="district" value="${safeValue(record.district, '')}" /></label>
        <label><span>Область</span><input data-field="region" value="${safeValue(record.region, '')}" /></label>
        <label><span>Lat</span><input data-field="lat" value="${safeValue(record.lat, '')}" /></label>
        <label><span>Lon</span><input data-field="lon" value="${safeValue(record.lon, '')}" /></label>
      `;
    }

    if (unknownType === 'object') {
      return `
        <label>
          <span>Підрозділ, до якого належить</span>
          ${renderCustomSelect('unitOwner', getUnitOptionList(), record.unitOwner || '')}
        </label>
      `;
    }

    if (unknownType === 'unit') {
      return `
        <label>
          <span>Батьківський підрозділ</span>
          ${renderCustomSelect('parentUnit', getUnitOptionList(), record.parentUnit || '')}
        </label>
      `;
    }

    return '';
  }

  function getVisualImage(record, unknownType) {
    if (unknownType === 'uav') return '../assets/img/uav/shahed-136.png';
    return getUnknownIconUrl(unknownType);
  }

  function renderCard(record, index, slot) {
    const active = slot === 0 ? 'is-active' : '';
    const unknownType = record.unknownType || 'record';
    const unknownConfig = getUnknownConfig(unknownType);
    const dataType = record.dataType || record.type || unknownConfig.shortLabel || 'Запис';
    const mainValue = record.mainValue || record.model || record.settlement || record.title || 'Невідоме значення';
    const visualImage = getVisualImage(record, unknownType);

    return `
      <article
        class="pg-card ${active} pg-card--${record.status}"
        data-index="${index}"
        data-slot="${slot}"
        data-status="${record.status || 'unknown'}"
        data-unknown-type="${unknownType}"
        style="--pg-card-accent:${unknownConfig.color}; --pg-card-bg-1:${unknownConfig.bg1}; --pg-card-bg-2:${unknownConfig.bg2};"
      >
        <div class="pg-card__inner">
          <div class="pg-card__face pg-card__front">
            <div class="pg-card__topline">
              <div class="pg-card__status">
                <span class="pg-status-dot"></span>
                ${unknownConfig.label}
              </div>
              <button class="pg-card__star" type="button" aria-label="Позначити">☆</button>
            </div>

            <div class="pg-unknown-badge">
              <span class="pg-unknown-badge__icon">
                <img src="${unknownConfig.iconUrl}" alt="${unknownConfig.label}" loading="lazy">
              </span>
              <strong>${unknownConfig.label}</strong>
            </div>

            <div class="pg-card__content pg-card__content--new">
              <section class="pg-data">
                <div class="pg-data__type">
                  <span class="pg-data__icon">
                    <img src="${unknownConfig.iconUrl}" alt="${dataType}" loading="lazy">
                  </span>
                  <span>${dataType}</span>
                </div>

                <h2 class="pg-data__value">${mainValue}</h2>
              </section>

              <section class="pg-visual pg-visual--${unknownType}">
                <div class="pg-radar-core"></div>

                <img
                  class="pg-uav-img pg-unknown-visual-img"
                  src="${visualImage}"
                  alt="${mainValue}"
                  loading="lazy"
                />
              </section>
            </div>

            <small>Клік — редагувати / Space — flip</small>
          </div>

          <div class="pg-card__face pg-card__back">
            <div class="pg-edit-head">
              <h3>Редагування запису</h3>
              <span>${safeValue(record.source, 'unknown_source')}</span>
            </div>

            <div class="pg-edit-grid pg-edit-grid--clean">
              <label>
                <span>Тип обʼєкта</span>
                ${renderCustomSelect('unknownType', getUnknownTypeOptionList(), unknownType)}
              </label>

              <div class="pg-readonly-field">
                <span>Теперішнє значення</span>
                <strong>${mainValue}</strong>
              </div>

              <label class="pg-edit-wide">
                <span>Редагування назви</span>
                <input data-field="mainValue" value="${mainValue}" placeholder="Введи правильну назву" />
              </label>

              ${renderTypeSpecificEditFields(record, unknownType)}
            </div>


            <button class="pg-save-btn" type="button">Зберегти зміни</button>
          </div>
        </div>
      </article>
    `;
  }

  function updateActiveRecordField(field, value) {
    const record = records[state.active];
    if (!record) return;

    record[field] = value;

    if (field === 'unknownType') {
      const config = getUnknownConfig(value);
      record.dataType = config.shortLabel;
      record.status = 'unknown';
    }
  }

  function saveActiveCardEdits(card) {
    const record = records[state.active];
    if (!record) return;

    card.querySelectorAll('[data-field]').forEach((field) => {
      const key = field.dataset.field;
      if (!key) return;

      record[key] = field.dataset.value !== undefined ? field.dataset.value : field.value;
    });

    if (record.mainValue) {
      record.title = `${record.dataType || getUnknownConfig(record.unknownType).shortLabel} ${record.mainValue}`;
      if (record.unknownType === 'uav') record.model = record.mainValue;
      if (record.unknownType === 'settlement') record.settlement = record.mainValue;
      if (record.unknownType === 'station') record.station = record.mainValue;
    }

    showSavePulse(card);
  }

  function showSavePulse(card) {
    card.classList.remove('is-saved-pulse');
    void card.offsetWidth;
    card.classList.add('is-saved-pulse');
  }

  function bindCardDrag(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    card.addEventListener('pointerdown', (event) => {
      if (event.target.closest('input, textarea, select, option, button, label, .pg-select')) return;
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

  function bindCustomSelects(card) {
    card.querySelectorAll('.pg-select').forEach((select) => {
      const head = select.querySelector('.pg-select__head');
      const label = select.querySelector('.pg-select__head span');
      const items = select.querySelectorAll('.pg-select__item');

      const closeOthers = () => {
        card.querySelectorAll('.pg-select.is-open').forEach((opened) => {
          if (opened !== select) opened.classList.remove('is-open');
        });
      };

      head?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeOthers();
        select.classList.toggle('is-open');
      });

      select.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          event.preventDefault();
          event.stopPropagation();
          closeOthers();
          select.classList.toggle('is-open');
        }

        if (event.code === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
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

  function bind() {
    document.querySelectorAll('.pg-card.is-active').forEach((card) => {
      bindCardDrag(card);
      bindCustomSelects(card);

      card.addEventListener('click', (event) => {
        if (event.target.closest('input, textarea, select, option, button, label, .pg-select')) return;
        if (card.classList.contains('is-dragging')) return;
        card.classList.toggle('is-flipped');
      });

      card.querySelector('[data-field="unknownType"]')?.addEventListener('pg-select-change', (event) => {
        event.stopPropagation();
        updateActiveRecordField('unknownType', event.detail.value);
        render();
        qs('.pg-card.is-active')?.classList.add('is-flipped');
      });

      card.querySelector('.pg-save-btn')?.addEventListener('click', (event) => {
        event.stopPropagation();
        saveActiveCardEdits(card);
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

  function pushRecentAction(action, xp, bonusText) {
    const active = records[state.active];
    state.recentActions.unshift({
      action,
      xp,
      bonusText,
      value: active?.mainValue || active?.title || 'Запис',
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    });

    state.recentActions = state.recentActions.slice(0, 6);
  }

  function getActionXp(action) {
    return {
      ignore: 6,
      confirm: 10,
      skip: 3
    }[action] || 3;
  }

  function getActionComboImpact(action, decisionTime) {
    const fast = decisionTime <= 2500;
    const veryFast = decisionTime <= 1300;

    if (action === 'skip') {
      return { comboGain: 0, streakGain: 0, speedBonus: fast ? 1 : 0, isCorrect: false };
    }

    return {
      comboGain: veryFast ? 2 : 1,
      streakGain: 1,
      speedBonus: veryFast ? 4 : fast ? 2 : 0,
      isCorrect: true
    };
  }

  function handleAction(action) {
    if (state.isResolving) return;

    const now = Date.now();
    const decisionTime = now - (state.lastCardShownAt || now);
    const baseXp = getActionXp(action);
    const impact = getActionComboImpact(action, decisionTime);
    const multiplier = getXpMultiplier();
    const rawXp = baseXp + impact.speedBonus;
    const xp = Math.max(1, Math.round(rawXp * multiplier));
    const activeCard = qs('.pg-card.is-active');
    const page = qs('#pendingGamePage');

    state.isResolving = true;
    state.sessionTotal += 1;

    if (impact.isCorrect) {
      state.sessionCorrect += 1;
      state.streak += impact.streakGain;
      state.combo += impact.comboGain;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
    } else if (action === 'skip') {
      state.combo = Math.max(0, state.combo - 1);
    } else {
      state.sessionErrors += 1;
      state.streak = 0;
      state.combo = 0;
    }

    state.xp = Math.min(state.xpMax, state.xp + xp);
    state.todayXp += xp;
    state.accuracy = state.sessionTotal
      ? Math.round((state.sessionCorrect / state.sessionTotal) * 100)
      : state.accuracy;

    const bonusText = impact.speedBonus ? `швидкість +${impact.speedBonus}` : '';
    pushRecentAction(action, xp, bonusText);

    if (page) {
      page.dataset.actionFlash = action;
      page.dataset.actionLabel = getActionLabel(action);
      page.dataset.combo = String(state.combo);
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
      state.lastActionAt = now;
      state.lastCardShownAt = Date.now();

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

    const isTyping = event.target?.closest?.('input, textarea, select, option, .pg-select');

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

    if (event.code === 'KeyA') {
      event.preventDefault();
      handleAction('ignore');
      return;
    }

    if (event.code === 'KeyS') {
      event.preventDefault();
      handleAction('skip');
      return;
    }

    if (event.code === 'KeyD') {
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

  function injectGamificationCss() {
    if (document.getElementById('pendingGameGamificationCss')) return;

    const style = document.createElement('style');
    style.id = 'pendingGameGamificationCss';
    style.textContent = `
      #pendingGamePage .pg-rankbar,
      #pendingGamePage .pg-right-panel,
      #pendingGamePage #pendingGameRightPanel {
        display: none !important;
      }

      #pendingGamePage.pg-page--clean {
        position: relative !important;
        min-height: calc(100vh - 130px) !important;
        padding-top: 0 !important;
        overflow: hidden !important;
      }

      #pendingGamePage .pg-stage {
        min-height: calc(100vh - 270px) !important;
        display: grid !important;
        place-items: center !important;
        padding-top: 78px !important;
      }

      .pg-game-hud {
        position: absolute;
        top: 8px;
        right: clamp(120px, 8vw, 170px);
        z-index: 60;
        display: flex;
        align-items: center;
        gap: 18px;
        pointer-events: none;
      }

      .pg-rank-ring {
        --pg-ring-progress: 0deg;
        width: 138px;
        height: 138px;
        border-radius: 50%;
        position: relative;
        display: grid;
        place-items: center;
        background:
          conic-gradient(from -90deg, #36e6ff 0deg, #8a5cff var(--pg-ring-progress), rgba(255,255,255,.08) var(--pg-ring-progress), rgba(255,255,255,.08) 360deg);
        box-shadow:
          0 0 24px rgba(85,223,255,.26),
          0 0 46px rgba(141,88,255,.22);
        animation: pgRankBreathe 4.6s ease-in-out infinite;
      }

      .pg-rank-ring::before {
        content: '';
        position: absolute;
        inset: 8px;
        border-radius: inherit;
        background: radial-gradient(circle at 45% 35%, rgba(85,223,255,.20), rgba(5,12,38,.96) 62%);
        box-shadow: inset 0 0 22px rgba(0,0,0,.55);
      }

      .pg-rank-ring__core {
        position: relative;
        z-index: 2;
        display: grid;
        place-items: center;
        text-align: center;
        color: #fff;
        line-height: 1.05;
      }

      .pg-rank-ring__core span {
        font-size: 11px;
        font-weight: 900;
        color: #58ddff;
        text-transform: uppercase;
      }

      .pg-rank-ring__core b {
        margin: 5px 0 4px;
        color: #ffd166;
        font-size: 18px;
        text-shadow: 0 0 16px rgba(255,209,102,.42);
      }

      .pg-rank-ring__core strong {
        max-width: 94px;
        color: #fff0a8;
        font-size: 13px;
        font-weight: 1000;
      }

      .pg-hud-stack {
        display: grid;
        gap: 10px;
        min-width: 190px;
      }

      .pg-hud-pill,
      .pg-hud-mini,
      .pg-operator-strip {
        background: rgba(8, 23, 63, .58);
        border: 1px solid rgba(85, 223, 255, .16);
        box-shadow: 0 18px 44px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter: blur(16px);
      }

      .pg-hud-pill {
        padding: 14px 16px;
        border-radius: 22px;
      }

      .pg-hud-pill span,
      .pg-hud-mini span,
      .pg-operator-strip span {
        display: block;
        color: rgba(223,233,255,.62);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      .pg-hud-pill strong {
        display: block;
        margin-top: 4px;
        color: #fff;
        font-size: 20px;
        font-weight: 1000;
      }

      .pg-hud-pill small {
        display: block;
        margin-top: 4px;
        color: rgba(230,240,255,.62);
        font-size: 12px;
        font-weight: 800;
      }

      .pg-hud-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .pg-hud-mini {
        min-height: 66px;
        border-radius: 18px;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 8px;
      }

      .pg-hud-mini strong {
        color: #33ffd1;
        font-size: 18px;
        font-weight: 1000;
      }

      .pg-operator-strip {
        position: absolute;
        left: 50%;
        bottom: 22px;
        transform: translateX(-50%);
        z-index: 55;
        min-width: min(760px, 66vw);
        height: 64px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        gap: 8px;
        padding: 0 18px;
        border-radius: 26px;
      }

      .pg-operator-strip div {
        text-align: center;
      }

      .pg-operator-strip strong {
        display: block;
        margin-top: 3px;
        color: #fff;
        font-size: 18px;
        font-weight: 1000;
      }

      #pendingGamePage[data-action-flash]::after {
        content: attr(data-action-label);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        padding: 20px 34px;
        border-radius: 999px;
        color: #fff;
        font-size: 34px;
        font-weight: 1000;
        letter-spacing: .08em;
        text-transform: uppercase;
        opacity: 0;
        pointer-events: none;
      }

      #pendingGamePage[data-action-flash="confirm"]::after {
        background: rgba(18, 180, 112, .28);
        border: 1px solid rgba(55, 230, 178, .65);
        box-shadow: 0 0 44px rgba(55,230,178,.28);
        animation: pgActionStamp .58s ease both;
      }

      #pendingGamePage[data-action-flash="ignore"]::after {
        background: rgba(210, 34, 74, .28);
        border: 1px solid rgba(255, 95, 126, .7);
        box-shadow: 0 0 44px rgba(255,95,126,.28);
        animation: pgActionStamp .58s ease both;
      }

      #pendingGamePage[data-action-flash="skip"]::after {
        background: rgba(120, 86, 255, .26);
        border: 1px solid rgba(155, 124, 255, .7);
        box-shadow: 0 0 44px rgba(155,124,255,.28);
        animation: pgActionStamp .58s ease both;
      }

      .pg-card.is-key-confirm {
        animation: pgCardConfirm .62s cubic-bezier(.2,.9,.2,1) both !important;
      }

      .pg-card.is-key-ignore {
        animation: pgCardIgnore .62s cubic-bezier(.2,.9,.2,1) both !important;
      }

      .pg-card.is-key-skip {
        animation: pgCardSkip .62s cubic-bezier(.2,.9,.2,1) both !important;
      }

      @keyframes pgCardConfirm {
        0% { transform: perspective(1200px) translateX(0) rotate(0deg) scale(1); opacity: 1; }
        35% { transform: perspective(1200px) translateX(80px) rotate(5deg) scale(1.02); opacity: 1; }
        100% { transform: perspective(1200px) translateX(620px) rotate(15deg) scale(.92); opacity: 0; }
      }

      @keyframes pgCardIgnore {
        0% { transform: perspective(1200px) translateX(0) rotate(0deg) scale(1); opacity: 1; }
        35% { transform: perspective(1200px) translateX(-80px) rotate(-5deg) scale(1.02); opacity: 1; }
        100% { transform: perspective(1200px) translateX(-620px) rotate(-15deg) scale(.92); opacity: 0; }
      }

      @keyframes pgCardSkip {
        0% { transform: perspective(1200px) translateY(0) scale(1); opacity: 1; }
        35% { transform: perspective(1200px) translateY(70px) scale(.98); opacity: 1; }
        100% { transform: perspective(1200px) translateY(520px) scale(.86); opacity: 0; }
      }

      @keyframes pgActionStamp {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(.72); filter: blur(10px); }
        28% { opacity: 1; transform: translate(-50%, -50%) scale(1.04); filter: blur(0); }
        100% { opacity: 0; transform: translate(-50%, -64%) scale(1); filter: blur(2px); }
      }

      @keyframes pgRankBreathe {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.18); }
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    injectGamificationCss();
    render();

    if (!window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__) {
      window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__ = true;
      bindHotkeys();
    }

    if (!window.__LAVASH_PENDING_SELECT_CLOSE_BOUND__) {
      window.__LAVASH_PENDING_SELECT_CLOSE_BOUND__ = true;
      document.addEventListener('click', () => {
        document.querySelectorAll('.pg-select.is-open').forEach((select) => {
          select.classList.remove('is-open');
        });
      });
    }
  }

  window.LAVASH_PENDING_GAME = {
    init
  };
})();
