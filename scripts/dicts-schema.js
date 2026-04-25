(() => {
  const schemaLeft = [
    { id: 'units', label: 'ПІДРОЗДІЛИ', icon: '🛡️' },
    { id: 'personnel', label: 'ПЕРСОНАЛ', icon: '👤' },
    { id: 'vehicles', label: 'ТЕХНІКА', icon: '🚙' },
    { id: 'positions', label: 'ПОЗИЦІЇ', icon: '📍' },
    { id: 'tasks', label: 'ЗАВДАННЯ', icon: '📋' },
    { id: 'events', label: 'ПОДІЇ', icon: '📅' },
    { id: 'stations', label: 'СТАНЦІЇ РЕБ', icon: '📡' },
    { id: 'uav', label: 'БПЛА', icon: '🛸' }
  ];

  const schemaRight = [
    { id: 'countries', label: 'КРАЇНИ', icon: '🌐' },
    { id: 'regions', label: 'РЕГІОНИ', icon: '🗺️' },
    { id: 'settlements', label: 'НАСЕЛЕНІ ПУНКТИ', icon: '🏙️' },
    { id: 'terrain', label: 'ТИПИ МІСЦЕВОСТІ', icon: '⛰️' },
    { id: 'objectTypes', label: 'ТИПИ ОБʼЄКТІВ', icon: '🏢' },
    { id: 'sources', label: 'ДЖЕРЕЛА ІНФОРМАЦІЇ', icon: 'ℹ️' },
    { id: 'statuses', label: 'СТАТУСИ', icon: '✅' },
    { id: 'roles', label: 'РОЛІ КОРИСТУВАЧІВ', icon: '👥' }
  ];

  function renderSchemaCard(item, side, index) {
    return `
      <button
        class="schema-orbit-card schema-orbit-card--${side}"
        type="button"
        data-schema-id="${item.id}"
        style="--i:${index};"
      >
        <span class="schema-orbit-card__icon">${item.icon}</span>
        <span class="schema-orbit-card__label">${item.label}</span>
        <span class="schema-orbit-card__dot"></span>
      </button>
    `;
  }

  function renderSchema() {
    const root = document.getElementById('dictsSchemaRoot');
    if (!root) return;

    root.classList.add('dicts-schema-root');

    root.innerHTML = `
      <div class="dict-schema-orbit">
        <div class="dict-schema-orbit__grid"></div>

        <div class="dict-schema-orbit__axis"></div>

        <section class="dict-schema-orbit__side dict-schema-orbit__side--left">
          <h3 class="dict-schema-orbit__title dict-schema-orbit__title--left">
            ДОВІДНИКИ<br>ОСНОВНІ
          </h3>

          <div class="dict-schema-orbit__cards dict-schema-orbit__cards--left">
            ${schemaLeft.map((item, index) => renderSchemaCard(item, 'left', index)).join('')}
          </div>
        </section>

        <section class="dict-schema-orbit__side dict-schema-orbit__side--right">
          <h3 class="dict-schema-orbit__title dict-schema-orbit__title--right">
            ДОВІДНИКИ<br>ДОДАТКОВІ
          </h3>

          <div class="dict-schema-orbit__cards dict-schema-orbit__cards--right">
            ${schemaRight.map((item, index) => renderSchemaCard(item, 'right', index)).join('')}
          </div>
        </section>

        <div class="dict-schema-orbit__legend">
          <span><i class="legend-dot legend-dot--cyan"></i> Основні довідники</span>
          <span><i class="legend-line"></i> Звʼязки</span>
          <span><i class="legend-dot legend-dot--violet"></i> Додаткові довідники</span>
        </div>
      </div>
    `;
  }

  function initSchemaView() {
    renderSchema();
  }

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView
  };
})();
