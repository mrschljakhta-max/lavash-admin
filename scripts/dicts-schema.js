(() => {

  const ICON_PATH = "../assets/icons/schema/";

  const schemaLeft = [
    { id: 'units', label: 'ПІДРОЗДІЛИ', icon: 'units.svg', x: 36, y: 18 },
    { id: 'personnel', label: 'ПЕРСОНАЛ', icon: 'personnel.svg', x: 32, y: 27 },
    { id: 'vehicles', label: 'ТЕХНІКА', icon: 'vehicles.svg', x: 29, y: 36 },
    { id: 'positions', label: 'ПОЗИЦІЇ', icon: 'positions.svg', x: 27, y: 45 },
    { id: 'tasks', label: 'ЗАВДАННЯ', icon: 'tasks.svg', x: 27, y: 54 },
    { id: 'events', label: 'ПОДІЇ', icon: 'events.svg', x: 29, y: 63 },
    { id: 'stations', label: 'СТАНЦІЇ РЕБ', icon: 'stations.svg', x: 32, y: 72 },
    { id: 'uav', label: 'БПЛА', icon: 'uav.svg', x: 36, y: 81 }
  ];

  const schemaRight = [
    { id: 'countries', label: 'КРАЇНИ', icon: 'countries.svg', x: 64, y: 18 },
    { id: 'regions', label: 'РЕГІОНИ', icon: 'regions.svg', x: 68, y: 27 },
    { id: 'settlements', label: 'НАСЕЛЕНІ ПУНКТИ', icon: 'settlements.svg', x: 71, y: 36 },
    { id: 'terrain', label: 'ТИПИ МІСЦЕВОСТІ', icon: 'terrain.svg', x: 73, y: 45 },
    { id: 'objectTypes', label: 'ТИПИ ОБʼЄКТІВ', icon: 'object-types.svg', x: 73, y: 54 },
    { id: 'sources', label: 'ДЖЕРЕЛА ІНФОРМАЦІЇ', icon: 'sources.svg', x: 71, y: 63 },
    { id: 'statuses', label: 'СТАТУСИ', icon: 'statuses.svg', x: 68, y: 72 },
    { id: 'roles', label: 'РОЛІ КОРИСТУВАЧІВ', icon: 'roles.svg', x: 64, y: 81 }
  ];

  const schemaRelations = [
    ['units','regions'],
    ['units','settlements'],
    ['personnel','roles'],
    ['vehicles','objectTypes'],
    ['positions','settlements'],
    ['tasks','statuses'],
    ['events','sources'],
    ['events','statuses'],
    ['stations','settlements'],
    ['stations','terrain'],
    ['uav','objectTypes'],
    ['uav','sources']
  ];

  function getPoint(node) {
    const isLeft = schemaLeft.some(n => n.id === node.id);
    return {
      x: node.x * 10 + (isLeft ? 110 : -110),
      y: node.y * 5.2
    };
  }

  function renderLine([from, to], i) {
    const a = getPoint([...schemaLeft, ...schemaRight].find(n => n.id === from));
    const b = getPoint([...schemaLeft, ...schemaRight].find(n => n.id === to));

    const curve = i % 2 ? 40 : -40;

    return `
      <path
        class="schema-link"
        data-from="${from}"
        data-to="${to}"
        d="M ${a.x} ${a.y} C ${a.x + 160} ${a.y + curve}, ${b.x - 160} ${b.y - curve}, ${b.x} ${b.y}"
      />
    `;
  }

  function renderCard(item, side) {
    return `
      <button
        class="schema-orbit-card schema-orbit-card--${side}"
        style="left:${item.x}%; top:${item.y}%"
        data-id="${item.id}"
      >
        <span class="schema-orbit-card__icon">
          <img src="${ICON_PATH + item.icon}" />
        </span>
        <span class="schema-orbit-card__label">${item.label}</span>
        <span class="schema-orbit-card__dot"></span>
      </button>
    `;
  }

  function renderSchema() {
    const root = document.getElementById("dictsSchemaRoot");
    if (!root) return;

    root.innerHTML = `
      <div class="dict-schema-orbit">

        <div class="dict-schema-orbit__grid"></div>
        <div class="dict-schema-orbit__axis"></div>

        <svg class="dict-schema-orbit__links" viewBox="0 0 1000 520">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stop-color="#14f7ee"/>
              <stop offset="100%" stop-color="#9558ff"/>
            </linearGradient>
          </defs>
          ${schemaRelations.map(renderLine).join("")}
        </svg>

        <div class="dict-schema-orbit__cards">
          ${schemaLeft.map(i => renderCard(i, 'left')).join("")}
          ${schemaRight.map(i => renderCard(i, 'right')).join("")}
        </div>

      </div>
    `;
  }

  function initSchemaView() {
    renderSchema();
  }

  window.LAVASH_DICTS_SCHEMA = { initSchemaView };

})();
