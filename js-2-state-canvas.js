/* ═══════════════════════════════════════════════════════
   JS 2 — Application State & Canvas Background Animation
   ═══════════════════════════════════════════════════════ */

// ── APPLICATION STATE ──────────────────────────────────
let state = {
  activeCategory:    'all',
  activePersonality: 'None',
  activeTag:         null,
  currentTab:        'generate',
  favorites:  JSON.parse(localStorage.getItem('pf_favorites') || '[]'),
  history:    JSON.parse(localStorage.getItem('pf_history')   || '[]'),
  stats:      JSON.parse(localStorage.getItem('pf_stats')     || JSON.stringify({ total:0, copies:0, downloads:0, byCat:{} })),
  lastPrompt: null,
  isDark:     localStorage.getItem('pf_theme') === 'dark',
  ratings:    JSON.parse(localStorage.getItem('pf_ratings')   || '{}'),
  dailyPrompt: '',
};

// ── CANVAS BACKGROUND — gentle floating orbs ──────────
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  const n = Math.floor(canvas.width * canvas.height / 14000);
  for (let i = 0; i < n; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 80 + 30,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a:  Math.random() * Math.PI * 2,
    });
  }
}

function drawBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.a += 0.003;
    if (p.x < -p.r)                p.x = canvas.width  + p.r;
    if (p.x > canvas.width  + p.r) p.x = -p.r;
    if (p.y < -p.r)                p.y = canvas.height + p.r;
    if (p.y > canvas.height + p.r) p.y = -p.r;
    const alpha = Math.sin(p.a) * 0.035 + 0.04;
    const grad  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grad.addColorStop(0, `rgba(86,124,141,${alpha})`);
    grad.addColorStop(1, 'rgba(86,124,141,0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  });
  requestAnimationFrame(drawBg);
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();
drawBg();
