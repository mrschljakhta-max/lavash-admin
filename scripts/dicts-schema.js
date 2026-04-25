(() => {
  const ICON_PATH = "../assets/icons/schema/";

  const schemaLeft = [
    { id: "units", label: "ПІДРОЗДІЛИ", icon: "units.svg", links: ["personnel", "positions", "tasks", "events", "stations"] },
    { id: "personnel", label: "ПЕРСОНАЛ", icon: "personnel.svg", links: ["units", "roles", "statuses", "events"] },
    { id: "vehicles", label: "ТЕХНІКА", icon: "vehicles.svg", links: ["units", "positions", "stations", "tasks"] },
    { id: "positions", label: "ПОЗИЦІЇ", icon: "positions.svg", links: ["units", "vehicles", "settlements", "terrain"] },
    { id: "tasks", label: "ЗАВДАННЯ", icon: "tasks.svg", links: ["units", "events", "sources", "statuses"] },
    { id: "events", label: "ПОДІЇ", icon: "events.svg", links: ["tasks", "sources", "settlements", "uav", "stations"] },
    { id: "stations", label: "СТАНЦІЇ РЕБ", icon: "stations.svg", links: ["units", "vehicles", "positions", "events", "uav"] },
    { id: "uav", label: "БПЛА", icon: "uav.svg", links: ["events", "stations", "objectTypes", "sources"] }
  ];

  const schemaRight = [
    { id: "countries", label: "КРАЇНИ", icon: "countries.svg", links: ["regions", "settlements"] },
    { id: "regions", label: "РЕГІОНИ", icon: "regions.svg", links: ["countries", "settlements"] },
    { id: "settlements", label: "НАСЕЛЕНІ ПУНКТИ", icon: "settlements.svg", links: ["regions", "positions", "events", "terrain"] },
    { id: "terrain", label: "ТИПИ МІСЦЕВОСТІ", icon: "terrain.svg", links: ["settlements", "positions"] },
    { id: "objectTypes", label: "ТИПИ ОБʼЄКТІВ", icon: "object-types.svg", links: ["positions", "uav", "stations"] },
    { id: "sources", label: "ДЖЕРЕЛА ІНФОРМАЦІЇ", icon: "sources.svg", links: ["events", "tasks", "uav"] },
    { id: "statuses", label: "СТАТУСИ", icon: "statuses.svg", links: ["tasks", "events", "personnel"] },
    { id: "roles", label: "РОЛІ КОРИСТУВАЧІВ", icon: "roles.svg", links: ["personnel", "statuses"] }
  ];

  const state = {
    nodes: [],
    byId: new Map()
  };

  const SCENE = {
    width: 1200,
    height: 680,
    hubX: 600,
    hubY: 340
  };

  function buildNodes() {
    const ySlots = [112, 174, 236, 298, 360, 422, 484, 546];

    const leftX = [314, 282, 254, 238, 238, 254, 282, 314];
    const rightX = [886, 918, 946, 962, 962, 946, 918, 886];

    const left = schemaLeft.map((item, index) => ({
      ...item,
      side: "left",
      index,
      x: leftX[index],
      y: ySlots[index],
      portX: leftX[index] + 122,
      portY: ySlots[index],
      orbitX: 172,
      orbitY: ySlots[index]
    }));

    const right = schemaRight.map((item, index) => ({
      ...item,
      side: "right",
      index,
      x: rightX[index],
      y: ySlots[index],
      portX: rightX[index] - 122,
      portY: ySlots[index],
      orbitX: 1028,
      orbitY: ySlots[index]
    }));

    state.nodes = [...left, ...right];
    state.byId = new Map(state.nodes.map((node) => [node.id, node]));
  }

  function cubicPath(fromX, fromY, toX, toY, side, curve = 1) {
    const dir = side === "left" ? 1 : -1;
    const distance = Math.abs(toX - fromX);

    const c1x = fromX + dir * distance * 0.45 * curve;
    const c1y = fromY;

    const c2x = toX - dir * distance * 0.4 * curve;
    const c2y = toY;

    return `M ${fromX} ${fromY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${toX} ${toY}`;
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

  function renderMainLink(node, index) {
    const hubX = node.side === "left" ? SCENE.hubX - 58 : SCENE.hubX + 58;
    const hubY = SCENE.hubY;

    const offset = (node.index - 3.5) * 3.2;
    const targetY = hubY + offset;

    const d = cubicPath(node.portX, node.portY, hubX, targetY, node.side, 1.08);

    return `
      <path
        class="schema-link schema-link--${node.side} schema-link--main"
        data-id="${node.id}"
        data-kind="main"
        style="--delay:${index * -0.32}s"
        d="${d}"
      />
    `;
  }

  function renderRelationLink(node, target, relationIndex) {
    if (!target) return "";

    const fromX = node.portX;
    const fromY = node.portY;

    const toX = target.side === "left" ? target.portX + 18 : target.portX - 18;
    const toY = target.portY;

    const fromDir = node.side === "left" ? 1 : -1;
    const toDir = target.side === "left" ? 1 : -1;

    const c1x = fromX + fromDir * 148;
    const c2x = toX - toDir * 148;

    const lift = Math.max(-92, Math.min(92, (target.index - node.index) * 15));
    const midY = (fromY + toY) / 2 + lift;

    const d = `
      M ${fromX} ${fromY}
      C ${c1x} ${fromY}, ${SCENE.hubX} ${midY}, ${c2x} ${toY}
      S ${toX} ${toY}, ${toX} ${toY}
    `;

    return `
      <path
        class="schema-link schema-link--relation schema-link--${node.side}"
        data-id="${node.id}"
        data-target="${target.id}"
        data-kind="relation"
        style="--delay:${relationIndex * -0.41}s"
        d="${d}"
      />
    `;
  }

  function renderRelationLinks() {
    const lines = [];

    state.nodes.forEach((node) => {
      node.links.forEach((targetId, relationIndex) => {
        const target = state.byId.get(targetId);
        if (!target) return;
        lines.push(renderRelationLink(node, target, relationIndex));
      });
    });

    return lines.join("");
  }

  function renderOrbitSegments() {
    return state.nodes.map((node) => {
      return `
        <span
          class="schema-orbit-segment schema-orbit-segment--${node.side}"
          data-id="${node.id}"
          style="top:${node.orbitY}px;"
        ></span>
      `;
    }).join("");
  }

  function renderNodeDots() {
    return state.nodes.map((node) => {
      const firstX = node.side === "left" ? SCENE.hubX - 140 : SCENE.hubX + 140;
      const secondX = node.side === "left" ? SCENE.hubX - 86 : SCENE.hubX + 86;

      return `
        <span
          class="schema-flow-dot schema-flow-dot--${node.side}"
          data-id="${node.id}"
          style="left:${firstX}px; top:${node.portY}px; --dot-delay:${node.index * -0.22}s"
        ></span>
        <span
          class="schema-flow-dot schema-flow-dot--${node.side}"
          data-id="${node.id}"
          style="left:${secondX}px; top:${node.portY + (SCENE.hubY - node.portY) * .3}px; --dot-delay:${node.index * -0.31}s"
        ></span>
      `;
    }).join("");
  }

  function renderMicroParticles() {
    return state.nodes.map((node, index) => {
      const sideClass = node.side === "left" ? "schema-particle--left" : "schema-particle--right";
      return `<span class="schema-particle ${sideClass}" style="--p-y:${node.y}px; --p-delay:${index * -0.4}s"></span>`;
    }).join("");
  }

  function getRelatedIds(id) {
    const node = state.byId.get(id);
    if (!node) return new Set();

    const related = new Set([id, ...node.links]);

    state.nodes.forEach((item) => {
      if (item.links.includes(id)) related.add(item.id);
    });

    return related;
  }

  function setActiveNode(id) {
    const hasActive = Boolean(id);
    const relatedIds = hasActive ? getRelatedIds(id) : new Set();

    document.querySelectorAll(".schema-node").forEach((element) => {
      const nodeId = element.dataset.id;
      const isActive = nodeId === id;
      const isRelated = relatedIds.has(nodeId);

      element.classList.toggle("is-focused", isActive);
      element.classList.toggle("is-related", hasActive && isRelated && !isActive);
      element.classList.toggle("is-dimmed", hasActive && !isRelated);
    });

    document.querySelectorAll(".schema-link").forEach((line) => {
      const lineId = line.dataset.id;
      const targetId = line.dataset.target;
      const kind = line.dataset.kind;

      const isMain = kind === "main" && lineId === id;

      const isRelation =
        kind === "relation" &&
        hasActive &&
        (lineId === id || targetId === id) &&
        relatedIds.has(lineId) &&
        (!targetId || relatedIds.has(targetId));

      const isVisibleRelated = isMain || isRelation;

      line.classList.toggle("is-active", isMain);
      line.classList.toggle("is-related", isRelation);
      line.classList.toggle("is-muted", hasActive && !isVisibleRelated);
    });

    document.querySelectorAll(".schema-orbit-segment").forEach((segment) => {
      const segId = segment.dataset.id;
      segment.classList.toggle("is-active", segId === id);
      segment.classList.toggle("is-related", hasActive && relatedIds.has(segId) && segId !== id);
      segment.classList.toggle("is-muted", hasActive && !relatedIds.has(segId));
    });

    document.querySelectorAll(".schema-flow-dot").forEach((dot) => {
      const dotId = dot.dataset.id;
      dot.classList.toggle("is-active", dotId === id);
      dot.classList.toggle("is-muted", hasActive && !relatedIds.has(dotId));
    });

    document.querySelector(".schema-hub")?.classList.toggle("is-hot", hasActive);
  }

  function bindEvents() {
    document.querySelectorAll(".schema-node").forEach((node) => {
      node.addEventListener("mouseenter", () => setActiveNode(node.dataset.id));
      node.addEventListener("mouseleave", () => setActiveNode(null));
      node.addEventListener("focus", () => setActiveNode(node.dataset.id));
      node.addEventListener("blur", () => setActiveNode(null));

      node.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("lavash:open-dictionary", {
          detail: { id: node.dataset.id }
        }));
      });
    });
  }

  function renderSchema() {
    const root = document.getElementById("dictsSchemaRoot");
    if (!root) return;

    buildNodes();
    root.classList.add("dicts-schema-root");

    root.innerHTML = `
      <div class="dict-schema-v6">
        <div class="schema-space schema-space--stars-a"></div>
        <div class="schema-space schema-space--stars-b"></div>
        <div class="schema-bg-grid"></div>
        <div class="schema-bg-glow"></div>

        <div class="schema-hemisphere schema-hemisphere--left"></div>
        <div class="schema-hemisphere schema-hemisphere--right"></div>

        <div class="schema-orbit schema-orbit--left"></div>
        <div class="schema-orbit schema-orbit--right"></div>
        <div class="schema-orbit-segments">${renderOrbitSegments()}</div>

        <div class="schema-axis"></div>

        <svg class="schema-links" viewBox="0 0 1200 680" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="schemaCyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#12fff1" stop-opacity=".98" />
              <stop offset="55%" stop-color="#29dfff" stop-opacity=".78" />
              <stop offset="100%" stop-color="#4da6ff" stop-opacity=".58" />
            </linearGradient>

            <linearGradient id="schemaVioletGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7d64ff" stop-opacity=".55" />
              <stop offset="45%" stop-color="#9b5cff" stop-opacity=".82" />
              <stop offset="100%" stop-color="#d36cff" stop-opacity=".98" />
            </linearGradient>

            <filter id="schemaGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="2.4" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          ${state.nodes.map(renderMainLink).join("")}
          ${renderRelationLinks()}
        </svg>

        <div class="schema-flow-dots">${renderNodeDots()}</div>
        <div class="schema-particles">${renderMicroParticles()}</div>

        <div class="schema-hub" aria-hidden="true">
          <span class="schema-hub__halo"></span>
          <span class="schema-hub__ring schema-hub__ring--a"></span>
          <span class="schema-hub__ring schema-hub__ring--b"></span>
          <span class="schema-hub__ring schema-hub__ring--c"></span>

          <span class="schema-crystal"></span>
          <span class="schema-hub__core"></span>
        </div>

        <div class="schema-nodes">${state.nodes.map(renderNode).join("")}</div>
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
