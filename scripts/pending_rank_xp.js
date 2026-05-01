/* =====================================================
   PENDING RANK + XP MODULE (UPGRADED)
===================================================== */

(function () {
  const PAGE_HASH = '#pending';

  function isPendingPage() {
    return location.hash === PAGE_HASH;
  }

  function removeUI() {
    document.querySelector('.pg-rank-xp')?.remove();
    document.querySelector('.pg-rank-xp-pop')?.remove();
  }

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

  let state = {
    level: 1,
    xp: 0,
    xpMax: 100,
    rank: '',
    accent: '#38dfff'
  };

  function clampLevel(level) {
    return Math.max(1, Math.min(15, Number(level) || 1));
  }

  function createUI() {
    if (!isPendingPage()) {
      removeUI();
      return null;
    }

    let root = document.querySelector('.pg-rank-xp');
    if (root) return root;

    root = document.createElement('aside');
    root.className = 'pg-rank-xp';

    root.innerHTML = `
      <div class="pg-rank-xp__rank">

        <div class="pg-rank-xp__emblem">
          <img src="../assets/ranks/rank-01.png" alt="rank">
        </div>

        <div class="pg-rank-xp__level">РІВЕНЬ</div>

        <div class="pg-rank-xp__title">—</div>

        <!-- 🔥 MINI XP BAR -->
        <div class="pg-rank-xp__bar">
          <div class="pg-rank-xp__bar-fill"></div>
          <div class="pg-rank-xp__bar-text">0 / 0 XP</div>
        </div>

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
    return root;
  }

  function updateUI() {
    if (!isPendingPage()) {
      removeUI();
      return;
    }

    const root = createUI();
    if (!root) return;

    const level = clampLevel(state.level);
    const xp = Math.max(0, Number(state.xp) || 0);
    const xpMax = Math.max(1, Number(state.xpMax) || 1);
    const percent = Math.max(0, Math.min(1, xp / xpMax)) * 100;

    const deg = percent * 3.6;

    root.style.setProperty('--pg-rank-accent', state.accent || '#38dfff');
    document.documentElement.style.setProperty('--pg-xp-deg', `${deg}deg`);

    // emblem
    const img = root.querySelector('.pg-rank-xp__emblem img');
    if (img) {
      img.src = `../assets/ranks/${RANKS[level] || RANKS[1]}`;
      img.alt = `Рівень ${level}`;
    }

    // level text
    const levelEl = root.querySelector('.pg-rank-xp__level');
    if (levelEl) levelEl.textContent = `РІВЕНЬ ${level}`;

    // rank name
    const titleEl = root.querySelector('.pg-rank-xp__title');
    if (titleEl) titleEl.textContent = state.rank || RANK_NAMES[level];

    // xp circle
    const xpStrong = root.querySelector('.pg-rank-xp__xp-core strong');
    if (xpStrong) xpStrong.textContent = xp.toLocaleString('uk-UA');

    const xpSmall = root.querySelector('.pg-rank-xp__xp-core small');
    if (xpSmall) {
      xpSmall.textContent = `${xp} / ${xpMax}`;
    }

    // 🔥 MINI BAR UPDATE
    const bar = root.querySelector('.pg-rank-xp__bar-fill');
    const barText = root.querySelector('.pg-rank-xp__bar-text');

    if (bar) bar.style.width = percent + '%';
    if (barText) barText.textContent = `${xp} / ${xpMax} XP`;
  }

  function showLevelUp() {
    if (!isPendingPage()) return;

    document.querySelector('.pg-rank-xp-pop')?.remove();

    const el = document.createElement('div');
    el.className = 'pg-rank-xp-pop';
    el.textContent = `РІВЕНЬ ${state.level}`;

    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('is-visible'));

    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 300);
    }, 1800);
  }

  function normalize(next = {}) {
    state = {
      ...state,
      ...next,
      level: clampLevel(next.level ?? state.level),
      xp: Math.max(0, Number(next.xp ?? state.xp) || 0),
      xpMax: Math.max(1, Number(next.xpMax ?? state.xpMax) || 1)
    };
  }

  window.LAVASH_PENDING_RANK_XP = {

    init(initialState = {}) {
      if (!isPendingPage()) return;
      normalize(initialState);
      updateUI();
    },

    set(nextState = {}) {
      if (!isPendingPage()) return;
      normalize(nextState);
      updateUI();
    },

    addXP(amount = 0) {
      if (!isPendingPage()) return;

      state.xp += Number(amount) || 0;

      while (state.xp >= state.xpMax && state.level < 15) {
        state.xp -= state.xpMax;
        state.level += 1;
        showLevelUp();
      }

      if (state.level >= 15) {
        state.level = 15;
        state.xp = Math.min(state.xp, state.xpMax);
      }

      updateUI();
    },

    destroy() {
      removeUI();
    }
  };

  window.addEventListener('hashchange', () => {
    if (!isPendingPage()) removeUI();
  });

})();
