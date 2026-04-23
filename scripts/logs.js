// ===== SETTINGS =====
const LETTER_COUNT = 140; // баланс між красою і перфомансом
const MAX_DPR = 1.5;

// ===== STATE =====
let canvas, ctx;
let letters = [];
let progress = 0;
let isUnlocked = false;
let lastTime = 0;

// ===== INIT =====
function initLogsVortex() {
  canvas = document.getElementById("vortexCanvas");
  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  ctx = canvas.getContext("2d");

  resizeCanvas();
  createLetters();

  document.body.classList.add("lock-scroll");

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("resize", resizeCanvas);

  animate(0);
}

// ===== CANVAS =====
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ===== LETTERS =====
function createLetters() {
  const chars = "ЛОГУВАННЯABCDEFGHIJKLMNOPQRSTUVWXYZ";

  letters = [];

  for (let i = 0; i < LETTER_COUNT; i++) {
    letters.push({
      char: chars[Math.floor(Math.random() * chars.length)],
      angle: Math.random() * Math.PI * 2,
      radius: 120 + Math.random() * 260,
      speed: 0.003 + Math.random() * 0.004,
      offset: Math.random() * 100
    });
  }
}

// ===== SCROLL =====
function handleWheel(e) {
  if (isUnlocked) return;

  e.preventDefault();

  progress += e.deltaY * 0.0015;
  progress = Math.max(0, Math.min(1, progress));

  if (progress >= 1) unlockScroll();
}

// ===== ANIMATION =====
function animate(time) {
  requestAnimationFrame(animate);

  // FPS LIMIT (~50fps)
  if (time - lastTime < 20) return;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawVortex(time);
}

// ===== DRAW =====
function drawVortex(time) {
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;

  ctx.font = "16px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < letters.length; i++) {
    const l = letters[i];

    // рух
    l.angle += l.speed;

    // легке "дихання"
    const wave = Math.sin(time * 0.001 + l.offset) * 10;

    let radius = l.radius + wave;

    // стискання при скролі
    radius *= (1 - progress * 0.75);

    let x = cx + Math.cos(l.angle) * radius;
    let y = cy + Math.sin(l.angle) * radius;

    // фінальне складання слова
    if (progress > 0.7) {
      const t = (progress - 0.7) / 0.3;

      const word = "ЛОГУВАННЯ";
      const spacing = 22;

      const targetX =
        cx - (word.length * spacing) / 2 + (i % word.length) * spacing;
      const targetY = cy;

      x = lerp(x, targetX, t);
      y = lerp(y, targetY, t);

      l.char = word[i % word.length];
    }

    // glow (легкий, не вбиває FPS)
    ctx.fillStyle = "rgba(80,200,255,0.9)";
    ctx.fillText(l.char, x, y);
  }
}

// ===== UTILS =====
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ===== UNLOCK =====
function unlockScroll() {
  isUnlocked = true;

  document.body.classList.remove("lock-scroll");

  const content = document.getElementById("logsContent");
  if (content) {
    content.classList.add("visible");
    content.scrollIntoView({ behavior: "smooth" });
  }
}

// ===== START =====
document.addEventListener("DOMContentLoaded", initLogsVortex);
