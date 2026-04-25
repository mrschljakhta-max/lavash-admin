(() => {
  const ICON_PATH = "../assets/icons/schema/";

  const schemaLeft = [
    { id: "units", label: "ПІДРОЗДІЛИ", icon: "units.svg" },
    { id: "personnel", label: "ПЕРСОНАЛ", icon: "personnel.svg" },
    { id: "vehicles", label: "ТЕХНІКА", icon: "vehicles.svg" },
    { id: "positions", label: "ПОЗИЦІЇ", icon: "positions.svg" },
    { id: "tasks", label: "ЗАВДАННЯ", icon: "tasks.svg" },
    { id: "events", label: "ПОДІЇ", icon: "events.svg" },
    { id: "stations", label: "СТАНЦІЇ РЕБ", icon: "stations.svg" },
    { id: "uav", label: "БПЛА", icon: "uav.svg" }
  ];

  const schemaRight = [
    { id: "countries", label: "КРАЇНИ", icon: "countries.svg" },
    { id: "regions", label: "РЕГІОНИ", icon: "regions.svg" },
    { id: "settlements", label: "НАСЕЛЕНІ ПУНКТИ", icon: "settlements.svg" },
    { id: "terrain", label: "ТИПИ МІСЦЕВОСТІ", icon: "terrain.svg" },
    { id: "objectTypes", label: "ТИПИ ОБʼЄКТІВ", icon: "object-types.svg" },
    { id: "sources", label: "ДЖЕРЕЛА ІНФОРМАЦІЇ", icon: "sources.svg" },
    { id: "statuses", label: "СТАТУСИ", icon: "statuses.svg" },
    { id: "roles", label: "РОЛІ КОРИСТУВАЧІВ", icon: "roles.svg" }
  ];

  const schemaRelations = [
    { from: "units", to: "regions" },
    { from: "units", to: "settlements" },
    { from: "personnel", to: "roles" },
    { from: "vehicles", to: "objectTypes" },
    { from: "positions", to: "settlements" },
    { from: "tasks", to: "statuses" },
    { from: "events", to: "sources" },
    { from: "events", to: "statuses" },
    { from: "stations", to: "settlements" },
    { from: "stations", to: "terrain" },
    { from: "uav", to: "objectTypes" },
    { from: "uav", to: "sources" }
  ];

  const state = {
    positions: new Map()
  };

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function buildPositions() {
    state.positions.clear();

    const centerX = 500;
    const centerY = 340;
    const radiusX = 350;
    const radiusY = 275;

    const angleStart = -68;
    const angleEnd = 68;

    function place(items, side) {
      const count = items.length;

      items.forEach((item, index) => {
        const t = count === 1 ? 0.5 : index / (count - 1);
        const angle = angleStart + (angleEnd - angleStart) * t;
        const rad = degToRad(angle);

        const x =
          side === "left"
            ? centerX - radiusX * Math.cos(rad)
            : centerX + radiusX * Math.cos(rad);

        const y = centerY + radiusY * Math.sin(rad);

        state.positions.set(item.id, {
          ...item,
          side,
          x,
          y
        });
      });
    }

    place(schemaLeft, "left");
    place(schemaRight, "right");
  }

  function getNode(id) {
    return state.positions.get(id);
  }

  function getAnchor(id) {
    const node = getNode(id);

    if (!node) {
      return { x: 500, y: 340 };
    }

    return {
      x: node.side === "left" ? node.x + 126 : node.x - 126,
      y: node.y
    };
  }

  function renderLine(relation, index) {
    const a = getAnchor(relation.from);
    const b = getAnchor(relation.to);

    const hubX = 500;
    const hubY = 340 + ((index % 7) - 3) * 14;

    return `
      <path
        class="schema-link"
        data-from="${relation.from}"
        data-to="${relation.to}"
        style="animation-delay:${index * -0.6}s"
        d="
          M ${a.x} ${a.y}
          C ${a.x + 95} ${a.y}, ${hubX - 90} ${hubY}, ${hubX} ${hubY}
          C ${hubX + 90} ${hubY}, ${b.x - 95} ${b.y}, ${b.x} ${b.y}
        "
      />
    `;
  }

  function renderCard(node) {
    return `
      <button
        class="schema-orbit-card schema-orbit-card--${node.side}"
        style="left:${node.x}px; top:${node.y}px"
        data-id="${node.id}"
        type="button"
      >
        <span class="schema-orbit-card__icon">
          <img src="${ICON_PATH + node.icon}" alt="" draggable="false" />
        </span>

        <span class="schema-orbit-card__label">${node.label}</span>
        <span class="schema-orbit-card__dot"></span>
      </button>
    `;
  }

  function setActiveNode(id) {
    document.querySelectorAll(".schema-orbit-card").forEach((card) => {
      const cardId = card.dataset.id;

      const related = schemaRelations.some(({ from, to }) => {
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
      console.warn("[dicts-schema] #dictsSchemaRoot не знайдено.");
      return;
    }

    buildPositions();

    const nodes = Array.from(state.positions.values());

    root.classList.add("dicts-schema-root");

    root.innerHTML = `
      <div class="dict-schema-orbit">
        <div class="dict-schema-orbit__grid"></div>

        <div class="schema-shell schema-shell--left">
          <span></span><span></span><span></span><span></span>
        </div>

        <div class="schema-shell schema-shell--right">
          <span></span><span></span><span></span><span></span>
        </div>

        <div class="dict-schema-orbit__axis"></div>

        <div class="schema-hub">
          <span class="schema-hub__ring schema-hub__ring--one"></span>
          <span class="schema-hub__ring schema-hub__ring--two"></span>
          <span class="schema-hub__ring schema-hub__ring--three"></span>
          <span class="schema-hub__core"></span>
        </div>

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
          ${nodes.map(renderCard).join("")}
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
