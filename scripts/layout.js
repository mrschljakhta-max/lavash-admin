(() => {
  const LAVASH_LOGIN_PAGE = '/lavash-admin/pages/index.html';

  const LAVASH_ROUTES = {
    editor: '/lavash-admin/pages/pending_v3.html',
    upload: '/lavash-admin/pages/upload.html',
    dicts: '/lavash-admin/pages/dicts.html',
    logs: '/lavash-admin/pages/logs.html'
  };

  function lavashCurrentPageKey() {
    const path = window.location.pathname;

    if (path.endsWith('/pending_v3.html')) return 'editor';
    if (path.endsWith('/upload.html')) return 'upload';
    if (path.endsWith('/dicts.html')) return 'dicts';
    if (path.endsWith('/logs.html')) return 'logs';

    return 'editor';
  }

  function lavashBuildLeftNav(activeKey) {
    return `
      <aside class="left-nav" id="leftNav">
        <div class="left-nav__inner">

          <div class="left-nav__top">
            <div class="brand-mini">
              <img
                src="/lavash-admin/assets/lavash-logo.svg?v=7"
                alt="Lavash"
                class="brand-mini__logo"
              />
              <span class="brand-mini__title">Lavash Admin</span>
            </div>

            <div class="user-box">
              <div class="user-box__email" id="userEmail">user@email.com</div>
              <button class="user-box__logout" id="logoutBtn" type="button">Вихід</button>
            </div>
          </div>

          <nav class="left-nav__menu" aria-label="Основна навігація">
            <button class="nav-item ${activeKey === 'editor' ? 'is-active' : ''}" data-route="editor" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-editor.svg?v=7" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Редактор</span>
            </button>

            <button class="nav-item ${activeKey === 'upload' ? 'is-active' : ''}" data-route="upload" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-upload.svg?v=7" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Завантаження</span>
            </button>

            <button class="nav-item ${activeKey === 'dicts' ? 'is-active' : ''}" data-route="dicts" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-dicts.svg?v=7" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Довідники</span>
            </button>

            <button class="nav-item ${activeKey === 'logs' ? 'is-active' : ''}" data-route="logs" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-logs.svg?v=7" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Логування</span>
            </button>
          </nav>

        </div>
      </aside>
    `;
  }

  function lavashBuildRightTools() {
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
                <img src="/lavash-admin/assets/icons/tool-search.svg?v=7" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Пошук</span>
            </button>

            <button class="tool-item" data-tool="filters" type="button">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/tool-filter.svg?v=7" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Фільтри</span>
            </button>

            <button class="tool-item" data-tool="refresh" type="button">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/tool-refresh.svg?v=7" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Оновити</span>
            </button>
          </div>

          <div class="right-tools__panel" id="layoutRightPanel">
            <div class="tool-block tool-block--search">
              <label class="tool-block__label" for="searchInput">Пошук</label>
              <input
                id="searchInput"
                class="tool-input"
                type="text"
                placeholder="Пошук по значенню..."
              />
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

            <button id="refreshBtn" class="tool-refresh-btn" type="button">
              Оновити
            </button>
          </div>

        </div>
      </aside>
    `;
  }

  function lavashBuildHeader(title = 'Lavash Admin', statusText = 'Підключено') {
    return `
      <header class="workspace-header">
        <div class="workspace-header__left">
          <h1 class="workspace-title">${title}</h1>
        </div>

        <div class="workspace-header__right">
          <div class="status-badge" id="statusBadge">${statusText}</div>
        </div>
      </header>
    `;
  }

  function initLavashLayout(options = {}) {
    const {
      pageKey = lavashCurrentPageKey(),
      title = 'Lavash Admin',
      statusText = 'Підключено',
      content = '',
      useRightTools = true
    } = options;

    const mount = document.getElementById('app');
    if (!mount) return;

    mount.innerHTML = `
      <div class="app-shell">
        ${lavashBuildLeftNav(pageKey)}

        <main class="main-workspace">
          ${lavashBuildHeader(title, statusText)}
          <section class="workspace-body" id="workspaceBody">
            ${content}
          </section>
        </main>

        ${useRightTools ? lavashBuildRightTools() : '<aside class="right-tools right-tools--empty"></aside>'}
      </div>
    `;

    bindLavashLayoutEvents();
  }

  function bindLavashLayoutEvents() {
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const route = btn.dataset.route;
        const href = LAVASH_ROUTES[route];
        if (!href) return;
        if (window.location.pathname === new URL(href, window.location.origin).pathname) return;
        window.location.href = href;
      });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          if (window.LAVASH_AUTH?.logout) {
            await window.LAVASH_AUTH.logout();
            return;
          }
          window.location.href = LAVASH_LOGIN_PAGE;
        } catch (error) {
          console.error('layout logout error:', error);
          window.location.href = LAVASH_LOGIN_PAGE;
        }
      });
    }

    document.querySelectorAll('.tool-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;

        if (tool === 'search') {
          document.getElementById('searchInput')?.focus();
          return;
        }

        if (tool === 'filters') {
          document.getElementById('statusFilter')?.focus();
          return;
        }

        if (tool === 'refresh') {
          document.getElementById('refreshBtn')?.click();
        }
      });
    });
  }

  async function hydrateLavashUser() {
    try {
      if (!window.LAVASH_AUTH?.protectAppPage) return null;

      const user = await window.LAVASH_AUTH.protectAppPage();
      if (!user) return null;

      const emailNode = document.getElementById('userEmail');
      if (emailNode) {
        emailNode.textContent = user.email || 'user@email.com';
      }

      return user;
    } catch (error) {
      console.error('hydrateLavashUser error:', error);
      return null;
    }
  }

  window.initLavashLayout = initLavashLayout;
  window.hydrateLavashUser = hydrateLavashUser;
  window.lavashCurrentPageKey = lavashCurrentPageKey;
})();
