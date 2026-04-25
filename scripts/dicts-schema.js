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

  const relations = {
    units: ["personnel", "vehicles", "positions", "tasks", "events", "stations", "roles", "statuses"],
    personnel: ["units", "positions", "tasks", "events", "roles", "statuses"],
    vehicles: ["units", "stations", "tasks", "events", "statuses"],
    positions: ["units", "personnel", "settlements", "terrain", "objectTypes"],
    tasks: ["units", "personnel", "vehicles", "events", "sources", "statuses"],
    events: ["tasks", "stations", "uav", "settlements", "sources", "statuses"],
    stations: ["units", "vehicles", "events", "settlements", "objectTypes", "statuses"],
    uav: ["events", "sources", "statuses"],

    countries: ["regions", "settlements"],
    regions: ["countries", "settlements"],
    settlements: ["regions", "countries", "positions", "events", "stations", "terrain"],
    terrain: ["settlements", "positions", "stations"],
    objectTypes: ["positions", "stations", "sources"],
    sources: ["events", "tasks", "uav", "objectTypes"],
    statuses: ["events", "tasks", "stations", "personnel", "vehicles"],
    roles: ["users", "units", "personnel"]
  };

  const state = { nodes: [] };

  function buildNodes() {
    const ySlots = [120, 180, 240, 300, 360, 420, 480, 540];

    const left = schemaLeft.map((item, index) => ({
      ...item,
      side: "left",
      x: 250 + Math.abs(index - 3.5) * 16,
      y: ySlots[index],
      portX: 358 + Math.abs(index - 3.5) * 8,
      portY: ySlots[index]
    }));

    const right = schemaRight.map((item, index) => ({
      ...item,
      side: "right",
      x: 750 - Math.abs(index - 3.5) * 16,
      y: ySlots[index],
      portX: 642 - Math.abs(index - 3.5) * 8,
      portY: ySlots[index]
    }));

    state.nodes = [...left, ...right];
  }

  function renderNode(node, index) {
    return `
      <button
        class="schema-node schema-node--${node.side}"
        type="button"
        data-id="${node.id}"
        style="left:${node.x}px; top:${node.y}px; --node-delay:${index * 0.055}s"
        aria-label="Відкрити довідник: ${node.label}"
      >
        <span class="schema-node__icon">
          <img src="${ICON_PATH + node.icon}" alt="" draggable="false" />
        </span>
        <span class="schema-node__label">${node.label}</span>
        <span class="schema-node__port"></span>
      </button>
    `;
  }

  function renderHubLine(node, index) {
    const hubX = 500;
    const hubY = 330;

    const endX = node.side === "left" ? hubX - 32 : hubX + 32;
    const direction = node.side === "left" ? 1 : -1;

    const bend = Math.abs(node.y - hubY);
    const roundness = 92 + bend * 0.34;

    const c1x = node.portX + direction * roundness;
    const c1y = node.portY;

    const c2x = endX - direction * (118 + bend * 0.18);
    const c2y = hubY + (node.portY - hubY) * 0.38;

    return `
      <path
        class="schema-link schema-link--${node.side}"
        data-id="${node.id}"
        d="M ${node.portX} ${node.portY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${hubY}"
      />
    `;
  }

  function renderLineDots(node) {
    const count = 4;
    return Array.from({ length: count }).map((_, i) => {
      const ratio = (i + 1) / (count + 1);
      return `
        <span
          class="schema-line-dot schema-line-dot--${node.side}"
          data-id="${node.id}"
          style="
            --dot-y:${node.y}px;
            --dot-i:${i};
            --dot-r:${ratio};
          "
        ></span>
      `;
    }).join("");
  }

  function renderOuterSegments(side) {
    return Array.from({ length: 8 }).map((_, i) => `
      <span class="schema-orbit-segment schema-orbit-segment--${side}" style="--seg:${i};"></span>
    `).join("");
  }

  function relatedIds(id) {
    return new Set([id, ...(relations[id] || [])]);
  }

  function setActiveNode(id) {
    const activeSet = id ? relatedIds(id) : null;

    document.querySelectorAll(".schema-node").forEach((node) => {
      const nodeId = node.dataset.id;
      const isMain = nodeId === id;
      const isRelated = activeSet?.has(nodeId);

      node.classList.toggle("is-focused", isMain);
      node.classList.toggle("is-related", Boolean(id) && Boolean(isRelated) && !isMain);
      node.classList.toggle("is-dimmed", Boolean(id) && !isRelated);
    });

    document.querySelectorAll(".schema-link, .schema-line-dot").forEach((el) => {
      const itemId = el.dataset.id;
      const isMain = itemId === id;
      const isRelated = activeSet?.has(itemId);

      el.classList.toggle("is-active", Boolean(isMain));
      el.classList.toggle("is-related", Boolean(id) && Boolean(isRelated) && !isMain);
      el.classList.toggle("is-muted", Boolean(id) && !isRelated);
    });

    document.querySelector(".schema-hub")?.classList.toggle("is-hot", Boolean(id));
  }

  function bindEvents() {
    document.querySelectorAll(".schema-node").forEach((node) => {
      node.addEventListener("mouseenter", () => setActiveNode(node.dataset.id));
      node.addEventListener("mouseleave", () => setActiveNode(null));
      node.addEventListener("focus", () => setActiveNode(node.dataset.id));
      node.addEventListener("blur", () => setActiveNode(null));
      node.addEventListener("click", () => {
        console.log("openDictionary:", node.dataset.id);
      });
    });
  }

  function renderSchema() {
    const root = document.getElementById("dictsSchemaRoot");
    if (!root) return;

    buildNodes();

    root.innerHTML = `
      <div class="dict-schema-v6">
        <div class="schema-space schema-space--a"></div>
        <div class="schema-space schema-space--b"></div>
        <div class="schema-grid"></div>
        <div class="schema-nebula"></div>

        <div class="schema-oval schema-oval--left"></div>
        <div class="schema-oval schema-oval--right"></div>

        <div class="schema-orbit schema-orbit--left">
          ${renderOuterSegments("left")}
        </div>

        <div class="schema-orbit schema-orbit--right">
          ${renderOuterSegments("right")}
        </div>

        <div class="schema-axis"></div>

        <svg class="schema-links" viewBox="0 0 1000 660" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="schemaCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#13fff2" stop-opacity=".98" />
              <stop offset="55%" stop-color="#20d7ff" stop-opacity=".82" />
              <stop offset="100%" stop-color="#62a5ff" stop-opacity=".52" />
            </linearGradient>

            <linearGradient id="schemaViolet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7b55ff" stop-opacity=".52" />
              <stop offset="48%" stop-color="#9d62ff" stop-opacity=".84" />
              <stop offset="100%" stop-color="#d96dff" stop-opacity=".98" />
            </linearGradient>

            <filter id="schemaGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          ${state.nodes.map(renderHubLine).join("")}
        </svg>

        <div class="schema-line-dots">
          ${state.nodes.map(renderLineDots).join("")}
        </div>

        <div class="schema-hub" aria-hidden="true">
          <span class="schema-hub__aura"></span>
          <span class="schema-hub__ring schema-hub__ring--1"></span>
          <span class="schema-hub__ring schema-hub__ring--2"></span>
          <span class="schema-hub__ring schema-hub__ring--3"></span>
          <span class="schema-hub__crystal">
            <i></i><b></b><em></em>
          </span>
          <span class="schema-hub__core"></span>
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
  window.LAVASH_DICTS_SCHEMA = { initSchemaView, renderSchema };
})();
