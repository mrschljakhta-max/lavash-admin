/* =====================================================
   PENDING RANK + XP MODULE (AAA UPGRADED + MICRO XP FX)
   Файл: pending_rank_xp.js
===================================================== */

(function () {
  const PAGE_HASH = '#pending';

  function isPendingPage() {
    return location.hash === PAGE_HASH;
  }

  function removeUI() {
    document.querySelector('.pg-rank-xp')?.remove();
    document.querySelector('.pg-rank-xp-pop')?.remove();
    document.querySelectorAll('.pg-rank-xp-fly').forEach((el) => el.remove());
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

  const XP_BY_ACTION = {
    approve: 10,
    approved: 10,
    accept: 10,
    accepted: 10,
    confirm: 10,
    confirmed: 10,
    save: 10,

    reject: 5,
    rejected: 5,
    decline: 5,
    declined: 5,

    ignore: 7,
    ignored: 7,
    skip: 7,
    skipped: 7
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

  function getRankTier(level) {
    if (level >= 13) {
      return {
        primary: '#ff4fd8',
        secondary: '#8b5cff',
        glow: 'rgba(255, 79, 216, 0.45)'
      };
    }

    if (level >= 10) {
      return {
        primary: '#ffd35b',
        secondary: '#ff8a2a',
        glow: 'rgba(255, 211, 91, 0.48)'
      };
    }

    if (level >= 7) {
      return {
        primary: '#38dfff',
        secondary: '#7c5cff',
        glow: 'rgba(56, 223, 255, 0.42)'
      };
    }

    if (level >= 4) {
      return {
        primary: '#6af2ff',
        secondary: '#ffd35b',
        glow: 'rgba(106, 242, 255, 0.38)'
      };
    }

    return {
      primary: '#9fb7ff',
      secondary: '#38dfff',
      glow: 'rgba(159, 183, 255, 0.34)'
    };
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

        <div class="pg-rank-xp__bar">
          <div class="pg-rank-xp__bar-fill"></div>
          <div class="pg-rank-xp__bar-text">0 / 0 XP</div>
        </div>

      </div>

      <div class="pg-rank-xp__xp">
        <div class="pg-rank-xp__xp-scale">
          <div class="pg-rank-xp__xp-energy"></div>

          <div class="pg-rank-xp__xp-core">
            <strong>0</strong>
            <span>XP</span>
            <small>0 / 0</small>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    return root;
  }

  function restartAnimation(el, className) {
    if (!el) return;

    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function playSuccessFX(amount) {
    if (!isPendingPage()) return;

    const root = createUI();
    if (!root) return;

    restartAnimation(root.querySelector('.pg-rank-xp__xp-scale'), 'is-xp-pulse');
    restartAnimation(root.querySelector('.pg-rank-xp__rank'), 'is-rank-flash');
    restartAnimation(root.querySelector('.pg-rank-xp__bar-fill'), 'is-xp-bar-hit');

    const xpRing = root.querySelector('.pg-rank-xp__xp-scale') || root.querySelector('.pg-rank-xp__xp');
    if (!xpRing) return;

    const fly = document.createElement('div');
    fly.className = 'pg-rank-xp-fly';
    fly.textContent = `+${Math.max(0, Number(amount) || 0)}`;

    xpRing.appendChild(fly);

    requestAnimationFrame(() => fly.classList.add('is-visible'));

    setTimeout(() => fly.remove(), 1150);
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
    const tier = getRankTier(level);

    root.style.setProperty('--pg-rank-accent', state.accent || tier.primary);
    root.style.setProperty('--pg-rank-tier', tier.primary);
    root.style.setProperty('--pg-rank-tier-2', tier.secondary);
    root.style.setProperty('--pg-rank-glow', tier.glow);

    document.documentElement.style.setProperty('--pg-rank-accent', state.accent || tier.primary);
    document.documentElement.style.setProperty('--pg-rank-tier', tier.primary);
    document.documentElement.style.setProperty('--pg-rank-tier-2', tier.secondary);
    document.documentElement.style.setProperty('--pg-rank-glow', tier.glow);
    document.documentElement.style.setProperty('--pg-xp-deg', `${deg}deg`);

    const img = root.querySelector('.pg-rank-xp__emblem img');
    if (img) {
      img.src = `../assets/ranks/${RANKS[level] || RANKS[1]}`;
      img.alt = `Рівень ${level}`;
    }

    const levelEl = root.querySelector('.pg-rank-xp__level');
    if (levelEl) levelEl.textContent = `РІВЕНЬ ${level}`;

    const titleEl = root.querySelector('.pg-rank-xp__title');
    if (titleEl) titleEl.textContent = state.rank || RANK_NAMES[level] || '—';

    const xpStrong = root.querySelector('.pg-rank-xp__xp-core strong');
    if (xpStrong) xpStrong.textContent = xp.toLocaleString('uk-UA');

    const xpSmall = root.querySelector('.pg-rank-xp__xp-core small');
    if (xpSmall) {
      xpSmall.textContent = `${xp.toLocaleString('uk-UA')} / ${xpMax.toLocaleString('uk-UA')}`;
    }

    const bar = root.querySelector('.pg-rank-xp__bar-fill');
    const barText = root.querySelector('.pg-rank-xp__bar-text');

    if (bar) {
      bar.style.width = `${percent}%`;
      bar.style.setProperty('--pg-rank-progress', `${percent}%`);
    }

    if (barText) {
      barText.textContent = `${xp.toLocaleString('uk-UA')} / ${xpMax.toLocaleString('uk-UA')} XP`;
    }
  }

  function showLevelUp() {
    if (!isPendingPage()) return;

    const root = document.querySelector('.pg-rank-xp');
    if (root) {
      root.classList.add('is-levelup');

      setTimeout(() => {
        root.classList.remove('is-levelup');
      }, 900);
    }

    document.querySelector('.pg-rank-xp-pop')?.remove();

    const level = clampLevel(state.level);
    const tier = getRankTier(level);

    const el = document.createElement('div');
    el.className = 'pg-rank-xp-pop';
    el.textContent = `РІВЕНЬ ${level}`;

    el.style.setProperty('--pg-rank-tier', tier.primary);
    el.style.setProperty('--pg-rank-tier-2', tier.secondary);

    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('is-visible'));

    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 320);
    }, 1900);
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
      if (!isPendingPage()) {
        removeUI();
        return;
      }

      normalize(initialState);
      updateUI();
    },

    set(nextState = {}) {
      if (!isPendingPage()) {
        removeUI();
        return;
      }

      normalize(nextState);
      updateUI();
    },

    addXP(amount = 0) {
      if (!isPendingPage()) return;

      const xpAmount = Math.max(0, Number(amount) || 0);
      if (!xpAmount) return;

      state.xp += xpAmount;

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
      playSuccessFX(xpAmount);
    },

    addActionXP(action) {
      if (!isPendingPage()) return;

      const key = String(action || '').toLowerCase();
      const xpAmount = XP_BY_ACTION[key] ?? 0;

      if (xpAmount > 0) {
        this.addXP(xpAmount);
      }
    },

    playSuccessFX(amount = 0) {
      playSuccessFX(amount);
    },

    destroy() {
      removeUI();
    }
  };

  window.addEventListener('hashchange', () => {
    if (!isPendingPage()) {
      removeUI();
    }
  });
})();
