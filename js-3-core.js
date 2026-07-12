/* ═══════════════════════════════════════════════════════
   JS 3 — Init, Sidebar, Daily Prompt, Tags,
           Filtering, Generate, Render Prompt Cards
   ═══════════════════════════════════════════════════════ */

// ── INIT ──────────────────────────────────────────────
function init() {
  if (state.isDark) document.body.classList.add('dark-mode');
  renderSidebar();
  renderDailyPrompt();
  renderChallenge();
  renderTags();
  populateBuilderCats();
  initSlots();
  updateHeaderCount();
}

// ── SIDEBAR ───────────────────────────────────────────
function renderSidebar() {
  const catList = document.getElementById('catList');
  const allBtn = `<button class="cat-btn active" data-id="all" onclick="selectCategory('all')">
    <span class="cat-emoji">⭐</span> All Categories
    <span class="cat-count">${Object.values(PROMPTS).reduce((a,b) => a + b.length, 0)}</span>
  </button>`;
  catList.innerHTML = allBtn + CATEGORIES.map(c => `
    <button class="cat-btn" data-id="${c.id}" onclick="selectCategory('${c.id}')">
      <span class="cat-emoji">${c.emoji}</span> ${c.label}
      <span class="cat-count">${(PROMPTS[c.id]||[]).length}</span>
    </button>
  `).join('');

  const pg = document.getElementById('personalityGrid');
  const icons = { None:'🤖', Teacher:'👩‍🏫', Pirate:'🏴‍☠️', Shakespeare:'🎭', Hacker:'💾', CEO:'💼', Scientist:'🔬', Detective:'🔍' };
  pg.innerHTML = Object.keys(PERSONALITIES).map(p => `
    <button class="cat-btn${state.activePersonality === p ? ' active' : ''}" onclick="selectPersonality('${p}')">
      <span class="cat-emoji">${icons[p] || '🤖'}</span> ${p}
    </button>
  `).join('');
}

// ── DAILY PROMPT ──────────────────────────────────────
function renderDailyPrompt() {
  const day  = new Date().getDate() % DAILY_PROMPTS.length;
  const text = DAILY_PROMPTS[day];
  document.getElementById('dailyText').textContent = text;
  state.dailyPrompt = text;
}

// ── CHALLENGE ─────────────────────────────────────────
function renderChallenge() {
  document.getElementById('challengeText').textContent =
    CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
}
function newChallenge() {
  document.getElementById('challengeText').textContent =
    CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
}

// ── TAGS ──────────────────────────────────────────────
function renderTags() {
  const allTags = new Set();
  Object.values(PROMPTS).forEach(arr => arr.forEach(p => (p.tags||[]).forEach(t => allTags.add(t))));
  document.getElementById('tagsBar').innerHTML = [...allTags].map(t => `
    <span class="tag${state.activeTag === t ? ' active' : ''}" onclick="toggleTag('${t}')">${t}</span>
  `).join('');
}

function toggleTag(tag) {
  state.activeTag = state.activeTag === tag ? null : tag;
  renderTags();
  filterPrompts();
}

// ── BUILDER CATEGORY POPULATE ─────────────────────────
function populateBuilderCats() {
  document.getElementById('bCat').innerHTML = CATEGORIES.map(c =>
    `<option value="${c.id}">${c.emoji} ${c.label}</option>`
  ).join('');
}

// ── CATEGORY / PERSONALITY SELECT ─────────────────────
function selectCategory(id) {
  state.activeCategory = id;
  document.querySelectorAll('.cat-btn[data-id]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });
  const cat = CATEGORIES.find(c => c.id === id);
  document.getElementById('sectionTitle').textContent    = id === 'all' ? 'All Prompts' : `${cat.emoji} ${cat.label}`;
  document.getElementById('sectionSubtitle').textContent = cat ? cat.subcats.join(', ') : 'All categories combined';
}

function selectPersonality(p) {
  state.activePersonality = p;
  document.querySelectorAll('#personalityGrid .cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().includes(p));
  });
  showToast(`Personality: ${p} ${p !== 'None' ? '🎭' : '🤖'}`);
}

// ── PROMPT POOL ───────────────────────────────────────
function getPromptPool() {
  let pool = [];
  const cat = state.activeCategory;
  if (cat === 'all') {
    Object.entries(PROMPTS).forEach(([k, v]) => v.forEach(p => pool.push({ ...p, catId: k })));
  } else {
    (PROMPTS[cat]||[]).forEach(p => pool.push({ ...p, catId: cat }));
  }
  const lang = document.getElementById('langSelect')?.value || 'en';
  if (lang === 'hi') pool = [...pool, ...HINDI_PROMPTS.map(t => ({ text:t, tags:['#Hindi'], diff:'intermediate', catId:'all' }))];
  if (lang === 'es') pool = [...pool, ...SPANISH_PROMPTS.map(t => ({ text:t, tags:['#Spanish'], diff:'intermediate', catId:'all' }))];
  const diff = document.getElementById('diffSelect')?.value || 'all';
  if (diff !== 'all') pool = pool.filter(p => p.diff === diff);
  if (state.activeTag) pool = pool.filter(p => (p.tags||[]).includes(state.activeTag));
  const q = document.getElementById('searchInput')?.value.toLowerCase() || '';
  if (q) pool = pool.filter(p => p.text.toLowerCase().includes(q));
  return pool;
}

// ── GENERATE ──────────────────────────────────────────
function generatePrompts(random = false) {
  const pool = getPromptPool();
  if (!pool.length) { showToast('No prompts match — try different filters'); return; }
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, random ? 1 : 6);
  shuffled.forEach(p => addToHistory(p));
  state.lastPrompt = shuffled[0];
  const personalityPrefix = state.activePersonality !== 'None' ? `[${state.activePersonality} Mode] ` : '';
  document.getElementById('promptGrid').innerHTML = shuffled.map((p, i) => renderPromptCard(p, i, personalityPrefix)).join('');
  state.stats.total += shuffled.length;
  shuffled.forEach(p => { state.stats.byCat[p.catId] = (state.stats.byCat[p.catId] || 0) + 1; });
  saveStats(); updateHeaderCount();
}

function surpriseMe() {
  const catIds = Object.keys(PROMPTS);
  selectCategory(catIds[Math.floor(Math.random() * catIds.length)]);
  setTimeout(() => generatePrompts(true), 100);
}

function filterPrompts() {
  const grid = document.getElementById('promptGrid');
  if (!grid.children.length || grid.querySelector('.empty-state')) return;
  generatePrompts();
}

// ── RENDER PROMPT CARD ────────────────────────────────
function renderPromptCard(p, index, prefix = '') {
  const cat         = CATEGORIES.find(c => c.id === p.catId) || { emoji:'⭐', label:'General', color:'#2F4156' };
  const isFav       = state.favorites.some(f => f.text === p.text);
  const rating      = state.ratings[p.text] || 0;
  const diffClass   = `diff-${p.diff || 'intermediate'}`;
  const displayText = prefix + p.text;
  const safeText    = displayText.replace(/`/g,'\\`').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  const stars       = [1,2,3,4,5].map(n =>
    `<span class="card-star ${n <= rating ? 'lit' : ''}" onclick="ratePrompt('${encodeURIComponent(p.text)}',${n})">★</span>`
  ).join('');

  return `<div class="prompt-card" style="animation-delay:${index * 0.07}s">
    <div class="card-header">
      <div class="card-cat">
        <div class="cat-dot" style="background:${cat.color}"></div>
        ${cat.emoji} ${cat.label}
      </div>
      <div class="card-actions-top">
        <button class="card-action fav${isFav ? ' active' : ''}" title="Favorite"
          onclick="toggleFavorite(this,'${safeText}','${encodeURIComponent(JSON.stringify(p.tags||[]))}','${p.diff||'intermediate'}','${p.catId}')">♥</button>
        <button class="card-action" title="Share"  onclick="sharePrompt('${safeText}')">↗</button>
        <button class="card-action" title="Expand" onclick="openModal('${safeText}')">⛶</button>
      </div>
    </div>
    <div class="card-prompt">${displayText}</div>
    <div class="card-meta">
      <div class="card-tags">${(p.tags||[]).map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
      <div class="card-stars">${stars}</div>
    </div>
    <div class="card-footer">
      <span class="difficulty-badge ${diffClass}">${p.diff || 'intermediate'}</span>
      <div style="display:flex;gap:7px">
        <button class="btn-dl"   onclick="downloadPrompt('${safeText}','txt')">↓ TXT</button>
        <button class="btn-dl"   onclick="downloadPrompt('${safeText}','pdf')">↓ PDF</button>
        <button class="btn-copy" onclick="copyPrompt(this,'${safeText}')">Copy</button>
      </div>
    </div>
  </div>`;
}
