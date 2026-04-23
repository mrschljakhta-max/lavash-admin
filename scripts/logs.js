(() => {
  const PAGE_SELECTOR = '#logsPage';

  const STATE = {
    initialized: false,
    wheelProgress: 0,
    unlocked: false,
    rafId: 0,
    particles: [],
    targetPoints: [],
    workspace: null,
    intro: null,
    content: null,
    canvas: null,
    ctx: null,
    progressBar: null,
    viewportWidth: 0,
    viewportHeight: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    targetProgress: 0,
    currentProgress: 0,
    releaseQueued: false,
    resizeHandler: null,
    wheelHandler: null
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function getCharPool() {
    return 'ЛОГУВАННЯ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  function buildTargetPoints(width, height) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.max(1200, Math.floor(width));
    offCanvas.height = Math.max(680, Math.floor(height));
    const ctx = offCanvas.getContext('2d');

    ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const titleFontSize = Math.max(128, offCanvas.width * 0.12);
    ctx.font = `900 ${titleFontSize}px Inter, Arial, sans-serif`;
    ctx.fillText('ЛОГУВАННЯ', offCanvas.width / 2, offCanvas.height * 0.42);

    const subtitleFontSize = Math.max(28, offCanvas.width * 0.022);
    ctx.font = `700 ${subtitleFontSize}px Inter, Arial, sans-serif`;
    ctx.fillText('ЖУРНАЛ ПОДІЙ', offCanvas.width / 2, offCanvas.height * 0.58);

    const image = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
    const points = [];
    const gap = Math.max(8, Math.round(offCanvas.width / 130));

    for (let y = 0; y < offCanvas.height; y += gap) {
      for (let x = 0; x < offCanvas.width; x += gap) {
        const alpha = image[(y * offCanvas.width + x) * 4 + 3];
        if (alpha > 140) {
          points.push({
            x: x / offCanvas.width,
            y: y / offCanvas.height,
            size: Math.random() * 0.6 + 0.7
          });
        }
      }
    }

    return points;
  }

  function createParticles() {
    const { viewportWidth: width, viewportHeight: height } = STATE;
    const count = Math.max(320, Math.min(760, Math.floor(width * 0.55)));
    const charPool = getCharPool();

    STATE.targetPoints = buildTargetPoints(width, height);
    const targetPoints = STATE.targetPoints;
    const particles = [];

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const ring = Math.random();
      const radius = lerp(Math.min(width, height) * 0.18, Math.min(width, height) * 0.62, ring);
      const depth = Math.random() * 0.85 + 0.15;
      const target = targetPoints[i % targetPoints.length] || { x: 0.5, y: 0.5, size: 1 };

      particles.push({
        char: charPool[Math.floor(Math.random() * charPool.length)],
        angle,
        radius,
        depth,
        speed: (Math.random() * 0.014 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        drift: (Math.random() - 0.5) * 0.002,
        size: (Math.random() * 18 + 10) * depth,
        opacity: Math.random() * 0.5 + 0.35,
        offsetY: (Math.random() - 0.5) * height * 0.22,
        targetX: target.x,
        targetY: target.y,
        targetSize: target.size
      });
    }

    STATE.particles = particles;
  }

  function setupCanvas() {
    if (!STATE.canvas || !STATE.workspace) return;

    const rect = STATE.intro.getBoundingClientRect();
    STATE.viewportWidth = Math.max(1, Math.floor(rect.width));
    STATE.viewportHeight = Math.max(1, Math.floor(rect.height));

    STATE.canvas.width = Math.floor(STATE.viewportWidth * STATE.dpr);
    STATE.canvas.height = Math.floor(STATE.viewportHeight * STATE.dpr);
    STATE.canvas.style.width = `${STATE.viewportWidth}px`;
    STATE.canvas.style.height = `${STATE.viewportHeight}px`;
    STATE.ctx.setTransform(STATE.dpr, 0, 0, STATE.dpr, 0, 0);

    createParticles();
  }

  function render() {
    const { ctx, viewportWidth: width, viewportHeight: height, particles, currentProgress } = STATE;
    if (!ctx || !width || !height) return;

    const introProgress = clamp(currentProgress / 0.72, 0, 1);
    const formProgress = clamp((currentProgress - 0.55) / 0.45, 0, 1);
    const settle = easeOutCubic(formProgress);

    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const ringShrink = lerp(1, 0.22, easeInOutQuad(clamp(currentProgress, 0, 1)));
    const swirlBoost = lerp(1.15, 4.8, introProgress);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.angle += p.speed + p.drift * (1 + currentProgress * 2.2);

      const vortexRadius = p.radius * ringShrink * (1 + Math.sin(p.angle * 2.3 + i) * 0.02);
      const spiralX = centerX + Math.cos(p.angle * swirlBoost) * vortexRadius;
      const spiralY = centerY + Math.sin(p.angle * swirlBoost) * vortexRadius * 0.72 + p.offsetY * (1 - currentProgress * 0.72);

      const tx = p.targetX * width;
      const ty = p.targetY * height;
      const x = lerp(spiralX, tx, settle);
      const y = lerp(spiralY, ty, settle);
      const size = lerp(p.size, p.size * 0.66 * p.targetSize, settle);
      const alpha = lerp(p.opacity, 0.94, settle);
      const glow = 0.12 + settle * 0.26;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(lerp(p.angle * 0.22, 0, settle));
      ctx.font = `700 ${size}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = i % 9 === 0
        ? `rgba(112, 174, 255, ${alpha})`
        : `rgba(244, 247, 255, ${alpha})`;
      ctx.shadowBlur = size * 0.9;
      ctx.shadowColor = `rgba(84, 130, 255, ${glow})`;
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    }

    const vortexGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.42);
    vortexGlow.addColorStop(0, `rgba(57, 98, 255, ${0.08 + currentProgress * 0.08})`);
    vortexGlow.addColorStop(0.35, `rgba(30, 62, 171, ${0.06 + currentProgress * 0.06})`);
    vortexGlow.addColorStop(1, 'rgba(1, 8, 26, 0)');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = vortexGlow;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }

  function updateProgressUI() {
    if (STATE.progressBar) {
      STATE.progressBar.style.width = `${(STATE.currentProgress * 100).toFixed(1)}%`;
    }

    if (STATE.intro) {
      const formed = STATE.currentProgress >= 0.78;
      STATE.intro.classList.toggle('is-formed', formed);
      STATE.intro.classList.toggle('is-locked', !STATE.unlocked);
    }
  }

  function animate() {
    STATE.currentProgress = lerp(STATE.currentProgress, STATE.targetProgress, 0.12);
    if (Math.abs(STATE.currentProgress - STATE.targetProgress) < 0.0008) {
      STATE.currentProgress = STATE.targetProgress;
    }

    updateProgressUI();
    render();

    if (!STATE.unlocked && STATE.targetProgress >= 1 && STATE.currentProgress >= 0.995 && !STATE.releaseQueued) {
      STATE.releaseQueued = true;
      window.setTimeout(unlockLogsScroll, 180);
    }

    STATE.rafId = window.requestAnimationFrame(animate);
  }

  function lockWorkspaceScroll() {
    if (!STATE.workspace) return;
    STATE.workspace.style.overflow = 'hidden';
    STATE.workspace.scrollTop = 0;
    STATE.workspace.classList.add('logs-scroll-lock');
  }

  function unlockLogsScroll() {
    if (STATE.unlocked || !STATE.workspace) return;

    STATE.unlocked = true;
    STATE.workspace.style.overflow = 'auto';
    STATE.workspace.classList.remove('logs-scroll-lock');

    const page = document.querySelector(PAGE_SELECTOR);
    page?.classList.remove('is-scroll-locked');
    page?.classList.add('is-unlocked');

    STATE.content?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (STATE.wheelHandler) {
      STATE.workspace.removeEventListener('wheel', STATE.wheelHandler, { passive: false });
    }
  }

  function onWheel(event) {
    if (STATE.unlocked) return;

    event.preventDefault();

    const delta = Math.sign(event.deltaY) * Math.min(0.12, Math.abs(event.deltaY) / 850);
    STATE.wheelProgress = clamp(STATE.wheelProgress + delta, 0, 1);
    STATE.targetProgress = STATE.wheelProgress;
  }

  function bindEvents() {
    STATE.wheelHandler = onWheel;
    STATE.resizeHandler = () => {
      STATE.dpr = Math.min(window.devicePixelRatio || 1, 2);
      setupCanvas();
    };

    STATE.workspace.addEventListener('wheel', STATE.wheelHandler, { passive: false });
    window.addEventListener('resize', STATE.resizeHandler);
  }

  function destroyPrevious() {
    if (STATE.workspace && STATE.wheelHandler) {
      STATE.workspace.removeEventListener('wheel', STATE.wheelHandler, { passive: false });
    }
    if (STATE.resizeHandler) {
      window.removeEventListener('resize', STATE.resizeHandler);
    }
    if (STATE.rafId) {
      window.cancelAnimationFrame(STATE.rafId);
      STATE.rafId = 0;
    }
    STATE.initialized = false;
  }

  async function initLogsPage() {
    destroyPrevious();

    const page = document.querySelector(PAGE_SELECTOR);
    const workspace = document.getElementById('workspaceBody');
    const intro = document.getElementById('logsIntro');
    const content = document.getElementById('logsContent');
    const canvas = document.getElementById('logsVortexCanvas');

    if (!page || !workspace || !intro || !content || !canvas) return;

    STATE.workspace = workspace;
    STATE.intro = intro;
    STATE.content = content;
    STATE.canvas = canvas;
    STATE.ctx = canvas.getContext('2d');
    STATE.progressBar = document.getElementById('logsProgressBar');
    STATE.wheelProgress = 0;
    STATE.currentProgress = 0;
    STATE.targetProgress = 0;
    STATE.unlocked = false;
    STATE.releaseQueued = false;

    page.classList.add('is-scroll-locked');
    page.classList.remove('is-unlocked');

    lockWorkspaceScroll();
    setupCanvas();
    bindEvents();
    updateProgressUI();
    animate();

    STATE.initialized = true;
  }

  window.LAVASH_LOGS = {
    initLogsPage
  };
})();
