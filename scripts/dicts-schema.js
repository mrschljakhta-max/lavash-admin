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
    { from: "units", to: "regions", power: "primary" },
    { from: "units", to: "settlements", power: "secondary" },
    { from: "personnel", to: "roles", power: "secondary" },
    { from: "vehicles", to: "objectTypes", power: "primary" },
    { from: "positions", to: "settlements", power: "primary" },
    { from: "tasks", to: "statuses", power: "primary" },
    { from: "events", to: "sources", power: "secondary" },
    { from: "events", to: "statuses", power: "secondary" },
    { from: "stations", to: "settlements", power: "primary" },
    { from: "stations", to: "terrain", power: "secondary" },
    { from: "uav", to: "objectTypes", power: "primary" },
    { from: "uav", to: "sources", power: "secondary" },

    { from: "units", to: "roles", power: "bg" },
    { from: "vehicles", to: "settlements", power: "bg" },
    { from: "positions", to: "terrain", power: "bg" },
    { from: "stations", to: "statuses", power: "bg" },
    { from: "tasks", to: "sources", power: "bg" },
    { from: "uav", to: "settlements", power: "bg" }
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

    const radiusX = 345;
    const radiusY = 286;

    const angleStart = -112;
    const angleEnd = 112;

    function place(items, side) {
      const count = items.length;

      items.forEach((item, index) => {
        const t = count === 1 ? 0.5 : index / (count - 1);
        const angle = angleStart + (angleEnd - angleStart) * t;
        const rad = degToRad(angle);

        const arcX = Math.cos(rad);
        const arcY = Math.sin(rad);

        const x = side === "left"
          ? centerX - Math.abs(radiusX * arcX)
          : centerX + Math.abs(radiusX * arcX);

        const y = centerY + radiusY * arcY;

        state.positions.set(item.id, {
          ...item,
          side,
          x,
          y,
          angle
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
      x: node.side === "left" ? node.x + 128 : node.x - 128,
      y: node.y
    };
  }

  function renderLine(relation, index) {
    const a = getAnchor(relation.from);
    const b = getAnchor(relation.to);

    const hubX = 500;
    const hubY = 340 + ((index % 9) - 4) * 9;

    return `
      <path
        class="schema-link schema-link--${relation.power || "secondary"}"
        data-from="${relation.from}"
        data-to="${relation.to}"
        style="animation-delay:${index * -0.72}s"
        d="
          M ${a.x} ${a.y}
          C ${a.x + 115} ${a.y}, ${hubX - 82} ${hubY}, ${hubX} ${hubY}
          C ${hubX + 82} ${hubY}, ${b.x - 115} ${b.y}, ${b.x} ${b.y}
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

    document.querySelector(".schema-hub")?.classList.toggle("is-hot", Boolean(id));
  }

  function bindSchemaEvents() {
    document.querySelectorAll(".schema-orbit-card").forEach((card) => {
      card.addEventListener("mouseenter", () => setActiveNode(card.dataset.id));
      card.addEventListener("mouseleave", () => setActiveNode(null));

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
        <div class="schema-stars"></div>

        <div class="schema-shell schema-shell--left">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <div class="schema-shell schema-shell--right">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <div class="schema-orbit-ring schema-orbit-ring--left"></div>
        <div class="schema-orbit-ring schema-orbit-ring--right"></div>

        <div class="dict-schema-orbit__axis"></div>

        <div class="schema-hub">
          <span class="schema-hub__halo"></span>
          <span class="schema-hub__ring schema-hub__ring--one"></span>
          <span class="schema-hub__ring schema-hub__ring--two"></span>
          <span class="schema-hub__ring schema-hub__ring--three"></span>
          <span class="schema-hub__diamond"></span>
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
              <stop offset="48%" stop-color="#4fa8ff" />
              <stop offset="100%" stop-color="#9558ff" />
            </linearGradient>

            <filter id="schemaGlow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
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
    requestAnimationFrame(renderSchema);
  }

  window.renderDictsSchemaNow = initSchemaViewSafe;

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView: initSchemaViewSafe,
    renderSchema
  };
})();
