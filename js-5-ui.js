/* ═══════════════════════════════════════════════════════
   JS 5 — Builder, Roulette, Modal, Tabs, Theme,
           Toast, Keyboard Shortcuts, Boot
   ═══════════════════════════════════════════════════════ */

// ── BUILDER ───────────────────────────────────────────
function buildPrompt() {
  const catId       = document.getElementById('bCat').value;
  const tone        = document.getElementById('bTone').value;
  const diff        = document.getElementById('bDiff').value.toLowerCase();
  const len         = document.getElementById('bLen').value;
  const personality = document.getElementById('bPersonality').value;
  const pool        = PROMPTS[catId] || [];
  const filtered    = pool.filter(p => p.diff === diff);
  const src         = filtered.length ? filtered : pool;
  if (!src.length) { showToast('No prompts for this combination'); return; }
  const picked         = src[Math.floor(Math.random() * src.length)];
  const personalityPfx = personality !== 'None' ? `[${personality}] ` : '';
  const lenSuffix      = len === 'Short' ? ' Keep it brief.'
                       : len === 'Long'  ? ' Go in-depth.'
                       : len === 'Detailed' ? ' Provide exhaustive detail.' : '';
  const finalPrompt = {
    text:  personalityPfx + picked.text + ` Tone: ${tone}.` + lenSuffix,
    tags:  [...(picked.tags || []), `#${tone}`, `#${len}`],
    diff:  diff,
    catId: catId,
  };
  addToHistory(finalPrompt);
  state.stats.total++; saveStats();
  document.getElementById('builderGrid').innerHTML = renderPromptCard(finalPrompt, 0);
  showToast('Prompt built');
}

// ── ROULETTE ──────────────────────────────────────────
function initSlots() {
  for (let i = 1; i <= 3; i++) {
    const track = document.getElementById(`slot${i}`);
    const items = [...SLOT_OPTIONS[i-1], ...SLOT_OPTIONS[i-1]];
    track.innerHTML = items.map(s => `<div class="slot-item">${s}</div>`).join('');
  }
}

let spinning = false, spinIntervals = [];

function spinRoulette() {
  if (spinning) return;
  spinning = true;
  document.getElementById('spinBtn').style.display = 'none';
  document.getElementById('stopBtn').style.display = '';
  for (let i = 1; i <= 3; i++) {
    const track = document.getElementById(`slot${i}`);
    let pos = 0;
    const speed = 8 + i * 4;
    const interval = setInterval(() => {
      pos = (pos + speed) % (54 * SLOT_OPTIONS[i-1].length);
      track.style.transform = `translateY(-${pos}px)`;
    }, 30);
    spinIntervals.push(interval);
  }
}

function stopRoulette() {
  if (!spinning) return;
  spinIntervals.forEach(id => clearInterval(id));
  spinIntervals = [];
  spinning = false;
  document.getElementById('spinBtn').style.display = '';
  document.getElementById('stopBtn').style.display = 'none';
  const catLabel = SLOT_OPTIONS[0][Math.floor(Math.random() * SLOT_OPTIONS[0].length)];
  const catId    = CATEGORIES.find(c => c.label.toLowerCase().startsWith(catLabel.toLowerCase()))?.id || 'programming';
  const pool     = PROMPTS[catId] || PROMPTS.programming;
  const picked   = pool[Math.floor(Math.random() * pool.length)];
  addToHistory({ ...picked, catId });
  state.stats.total++; saveStats();
  document.getElementById('rouletteGrid').innerHTML = renderPromptCard({ ...picked, catId }, 0);
  showToast(`Landed on: ${catLabel}`);
}

// ── MODAL ─────────────────────────────────────────────
function openModal(text) {
  const decoded = text.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  document.getElementById('modalTitle').textContent = 'Full Prompt';
  document.getElementById('modalBody').textContent  = decoded;
  document.getElementById('modal').classList.add('show');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal'))
    document.getElementById('modal').classList.remove('show');
}

function showShortcutsModal() {
  document.getElementById('shortcutsModal').classList.add('show');
}

function closeShortcutsModal(e) {
  if (e.target === document.getElementById('shortcutsModal'))
    document.getElementById('shortcutsModal').classList.remove('show');
}

// ── TABS ──────────────────────────────────────────────
function switchTab(name) {
  state.currentTab = name;
  document.querySelectorAll('.tab-btn').forEach(b  => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${name}`));
  if (name === 'favorites') renderFavorites();
  if (name === 'history')   renderHistory();
  if (name === 'stats')     renderStats();
}

// ── THEME ─────────────────────────────────────────────
function toggleTheme() {
  state.isDark = !state.isDark;
  document.body.classList.toggle('dark-mode', state.isDark);
  localStorage.setItem('pf_theme', state.isDark ? 'dark' : 'light');
  showToast(state.isDark ? 'Dark mode on' : 'Light mode on');
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast     = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// ── KEYBOARD SHORTCUTS ────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  if (e.key === ' ' && !e.ctrlKey)   { e.preventDefault(); switchTab('generate'); generatePrompts(); }
  if (e.ctrlKey && e.key === 'r')    { e.preventDefault(); switchTab('generate'); generatePrompts(true); }
  if (e.ctrlKey && e.key === 'c')    {
    if (state.lastPrompt) { e.preventDefault(); navigator.clipboard.writeText(state.lastPrompt.text).then(() => showToast('Last prompt copied')); }
  }
  if (e.ctrlKey && e.key === 'f')    { e.preventDefault(); switchTab('favorites'); }
  if (e.ctrlKey && e.key === 'h')    { e.preventDefault(); switchTab('history'); }
  if (e.key === 'Escape') {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('shortcutsModal').classList.remove('show');
  }
});

// ── BOOT ──────────────────────────────────────────────
init();
setTimeout(() => {
  generatePrompts();
  showToast('Welcome to PromptForge — press Space to generate');
}, 500);
