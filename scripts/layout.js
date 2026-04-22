(() => {
  function lavashCurrentPageKey() {
    const hash = window.location.hash.replace('#', '').trim();

    if (hash === 'upload') return 'upload';
    if (hash === 'dicts') return 'dicts';
    if (hash === 'logs') return 'logs';

    return 'editor';
  }

  function lavashBuildLeftNav(activeKey) {
    return `
      <aside class="left-nav" id="leftNav">
        <div class="left-nav__inner">

          <div class="left-nav__top">
            <div class="brand-mini">
              <img
                src="/lavash-admin/assets/lavash-logo.svg?v=12"
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
            <button class="nav-item ${activeKey === 'editor' ? 'is-active' : ''}" data-route="pending" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-editor.svg?v=12" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Редактор</span>
            </button>

            <button class="nav-item ${activeKey === 'upload' ? 'is-active' : ''}" data-route="upload" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-upload.svg?v=12" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Завантаження</span>
            </button>

            <button class="nav-item ${activeKey === 'dicts' ? 'is-active' : ''}" data-route="dicts" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-dicts.svg?v=12" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Довідники</span>
            </button>

            <button class="nav-item ${activeKey === 'logs' ? 'is-active' : ''}" data-route="logs" type="button">
              <span class="nav-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/nav-logs.svg?v=12" alt="" class="nav-item__icon" />
              </span>
              <span class="nav-item__label">Логування</span>
            </button>
          </nav>

        </div>
      </aside>
    `;
  }

  function lavashBuildDefaultRightTools(pageKey = lavashCurrentPageKey()) {
    const isDictsPage = pageKey === 'dicts';

    return `
      <aside class="right-tools" id="rightTools">
        <div class="right-tools__inner">

          <div class="right-tools__top">
            <div class="right-tools__title-wrap">
              <span class="right-tools__title">Інструменти</span>
            </div>
          </div>

          <div class="right-tools__menu" aria-label="Інструменти сторінки">
            ${isDictsPage ? `
              <div class="dicts-mode-switcher" id="dictsModeSwitcher">
                <button
                  class="tool-item tool-item--dicts-mode"
                  id="dictsModeTrigger"
                  type="button"
                  aria-expanded="false"
                  aria-controls="dictsModePopover"
                  title="Режими довідників"
                >
                  <span class="tool-item__icon-wrap tool-item__icon-wrap--svg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="7" height="7" rx="1.6"></rect>
                      <rect x="14" y="4" width="7" height="7" rx="1.6"></rect>
                      <rect x="3" y="15" width="7" height="6" rx="1.6"></rect>
                      <path d="M14 18h7"></path>
                      <path d="M17.5 15v6"></path>
                    </svg>
                  </span>
                  <span class="tool-item__label">Режими</span>
                </button>

                <div class="dicts-mode-switcher__popover hidden" id="dictsModePopover">
                  <div class="dicts-radial-menu">
                    <button type="button" class="dicts-mode-action dicts-mode-action--radial is-active" data-dicts-mode="carousel">
                      <span class="dicts-mode-action__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="6" width="5" height="12" rx="1.5"></rect>
                          <rect x="9.5" y="4" width="5" height="16" rx="1.5"></rect>
                          <rect x="16" y="6" width="5" height="12" rx="1.5"></rect>
                        </svg>
                      </span>
                      <span class="dicts-mode-action__label">Карусель</span>
                    </button>

                    <button type="button" class="dicts-mode-action dicts-mode-action--radial" data-dicts-mode="schema">
                      <span class="dicts-mode-action__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="4" width="6" height="5" rx="1.2"></rect>
                          <rect x="15" y="4" width="6" height="5" rx="1.2"></rect>
                          <rect x="9" y="15" width="6" height="5" rx="1.2"></rect>
                          <path d="M6 9v3"></path>
                          <path d="M18 9v3"></path>
                          <path d="M6 12h12"></path>
                          <path d="M12 12v3"></path>
                        </svg>
                      </span>
                      <span class="dicts-mode-action__label">Схема</span>
                    </button>

                    <button type="button" class="dicts-mode-action dicts-mode-action--radial dicts-mode-action--accent" id="dictsAddDictionaryBtn">
                      <span class="dicts-mode-action__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                          <path d="M12 5v14"></path>
                          <path d="M5 12h14"></path>
                        </svg>
                      </span>
                      <span class="dicts-mode-action__label">Додати довідник</span>
                    </button>
                  </div>
                </div>
              </div>
            ` : ''}

            <button class="tool-item" data-tool="search" type="button">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/tool-search.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Пошук</span>
            </button>

            <button class="tool-item" data-tool="filters" type="button">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/tool-filter.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Фільтри</span>
            </button>

            <button class="tool-item" data-tool="refresh" type="button">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/tool-refresh.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Оновити</span>
            </button>
          </div>

          <div class="right-tools__panel" id="layoutRightPanel"></div>
        </div>
      </aside>
    `;
  }

  function lavashBuildUploadRightTools() {
    return `
      <aside class="right-tools right-tools--upload" id="rightTools">
        <div class="right-tools__inner">

          <div class="right-tools__top">
            <div class="right-tools__title-wrap">
              <span class="right-tools__title">Обробка</span>
            </div>
          </div>

          <div class="right-tools__menu" aria-label="Інструменти завантаження">
            <button class="tool-item tool-item--upload" type="button" data-upload-tool="queue">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/upload/stack.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Черга</span>
            </button>

            <button class="tool-item tool-item--upload" type="button" data-upload-tool="validate">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/upload/shield.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Перевірка</span>
            </button>

            <button class="tool-item tool-item--upload" type="button" data-upload-tool="parse">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/upload/settings.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Парсинг</span>
            </button>

            <button class="tool-item tool-item--upload" type="button" data-upload-tool="extract">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/upload/target.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Події</span>
            </button>

            <button class="tool-item tool-item--upload" type="button" data-upload-tool="database">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/upload/database.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Supabase</span>
            </button>

            <button class="tool-item tool-item--upload tool-item--accent" type="button" id="uploadStartSideBtn">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/upload/bolt.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Запуск</span>
            </button>
          </div>

          <div class="right-tools__panel right-tools__panel--upload" id="layoutRightPanel">
            <div class="tool-block tool-block--upload-queue">
              <label class="tool-block__label">Файлів у черзі</label>
              <div class="upload-side-stat">
                <span class="upload-side-stat__value" id="uploadQueueCount">0</span>
                <span class="upload-side-stat__text">готово до обробки</span>
              </div>
            </div>

            <div class="tool-block tool-block--upload-stage" id="uploadStageValidateBlock">
              <div class="upload-stage-line">
                <img src="/lavash-admin/assets/icons/upload/shield.svg?v=12" class="icon-sm" alt="">
                <div>
                  <div class="upload-stage-line__title">Перевірка</div>
                  <div class="upload-stage-line__text">Формат, назва, цілісність</div>
                </div>
              </div>
            </div>

            <div class="tool-block tool-block--upload-stage" id="uploadStageParseBlock">
              <div class="upload-stage-line">
                <img src="/lavash-admin/assets/icons/upload/settings.svg?v=12" class="icon-sm" alt="">
                <div>
                  <div class="upload-stage-line__title">Парсинг</div>
                  <div class="upload-stage-line__text">Розбір структури документа</div>
                </div>
              </div>
            </div>

            <div class="tool-block tool-block--upload-stage" id="uploadStageExtractBlock">
              <div class="upload-stage-line">
                <img src="/lavash-admin/assets/icons/upload/target.svg?v=12" class="icon-sm" alt="">
                <div>
                  <div class="upload-stage-line__title">Виділення подій</div>
                  <div class="upload-stage-line__text">Формування записів і сутностей</div>
                </div>
              </div>
            </div>

            <div class="tool-block tool-block--upload-stage" id="uploadStageDbBlock">
              <div class="upload-stage-line">
                <img src="/lavash-admin/assets/icons/upload/database.svg?v=12" class="icon-sm" alt="">
                <div>
                  <div class="upload-stage-line__title">Запис у Supabase</div>
                  <div class="upload-stage-line__text">Збереження даних і логів</div>
                </div>
              </div>
            </div>

            <button id="uploadStartPanelBtn" class="tool-refresh-btn tool-refresh-btn--upload" type="button">
              <img src="/lavash-admin/assets/icons/upload/bolt.svg?v=12" class="icon-sm" alt="">
              Завантажити і обробити
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
      useRightTools = true,
      contentClass = 'workspace-body--page',
      rightToolsVariant = 'default'
    } = options;

    const mount = document.getElementById('app');
    if (!mount) return;

    const rightToolsHtml = !useRightTools
      ? '<aside class="right-tools right-tools--empty"></aside>'
      : (rightToolsVariant === 'upload'
          ? lavashBuildUploadRightTools()
          : lavashBuildDefaultRightTools(pageKey));

    mount.innerHTML = `
      <div class="app-shell">
        ${lavashBuildLeftNav(pageKey)}

        <main class="main-workspace">
          ${lavashBuildHeader(title, statusText)}
          <section class="workspace-body ${contentClass}" id="workspaceBody">
            ${content}
          </section>
        </main>

        ${rightToolsHtml}
      </div>
    `;

    bindLavashLayoutEvents();
  }

  function bindLavashLayoutEvents() {
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const route = btn.dataset.route;
        window.location.hash = route;
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
          window.location.href = '/lavash-admin/pages/index.html';
        } catch (error) {
          console.error('layout logout error:', error);
          window.location.href = '/lavash-admin/pages/index.html';
        }
      });
    }

    document.querySelectorAll('.tool-item[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;

        if (tool === 'search') {
          const input = document.getElementById('dictSearchInput') || document.getElementById('searchInput');
          input?.focus();
          return;
        }

        if (tool === 'filters') {
          const select = document.getElementById('dictTypeFilter') || document.getElementById('statusFilter');
          select?.focus();
          return;
        }

        if (tool === 'refresh') {
          const refresh = document.getElementById('refreshBtn');
          refresh?.click();
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
})();
