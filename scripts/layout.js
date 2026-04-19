const APP_BASE = '/lavash-admin';
const LOGIN_PAGE = `${APP_BASE}/pages/index.html`;

function layoutIcon(path, alt = '') {
  return `<img src="${path}" alt="${alt}" class="nav-item__icon">`;
}

function getPageTitle(pageKey) {
  const map = {
    pending: 'Черга перевірки',
    upload: 'Завантаження',
    dicts: 'Довідники',
    logs: 'Логування'
  };
  return map[pageKey] || 'Lavash Admin';
}

function buildLeftNav(pageKey, userEmail = 'user@email.com') {
  return `
    <aside class="left-nav" id="leftNav">
      <div class="left-nav__inner">
        <div class="left-nav__top">
          <div class="brand-mini">
            <img
              src="${APP_BASE}/assets/lavash-logo.svg?v=6"
              alt="Lavash"
              class="brand-mini__logo"
            />
            <span class="brand-mini__title">Lavash Admin</span>
          </div>

          <div class="user-box">
            <div class="user-box__email" id="userEmail">${userEmail}</div>
            <button class="user-box__logout" id="logoutBtn" type="button">Вихід</button>
          </div>
        </div>

        <nav class="left-nav__menu" aria-label="Основна навігація">
          <button class="nav-item ${pageKey === 'pending' ? 'is-active' : ''}" data-route="pending" type="button">
            <span class="nav-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/nav-editor.svg`, 'Редактор')}
            </span>
            <span class="nav-item__label">Редактор</span>
          </button>

          <button class="nav-item ${pageKey === 'upload' ? 'is-active' : ''}" data-route="upload" type="button">
            <span class="nav-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/nav-upload.svg`, 'Завантаження')}
            </span>
            <span class="nav-item__label">Завантаження</span>
          </button>

          <button class="nav-item ${pageKey === 'dicts' ? 'is-active' : ''}" data-route="dicts" type="button">
            <span class="nav-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/nav-dicts.svg`, 'Довідники')}
            </span>
            <span class="nav-item__label">Довідники</span>
          </button>

          <button class="nav-item ${pageKey === 'logs' ? 'is-active' : ''}" data-route="logs" type="button">
            <span class="nav-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/nav-logs.svg`, 'Логування')}
            </span>
            <span class="nav-item__label">Логування</span>
          </button>
        </nav>
      </div>
    </aside>
  `;
}

function buildRightTools(pageKey) {
  const showTools = pageKey === 'pending';

  if (!showTools) {
    return `
      <aside class="right-tools" id="rightTools">
        <div class="right-tools__inner">
          <div class="right-tools__top">
            <div class="right-tools__title-wrap">
              <span class="right-tools__title">Інструменти</span>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  return `
    <aside class="right-tools" id="rightTools">
      <div class="right-tools__inner">
        <div class="right-tools__top">
          <div class="right-tools__title-wrap">
            <span class="right-tools__title">Інструменти</span>
          </div>
        </div>

        <div class="right-tools__menu" aria-label="Інструменти сторінки">
          <button class="tool-item" data-tool="search" type="button">
            <span class="tool-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/tool-search.svg`, 'Пошук')}
            </span>
            <span class="tool-item__label">Пошук</span>
          </button>

          <button class="tool-item" data-tool="filters" type="button">
            <span class="tool-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/tool-filter.svg`, 'Фільтри')}
            </span>
            <span class="tool-item__label">Фільтри</span>
          </button>

          <button class="tool-item" data-tool="refresh" type="button">
            <span class="tool-item__icon-wrap">
              ${layoutIcon(`${APP_BASE}/assets/icons/tool-refresh.svg`, 'Оновити')}
            </span>
            <span class="tool-item__label">Оновити</span>
          </button>
        </div>

        <div class="right-tools__panel">
          <div class="tool-block tool-block--search">
            <label class="tool-block__label" for="searchInput">Пошук</label>
            <input id="searchInput" class="tool-input" type="text" placeholder="Пошук по значенню..." />
          </div>

          <div class="tool-block">
            <label class="tool-block__label" for="statusFilter">Статус</label>
            <select id="statusFilter" class="tool-select">
              <option value="all">усі статуси</option>
            </select>
          </div>

          <div class="tool-block">
            <label class="tool-block__label" for="fieldFilter">Поле</label>
            <select id="fieldFilter" class="tool-select">
              <option value="all">усі поля</option>
            </select>
          </div>

          <div class="tool-block">
            <label class="tool-block__label" for="sourceFilter">Джерело</label>
            <select id="sourceFilter" class="tool-select">
              <option value="all">усі джерела</option>
            </select>
          </div>

          <button id="refreshBtn" class="tool-refresh-btn" type="button">Оновити</button>
        </div>
      </div>
    </aside>
  `;
}

function buildHeader(pageKey) {
  return `
    <header class="workspace-header">
      <div class="workspace-header__left">
        <h1 class="workspace-title">${getPageTitle(pageKey)}</h1>
      </div>
      <div class="workspace-header__right">
        <div class="status-badge" id="statusBadge">Підключено</div>
      </div>
    </header>
  `;
}

function buildMainContent(pageKey) {
  if (pageKey === 'pending') {
    return `
      <section class="workspace-body">
        <section class="records-panel" aria-label="Список записів">
          <div class="records-panel__body" id="pendingGroups">
            <div class="placeholder-card">Завантаження записів...</div>
          </div>
        </section>

        <section class="details-panel" aria-label="Деталі запису">
          <div class="details-panel__body" id="candidates">
            <div class="placeholder-card">Оберіть запис ліворуч</div>
          </div>
        </section>
      </section>
    `;
  }

  return `
    <section class="workspace-body workspace-body--single">
      <section class="records-panel" aria-label="Контент сторінки">
        <div class="records-panel__body" id="pageContent">
          <div class="placeholder-card">Сторінка в розробці</div>
        </div>
      </section>
    </section>
  `;
}

async function layoutResolveUserEmail() {
  try {
    const user = await window.LAVASH_AUTH?.protectAppPage?.();
    return user?.email || 'user@email.com';
  } catch {
    return 'user@email.com';
  }
}

function layoutBindNav() {
  const routeMap = {
    pending: `${APP_BASE}/pages/pending_v3.html`,
    upload: `${APP_BASE}/pages/upload.html`,
    dicts: `${APP_BASE}/pages/dicts.html`,
    logs: `${APP_BASE}/pages/logs.html`
  };

  document.querySelectorAll('.nav-item[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.dataset.route;
      const href = routeMap[route];
      if (!href) return;
      if (window.location.pathname === new URL(href, window.location.origin).pathname) return;
      window.location.href = href;
    });
  });
}

function layoutBindLogout() {
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
      if (window.LAVASH_AUTH?.logout) {
        await window.LAVASH_AUTH.logout();
        return;
      }
      window.location.href = LOGIN_PAGE;
    } catch {
      window.location.href = LOGIN_PAGE;
    }
  });
}

async function initLayout(pageKey) {
  const mount = document.getElementById('app');
  if (!mount) return;

  const userEmail = await layoutResolveUserEmail();

  mount.innerHTML = `
    <div class="app-shell">
      ${buildLeftNav(pageKey, userEmail)}

      <main class="main-workspace">
        ${buildHeader(pageKey)}
        ${buildMainContent(pageKey)}
      </main>

      ${buildRightTools(pageKey)}
    </div>
  `;

  layoutBindNav();
  layoutBindLogout();
}

window.LAVASH_LAYOUT = {
  initLayout
};
