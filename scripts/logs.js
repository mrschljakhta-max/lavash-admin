(() => {
  const page = document.getElementById("logsPage");
  const shell = document.getElementById("logsVortexShell");
  const canvas = document.getElementById("logsVortexCanvas");
  const hud = document.getElementById("logsVortexStatus");
  const resetBtn = document.getElementById("logsResetBtn");
  const lockAgainBtn = document.getElementById("logsLockAgainBtn");

  if (!page || !shell || !canvas) return;

  const ctx = canvas.getContext("2d");

  const KEY_WORD = "ЛОГУВАННЯ";
  const RING_COUNT = 5;
  const UNLOCK_ORDER = [0, 2, 1, 4, 3];

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let dpr = 1;

  let activeRing = -1;
  let unlocked = false;
  let lastTime = performance.now();
  let globalPulse = 0;
  let flash = 0;
  let shake = 0;

  const rings = [];
  const particles = [];
  const sparks = [];

  const noiseLetters = "АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789";

  function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function angleDistance(a, b) {
    const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
    return Math.min(diff, 360 - diff);
  }

  function shortestAngleDelta(from, to) {
    let delta = normalizeAngle(to) - normalizeAngle(from);
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return delta;
  }

  function createRings() {
    rings.length = 0;

    const pieces = [
      { word: "ЛО", target: 38, physics: "normal" },
      { word: "ГУ", target: 142, physics: "heavy" },
      { word: "ВА", target: 226, physics: "inverse" },
      { word: "НН", target: 304, physics: "drift" },
      { word: "Я", target: 88, physics: "unstable" }
    ];

    for (let i = 0; i < RING_COUNT; i++) {
      rings.push({
        index: i,
        word: pieces[i].word,
        target: pieces[i].target,
        angle: Math.random() * 360,
        velocity: 0,
        radius: 120 + i * 54,
        letters: [],
        locked: false,
        match: 0,
        pulse: 0,
        physics: pieces[i].physics
      });
    }
  }

  function buildLetters() {
    rings.forEach((ring, ringIndex) => {
      ring.letters.length = 0;

      const total = 26 + ringIndex * 4;
      const keyChars = ring.word.split("");

      for (let i = 0; i < total; i++) {
        const useKey = i < keyChars.length;
        ring.letters.push({
          char: useKey ? keyChars[i] : noiseLetters[Math.floor(Math.random() * noiseLetters.length)],
          slot: i,
          key: useKey,
          jitter: Math.random() * Math.PI * 2,
          size: useKey ? 28 : 18 + Math.random() * 8,
          alpha: useKey ? 1 : 0.55 + Math.random() * 0.35
        });
      }
    });
  }

  function createParticles() {
    particles.length = 0;

    for (let i = 0; i < 140; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 70 + Math.random() * 620,
        speed: 0.12 + Math.random() * 0.45,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.15 + Math.random() * 0.55,
        drift: Math.random() * Math.PI * 2
      });
    }
  }

  function addSpark(x, y, amount = 16) {
    for (let i = 0; i < amount; i++) {
      sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9,
        life: 1,
        size: 1 + Math.random() * 3
      });
    }
  }

  function resize() {
    const rect = shell.getBoundingClientRect();

    width = Math.max(320, rect.width);
    height = Math.max(420, rect.height);

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = width / 2;
    cy = height / 2 + 18;

    const maxRadius = Math.min(width * 0.32, height * 0.39);
    const step = maxRadius / 5.4;

    rings.forEach((ring, i) => {
      ring.radius = step * (1.25 + i * 0.92);
    });
  }

  function resetLock() {
    unlocked = false;
    activeRing = -1;
    flash = 0;
    shake = 0;

    page.classList.remove("is-unlocked", "is-table-visible");

    createRings();
    buildLetters();
    createParticles();
    resize();
    updateHud();
  }

  function getCurrentOrderIndex() {
    return rings.filter(r => r.locked).length;
  }

  function getRequiredRingIndex() {
    const step = getCurrentOrderIndex();
    return UNLOCK_ORDER[step] ?? -1;
  }

  function isRingAllowed(ringIndex) {
    return ringIndex === getRequiredRingIndex();
  }

  function getRingAtPosition(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - cx;
    const y = clientY - rect.top - cy;
    const distance = Math.hypot(x, y);

    let best = -1;
    let bestDiff = Infinity;

    rings.forEach((ring, index) => {
      const diff = Math.abs(distance - ring.radius);
      if (diff < bestDiff && diff < 32) {
        bestDiff = diff;
        best = index;
      }
    });

    return best;
  }

  function updateHud() {
    if (!hud) return;

    const required = getRequiredRingIndex();

    if (unlocked) {
      hud.textContent = "ДОСТУП ВІДКРИТО · ТАБЛИЦЯ ЛОГУВАННЯ АКТИВНА";
      return;
    }

    if (required < 0) {
      hud.textContent = "УСІ КІЛЬЦЯ НАЛАШТОВАНО · ВІДКРИТТЯ ДОСТУПУ";
      return;
    }

    const ring = rings[required];
    const roman = ["I", "II", "III", "IV", "V"][required];

    hud.textContent = `КІЛЬЦЕ ${roman} · SIGNAL MATCH ${Math.round(ring.match)}% · НАСТУПНЕ ${roman}`;
  }

  function applyRingPhysics(ring, deltaY) {
    let power = deltaY * 0.016;

    if (ring.physics === "heavy") power *= 0.45;
    if (ring.physics === "inverse") power *= -0.78;
    if (ring.physics === "drift") power *= 0.64;
    if (ring.physics === "unstable") power *= 0.92;

    ring.velocity += power;

    if (Math.abs(ring.velocity) > 7) {
      ring.velocity = Math.sign(ring.velocity) * 7;
    }
  }

  function checkRingLock(ring) {
    if (ring.locked) return;

    const diff = angleDistance(ring.angle, ring.target);
    ring.match = Math.max(0, 100 - diff * 1.2);

    if (diff < 34) {
      const delta = shortestAngleDelta(ring.angle, ring.target);
      ring.angle += delta * 0.22;
      ring.velocity *= 0.72;
      ring.pulse = Math.max(ring.pulse, 0.55);
    }

    if (diff < 16) {
      const delta = shortestAngleDelta(ring.angle, ring.target);
      ring.angle += delta * 0.35;
      ring.velocity *= 0.48;
      ring.pulse = Math.max(ring.pulse, 0.85);
    }

    const finalDiff = angleDistance(ring.angle, ring.target);

    if (finalDiff < 9 || ring.match >= 91) {
      ring.locked = true;
      ring.angle = ring.target;
      ring.velocity = 0;
      ring.match = 100;
      ring.pulse = 1.2;

      const sparkX = cx + Math.cos((ring.target - 90) * Math.PI / 180) * ring.radius;
      const sparkY = cy + Math.sin((ring.target - 90) * Math.PI / 180) * ring.radius;
      addSpark(sparkX, sparkY, 28);

      flash = 0.8;
      shake = 7;
    }

    checkUnlock();
    updateHud();
  }

  function checkUnlock() {
    if (unlocked) return;

    if (rings.every(r => r.locked)) {
      unlockLogs();
    }
  }

  function unlockLogs() {
    if (unlocked) return;

    unlocked = true;
    flash = 1.8;
    shake = 12;

    setTimeout(() => {
      page.classList.add("is-unlocked");

      setTimeout(() => {
        page.classList.add("is-table-visible");

        const table = document.getElementById("logsTableSection");
        if (table) {
          table.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 700);
    }, 450);

    updateHud();
  }

  function drawBackground(time) {
    ctx.save();

    ctx.translate(cx, cy);

    const pulse = 0.5 + Math.sin(time * 0.0018) * 0.5;

    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.42);
    core.addColorStop(0, `rgba(70, 255, 245, ${0.34 + pulse * 0.1})`);
    core.addColorStop(0.25, "rgba(33, 185, 235, 0.16)");
    core.addColorStop(0.65, "rgba(0, 80, 150, 0.05)");
    core.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.43, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(123, 241, 255, 0.08)";
    ctx.lineWidth = 1;

    for (let r = 72; r < Math.max(width, height); r += 56) {
      ctx.beginPath();
      ctx.arc(0, 0, r + Math.sin(time * 0.0008 + r) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 44; i++) {
      const a = i * (Math.PI * 2 / 44) + time * 0.00005;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 60, Math.sin(a) * 60);
      ctx.lineTo(Math.cos(a) * Math.max(width, height), Math.sin(a) * Math.max(width, height));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawParticles(time, dt) {
    ctx.save();

    particles.forEach(p => {
      p.angle += p.speed * 0.0008 * dt;
      p.radius -= 0.018 * dt;

      if (p.radius < 45) {
        p.radius = 360 + Math.random() * 420;
        p.angle = Math.random() * Math.PI * 2;
      }

      const wobble = Math.sin(time * 0.001 + p.drift) * 8;
      const x = cx + Math.cos(p.angle) * (p.radius + wobble);
      const y = cy + Math.sin(p.angle) * (p.radius + wobble);

      ctx.fillStyle = `rgba(160, 248, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawRingGuides(time) {
    ctx.save();
    ctx.translate(cx, cy);

    rings.forEach((ring, index) => {
      const isActive = index === activeRing;
      const allowed = isRingAllowed(index);
      const locked = ring.locked;

      let alpha = 0.18;
      let color = "rgba(115, 238, 255,";

      if (locked) {
        alpha = 0.72;
        color = "rgba(120, 255, 185,";
      } else if (isActive && allowed) {
        alpha = 0.92;
        color = "rgba(90, 248, 255,";
      } else if (isActive && !allowed) {
        alpha = 0.42;
        color = "rgba(255, 108, 142,";
      }

      const sweep = (time * 0.08 + index * 80) % 360;

      ctx.lineWidth = isActive ? 3 : 1.5;
      ctx.strokeStyle = `${color}${alpha})`;
      ctx.shadowBlur = isActive || locked ? 24 : 6;
      ctx.shadowColor = locked ? "rgba(89,255,185,0.75)" : "rgba(0,238,255,0.75)";

      ctx.beginPath();
      ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = isActive ? 7 : 4;
      ctx.strokeStyle = `${color}${locked ? 0.55 : isActive ? 0.72 : 0.18})`;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        ring.radius,
        (sweep - 22) * Math.PI / 180,
        (sweep + 36) * Math.PI / 180
      );
      ctx.stroke();

      ctx.shadowBlur = 0;
    });

    ctx.restore();
  }

  function drawLetters(time) {
    ctx.save();
    ctx.translate(cx, cy);

    rings.forEach((ring, ringIndex) => {
      const total = ring.letters.length;
      const isActive = ringIndex === activeRing;
      const allowed = isRingAllowed(ringIndex);
      const locked = ring.locked;

      ring.letters.forEach((letter, i) => {
        const baseAngle = (i / total) * Math.PI * 2;
        const ringAngle = ring.angle * Math.PI / 180;
        const turbulence = locked ? 0 : Math.sin(time * 0.002 + letter.jitter) * (isActive ? 2.5 : 1.1);
        const radius = ring.radius + turbulence;

        const a = baseAngle + ringAngle;
        const x = Math.cos(a - Math.PI / 2) * radius;
        const y = Math.sin(a - Math.PI / 2) * radius;

        const keyBoost = letter.key ? 1.22 : 1;
        const hoverBoost = isActive && allowed ? 1.14 : 1;
        const lockBoost = locked ? 1.18 : 1;

        const size = letter.size * keyBoost * hoverBoost * lockBoost;
        const alpha = locked
          ? 0.96
          : letter.alpha * (isActive ? 1 : 0.72) * (allowed || locked ? 1 : 0.45);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + Math.PI / 2);

        ctx.font = `900 ${size}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (locked) {
          ctx.fillStyle = `rgba(186, 255, 216, ${alpha})`;
          ctx.shadowColor = "rgba(115, 255, 190, 0.95)";
          ctx.shadowBlur = 18;
        } else if (isActive && allowed) {
          ctx.fillStyle = `rgba(170, 250, 255, ${alpha})`;
          ctx.shadowColor = "rgba(46, 241, 255, 0.9)";
          ctx.shadowBlur = 20;
        } else {
          ctx.fillStyle = `rgba(196, 236, 244, ${alpha})`;
          ctx.shadowColor = "rgba(67, 229, 255, 0.35)";
          ctx.shadowBlur = 8;
        }

        ctx.fillText(letter.char, 0, 0);
        ctx.restore();
      });
    });

    ctx.restore();
  }

  function drawCenterText(time) {
    ctx.save();
    ctx.translate(cx, cy);

    const glow = 0.5 + Math.sin(time * 0.003) * 0.5;

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
    g.addColorStop(0, `rgba(87, 255, 245, ${0.32 + glow * 0.12})`);
    g.addColorStop(0.45, "rgba(40, 213, 234, 0.14)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 155, 0, Math.PI * 2);
    ctx.fill();

    const lockedCount = rings.filter(r => r.locked).length;
    const parts = ["ЛО", "ГУ", "ВА", "НН", "Я"];
    const display = parts
      .map((p, i) => (rings[i]?.locked ? p : i === getRequiredRingIndex() ? p : " "))
      .join(" ");

    ctx.font = `1000 ${Math.min(58, width * 0.045)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "6px";
    ctx.fillStyle = "rgba(237, 255, 247, 0.95)";
    ctx.shadowColor = "rgba(75, 255, 236, 0.95)";
    ctx.shadowBlur = 28;
    ctx.fillText(display || KEY_WORD, 0, 0);

    ctx.font = "900 12px Arial, sans-serif";
    ctx.fillStyle = "rgba(232, 247, 255, 0.62)";
    ctx.shadowBlur = 8;
    ctx.fillText(unlocked ? "СИСТЕМА РОЗБЛОКОВАНА" : `СИСТЕМА ЗАБЛОКОВАНА · ${lockedCount}/5`, 0, 46);

    ctx.restore();
  }

  function drawSparks(dt) {
    ctx.save();

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];

      s.x += s.vx * dt * 0.055;
      s.y += s.vy * dt * 0.055;
      s.vx *= 0.965;
      s.vy *= 0.965;
      s.life -= dt * 0.0018;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.fillStyle = `rgba(125, 255, 225, ${s.life})`;
      ctx.shadowColor = "rgba(72, 242, 255, 0.9)";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawFlash() {
    if (flash <= 0) return;

    ctx.save();
    ctx.fillStyle = `rgba(134, 255, 245, ${Math.min(flash, 0.42)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function updateRings(dt) {
    rings.forEach((ring, index) => {
      if (ring.locked) {
        ring.match = 100;
        ring.pulse *= 0.92;
        return;
      }

      ring.angle += ring.velocity * dt * 0.09;
      ring.velocity *= ring.physics === "unstable" ? 0.925 : 0.94;

      if (ring.physics === "drift" && isRingAllowed(index)) {
        ring.angle += Math.sin(performance.now() * 0.0012) * 0.035 * dt;
      }

      if (ring.physics === "unstable" && isRingAllowed(index)) {
        ring.angle += Math.sin(performance.now() * 0.003) * 0.025 * dt;
      }

      const diff = angleDistance(ring.angle, ring.target);
      ring.match = Math.max(0, 100 - diff * 1.2);

      if (isRingAllowed(index)) {
        checkRingLock(ring);
      }

      ring.pulse *= 0.9;
    });
  }

  function draw(time) {
    const dt = Math.min(32, time - lastTime);
    lastTime = time;

    globalPulse += dt * 0.001;
    flash *= 0.9;
    shake *= 0.86;

    updateRings(dt);

    ctx.clearRect(0, 0, width, height);

    if (shake > 0.2) {
      ctx.save();
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }

    drawBackground(time);
    drawParticles(time, dt);
    drawRingGuides(time);
    drawLetters(time);
    drawCenterText(time);
    drawSparks(dt);
    drawFlash();

    if (shake > 0.2) {
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  function handleWheel(e) {
    if (unlocked) return;

    const ringIndex = getRingAtPosition(e.clientX, e.clientY);

    if (ringIndex < 0) return;

    e.preventDefault();

    activeRing = ringIndex;

    const ring = rings[ringIndex];

    if (ring.locked) {
      updateHud();
      return;
    }

    if (!isRingAllowed(ringIndex)) {
      shake = Math.max(shake, 4);
      flash = Math.max(flash, 0.18);
      updateHud();
      return;
    }

    applyRingPhysics(ring, e.deltaY);
    checkRingLock(ring);

    const rect = canvas.getBoundingClientRect();
    addSpark(e.clientX - rect.left, e.clientY - rect.top, Math.abs(e.deltaY) > 80 ? 7 : 3);

    updateHud();
  }

  function handleMove(e) {
    if (unlocked) return;

    activeRing = getRingAtPosition(e.clientX, e.clientY);
    updateHud();
  }

  function bindEvents() {
    shell.addEventListener("wheel", handleWheel, { passive: false });
    shell.addEventListener("mousemove", handleMove);
    shell.addEventListener("mouseleave", () => {
      activeRing = -1;
      updateHud();
    });

    window.addEventListener("resize", resize);

    if (resetBtn) {
      resetBtn.addEventListener("click", resetLock);
    }

    if (lockAgainBtn) {
      lockAgainBtn.addEventListener("click", () => {
        resetLock();
        shell.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  }

  createRings();
  buildLetters();
  createParticles();
  resize();
  bindEvents();
  updateHud();
  requestAnimationFrame(draw);
})();
