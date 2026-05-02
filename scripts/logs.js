// FIXED REINIT FOR ANIMATION
let animationFrame;

function initLogs() {
  const canvas = document.getElementById('logsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText('LOGS ACTIVE', 50, 50);
    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

window.addEventListener('page:loaded', () => {
  cancelAnimationFrame(animationFrame);
  initLogs();
});
