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
    const activeUnknownConfig = getUnknownConfig(activeRecord.unknownType || 'record');
    document.documentElement.style.setProperty('--pg-accent-status', activeUnknownConfig.color || getStatusColor(activeRecord.status));

    root.innerHTML = `
      <section class="pg-page pg-page--game" id="pendingGamePage">
        <div class="pg-bg-orb pg-bg-orb--left"></div>
        <div class="pg-bg-orb pg-bg-orb--right"></div>

        <div class="pg-game-hud" aria-hidden="true">
          <aside class="pg-hud-rank-card">
            <div class="pg-rank-emblem" aria-hidden="true">
              <img src="../assets/ranks/rank-analyst-ii.svg" alt="">
            </div>
            <div class="pg-rank-info">
              <span class="pg-hud-rank-card__kicker">Ранг</span>
              <strong>${state.rank}</strong>
              <small>Рівень ${state.level}</small>
            </div>
          </aside>

          <aside
            class="pg-hud-xp-card"
            style="--pg-ring-progress:${progress * 3.6}deg; --pg-xp-progress:${progress}%; --pg-ring-accent:${activeUnknownConfig.color};"
          >
            <div class="pg-hud-xp-ring">
              <div class="pg-hud-xp-ring__core">
                <strong>${state.xp}</strong>
                <span>XP</span>
              </div>
            </div>
            <div class="pg-hud-xp-info">
              <span>XP</span>
              <strong>${state.xp.toLocaleString('uk-UA')}</strong>
              <div class="pg-hud-xp-bar"><i></i></div>
              <small>${state.xpMax.toLocaleString('uk-UA')} до наступного рівня</small>
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

       <div class="pg-xp-pop" id="pgXpPop">+10 XP</div>
      </section>
    `;

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
        color: '#ffd84d',
        bg1: 'rgba(255, 196, 45, .96)',
        bg2: 'rgba(142, 86, 0, .96)'
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
    const mainValue = record.mainValue || record.model || record.settlement || record.title || 'Невідоме значення';
    const visualImage = getVisualImage(record, unknownType);

    return `
      <article
        class="pg-card ${active} pg-card--${record.status} pg-card--type-${unknownType}"
        data-index="${index}"
        data-slot="${slot}"
        data-status="${record.status || 'unknown'}"
        data-unknown-type="${unknownType}"
        data-type="${unknownType}"
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

            <div class="pg-card__content">
              <div class="pg-data">
                <div class="pg-data__value">${mainValue}</div>
              </div>

              <div class="pg-visual pg-visual--${unknownType}">
                <div class="pg-radar-core"></div>

                <img
                  class="pg-uav-img pg-unknown-visual-img"
                  src="${visualImage}"
                  alt="${mainValue}"
                  loading="lazy"
                />
              </div>
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
      card.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) rotate(${rotate}deg) scale(1)`;

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



  function bindReactiveBeam(card) {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

      card.style.setProperty('--beam-x', x.toFixed(3));
      card.style.setProperty('--beam-y', y.toFixed(3));
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--beam-x', '.50');
      card.style.setProperty('--beam-y', '.50');
    });
  }

  function bindCardTilt(card) {
    card.addEventListener('pointermove', (event) => {
      if (card.classList.contains('is-dragging')) return;
      if (card.classList.contains('is-flipped')) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = y * -8;
      const rotateY = x * 10;

      card.style.setProperty('--pg-tilt-x', `${rotateX}deg`);
      card.style.setProperty('--pg-tilt-y', `${rotateY}deg`);
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--pg-tilt-x');
      card.style.removeProperty('--pg-tilt-y');
    });
  }


  function bindRadarInteraction(card) {
    const radar = card.querySelector('.pg-radar-core');
    const uav = card.querySelector('.pg-uav-img');

    if (!radar) return;

    card.addEventListener('pointermove', (event) => {
      if (card.classList.contains('is-dragging')) return;
      if (card.classList.contains('is-flipped')) return;

      const rect = card.getBoundingClientRect();

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      radar.style.setProperty('--pg-radar-angle', `${angle}deg`);
      radar.classList.add('is-tracking');

      if (uav) {
        const px = dx * 0.018;
        const py = dy * 0.018;

        uav.style.setProperty('--pg-uav-x', `${px}px`);
        uav.style.setProperty('--pg-uav-y', `${py}px`);
        uav.classList.add('is-parallax');
      }
    });

    card.addEventListener('pointerleave', () => {
      radar.classList.remove('is-tracking');
      radar.style.removeProperty('--pg-radar-angle');

      if (uav) {
        uav.classList.remove('is-parallax');
        uav.style.removeProperty('--pg-uav-x');
        uav.style.removeProperty('--pg-uav-y');
      }
    });
  }


  function bindRadarLock(card) {
    let lockTimer = null;

    const clearLock = () => {
      if (lockTimer) {
        clearTimeout(lockTimer);
        lockTimer = null;
      }
      card.classList.remove('is-locked');
    };

    card.addEventListener('pointerenter', () => {
      clearLock();

      lockTimer = setTimeout(() => {
        if (!card.classList.contains('is-dragging') && !card.classList.contains('is-flipped')) {
          card.classList.add('is-locked');
        }
      }, 420);
    });

    card.addEventListener('pointerleave', clearLock);

    card.addEventListener('pointerdown', () => {
      if (card.classList.contains('is-flipped')) return;
      card.classList.remove('is-locked');
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
      bindCardTilt(card);
      bindReactiveBeam(card);
      bindRadarInteraction(card);
      bindRadarLock(card);
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

    if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.code === 'KeyA') {
      event.preventDefault();
      handleAction('ignore');
      return;
    }

    if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.code === 'KeyS') {
      event.preventDefault();
      handleAction('skip');
      return;
    }

    if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.code === 'KeyD') {
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
/* ===== BACK CARD WHEEL LOCK ===== */

(function lockBackCardWheel() {
  document.addEventListener(
    "wheel",
    function (event) {
      const backCard = event.target.closest(
        '.pg-card[data-slot="0"] .pg-card__back'
      );

      if (!backCard) return;

      const scrollable = event.target.closest(
        '.pg-card__back, .pg-card__back form, .pg-card__back [class*="form"], .pg-card__back [class*="edit"]'
      );

      if (!scrollable) return;

      const canScroll =
        scrollable.scrollHeight > scrollable.clientHeight ||
        backCard.scrollHeight > backCard.clientHeight;

      if (canScroll) {
        event.stopPropagation();
      }
    },
    { capture: true, passive: false }
  );
})();
