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
    { from: "uav", to: "sources", type: "secondary" },

    { from: "units", to: "roles", type: "bg" },
    { from: "vehicles", to: "settlements", type: "bg" },
    { from: "positions", to: "terrain", type: "bg" },
    { from: "stations", to: "statuses", type: "bg" }
  ];

  const state = {
    nodes: []
  };

  function buildNodes() {
    const centerX = 500;
    const centerY = 340;

    const ySlots = [112, 172, 232, 292, 352, 412, 472, 532];

    /*
      Контрольована псевдодуга.
      Це не “сухий еліпс”, який ламає верстку,
      а стабільна орбітальна геометрія як на референсі.
    */
    const xCurveLeft = [282, 236, 202, 180, 180, 202, 236, 282];
    const xCurveRight = [718, 764, 798, 820, 820, 798, 764, 718];

    const left = schemaLeft.map((item, index) => ({
      ...item,
      side: "left",
      x: xCurveLeft[index],
      y: ySlots[index],
      anchorX: xCurveLeft[index] + 124,
      anchorY: ySlots[index]
    }));

    const right = schemaRight.map((item, index) => ({
      ...item,
      side: "right",
      x: xCurveRight[index],
      y: ySlots[index],
      anchorX: xCurveRight[index] - 124,
      anchorY: ySlots[index]
    }));

    state.nodes = [...left, ...right];

    return { centerX, centerY };
  }

  function getNode(id) {
    return state.nodes.find((node) => node.id === id);
  }

  function renderLine(relation, index) {
    const from = getNode(relation.from);
    const to = getNode(relation.to);

    if (!from || !to) return "";

    const hubX = 500;
    const hubY = 340 + ((index % 7) - 3) * 13;

    const leftControlX = from.anchorX + 110;
    const rightControlX = to.anchorX - 110;

    return `
      <path
        class="schema-link schema-link--${relation.type}"
        data-from="${relation.from}"
        data-to="${relation.to}"
        style="animation-delay:${index * -0.55}s"
        d="
          M ${from.anchorX} ${from.anchorY}
          C ${leftControlX} ${from.anchorY}, ${hubX - 92} ${hubY}, ${hubX} ${hubY}
          C ${hubX + 92} ${hubY}, ${rightControlX} ${to.anchorY}, ${to.anchorX} ${to.anchorY}
        "
      />
    `;
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

  function setActiveNode(id) {
    document.querySelectorAll(".schema-node").forEach((node) => {
      const nodeId = node.dataset.id;

      const related = relations.some(({ from, to }) => {
        return (from === id && to === nodeId) || (to === id && from === nodeId);
      });

      node.classList.toggle("is-focused", nodeId === id);
      node.classList.toggle("is-related", related);
      node.classList.toggle("is-dimmed", Boolean(id) && nodeId !== id && !related);
    });

    document.querySelectorAll(".schema-link").forEach((line) => {
      const active = line.dataset.from === id || line.dataset.to === id;

      line.classList.toggle("is-active", active);
      line.classList.toggle("is-muted", Boolean(id) && !active);
    });

    document.querySelector(".schema-hub")?.classList.toggle("is-hot", Boolean(id));
  }

  function bindEvents() {
    document.querySelectorAll(".schema-node").forEach((node) => {
      node.addEventListener("mouseenter", () => setActiveNode(node.dataset.id));
      node.addEventListener("mouseleave", () => setActiveNode(null));

      node.addEventListener("click", () => {
        console.log("openDictionary:", node.dataset.id);
      });
    });

    document.querySelectorAll(".schema-link").forEach((line) => {
      line.addEventListener("mouseenter", () => {
        const from = line.dataset.from;
        const to = line.dataset.to;

        document.querySelectorAll(".schema-node").forEach((node) => {
          const id = node.dataset.id;
          node.classList.toggle("is-focused", id === from || id === to);
          node.classList.toggle("is-dimmed", id !== from && id !== to);
        });

        document.querySelectorAll(".schema-link").forEach((path) => {
          path.classList.toggle("is-active", path === line);
          path.classList.toggle("is-muted", path !== line);
        });

        document.querySelector(".schema-hub")?.classList.add("is-hot");
      });

      line.addEventListener("mouseleave", () => {
        setActiveNode(null);
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
        <div class="schema-bg-noise"></div>

        <div class="schema-shell schema-shell--left">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <div class="schema-shell schema-shell--right">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <div class="schema-arc-label schema-arc-label--left">ОСНОВНІ ДОВІДНИКИ</div>
        <div class="schema-arc-label schema-arc-label--right">ДОДАТКОВІ ДОВІДНИКИ</div>

        <div class="schema-axis"></div>

        <svg
          class="schema-links"
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

            <filter id="schemaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          ${relations.map(renderLine).join("")}
        </svg>

        <div class="schema-hub">
          <span class="schema-hub__halo"></span>
          <span class="schema-hub__ring schema-hub__ring--outer"></span>
          <span class="schema-hub__ring schema-hub__ring--middle"></span>
          <span class="schema-hub__ring schema-hub__ring--inner"></span>
          <span class="schema-hub__diamond"></span>
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

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView,
    renderSchema,
    relations
  };
})();
