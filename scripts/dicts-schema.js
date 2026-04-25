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

  const relations = [
    { from: "units", to: "regions", type: "primary" },
    { from: "units", to: "settlements", type: "primary" },
    { from: "personnel", to: "roles", type: "secondary" },
    { from: "vehicles", to: "objectTypes", type: "primary" },
    { from: "positions", to: "settlements", type: "primary" },
    { from: "tasks", to: "statuses", type: "primary" },
    { from: "events", to: "sources", type: "secondary" },
    { from: "events", to: "statuses", type: "secondary" },
    { from: "stations", to: "settlements", type: "primary" },
    { from: "stations", to: "terrain", type: "secondary" },
    { from: "uav", to: "objectTypes", type: "primary" },
    { from: "uav", to: "sources", type: "secondary" }
  ];

  const state = {
    nodes: []
  };

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function buildNodes() {
    const centerX = 500;
    const centerY = 340;

    const radiusX = 300;
    const radiusY = 340;

    const angleStart = -110;
    const angleEnd = 110;

    const visualCompressY = 0.78;
    const cardOffsetX = 34;

    const buildSide = (items, side) => {
      return items.map((item, index) => {
        const t = items.length === 1 ? 0.5 : index / (items.length - 1);
        const angle = angleStart + (angleEnd - angleStart) * t;
        const rad = degToRad(angle);

        const rawX = radiusX * Math.cos(rad);
        const rawY = radiusY * Math.sin(rad) * visualCompressY;

        const x =
          side === "left"
            ? centerX - Math.abs(rawX) - cardOffsetX
            : centerX + Math.abs(rawX) + cardOffsetX;

        const y = centerY + rawY;

        return {
          ...item,
          side,
          x,
          y,
          angle
        };
      });
    };

    state.nodes = [
      ...buildSide(schemaLeft, "left"),
      ...buildSide(schemaRight, "right")
    ];
  }

  function renderNode(node) {
    return `
      <button
        class="schema-node schema-node--${node.side}"
        type="button"
        data-id="${node.id}"
        style="left:${node.x}px; top:${node.y}px;"
      >
        <span class="schema-node__icon">
          <img src="${ICON_PATH + node.icon}" alt="" draggable="false" />
        </span>

        <span class="schema-node__label">${node.label}</span>
        <span class="schema-node__port"></span>
      </button>
    `;
  }

  function bindEvents() {
    document.querySelectorAll(".schema-node").forEach((node) => {
      node.addEventListener("click", () => {
        console.log("openDictionary:", node.dataset.id);
      });
    });
  }

  function renderSchema() {
    const root = document.getElementById("dictsSchemaRoot");

    if (!root) {
      console.warn("[dicts-schema] #dictsSchemaRoot не знайдено.");
      return;
    }

    buildNodes();

    root.classList.add("dicts-schema-root");

    root.innerHTML = `
      <div class="dict-schema-v4">
        <div class="schema-bg-grid"></div>

        <div class="schema-arc schema-arc--left"></div>
        <div class="schema-arc schema-arc--right"></div>

        <div class="schema-axis"></div>

        <div class="schema-center-marker">
          <span></span>
        </div>

        <div class="schema-nodes">
          ${state.nodes.map(renderNode).join("")}
        </div>
      </div>
    `;

    bindEvents();
  }

  function initSchemaView() {
    requestAnimationFrame(renderSchema);
  }

  window.renderDictsSchemaNow = initSchemaView;

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView,
    renderSchema,
    relations
  };
})();
