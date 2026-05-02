(() => {
  const KEY_WORD = 'ЛОГУВАННЯ';
  const TAU = Math.PI * 2;

  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const normDeg = (deg) => ((deg % 360) + 360) % 360;
  const shortestDeg = (a, b) => {
    const diff = Math.abs(normDeg(a) - normDeg(b));
    return Math.min(diff, 360 - diff);
  };

  function initLogsPage() {
    const page = document.getElementById('logsPage');
    const shell = document.getElementById('logsVortexShell');
    const canvas = document.getElementById('logsVortexCanvas');
    const statusEl = document.getElementById('logsRingStatus');
    const resetBtn = document.getElementById('logsVortexReset');
    const lockAgainBtn = document.getElementById('logsLockAgain');
    const panel = document.getElementById('logsUnlockPanel');

    if (!page || !shell || !canvas || page.dataset.logsReady === 'true') return;
    page.dataset.logsReady = 'true';

    const ctx = canvas.getContext('2d', { alpha: true });
    const state = {
      dpr: Math.max(1, Math.min(window.devicePixelRatio || 1, 2)),
      width: 0,
      height: 0,
      cx: 0,
      cy: 0,
      scale: 1,
      activeRing: -1,
      pointerX: 0,
      pointerY: 0,
      time: 0,
      unlocked: false,
      unlockFx: 0,
      pulses: [],
      sparks: [],
      dust: [],
      fieldRot: 0,
      lastWheelAt: 0,
      wrongOrderFx: 0,
      requiredOrder: [2, 0, 4, 1, 3],
      orderCursor: 0,
    };

    const alphabet = 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789';

    const rings = [
      { id: 0, name: 'I', radius: 104,  letterCount: 18, target: 314, angle: rand(42, 270), velocity: 0, invert: false, drag: .86, power: .055, weight: 1.00, wobble: 1.2, locked: false, hover: 0, lockFlash: 0, letters: [] },
      { id: 1, name: 'II', radius: 158, letterCount: 24, target: 128, angle: rand(30, 330), velocity: 0, invert: true,  drag: .88, power: .044, weight: 1.20, wobble: 1.9, locked: false, hover: 0, lockFlash: 0, letters: [] },
      { id: 2, name: 'III', radius: 216, letterCount: 30, target: 246, angle: rand(20, 340), velocity: 0, invert: false, drag: .91, power: .036, weight: 1.55, wobble: 2.5, locked: false, hover: 0, lockFlash: 0, letters: [] },
      { id: 3, name: 'IV', radius: 276, letterCount: 36, target: 68,  angle: rand(30, 300), velocity: 0, invert: true,  drag: .90, power: .030, weight: 1.80, wobble: 3.0, locked: false, hover: 0, lockFlash: 0, letters: [] },
      { id: 4, name: 'V', radius: 338, letterCount: 42, target: 202, angle: rand(35, 320), velocity: 0, invert: false, drag: .93, power: .025, weight: 2.20, wobble: 3.8, locked: false, hover: 0, lockFlash: 0, letters: [] },
    ];

    const keySlots = [
      { char: 'Л', ring: 2, offset: -216 },
      { char: 'О', ring: 0, offset: -162 },
      { char: 'Г', ring: 4, offset: -108 },
      { char: 'У', ring: 1, offset: -54 },
      { char: 'В', ring: 3, offset: 0 },
      { char: 'А', ring: 2, offset: 54 },
      { char: 'Н', ring: 0, offset: 108 },
      { char: 'Н', ring: 4, offset: 162 },
      { char: 'Я', ring: 1, offset: 216 },
    ];

    function buildLetters() {
      rings.forEach((ring) => {
        ring.letters = Array.from({ length: ring.letterCount }, (_, index) => ({
          char: alphabet[Math.floor(Math.random() * alphabet.length)],
          base: index * 360 / ring.letterCount,
          size: rand(14, 27),
          alpha: rand(.25, .7),
          depth: rand(.75, 1.22),
          fake: Math.random() > .78,
        }));
      });
    }

    function seedDust() {
      state.dust = Array.from({ length: 110 }, () => ({
        a: rand(0, TAU),
        r: rand(20, 380),
        speed: rand(.0009, .0038),
        size: rand(.55, 1.9),
        alpha: rand(.08, .32),
      }));
    }

    function resize() {
      const rect = shell.getBoundingClientRect();
      state.width = Math.max(320, rect.width);
      state.height = Math.max(420, rect.height);
      state.cx = state.width / 2;
      state.cy = state.height / 2 + 12;
      // v6: портал заповнює більшу частину сцени, але лишає повітря для HUD зверху/знизу.
      state.scale = clamp(Math.min(state.width / 1120, state.height / 720), .58, .98);
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    }

    function ringAtPoint(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - state.cx;
      const y = clientY - rect.top - state.cy;
      const distance = Math.sqrt(x * x + y * y) / state.scale;
      let best = -1;
      let bestDiff = Infinity;

      rings.forEach((ring, index) => {
        const diff = Math.abs(distance - ring.radius);
        if (diff < 34 && diff < bestDiff) {
          best = index;
          bestDiff = diff;
        }
      });

      return best;
    }

    function progressForRing(ring) {
      const diff = shortestDeg(ring.angle, ring.target);
      return clamp(1 - diff / 82, 0, 1);
    }

    function createPulse(ring, color = 'cyan') {
      state.pulses.push({
        ring: ring ? ring.id : -1,
        radius: ring ? ring.radius : 155,
        life: 1,
        color,
      });
    }

    function createSparks(ring, amount = 18) {
      const radius = (ring ? ring.radius : 220) * state.scale;
      for (let i = 0; i < amount; i++) {
        const a = rand(0, TAU);
        state.sparks.push({
          x: state.cx + Math.cos(a) * radius,
          y: state.cy + Math.sin(a) * radius,
          vx: Math.cos(a) * rand(.5, 3.4),
          vy: Math.sin(a) * rand(.5, 3.4),
          life: 1,
          size: rand(1, 3.2),
        });
      }
    }

    function updateStatus() {
      if (!statusEl) return;

      if (state.unlocked) {
        statusEl.textContent = 'Ключ прийнято · доступ відкрито';
        return;
      }

      if (state.activeRing < 0) {
        const lockedCount = rings.filter((ring) => ring.locked).length;
        statusEl.textContent = `Налаштовано ${lockedCount}/${rings.length} · порядок: ${state.requiredOrder.map(i => rings[i].name).join(' → ')}`;
        return;
      }

      const ring = rings[state.activeRing];
      const match = Math.round(progressForRing(ring) * 100);
      const expected = rings[state.requiredOrder[state.orderCursor]];
      statusEl.textContent = `Кільце ${ring.name} · SIGNAL MATCH ${match}% · наступне ${expected.name}`;
    }

    function tryLockRing(ring) {
      if (ring.locked) return;

      const match = progressForRing(ring);
      const isNear = (shortestDeg(ring.angle, ring.target) < 20 || match > .76) && Math.abs(ring.velocity) < 9.5;
      if (!isNear) return;

      const expectedIndex = state.requiredOrder[state.orderCursor];
      if (ring.id !== expectedIndex) {
        // Wrong order: glitch pulse and push ring away. Це ускладнює проходження, але не бісить повним скиданням.
        ring.velocity += (Math.random() > .5 ? 1 : -1) * rand(8, 15);
        state.wrongOrderFx = 1;
        createPulse(ring, 'red');
        createSparks(ring, 28);
        updateStatus();
        return;
      }

      ring.locked = true;
      ring.angle = ring.target;
      ring.velocity = 0;
      ring.lockFlash = 1;
      state.orderCursor += 1;
      createPulse(ring, 'green');
      createSparks(ring, 36);
      updateStatus();

      if (rings.every((item) => item.locked)) unlockLogs();
    }

    function unlockLogs() {
      if (state.unlocked) return;
      state.unlocked = true;
      state.unlockFx = 1;
      page.dataset.locked = 'false';
      shell.classList.add('is-unlocking');
      createPulse(null, 'green');
      createSparks(null, 90);
      updateStatus();

      window.setTimeout(() => {
        panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 760);
    }

    function resetLock() {
      rings.forEach((ring) => {
        ring.angle = rand(30, 330);
        ring.velocity = 0;
        ring.locked = false;
        ring.lockFlash = 0;
        ring.hover = 0;
      });
      state.activeRing = -1;
      state.orderCursor = 0;
      state.unlocked = false;
      state.unlockFx = 0;
      state.pulses = [];
      state.sparks = [];
      state.wrongOrderFx = 0;
      page.dataset.locked = 'true';
      shell.classList.remove('is-unlocking');
      buildLetters();
      updateStatus();
      shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function updatePhysics(dt) {
      state.time += dt;
      state.fieldRot += dt * 2.6;
      shell.style.setProperty('--logs-field-rot', `${state.fieldRot}deg`);
      state.wrongOrderFx *= .92;

      rings.forEach((ring, index) => {
        const hoverTarget = state.activeRing === index ? 1 : 0;
        ring.hover = lerp(ring.hover, hoverTarget, .13);

        if (!ring.locked) {
          const match = progressForRing(ring);
          const diff = shortestDeg(ring.angle, ring.target);

          if (match > .58 && Math.abs(ring.velocity) < 8.8) {
            const direct = normDeg(ring.target) - normDeg(ring.angle);
            const shortest = ((direct + 540) % 360) - 180;
            // Сильніше магнітне дотягування біля цілі, щоб останнє кільце не зависало на 90–92%.
            ring.velocity += shortest * (.032 + match * .045) * match;
          }

          // v6: прибрано випадкове розблокування кілець — замок має бути складним, але передбачуваним.
          ring.angle += ring.velocity * dt * 60;
          ring.velocity *= Math.pow(ring.drag, dt * 60);

          if ((diff < 20 || match > .76) && Math.abs(ring.velocity) < 9.5) tryLockRing(ring);
        } else {
          ring.angle = lerp(ring.angle, ring.target, .24);
          ring.lockFlash *= .88;
        }
      });

      state.pulses.forEach((pulse) => { pulse.life -= dt * 1.15; });
      state.pulses = state.pulses.filter((pulse) => pulse.life > 0);

      state.sparks.forEach((spark) => {
        spark.x += spark.vx * dt * 60;
        spark.y += spark.vy * dt * 60;
        spark.vx *= .975;
        spark.vy *= .975;
        spark.life -= dt * 1.35;
      });
      state.sparks = state.sparks.filter((spark) => spark.life > 0);
    }

    function drawBackground() {
      const w = state.width;
      const h = state.height;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(state.cx, state.cy, 0, state.cx, state.cy, Math.max(w, h) * .65);
      g.addColorStop(0, 'rgba(84,244,255,0.13)');
      g.addColorStop(.35, 'rgba(27,87,148,0.08)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(state.cx, state.cy);
      ctx.rotate(state.time * .045);
      for (let i = 0; i < 44; i++) {
        const a = i * TAU / 44;
        const len = Math.max(w, h);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 20, Math.sin(a) * 20);
        ctx.lineTo(Math.cos(a + .045) * len, Math.sin(a + .045) * len);
        ctx.strokeStyle = `rgba(84,244,255,${i % 3 === 0 ? .04 : .018})`;
        ctx.lineWidth = i % 5 === 0 ? 1.4 : .65;
        ctx.stroke();
      }
      ctx.restore();

      state.dust.forEach((p) => {
        p.a += p.speed;
        p.r -= p.speed * 18;
        if (p.r < 18) p.r = rand(300, 430);
        const x = state.cx + Math.cos(p.a + state.time * .02) * p.r * state.scale;
        const y = state.cy + Math.sin(p.a + state.time * .025) * p.r * state.scale;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, TAU);
        ctx.fillStyle = `rgba(141,239,255,${p.alpha})`;
        ctx.fill();
      });
    }


    function drawPortalOrnaments() {
      const outer = 410 * state.scale;
      const inner = 250 * state.scale;

      ctx.save();
      ctx.translate(state.cx, state.cy);

      // Велике енергетичне поле, щоб не було порожніх зон навколо вихору.
      for (let i = 0; i < 9; i++) {
        const r = inner + i * 34 * state.scale;
        const start = state.time * (.18 + i * .015) + i * .7;
        ctx.beginPath();
        ctx.arc(0, 0, r, start, start + Math.PI * (0.35 + (i % 3) * .08));
        ctx.strokeStyle = `rgba(84,244,255,${.035 + (i % 2) * .018})`;
        ctx.lineWidth = (i % 3 === 0 ? 2.1 : 1.05) * state.scale;
        ctx.shadowColor = 'rgba(84,244,255,.35)';
        ctx.shadowBlur = 16 * state.scale;
        ctx.stroke();
      }

      // Два похилих “гравітаційних розрізи”, як у sci-fi інтерфейсі.
      for (let side = -1; side <= 1; side += 2) {
        ctx.save();
        ctx.rotate(side * .42 + Math.sin(state.time * .22) * .025);
        const g = ctx.createLinearGradient(-outer, 0, outer, 0);
        g.addColorStop(0, 'rgba(84,244,255,0)');
        g.addColorStop(.48, 'rgba(84,244,255,.075)');
        g.addColorStop(.52, 'rgba(255,255,255,.10)');
        g.addColorStop(1, 'rgba(84,244,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-outer, -18 * state.scale);
        ctx.lineTo(outer, -42 * state.scale);
        ctx.lineTo(outer, 42 * state.scale);
        ctx.lineTo(-outer, 18 * state.scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Точки-орієнтири по великому зовнішньому радарному колу.
      for (let i = 0; i < 72; i++) {
        const a = i * TAU / 72 + state.time * .05;
        const r = outer + Math.sin(state.time + i) * 5 * state.scale;
        const size = (i % 6 === 0 ? 2.3 : 1.05) * state.scale;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, size, 0, TAU);
        ctx.fillStyle = `rgba(170,247,255,${i % 6 === 0 ? .32 : .12})`;
        ctx.fill();
      }

      ctx.restore();
    }

    function drawRingRail(ring, index) {
      const r = ring.radius * state.scale;
      const active = ring.hover;
      const match = progressForRing(ring);
      const alpha = ring.locked ? .8 : (.12 + active * .42 + match * .18);

      ctx.save();
      ctx.translate(state.cx, state.cy);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.strokeStyle = ring.locked
        ? `rgba(77,255,154,${.35 + ring.lockFlash * .5})`
        : `rgba(84,244,255,${alpha})`;
      ctx.lineWidth = (ring.locked ? 2.2 : 1.1 + active * 2.1) * state.scale;
      ctx.shadowColor = ring.locked ? 'rgba(77,255,154,.75)' : 'rgba(84,244,255,.7)';
      ctx.shadowBlur = (ring.locked ? 24 : active * 28 + match * 18) * state.scale;
      ctx.stroke();

      if (active || match > .52 || ring.locked) {
        const sweepA = state.time * (1.3 + index * .11) + index;
        ctx.beginPath();
        ctx.arc(0, 0, r, sweepA, sweepA + .46 + active * .28);
        ctx.strokeStyle = ring.locked ? 'rgba(180,255,220,.92)' : 'rgba(255,255,255,.78)';
        ctx.lineWidth = (2.6 + active * 1.6) * state.scale;
        ctx.shadowBlur = 30 * state.scale;
        ctx.stroke();
      }

      // hidden target notch only glows when near target
      if (match > .35 && !ring.locked) {
        const a = ring.target * Math.PI / 180;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 4 + match * 5, 0, TAU);
        ctx.fillStyle = `rgba(84,244,255,${.18 + match * .55})`;
        ctx.shadowBlur = 20 * state.scale;
        ctx.fill();
      }

      ctx.restore();
    }

    function drawLettersForRing(ring, ringIndex) {
      const r = ring.radius * state.scale;
      const active = ring.hover;
      const match = progressForRing(ring);
      const baseAngle = ring.angle * Math.PI / 180;
      const wobblePower = ring.locked ? 0 : ring.wobble * (1 - match * .65) * (1 + Math.abs(ring.velocity) * .018);

      ctx.save();
      ctx.translate(state.cx, state.cy);

      ring.letters.forEach((letter, index) => {
        const local = letter.base * Math.PI / 180;
        const turbulence = Math.sin(state.time * (1.8 + ringIndex * .22) + index * 1.71) * wobblePower * state.scale;
        const rr = r + turbulence;
        const a = baseAngle + local + Math.sin(state.time * .8 + index) * .004 * (1 - match);
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        const front = (Math.sin(a) + 1) / 2;
        const size = (letter.size * (.78 + front * .42) + active * 2.8 + match * 2.2) * state.scale;
        const alpha = clamp(letter.alpha + front * .22 + active * .18 + match * .25 - (ring.locked ? 0 : 0), .08, .95);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + Math.PI / 2);
        ctx.font = `900 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = ring.locked ? 'rgba(77,255,154,.95)' : 'rgba(84,244,255,.9)';
        ctx.shadowBlur = (active * 18 + match * 14 + (letter.fake ? 8 : 0)) * state.scale;
        ctx.fillStyle = ring.locked
          ? `rgba(210,255,235,${alpha})`
          : `rgba(202,244,255,${alpha})`;
        ctx.fillText(letter.char, 0, 0);
        ctx.restore();
      });

      ctx.restore();
    }

    function drawCenterKey() {
      const progressByRing = rings.map(progressForRing);
      const lockedCount = rings.filter(r => r.locked).length;
      const global = lockedCount / rings.length;
      const letterGap = 50 * state.scale;
      const startX = state.cx - ((KEY_WORD.length - 1) * letterGap) / 2;
      const y = state.cy + 3 * state.scale;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // subtle core, no ugly plaque
      const core = ctx.createRadialGradient(state.cx, state.cy, 0, state.cx, state.cy, 165 * state.scale);
      core.addColorStop(0, `rgba(84,244,255,${.14 + global * .22})`);
      core.addColorStop(.45, `rgba(12,36,61,${.32 + global * .18})`);
      core.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(state.cx, state.cy, 176 * state.scale, 0, TAU);
      ctx.fill();

      keySlots.forEach((slot, index) => {
        const ring = rings[slot.ring];
        const match = progressByRing[slot.ring];
        const locked = ring.locked;
        const x = startX + index * letterGap;
        const scatterA = (ring.angle + slot.offset) * Math.PI / 180;
        const scatterR = ring.radius * state.scale * (.92 - match * .54);
        const sx = state.cx + Math.cos(scatterA) * scatterR;
        const sy = state.cy + Math.sin(scatterA) * scatterR;
        const px = lerp(sx, x, locked ? 1 : Math.pow(match, 2.4));
        const py = lerp(sy, y, locked ? 1 : Math.pow(match, 2.4));
        const alpha = clamp(.18 + match * .82, .18, 1);
        const size = (locked ? 46 : 28 + match * 18) * state.scale;

        ctx.save();
        ctx.translate(px, py);
        ctx.font = `1000 ${size}px Inter, system-ui, sans-serif`;
        ctx.shadowColor = locked ? 'rgba(77,255,154,.8)' : 'rgba(84,244,255,.88)';
        ctx.shadowBlur = (locked ? 34 : 12 + match * 26) * state.scale;
        ctx.fillStyle = locked ? `rgba(229,255,244,${alpha})` : `rgba(84,244,255,${alpha})`;
        ctx.fillText(slot.char, 0, 0);
        ctx.restore();
      });

      ctx.font = `900 ${12 * state.scale}px ui-monospace, monospace`;
      ctx.fillStyle = `rgba(225,239,255,${.28 + global * .48})`;
      ctx.letterSpacing = '2px';
      ctx.fillText(state.unlocked ? 'КЛЮЧ ПРИЙНЯТО' : 'СИСТЕМА ЗАБЛОКОВАНА', state.cx, state.cy + 62 * state.scale);

      if (state.wrongOrderFx > .03) {
        ctx.font = `1000 ${16 * state.scale}px ui-monospace, monospace`;
        ctx.fillStyle = `rgba(255,77,120,${state.wrongOrderFx})`;
        ctx.shadowColor = 'rgba(255,77,120,.9)';
        ctx.shadowBlur = 24 * state.scale;
        ctx.fillText('НЕПРАВИЛЬНИЙ ПОРЯДОК КІЛЕЦЬ', state.cx, state.cy - 78 * state.scale);
      }

      ctx.restore();
    }

    function drawPulsesAndSparks() {
      state.pulses.forEach((pulse) => {
        const life = pulse.life;
        const r = pulse.radius * state.scale + (1 - life) * 105 * state.scale;
        ctx.save();
        ctx.translate(state.cx, state.cy);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, TAU);
        const color = pulse.color === 'red'
          ? `rgba(255,77,120,${life * .6})`
          : pulse.color === 'green'
            ? `rgba(77,255,154,${life * .62})`
            : `rgba(84,244,255,${life * .55})`;
        ctx.strokeStyle = color;
        ctx.lineWidth = (1 + (1 - life) * 4) * state.scale;
        ctx.shadowColor = color;
        ctx.shadowBlur = 26 * state.scale;
        ctx.stroke();
        ctx.restore();
      });

      state.sparks.forEach((spark) => {
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, TAU);
        ctx.fillStyle = `rgba(180,247,255,${spark.life})`;
        ctx.shadowColor = 'rgba(84,244,255,.9)';
        ctx.shadowBlur = 12 * state.scale;
        ctx.fill();
      });
    }

    let last = performance.now();
    function frame(now) {
      const dt = clamp((now - last) / 1000, .001, .04);
      last = now;

      updatePhysics(dt);
      drawBackground();
      drawPortalOrnaments();

      // back rings first
      rings.slice().reverse().forEach((ring, reverseIndex) => {
        const index = rings.length - 1 - reverseIndex;
        drawRingRail(ring, index);
      });

      rings.slice().reverse().forEach((ring, reverseIndex) => {
        const index = rings.length - 1 - reverseIndex;
        drawLettersForRing(ring, index);
      });

      drawCenterKey();
      drawPulsesAndSparks();
      updateStatus();
      requestAnimationFrame(frame);
    }

    canvas.addEventListener('mousemove', (event) => {
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.activeRing = state.unlocked ? -1 : ringAtPoint(event.clientX, event.clientY);
    });

    canvas.addEventListener('mouseleave', () => {
      state.activeRing = -1;
    });

    canvas.addEventListener('wheel', (event) => {
      if (state.unlocked) return;
      const index = state.activeRing;
      if (index < 0) return;

      event.preventDefault();
      state.lastWheelAt = Date.now();
      const ring = rings[index];
      if (ring.locked) return;

      const direction = ring.invert ? -1 : 1;
      const delta = clamp(event.deltaY, -140, 140);
      ring.velocity += direction * delta * ring.power / ring.weight;

      // Якщо користувач уже підвів правильне кільце близько до цілі — одразу даємо замку клацнути.
      if (state.requiredOrder[state.orderCursor] === ring.id && progressForRing(ring) > .74) {
        tryLockRing(ring);
      }

      if (Math.abs(ring.velocity) > 4.5) {
        createSparks(ring, 3);
      }
    }, { passive: false });

    resetBtn?.addEventListener('click', resetLock);
    lockAgainBtn?.addEventListener('click', resetLock);
    window.addEventListener('resize', resize);

    buildLetters();
    seedDust();
    resize();
    updateStatus();
    requestAnimationFrame(frame);
  }

  window.LAVASH_LOGS = { initLogsPage };
})();
