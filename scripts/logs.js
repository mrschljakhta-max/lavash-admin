// ====== SETTINGS ======
const LETTER_COUNT = 120; // було більше → лагало
const MAX_DPR = 1.5; // обмеження DPI

// ====== STATE ======
let canvas, ctx;
let letters = [];
let progress = 0;
let isUnlocked = false;
let animationId;
let lastTime = 0;

// ====== INIT ======
function initLogsVortex() {
  canvas = document.getElementById("vortexCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  resizeCanvas();
  createLetters();

  document.body.classList.add("lock-scroll");

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("resize", debounce(resizeCanvas, 200));

  animate(0);
}

// ====== CANVAS ======
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ====== LETTERS ======
function createLetters() {
  const chars = "ЛОГУВАННЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  letters = [];

  for (let i = 0; i < LETTER_COUNT; i++) {
    letters.push({
      char: chars[Math.floor(Math.random() * chars.length)],
      angle: Math.random() * Math.PI * 2,
      radius: 200 + Math.random() * 200,
      speed: 0.002 + Math.random() * 0.003,
      size: 12 + Math.random() * 10
    });
  }
}

// ====== SCROLL ======
function handleWheel(e) {
  if (isUnlocked) return;

  e.preventDefault();

  progress += e.deltaY * 0.0015;
  progress = Math.max(0, Math.min(1, progress));

  if (progress >= 1) unlockScroll();
}

// ====== ANIMATION ======
function animate(time) {
  animationId = requestAnimationFrame(animate);

  // FPS LIMIT (60 → ~45)
  if (time - lastTime < 22) return;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawVortex();
}

// ====== DRAW ======
function drawVortex() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < letters.length; i++) {
    const l = letters[i];

    l.angle += l.speed;

    let radius = l.radius * (1 - progress * 0.7);

    let x = cx + Math.cos(l.angle) * radius;
    let y = cy + Math.sin(l.angle) * radius;

    // фінальне збирання
    if (progress > 0.7) {
      const t = (progress - 0.7) / 0.3;

      const targetX = cx + (i - LETTER_COUNT / 2) * 6;
      const targetY = cy;

      x = lerp(x, targetX, t);
      y = lerp(y, targetY, t);
    }

    // легкий glow (без лагів)
    ctx.fillStyle = "rgba(0,200,255,0.8)";
    ctx.fillText(l.char, x, y);
  }
}

// ====== UTILS ======
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function debounce(fn, delay) {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
}

// ====== UNLOCK ======
function unlockScroll() {
  isUnlocked = true;

  document.body.classList.remove("lock-scroll");

  const content = document.getElementById("logsContent");
  content.classList.add("visible");

  content.scrollIntoView({ behavior: "smooth" });
}

// ====== START ======
document.addEventListener("DOMContentLoaded", initLogsVortex);
