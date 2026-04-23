const canvas = document.getElementById("vortexCanvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

canvas.width = W;
canvas.height = H;

let centerX = W / 2;
let centerY = H / 2;

// ===== БУКВИ =====
const letters = "ЛОГУВАННЯ".split("");

let angleOffset = 0; // керується колесом

// ===== СКРОЛ =====
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  angleOffset += e.deltaY * 0.002;
}, { passive: false });

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, W, H);

  const radius = 150;

  ctx.font = "30px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#4cc9ff";

  for (let i = 0; i < letters.length; i++) {
    const angle = (i / letters.length) * Math.PI * 2 + angleOffset;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.fillText(letters[i], x, y);
  }

  requestAnimationFrame(draw);
}

draw();
