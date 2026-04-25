(() => {
  const ICON_PATH = "../assets/icons/schema/";

  const schemaLeft = [
    { id: "units", label: "ПІДРОЗДІЛИ", icon: "units.svg", x: 23, y: 17 },
    { id: "personnel", label: "ПЕРСОНАЛ", icon: "personnel.svg", x: 20, y: 26 },
    { id: "vehicles", label: "ТЕХНІКА", icon: "vehicles.svg", x: 18, y: 35 },
    { id: "positions", label: "ПОЗИЦІЇ", icon: "positions.svg", x: 16.8, y: 44 },
    { id: "tasks", label: "ЗАВДАННЯ", icon: "tasks.svg", x: 16.8, y: 53 },
    { id: "events", label: "ПОДІЇ", icon: "events.svg", x: 18, y: 62 },
    { id: "stations", label: "СТАНЦІЇ РЕБ", icon: "stations.svg", x: 20, y: 71 },
    { id: "uav", label: "БПЛА", icon: "uav.svg", x: 23, y: 80 }
  ];

  const schemaRight = [
    { id: "countries", label: "КРАЇНИ", icon: "countries.svg", x: 77, y: 17 },
    { id: "regions", label: "РЕГІОНИ", icon: "regions.svg", x: 80, y: 26 },
    { id: "settlements", label: "НАСЕЛЕНІ ПУНКТИ", icon: "settlements.svg", x: 82, y: 35 },
    { id: "terrain", label: "ТИПИ МІСЦЕВОСТІ", icon: "terrain.svg", x: 83.2, y: 44 },
    { id: "objectTypes", label: "ТИПИ ОБʼЄКТІВ", icon: "object-types.svg", x: 83.2, y: 53 },
    { id: "sources", label: "ДЖЕРЕЛА ІНФОРМАЦІЇ", icon: "sources.svg", x: 82, y: 62 },
    { id: "statuses", label: "СТАТУСИ", icon: "statuses.svg", x: 80, y: 71 },
    { id: "roles", label: "РОЛІ КОРИСТУВАЧІВ", icon: "roles.svg", x: 77, y: 80 }
  ];

  const schemaRelations = [
    ["units", "regions"],
    ["units", "settlements"],
    ["personnel", "roles"],
    ["vehicles", "objectTypes"],
    ["positions", "settlements"],
    ["tasks", "statuses"],
    ["events", "sources"],
    ["events", "statuses"],
    ["stations", "settlements"],
    ["stations", "terrain"],
    ["uav", "objectTypes"],
    ["uav", "sources"]
  ];

  const allNodes = () => [...schemaLeft, ...schemaRight];

  function getNode(id) {
    return allNodes().find((node) => node.id === id);
  }

  function getPoint(id) {
    const node = getNode(id);

    if (!node) {
      return { x: 500, y: 340 };
    }

    const isLeft = schemaLeft.some((item) => item.id === id);

    return {
      x: node.x * 10 + (isLeft ? 132 : -132),
      y: node.y * 6.8
    };
  }

  function renderLine([from, to], index) {
    const a = getPoint(from);
    const b = getPoint(to);

    const centerX = 500;
    const centerY = 340 + ((index % 7) - 3) * 22;

    return `
      <path
        class="schema-link"
        data-from="${from}"
        data-to="${to}"
        d="
          M ${a.x} ${a.y}
          C ${a.x + 140} ${a.y}, ${centerX - 96} ${centerY}, ${centerX} ${centerY}
          C ${centerX + 96} ${centerY}, ${b.x - 140} ${b.y}, ${b.x} ${b.y}
        "
      />
    `;
  }

  function renderCard(item, side) {
    return `
      <button
        class="schema-orbit-card schema-orbit-card--${side}"
        style="left:${item.x}%; top:${item.y}%"
        data-id="${item.id}"
        type="button"
      >
        <span class="schema-orbit-card__icon">
          <img src="${ICON_PATH + item.icon}" alt="" draggable="false" />
        </span>

        <span class="schema-orbit-card__label">${item.label}</span>
        <span class="schema-orbit-card__dot"></span>
      </button>
    `;
  }

  function setActiveNode(id) {
    document.querySelectorAll(".schema-orbit-card").forEach((card) => {
      const cardId = card.dataset.id;

      const related = schemaRelations.some(([from, to]) => {
        return (from === id && to === cardId) || (to === id && from === cardId);
      });

      card.classList.toggle("is-focused", cardId === id);
      card.classList.toggle("is-related", related);
      card.classList.toggle("is-dimmed", Boolean(id) && cardId !== id && !related);
    });

    document.querySelectorAll(".schema-link").forEach((line) => {
      const active = line.dataset.from === id || line.dataset.to === id;

      line.classList.toggle("is-active", active);
      line.classList.toggle("is-muted", Boolean(id) && !active);
    });
  }

  function bindSchemaEvents() {
    document.querySelectorAll(".schema-orbit-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        setActiveNode(card.dataset.id);
      });

      card.addEventListener("mouseleave", () => {
        setActiveNode(null);
      });

      card.addEventListener("click", () => {
        console.log("open dictionary:", card.dataset.id);
      });
    });
  }

  function renderSchema() {
    const root = document.getElementById("dictsSchemaRoot");

    if (!root) {
      console.warn("[dicts-schema] #dictsSchemaRoot не знайдено. Схему не відрендерено.");
      return;
    }

    root.classList.add("dicts-schema-root");

    root.innerHTML = `
      <div class="dict-schema-orbit">
        <div class="dict-schema-orbit__grid"></div>

        <div class="dict-schema-orbit__arc dict-schema-orbit__arc--left"></div>
        <div class="dict-schema-orbit__arc dict-schema-orbit__arc--right"></div>

        <div class="dict-schema-orbit__axis"></div>
        <div class="dict-schema-orbit__core"></div>

        <svg
          class="dict-schema-orbit__links"
          viewBox="0 0 1000 680"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="schemaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#14f7ee" />
              <stop offset="50%" stop-color="#4fa8ff" />
              <stop offset="100%" stop-color="#9558ff" />
            </linearGradient>
          </defs>

          ${schemaRelations.map(renderLine).join("")}
        </svg>

        <div class="dict-schema-orbit__cards">
          ${schemaLeft.map((item) => renderCard(item, "left")).join("")}
          ${schemaRight.map((item) => renderCard(item, "right")).join("")}
        </div>
      </div>
    `;

    bindSchemaEvents();
  }

  function initSchemaViewSafe() {
    requestAnimationFrame(() => {
      renderSchema();
    });
  }

  window.renderDictsSchemaNow = initSchemaViewSafe;

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView: initSchemaViewSafe,
    renderSchema
  };
})();
