(() => {
  const KEY_WORD = 'ЛОГУВАННЯ';
  const UNLOCK_PHASE = 4.35;
  const SNAP_ZONE = 0.34;
  const MIN_SCROLL_DELTA_TO_UNLOCK = 1100;

  let cleanup = null;

  function initLogsPage() {
    if (typeof cleanup === 'function') cleanup();

    const page = document.getElementById('logsPage');
    const lock = document.getElementById('logsLock');
    const canvas = document.getElementById('logsVortexCanvas');
    const progress = document.getElementById('logsVortexProgress');
    const status = document.getElementById('logsVortexStatus');
    const wordEl = document.getElementById('logsVortexWord');
    const resetBtn = document.getElementById('logsLockReset');

    if (!page || !lock || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let angle = 0;
    let velocity = 0;
    let time = 0;
    let unlocked = false;
    let rafId = 0;
    let userScrollPower = 0;
    let hasInteracted = false;

    const noiseLetters = buildNoiseLetters();
    const keyLetters = KEY_WORD.split('').map((char, index) => ({
      char,
      index,
      seed: Math.random() * 1000,
      baseAngle: (index / KEY_WORD.length) * Math.PI * 2 + 0.4,
      radiusJitter: Math.random() * 18 - 9,
    }));

    function buildNoiseLetters() {
      const noise = 'АБВГДЕЄЖЗИКЛМНОПРСТУФХЦЧШЮЯ0123456789ACCESSLOGS';
      const arr = [];
      for (let i = 0; i < 122; i += 1) {
        arr.push({
          char: noise[i % noise.length],
          seed: Math.random() * 1000,
          index: i,
          baseAngle: (i / 122) * Math.PI * 2 * 5.5,
          radiusJitter: Math.random() * 32 - 16,
          size: 11 + Math.random() * 15 + (i % 9 === 0 ? 9 : 0),
        });
      }
      return arr;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, rect.width);
      height = Math.max(300, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function distanceToUnlock() {
      const cycle = Math.PI * 2;
      const normalized = ((angle % cycle) + cycle) % cycle;
      const target = ((UNLOCK_PHASE % cycle) + cycle) % cycle;
      return Math.min(Math.abs(normalized - target), cycle - Math.abs(normalized - target));
    }

    function getSnap() {
      return Math.max(0, 1 - distanceToUnlock() / SNAP_ZONE);
    }

    function smoothstep(edge0, edge1, value) {
      const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
      return x * x * (3 - 2 * x);
    }

    function drawRings(cx, cy, maxR, snap) {
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < 12; i += 1) {
        const r = maxR * (0.13 + i * 0.072);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(104, 223, 255, ${0.035 + snap * 0.04})`;
        ctx.lineWidth = i % 3 === 0 ? 1.35 : 0.55;
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawNoise(cx, cy, maxR, snap, turbulence) {
      const fadeOut = smoothstep(0.52, 0.96, snap);
      noiseLetters.forEach((item) => {
        const depth = item.index / noiseLetters.length;
        const spiralR = maxR * (0.11 + depth * 0.86) + item.radiusJitter;
        const twist = item.baseAngle + angle * (1.55 - depth * 0.62) + depth * 7.8;
        const wave = Math.sin(time * 2.2 + item.seed + angle) * turbulence;
        const x = cx + Math.cos(twist) * (spiralR + wave);
        const y = cy + Math.sin(twist) * (spiralR + wave * 0.55);
        const alpha = (0.16 + (1 - depth) * 0.58 + snap * 0.12) * (1 - fadeOut * 0.72);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(twist + Math.PI / 2);
        ctx.font = `900 ${item.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = `rgba(80, 232, 255, ${0.22 + snap * 0.34})`;
        ctx.shadowBlur = 7 + snap * 15 + Math.abs(velocity) * 1.2;
        ctx.fillStyle = `rgba(225, 250, 255, ${Math.min(1, alpha)})`;
        ctx.fillText(item.char, 0, 0);
        ctx.restore();
      });
    }

    function drawKeyWord(cx, cy, maxR, snap, turbulence) {
      const assemble = smoothstep(0.48, 0.985, snap);
      const fontSize = Math.max(30, Math.min(54, width * 0.075));
      const spacing = fontSize * 0.92;
      const total = (KEY_WORD.length - 1) * spacing;

      keyLetters.forEach((item) => {
        const orbitR = maxR * (0.24 + item.index * 0.045) + item.radiusJitter;
        const twist = item.baseAngle + angle * (1.72 - item.index * 0.045) + item.index * 0.54;
        const wave = Math.sin(time * 2.5 + item.seed + angle) * turbulence;
        const orbitX = cx + Math.cos(twist) * (orbitR + wave);
        const orbitY = cy + Math.sin(twist) * (orbitR + wave * 0.45);
        const targetX = cx - total / 2 + item.index * spacing;
        const targetY = cy + fontSize * 0.11;
        const x = orbitX + (targetX - orbitX) * assemble;
        const y = orbitY + (targetY - orbitY) * assemble;
        const rot = (twist + Math.PI / 2) * (1 - assemble);
        const size = fontSize * (0.66 + assemble * 0.54);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.font = `950 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = `rgba(90, 245, 255, ${0.55 + assemble * 0.45})`;
        ctx.shadowBlur = 14 + assemble * 24;
        ctx.fillStyle = `rgba(127, 243, 255, ${0.52 + assemble * 0.48})`;
        ctx.fillText(item.char, 0, 0);
        ctx.restore();
      });
    }

    function updateUi(snap) {
      const percent = Math.round(snap * 100);
      if (progress) progress.style.width = `${percent}%`;

      if (status) {
        status.textContent = snap > 0.94 ? 'слово майже зібрано' : snap > 0.58 ? 'літери стають у лінію' : snap > 0.24 ? 'сигнал вирівнюється' : 'система заблокована';
      }

      if (wordEl) {
        const revealed = Math.floor(smoothstep(0.48, 0.98, snap) * KEY_WORD.length);
        const text = KEY_WORD.split('').map((char, index) => (index < revealed ? char : '·')).join('');
        wordEl.textContent = text;
        wordEl.classList.toggle('is-hot', snap > 0.72);
      }
    }

    function draw() {
      time += 0.016;
      velocity *= unlocked ? 0.86 : 0.935;
      angle += velocity;

      const snap = getSnap();
      if (!unlocked && snap > 0.08) {
        const cycle = Math.PI * 2;
        const target = ((UNLOCK_PHASE % cycle) + cycle) % cycle;
        const normalized = ((angle % cycle) + cycle) % cycle;
        let diff = target - normalized;
        if (diff > Math.PI) diff -= cycle;
        if (diff < -Math.PI) diff += cycle;
        angle += diff * 0.021 * snap;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.455;
      const turbulence = Math.min(Math.abs(velocity) * 34, 30) * (1 - snap * 0.72);

      drawRings(cx, cy, maxR, snap);

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grd.addColorStop(0, `rgba(102, 241, 255, ${0.20 + snap * 0.35})`);
      grd.addColorStop(0.30, 'rgba(42, 167, 255, 0.075)');
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      drawNoise(cx, cy, maxR, snap, turbulence);
      drawKeyWord(cx, cy, maxR, snap, turbulence);
      updateUi(snap);

      if (
        !unlocked &&
        hasInteracted &&
        userScrollPower >= MIN_SCROLL_DELTA_TO_UNLOCK &&
        snap > 0.987 &&
        Math.abs(velocity) < 0.42
      ) {
        unlock();
      }

      rafId = requestAnimationFrame(draw);
    }

    function onWheel(event) {
      if (unlocked) return;
      event.preventDefault();
      hasInteracted = true;
      userScrollPower += Math.abs(event.deltaY);
      velocity += event.deltaY * 0.0009;
    }

    function unlock() {
      unlocked = true;
      page.classList.add('is-unlocked');
      lock.classList.add('is-unlocked');
      if (status) status.textContent = 'доступ розблоковано';
      if (wordEl) {
        wordEl.textContent = KEY_WORD;
        wordEl.classList.add('is-hot');
      }
      setTimeout(() => {
        const dash = document.getElementById('logsDashboard');
        dash?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 520);
    }

    function reset() {
      unlocked = false;
      angle = 0;
      velocity = 0;
      userScrollPower = 0;
      hasInteracted = false;
      page.classList.remove('is-unlocked');
      lock.classList.remove('is-unlocked');
      lock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    lock.addEventListener('wheel', onWheel, { passive: false });
    resetBtn?.addEventListener('click', reset);

    cleanup = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      lock.removeEventListener('wheel', onWheel);
      resetBtn?.removeEventListener('click', reset);
    };
  }

  window.LAVASH_LOGS = { initLogsPage };
})();
