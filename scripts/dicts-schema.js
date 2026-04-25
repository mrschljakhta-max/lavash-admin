(() => {
  const ICON_PATH = "../assets/icons/schema/";

  const schemaLeft = [
    { id: "units", label: "ПІДРОЗДІЛИ", icon: "units.svg", link: "primary" },
    { id: "personnel", label: "ПЕРСОНАЛ", icon: "personnel.svg", link: "primary" },
    { id: "vehicles", label: "ТЕХНІКА", icon: "vehicles.svg", link: "primary" },
    { id: "positions", label: "ПОЗИЦІЇ", icon: "positions.svg", link: "primary" },
    { id: "tasks", label: "ЗАВДАННЯ", icon: "tasks.svg", link: "secondary" },
    { id: "events", label: "ПОДІЇ", icon: "events.svg", link: "secondary" },
    { id: "stations", label: "СТАНЦІЇ РЕБ", icon: "stations.svg", link: "primary" },
    { id: "uav", label: "БПЛА", icon: "uav.svg", link: "primary" }
  ];

  const schemaRight = [
    { id: "countries", label: "КРАЇНИ", icon: "countries.svg", link: "primary" },
    { id: "regions", label: "РЕГІОНИ", icon: "regions.svg", link: "primary" },
    { id: "settlements", label: "НАСЕЛЕНІ ПУНКТИ", icon: "settlements.svg", link: "primary" },
    { id: "terrain", label: "ТИПИ МІСЦЕВОСТІ", icon: "terrain.svg", link: "secondary" },
    { id: "objectTypes", label: "ТИПИ ОБʼЄКТІВ", icon: "object-types.svg", link: "secondary" },
    { id: "sources", label: "ДЖЕРЕЛА ІНФОРМАЦІЇ", icon: "sources.svg", link: "secondary" },
    { id: "statuses", label: "СТАТУСИ", icon: "statuses.svg", link: "primary" },
    { id: "roles", label: "РОЛІ КОРИСТУВАЧІВ", icon: "roles.svg", link: "primary" }
  ];

  const state = { nodes: [] };

  function buildNodes() {
    const ySlots = [116, 176, 236, 296, 356, 416, 476, 536];
    const xLeft = [274, 238, 214, 198, 198, 214, 238, 274];
    const xRight = [726, 762, 786, 802, 802, 786, 762, 726];

    const left = schemaLeft.map((item, index) => ({
      ...item,
      side: "left",
      x: xLeft[index],
      y: ySlots[index],
      portX: xLeft[index] + 123,
      portY: ySlots[index]
    }));

    const right = schemaRight.map((item, index) => ({
      ...item,
      side: "right",
      x: xRight[index],
      y: ySlots[index],
      portX: xRight[index] - 123,
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
        style="left:${node.x}px; top:${node.y}px; --node-delay:${index * 0.07}s"
        aria-label="Відкрити довідник: ${node.label}"
      >
        <span class="schema-node__icon"><img src="${ICON_PATH + node.icon}" alt="" draggable="false" /></span>
        <span class="schema-node__label">${node.label}</span>
        <span class="schema-node__port"></span>
      </button>
    `;
  }

  function renderHubLine(node, index) {
    const hubX = 500;
    const hubY = 340;
    const laneOffset = (index % 8 - 3.5) * 4.8;
    const endX = node.side === "left" ? hubX - 42 : hubX + 42;
    const midY = node.portY * 0.58 + hubY * 0.42 + laneOffset;
    const c1x = node.side === "left" ? node.portX + 78 : node.portX - 78;
    const c2x = node.side === "left" ? endX - 96 : endX + 96;

    return `
      <path
        class="schema-link schema-link--${node.side} schema-link--${node.link}"
        data-id="${node.id}"
        style="animation-delay:${index * -0.34}s"
        d="M ${node.portX} ${node.portY} C ${c1x} ${node.portY}, ${c2x} ${midY}, ${endX} ${hubY}"
      />
    `;
  }

  function renderMicroParticles() {
    return state.nodes.map((node, index) => {
      const sideClass = node.side === "left" ? "schema-particle--left" : "schema-particle--right";
      return `<span class="schema-particle ${sideClass}" style="--p-y:${node.y}px; --p-delay:${index * -0.42}s"></span>`;
    }).join("");
  }

  function setActiveNode(id) {
    document.querySelectorAll(".schema-node").forEach((node) => {
      const active = node.dataset.id === id;
      node.classList.toggle("is-focused", active);
      node.classList.toggle("is-dimmed", Boolean(id) && !active);
    });

    document.querySelectorAll(".schema-link").forEach((line) => {
      const active = line.dataset.id === id;
      line.classList.toggle("is-active", active);
      line.classList.toggle("is-muted", Boolean(id) && !active);
    });

    document.querySelector(".schema-hub")?.classList.toggle("is-hot", Boolean(id));
  }

  function bindEvents() {
    document.querySelectorAll(".schema-node").forEach((node) => {
      node.addEventListener("mouseenter", () => setActiveNode(node.dataset.id));
      node.addEventListener("mouseleave", () => setActiveNode(null));
      node.addEventListener("focus", () => setActiveNode(node.dataset.id));
      node.addEventListener("blur", () => setActiveNode(null));
      node.addEventListener("click", () => console.log("openDictionary:", node.dataset.id));
    });

    document.querySelectorAll(".schema-link").forEach((line) => {
      line.addEventListener("mouseenter", () => setActiveNode(line.dataset.id));
      line.addEventListener("mouseleave", () => setActiveNode(null));
    });
  }

  function renderSchema() {
    const root = document.getElementById("dictsSchemaRoot");
    if (!root) return;

    buildNodes();
    root.classList.add("dicts-schema-root");

    root.innerHTML = `
      <div class="dict-schema-v5">
        <div class="schema-space schema-space--stars-a"></div>
        <div class="schema-space schema-space--stars-b"></div>
        <div class="schema-bg-grid"></div>
        <div class="schema-bg-glow"></div>
        <div class="schema-hemisphere schema-hemisphere--left"></div>
        <div class="schema-hemisphere schema-hemisphere--right"></div>
        <div class="schema-orbit schema-orbit--left"><span>ОСНОВНІ ДОВІДНИКИ</span></div>
        <div class="schema-orbit schema-orbit--right"><span>ДОДАТКОВІ ДОВІДНИКИ</span></div>
        <div class="schema-axis"></div>

        <svg class="schema-links" viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="schemaCyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#10fff3" stop-opacity=".98" />
              <stop offset="100%" stop-color="#55a8ff" stop-opacity=".58" />
            </linearGradient>
            <linearGradient id="schemaVioletGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8e5bff" stop-opacity=".58" />
              <stop offset="100%" stop-color="#bd62ff" stop-opacity=".98" />
            </linearGradient>
            <filter id="schemaGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          ${state.nodes.map(renderHubLine).join("")}
        </svg>

        <div class="schema-particles">${renderMicroParticles()}</div>

        <div class="schema-hub" aria-hidden="true">
          <span class="schema-hub__halo"></span>
          <span class="schema-hub__orbit schema-hub__orbit--a"></span>
          <span class="schema-hub__orbit schema-hub__orbit--b"></span>
          <span class="schema-hub__orbit schema-hub__orbit--c"></span>
          <span class="schema-hub__diamond"></span>
          <span class="schema-hub__core"></span>
          <span class="schema-hub__caption">ЦЕНТРАЛЬНЕ ЯДРО<br>СИНХРОНІЗАЦІЇ ДАНИХ</span>
        </div>

        <div class="schema-nodes">${state.nodes.map(renderNode).join("")}</div>

        <div class="schema-legend" aria-hidden="true">
          <span><i class="legend-line legend-line--primary"></i>ПРЯМІ ЗВʼЯЗКИ</span>
          <span><i class="legend-line legend-line--secondary"></i>НЕПРЯМІ ЗВʼЯЗКИ</span>
          <span><i class="legend-flow"></i>ПОТОК ДАНИХ</span>
          <span><i class="legend-dot"></i>АКТИВНИЙ ВУЗОЛ</span>
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
