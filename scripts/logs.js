const canvas = document.getElementById("vortexCanvas");
const ctx = canvas.getContext("2d");

let W, H, CX, CY;
let letters = [];
let progress = 0;
let unlocked = false;

// ===== INIT =====
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * dpr;
  canvas.height = H * dpr;

  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  CX = W / 2;
  CY = H / 2;
}

function createLetters() {
  const chars = "ЛОГУВАННЯABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 200; i++) {
    letters.push({
      char: chars[Math.floor(Math.random() * chars.length)],
      angle: Math.random() * Math.PI * 2,
      radius: 50 + Math.random() * 400,
      depth: Math.random(),
      speed: 0.002 + Math.random() * 0.004
    });
  }
}

// ===== SCROLL =====
window.addEventListener("wheel", (e) => {
  if (unlocked) return;

  e.preventDefault();

  progress += e.deltaY * 0.0015;
  progress = Math.max(0, Math.min(1, progress));

  if (progress >= 1) unlock();
}, { passive: false });

// ===== DRAW =====
function draw() {
  requestAnimationFrame(draw);

  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < letters.length; i++) {
    const l = letters[i];

    l.angle += l.speed * (1 + progress * 3);

    let radius = l.radius * (1 - progress * 0.8);
    let scale = 0.5 + l.depth * (1 + progress);

    let x = CX + Math.cos(l.angle) * radius;
    let y = CY + Math.sin(l.angle) * radius;

    if (progress > 0.6) {
      let t = (progress - 0.6) / 0.4;

      const word = "ЛОГУВАННЯ";
      const spacing = 26;

      let tx = CX - (word.length * spacing) / 2 + (i % word.length) * spacing;
      let ty = CY;

      x = lerp(x, tx, t);
      y = lerp(y, ty, t);

      l.char = word[i % word.length];
      scale = lerp(scale, 1.2, t);
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = `rgba(120,220,255,${0.5 + l.depth * 0.5})`;
    ctx.font = "18px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(l.char, 0, 0);
    ctx.restore();
  }
}

// ===== UTILS =====
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ===== UNLOCK =====
function unlock() {
  unlocked = true;

  document.body.classList.remove("lock-scroll");

  const content = document.getElementById("logsContent");
  content.classList.add("visible");

  content.scrollIntoView({ behavior: "smooth" });
}

// ===== START =====
resize();
createLetters();
draw();

window.addEventListener("resize", resize);
