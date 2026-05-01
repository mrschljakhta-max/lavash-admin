/* =====================================================
   PENDING RANK + XP MODULE
   Файл: pending_rank_xp.js
===================================================== */

(function () {

  /* ===== CONFIG ===== */

  const RANKS = {
    1: 'rank-01.png',
    2: 'rank-02.png',
    3: 'rank-03.png',
    4: 'rank-04.png',
    5: 'rank-05.png',
    6: 'rank-06.png',
    7: 'rank-07.png',
    8: 'rank-08.png',
    9: 'rank-09.png',
    10: 'rank-10.png',
    11: 'rank-11.png',
    12: 'rank-12.png',
    13: 'rank-13.png',
    14: 'rank-14.png',
    15: 'rank-15.png'
  };

  const RANK_NAMES = {
    1: 'Новобранець',
    2: 'Оператор',
    3: 'Спостерігач',
    4: 'Аналітик',
    5: 'Трекер',
    6: 'Тактик',
    7: 'Контролер',
    8: 'Навідник',
    9: 'Координатор',
    10: 'Старший оператор',
    11: 'Майстер',
    12: 'Спеціаліст',
    13: 'Експерт',
    14: 'Командир',
    15: 'Еліта'
  };

  /* ===== STATE ===== */

  let state = {
    level: 1,
    xp: 0,
    xpMax: 100
  };

  /* ===== INIT UI ===== */

  function createUI() {
    const root = document.createElement('div');
    root.className = 'pg-rank-xp';

    root.innerHTML = `
      <div class="pg-rank-xp__rank">
        <div class="pg-rank-xp__emblem">
          <img src="" alt="rank">
        </div>
        <div class="pg-rank-xp__level">РІВЕНЬ</div>
        <div class="pg-rank-xp__title">—</div>
      </div>

      <div class="pg-rank-xp__xp">
        <div class="pg-rank-xp__xp-core">
          <strong>0</strong>
          <span>XP</span>
          <small>0 / 0</small>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  /* ===== UPDATE ===== */

  function updateUI() {

    const percent = Math.min(1, state.xp / state.xpMax);
    const deg = percent * 360;

    document.documentElement.style.setProperty('--pg-xp-deg', deg + 'deg');

    // XP text
    const xpStrong = document.querySelector('.pg-rank-xp__xp-core strong');
    const xpSmall = document.querySelector('.pg-rank-xp__xp-core small');

    if (xpStrong) xpStrong.textContent = state.xp;
    if (xpSmall) xpSmall.textContent = `${state.xp} / ${state.xpMax}`;

    // Rank image
    const img = document.querySelector('.pg-rank-xp__emblem img');
    if (img && RANKS[state.level]) {
      img.src = `../assets/ranks/${RANKS[state.level]}`;
    }

    // Rank name
    const title = document.querySelector('.pg-rank-xp__title');
    if (title) {
      title.textContent = RANK_NAMES[state.level] || '—';
    }
  }

  /* ===== LEVEL UP ===== */

  function checkLevelUp() {
    if (state.xp >= state.xpMax) {

      state.xp -= state.xpMax;
      state.level = Math.min(state.level + 1, 15);

      showLevelUp();
    }
  }

  function showLevelUp() {
    const el = document.createElement('div');
    el.className = 'pg-rank-xp-pop';
    el.textContent = `РІВЕНЬ ${state.level}`;

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.classList.add('is-visible');
    });

    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 300);
    }, 2000);
  }

  /* ===== PUBLIC API ===== */

  window.LAVASH_PENDING_RANK_XP = {

    init(initialState) {
      state = { ...state, ...initialState };
      createUI();
      updateUI();
    },

    addXP(amount) {
      state.xp += amount;
      checkLevelUp();
      updateUI();
    },

    set(stateUpdate) {
      state = { ...state, ...stateUpdate };
      updateUI();
    },

    updateFromGame(gameState) {
      state.level = gameState.level || state.level;
      state.xp = gameState.xp || state.xp;
      state.xpMax = gameState.xpMax || state.xpMax;

      updateUI();
    }

  };

})();
