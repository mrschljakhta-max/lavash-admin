(() => {
  const KEY_WORD = 'ЛОГУВАННЯ';
  // ВАЖЛИВО: не ставимо Math.PI * 2 / 4 / 8, бо це дає фазу 0
  // і замок одразу вважає себе зібраним при першому рендері.
  const UNLOCK_PHASE = 4.35; // правильне положення вихору в радіанах
  const SNAP_ZONE = 0.30;
  const MIN_SCROLL_DELTA_TO_UNLOCK = 900; // користувач має реально докрутити замок

  let cleanup = null;

  function initLogsPage() {
    if (typeof cleanup === 'function') cleanup();

    const page = document.getElementById('logsPage');
    const lock = document.getElementById('logsLock');
    const canvas = document.getElementById('logsVortexCanvas');
    const progress = document.getElementById('logsVortexProgress');
    const status = document.getElementById('logsVortexStatus');
    const resetBtn = document.getElementById('logsLockReset');

    if (!page || !lock || !canvas) return;

    const ctx = canvas.getContext('2d');
    const lettersPool = buildLettersPool();

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

    const letters = lettersPool.map((char, index) => ({
      char,
      seed: Math.random() * 1000,
      ring: index % 9,
      index,
      baseAngle: (index / lettersPool.length) * Math.PI * 2 * 5.2,
      radiusJitter: Math.random() * 34 - 17,
      size: 12 + Math.random() * 18 + (index % 7 === 0 ? 12 : 0),
    }));

    function buildLettersPool() {
      const noise = 'АБВГДЕЄЖЗИКЛМНОПРСТУФХЦЧШЮЯ0123456789ACCESSLOGS';
      const arr = [];
      for (let i = 0; i < 118; i += 1) arr.push(noise[i % noise.length]);
      KEY_WORD.split('').forEach((char, i) => arr.splice(28 + i * 7, 0, char));
      return arr;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(320, rect.width);
      height = Math.max(320, rect.height);
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

    function drawRings(cx, cy, maxR, snap) {
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < 12; i += 1) {
        const r = maxR * (0.13 + i * 0.072);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(104, 223, 255, ${0.035 + snap * 0.035})`;
        ctx.lineWidth = i % 3 === 0 ? 1.4 : 0.6;
        ctx.stroke();
      }
      ctx.restore();
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
        angle += diff * 0.026 * snap;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.46;
      const turbulence = Math.min(Math.abs(velocity) * 34, 30) * (1 - snap * 0.72);

      drawRings(cx, cy, maxR, snap);

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grd.addColorStop(0, `rgba(102, 241, 255, ${0.25 + snap * 0.32})`);
      grd.addColorStop(0.28, 'rgba(42, 167, 255, 0.08)');
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      letters.forEach((item) => {
        const depth = item.index / letters.length;
        const spiralR = maxR * (0.11 + depth * 0.86) + item.radiusJitter;
        const twist = item.baseAngle + angle * (1.55 - depth * 0.62) + depth * 7.8;
        const wave = Math.sin(time * 2.2 + item.seed + angle) * turbulence;
        const x = cx + Math.cos(twist) * (spiralR + wave);
        const y = cy + Math.sin(twist) * (spiralR + wave * 0.55);
        const sizeBoost = snap * (item.char === KEY_WORD[item.index % KEY_WORD.length] ? 10 : 4);
        const alpha = 0.18 + (1 - depth) * 0.68 + snap * 0.22;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(twist + Math.PI / 2);
        ctx.font = `900 ${item.size + sizeBoost}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = `rgba(80, 232, 255, ${0.32 + snap * 0.55})`;
        ctx.shadowBlur = 8 + snap * 18 + Math.abs(velocity) * 1.5;
        ctx.fillStyle = `rgba(225, 250, 255, ${Math.min(1, alpha)})`;
        ctx.fillText(item.char, 0, 0);
        ctx.restore();
      });

      if (progress) progress.style.width = `${Math.round(snap * 100)}%`;
      if (status) {
        status.textContent = snap > 0.82 ? 'майже зібрано' : snap > 0.42 ? 'сигнал вирівнюється' : 'система заблокована';
      }

      if (
        !unlocked &&
        hasInteracted &&
        userScrollPower >= MIN_SCROLL_DELTA_TO_UNLOCK &&
        snap > 0.965 &&
        Math.abs(velocity) < 0.45
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
