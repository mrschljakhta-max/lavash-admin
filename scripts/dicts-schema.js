(() => {
  const schemaLeft = [
    { id: 'units', label: 'ПІДРОЗДІЛИ', icon: '🛡️', x: 36, y: 18 },
    { id: 'personnel', label: 'ПЕРСОНАЛ', icon: '👤', x: 32, y: 27 },
    { id: 'vehicles', label: 'ТЕХНІКА', icon: '🚙', x: 29, y: 36 },
    { id: 'positions', label: 'ПОЗИЦІЇ', icon: '📍', x: 27, y: 45 },
    { id: 'tasks', label: 'ЗАВДАННЯ', icon: '📋', x: 27, y: 54 },
    { id: 'events', label: 'ПОДІЇ', icon: '📅', x: 29, y: 63 },
    { id: 'stations', label: 'СТАНЦІЇ РЕБ', icon: '📡', x: 32, y: 72 },
    { id: 'uav', label: 'БПЛА', icon: '🛸', x: 36, y: 81 }
  ];

  const schemaRight = [
    { id: 'countries', label: 'КРАЇНИ', icon: '🌐', x: 64, y: 18 },
    { id: 'regions', label: 'РЕГІОНИ', icon: '🗺️', x: 68, y: 27 },
    { id: 'settlements', label: 'НАСЕЛЕНІ ПУНКТИ', icon: '🏙️', x: 71, y: 36 },
    { id: 'terrain', label: 'ТИПИ МІСЦЕВОСТІ', icon: '⛰️', x: 73, y: 45 },
    { id: 'objectTypes', label: 'ТИПИ ОБʼЄКТІВ', icon: '🏢', x: 73, y: 54 },
    { id: 'sources', label: 'ДЖЕРЕЛА ІНФОРМАЦІЇ', icon: 'ℹ️', x: 71, y: 63 },
    { id: 'statuses', label: 'СТАТУСИ', icon: '✅', x: 68, y: 72 },
    { id: 'roles', label: 'РОЛІ КОРИСТУВАЧІВ', icon: '👥', x: 64, y: 81 }
  ];

  const schemaRelations = [
    ['units', 'regions'],
    ['units', 'settlements'],
    ['personnel', 'roles'],
    ['vehicles', 'objectTypes'],
    ['positions', 'settlements'],
    ['tasks', 'statuses'],
    ['events', 'sources'],
    ['events', 'statuses'],
    ['stations', 'settlements'],
    ['stations', 'terrain'],
    ['uav', 'objectTypes'],
    ['uav', 'sources']
  ];

  function allNodes() {
    return [...schemaLeft, ...schemaRight];
  }

  function getNode(id) {
    return allNodes().find((item) => item.id === id);
  }

  function getPoint(id) {
    const node = getNode(id);
    if (!node) return { x: 500, y: 260 };

    const isLeft = schemaLeft.some((item) => item.id === id);
    const x = node.x * 10 + (isLeft ? 112 : -112);
    const y = node.y * 5.2;

    return { x, y };
  }

  function renderLine([from, to], index) {
    const a = getPoint(from);
    const b = getPoint(to);

    const c1x = a.x + 160;
    const c2x = b.x - 160;
    const midShift = index % 2 === 0 ? -20 : 20;

    return `
      <path
        class="schema-link"
        data-from="${from}"
        data-to="${to}"
        d="M ${a.x} ${a.y} C ${c1x} ${a.y + midShift}, ${c2x} ${b.y - midShift}, ${b.x} ${b.y}"
      />
    `;
  }

  function renderSchemaCard(item, side) {
    return `
      <button
        class="schema-orbit-card schema-orbit-card--${side}"
        type="button"
        data-schema-id="${item.id}"
        style="left:${item.x}%; top:${item.y}%;"
      >
        <span class="schema-orbit-card__icon">${item.icon}</span>
        <span class="schema-orbit-card__label">${item.label}</span>
        <span class="schema-orbit-card__dot"></span>
      </button>
    `;
  }

  function setActiveNode(id) {
    const root = document.getElementById('dictsSchemaRoot');
    if (!root) return;

    root.dataset.activeNode = id || '';

    document.querySelectorAll('.schema-orbit-card').forEach((card) => {
      const cardId = card.dataset.schemaId;
      const related = schemaRelations.some(([from, to]) => {
        return (from === id && to === cardId) || (to === id && from === cardId);
      });

      card.classList.toggle('is-focused', cardId === id);
      card.classList.toggle('is-related', related);
      card.classList.toggle('is-dimmed', Boolean(id) && cardId !== id && !related);
    });

    document.querySelectorAll('.schema-link').forEach((line) => {
      const active = line.dataset.from === id || line.dataset.to === id;
      line.classList.toggle('is-active', active);
      line.classList.toggle('is-muted', Boolean(id) && !active);
    });
  }

  function bindSchemaEvents() {
    document.querySelectorAll('.schema-orbit-card').forEach((card) => {
      card.addEventListener('mouseenter', () => setActiveNode(card.dataset.schemaId));
      card.addEventListener('mouseleave', () => setActiveNode(null));
      card.addEventListener('click', () => {
        console.log('open dictionary:', card.dataset.schemaId);
      });
    });
  }

  function renderSchema() {
    const root = document.getElementById('dictsSchemaRoot');
    if (!root) return;

    root.classList.add('dicts-schema-root');

    root.innerHTML = `
      <div class="dict-schema-orbit">
        <div class="dict-schema-orbit__grid"></div>
        <div class="dict-schema-orbit__axis"></div>

        <svg class="dict-schema-orbit__links" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="schemaLinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#14f7ee" />
              <stop offset="100%" stop-color="#9558ff" />
            </linearGradient>
          </defs>
          ${schemaRelations.map(renderLine).join('')}
        </svg>

        <h3 class="dict-schema-orbit__title dict-schema-orbit__title--left">
          ДОВІДНИКИ<br>ОСНОВНІ
        </h3>

        <h3 class="dict-schema-orbit__title dict-schema-orbit__title--right">
          ДОВІДНИКИ<br>ДОДАТКОВІ
        </h3>

        <div class="dict-schema-orbit__cards">
          ${schemaLeft.map((item) => renderSchemaCard(item, 'left')).join('')}
          ${schemaRight.map((item) => renderSchemaCard(item, 'right')).join('')}
        </div>
      </div>
    `;

    bindSchemaEvents();
  }

  function initSchemaView() {
    renderSchema();
  }

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView
  };
})();
