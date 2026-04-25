(() => {
  const ICON_PATH = "../assets/icons/schema/";

  const schemaLeft = [
    { id: "units", label: "ПІДРОЗДІЛИ", icon: "units.svg", x: 26, y: 18 },
    { id: "personnel", label: "ПЕРСОНАЛ", icon: "personnel.svg", x: 22, y: 27 },
    { id: "vehicles", label: "ТЕХНІКА", icon: "vehicles.svg", x: 19, y: 36 },
    { id: "positions", label: "ПОЗИЦІЇ", icon: "positions.svg", x: 17, y: 45 },
    { id: "tasks", label: "ЗАВДАННЯ", icon: "tasks.svg", x: 17, y: 54 },
    { id: "events", label: "ПОДІЇ", icon: "events.svg", x: 19, y: 63 },
    { id: "stations", label: "СТАНЦІЇ РЕБ", icon: "stations.svg", x: 22, y: 72 },
    { id: "uav", label: "БПЛА", icon: "uav.svg", x: 26, y: 81 }
  ];

  const schemaRight = [
    { id: "countries", label: "КРАЇНИ", icon: "countries.svg", x: 74, y: 18 },
    { id: "regions", label: "РЕГІОНИ", icon: "regions.svg", x: 78, y: 27 },
    { id: "settlements", label: "НАСЕЛЕНІ ПУНКТИ", icon: "settlements.svg", x: 81, y: 36 },
    { id: "terrain", label: "ТИПИ МІСЦЕВОСТІ", icon: "terrain.svg", x: 83, y: 45 },
    { id: "objectTypes", label: "ТИПИ ОБʼЄКТІВ", icon: "object-types.svg", x: 83, y: 54 },
    { id: "sources", label: "ДЖЕРЕЛА ІНФОРМАЦІЇ", icon: "sources.svg", x: 81, y: 63 },
    { id: "statuses", label: "СТАТУСИ", icon: "statuses.svg", x: 78, y: 72 },
    { id: "roles", label: "РОЛІ КОРИСТУВАЧІВ", icon: "roles.svg", x: 74, y: 81 }
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
    return allNodes().find((n) => n.id === id);
  }

  function getPoint(id) {
    const n = getNode(id);

    if (!n) {
      return { x: 500, y: 340 };
    }

    const isLeft = schemaLeft.some((item) => item.id === id);

    return {
      x: n.x * 10 + (isLeft ? 115 : -115),
      y: n.y * 6.2
    };
  }

  function renderLine([from, to], index) {
    const a = getPoint(from);
    const b = getPoint(to);

    const centerX = 500;
    const centerY = 340 + ((index % 6) - 3) * 18;

    return `
      <path
        class="schema-link"
        data-from="${from}"
        data-to="${to}"
        d="
          M ${a.x} ${a.y}
          C ${a.x + 120} ${a.y}, ${centerX - 80} ${centerY}, ${centerX} ${centerY}
          C ${centerX + 80} ${centerY}, ${b.x - 120} ${b.y}, ${b.x} ${b.y}
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
