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

            <div class="user-stack">
              <button class="user-mini-btn" type="button" aria-label="Користувач">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M6 20c0-4 12-4 12 0"></path>
                </svg>
              </button>

              <div class="user-box">
                <div class="user-box__email" id="userEmail">user@email.com</div>
                <button class="user-box__logout" id="logoutBtn" type="button">Вихід</button>
              </div>
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
              <button
                class="tool-item tool-item--dicts-mode"
                id="dictsModeTrigger"
                type="button"
                aria-haspopup="dialog"
                aria-controls="dictsModeDialog"
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
            ` : ''}

            <button class="tool-item" data-tool="rating" type="button" title="Рейтинг користувачів">
              <span class="tool-item__icon-wrap tool-item__icon-wrap--svg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M8 21h8"></path>
                  <path d="M12 17v4"></path>
                  <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path>
                  <path d="M7 6H4a2 2 0 0 0 2 4h1"></path>
                  <path d="M17 6h3a2 2 0 0 1-2 4h-1"></path>
                </svg>
              </span>
              <span class="tool-item__label">Рейтинг</span>
            </button>

            <button class="tool-item" data-tool="guide" type="button" title="Інструкція до роботи">
              <span class="tool-item__icon-wrap tool-item__icon-wrap--svg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path>
                  <path d="M8 7h8"></path>
                  <path d="M8 11h6"></path>
                </svg>
              </span>
              <span class="tool-item__label">Інструкція</span>
            </button>

            <button class="tool-item" data-tool="refresh" type="button" title="Оновити">
              <span class="tool-item__icon-wrap">
                <img src="/lavash-admin/assets/icons/tool-refresh.svg?v=12" alt="" class="tool-item__icon" />
              </span>
              <span class="tool-item__label">Оновити</span>
            </button>
          </div>

          ${isDictsPage ? '' : '<div class="right-tools__panel" id="layoutRightPanel"></div>'}
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

            <button id="uploadStartPanelBtn" class="tool-refresh-btn tool-refresh-btn--upload" type="button">
              <img src="/lavash-admin/assets/icons/upload/bolt.svg?v=12" class="icon-sm" alt="">
              Завантажити і обробити
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  function lavashBuildDictsModeDialog() {
    return `
      <div class="lavash-modal hidden" id="dictsModeDialog" aria-hidden="true">
        <div class="lavash-modal__backdrop" data-close="dicts-mode-dialog"></div>

        <div class="lavash-modal__card lavash-modal__card--dicts-modes" role="dialog" aria-modal="true" aria-labelledby="dictsModeDialogTitle">
          <div class="lavash-modal__header">
            <div>
              <h3 class="lavash-modal__title" id="dictsModeDialogTitle">Режими довідників</h3>
              <p class="lavash-modal__subtitle">Оберіть потрібний режим відображення або створіть новий довідник</p>
            </div>

            <button class="lavash-modal__close" id="dictsModeDialogClose" type="button" aria-label="Закрити">
              <span>✕</span>
            </button>
          </div>

          <div class="dicts-mode-dialog__grid">
            <button type="button" class="dicts-mode-dialog__action is-active" data-dicts-mode="carousel">
              <span class="dicts-mode-dialog__text">
                <strong>Карусель</strong>
                <small>Картки довідників у форматі слайдера</small>
              </span>
            </button>

            <button type="button" class="dicts-mode-dialog__action" data-dicts-mode="schema">
              <span class="dicts-mode-dialog__text">
                <strong>Схема</strong>
                <small>Структурне відображення довідників</small>
              </span>
            </button>

            <button type="button" class="dicts-mode-dialog__action dicts-mode-dialog__action--accent" id="dictsAddDictionaryBtn">
              <span class="dicts-mode-dialog__text">
                <strong>Додати довідник</strong>
                <small>Відкрити форму створення нового довідника</small>
              </span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function lavashBuildRatingModal() {
    return `
      <div class="lavash-modal hidden" id="ratingModal" aria-hidden="true">
        <div class="lavash-modal__backdrop" data-close="rating-modal"></div>

        <div class="lavash-modal__card lavash-modal__card--rating" role="dialog" aria-modal="true" aria-labelledby="ratingModalTitle">
          <div class="lavash-modal__header">
            <div>
              <h3 class="lavash-modal__title" id="ratingModalTitle">Рейтинг користувачів</h3>
              <p class="lavash-modal__subtitle">Поточний прогрес операторів, XP та рівні обробки</p>
            </div>

            <button class="lavash-modal__close" id="ratingModalClose" type="button" aria-label="Закрити">
              <span>✕</span>
            </button>
          </div>

          <div class="lavash-rating-hero">
            <div class="lavash-rating-hero__orb"><span>Ⅰ</span></div>
            <div class="lavash-rating-hero__text">
              <strong>Топ операторів</strong>
              <span>XP, рівень і швидкість обробки записів</span>
            </div>
          </div>

          <div class="lavash-rating-list" id="ratingModalList">
            <div class="lavash-rating-row is-top">
              <span class="lavash-rating-row__place">01</span>
              <span class="lavash-rating-row__avatar">★</span>
              <span class="lavash-rating-row__main"><strong>Оператор</strong><small>Рівень 12 · Аналітик II</small></span>
              <span class="lavash-rating-row__bar"><i style="width:84%"></i></span>
              <strong class="lavash-rating-row__xp">842 XP</strong>
            </div>
            <div class="lavash-rating-row">
              <span class="lavash-rating-row__place">02</span>
              <span class="lavash-rating-row__avatar">◆</span>
              <span class="lavash-rating-row__main"><strong>Аналітик</strong><small>Рівень 9 · Контролер</small></span>
              <span class="lavash-rating-row__bar"><i style="width:68%"></i></span>
              <strong class="lavash-rating-row__xp">680 XP</strong>
            </div>
            <div class="lavash-rating-row">
              <span class="lavash-rating-row__place">03</span>
              <span class="lavash-rating-row__avatar">◇</span>
              <span class="lavash-rating-row__main"><strong>Черговий</strong><small>Рівень 7 · Навідник</small></span>
              <span class="lavash-rating-row__bar"><i style="width:52%"></i></span>
              <strong class="lavash-rating-row__xp">515 XP</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function lavashBuildGuideModal() {
    return `
      <div class="lavash-modal hidden" id="guideModal" aria-hidden="true">
        <div class="lavash-modal__backdrop" data-close="guide-modal"></div>

        <div class="lavash-modal__card lavash-modal__card--guide lavash-modal__card--guide-pro" role="dialog" aria-modal="true" aria-labelledby="guideModalTitle">
          <div class="lavash-modal__header lavash-modal__header--pro">
            <div class="lavash-modal__head-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path>
                <path d="M8 7h8"></path>
                <path d="M8 11h6"></path>
              </svg>
            </div>

            <div>
              <h3 class="lavash-modal__title" id="guideModalTitle">Інструкція до роботи</h3>
              <p class="lavash-modal__subtitle">Коротка легенда обробки карток, дій оператора та гарячих клавіш</p>
            </div>

            <button class="lavash-modal__close" id="guideModalClose" type="button" aria-label="Закрити">
              <span>✕</span>
            </button>
          </div>

          <div class="lavash-guide-pro">
            <section class="lavash-guide-flow" aria-label="Основний порядок роботи">
              <article class="lavash-guide-step">
                <span class="lavash-guide-step__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
                <div>
                  <strong>1. Переглянь картку</strong>
                  <p>Перевір тип обʼєкта, поточне значення, запропоновану назву та додаткові поля.</p>
                </div>
              </article>

              <article class="lavash-guide-step">
                <span class="lavash-guide-step__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </span>
                <div>
                  <strong>2. Обери дію</strong>
                  <p>Погодь, відхили або проігноруй запис. Якість рішення впливає на XP та рейтинг.</p>
                </div>
              </article>

              <article class="lavash-guide-step">
                <span class="lavash-guide-step__icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18"></path>
                    <path d="m5 10 7-7 7 7"></path>
                    <path d="M5 21h14"></path>
                  </svg>
                </span>
                <div>
                  <strong>3. Збережи зміни</strong>
                  <p>Після успішної обробки система додає XP, оновлює прогрес і переходить до наступної картки.</p>
                </div>
              </article>
            </section>

            <section class="lavash-hotkeys-panel" aria-label="Гарячі клавіші">
              <div class="lavash-hotkeys-panel__head">
                <span>Гарячі клавіші</span>
                <small>для швидкої роботи без миші</small>
              </div>

              <div class="lavash-hotkeys-grid">
                <div class="lavash-hotkey">
                  <kbd>A</kbd>
                  <span>Погодити / прийняти запис</span>
                  <b>+10 XP</b>
                </div>

                <div class="lavash-hotkey">
                  <kbd>S</kbd>
                  <span>Відхилити запис</span>
                  <b>+5 XP</b>
                </div>

                <div class="lavash-hotkey">
                  <kbd>D</kbd>
                  <span>Проігнорувати / пропустити</span>
                  <b>+7 XP</b>
                </div>

                <div class="lavash-hotkey">
                  <kbd>Space</kbd>
                  <span>Flip картки / перехід на бек</span>
                  <b>перегляд</b>
                </div>

                <div class="lavash-hotkey">
                  <kbd>Esc</kbd>
                  <span>Закрити модалку або скасувати дію</span>
                  <b>вихід</b>
                </div>
              </div>
            </section>

            <section class="lavash-guide-tip">
              <div>
                <strong>Порада</strong>
                <p>Працюй клавішами A / S / D для швидкого сортування, Space — для перевірки деталей на звороті картки, Esc — для швидкого закриття вікон.</p>
              </div>

              <div class="lavash-guide-tip__orb" aria-hidden="true">★</div>
            </section>
          </div>

          <div class="lavash-guide-footer">
            <span>Дякуємо за якісну обробку!</span>
            <button class="lavash-guide-ok" type="button" onclick="document.getElementById('guideModalClose')?.click()">Зрозуміло</button>
          </div>
        </div>
      </div>
    `;
  }

  function lavashBuildHeader(title = 'Lavash Admin') {
  return `
    <header class="workspace-header">
      <div class="workspace-header__left">
        <h1 class="workspace-title">${title}</h1>
      </div>

      <div class="workspace-header__right">
        <button
          class="status-badge"
          id="connectionStatus"
          type="button"
          data-status="online"
          aria-label="Підключено"
          title="Підключено"
        >
          <span class="status-badge__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path class="status-badge__wave status-badge__wave--outer" d="M5.25 12a6.75 6.75 0 0 1 13.5 0"></path>
              <path class="status-badge__wave status-badge__wave--inner" d="M8.4 12a3.6 3.6 0 0 1 7.2 0"></path>
              <circle class="status-badge__dot" cx="12" cy="12" r="2.15"></circle>
            </svg>
          </span>

          <span class="status-badge__text">Підключено</span>
        </button>
      </div>
    </header>
  `;
}
  function setConnectionStatus(status) {
    const badge = document.getElementById('connectionStatus');
    if (!badge) return;

    const map = {
      online: 'Підключено',
      reconnecting: 'Відновлення',
      offline: 'Немає звʼязку'
    };

    const normalized = map[status] ? status : 'online';

    badge.dataset.status = normalized;
badge.setAttribute('aria-label', map[normalized]);
badge.setAttribute('title', map[normalized]);

    const text = badge.querySelector('.status-badge__text');
    if (text) text.textContent = map[normalized];
  }

  function initConnectionStatus() {
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');
  }

  window.LAVASH_CONNECTION = {
    set: setConnectionStatus
  };

  window.addEventListener('online', () => setConnectionStatus('online'));
  window.addEventListener('offline', () => setConnectionStatus('offline'));

  function initLavashLayout(options = {}) {
    const {
      pageKey = lavashCurrentPageKey(),
      title = 'Lavash Admin',
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

    const dictsDialogHtml = pageKey === 'dicts' ? lavashBuildDictsModeDialog() : '';
    const commonDialogsHtml = `
      ${lavashBuildRatingModal()}
      ${lavashBuildGuideModal()}
    `;

    mount.innerHTML = `
      <div class="app-shell">
        ${lavashBuildLeftNav(pageKey)}

        <main class="main-workspace">
          ${lavashBuildHeader(title)}
          <section class="workspace-body ${contentClass}" id="workspaceBody">
            ${content}
          </section>
        </main>

        ${rightToolsHtml}
      </div>

      ${dictsDialogHtml}
      ${commonDialogsHtml}
    `;

    bindLavashLayoutEvents();
    initConnectionStatus();
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

    bindDictsModeDialog();
    bindRightToolsActions();
  }

  function lavashOpenModal(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    dialog.classList.remove('hidden');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lavash-modal-open');
  }

  function lavashCloseModal(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    dialog.classList.add('hidden');
    dialog.setAttribute('aria-hidden', 'true');

    const anyOpen = document.querySelector('.lavash-modal:not(.hidden)');
    if (!anyOpen) {
      document.body.classList.remove('lavash-modal-open');
    }
  }

  function bindGenericModal(dialogId, closeId, closeDataName) {
    const dialog = document.getElementById(dialogId);
    if (!dialog || dialog.dataset.bound === 'true') return;

    dialog.dataset.bound = 'true';

    const closeBtn = document.getElementById(closeId);
    const backdrop = dialog.querySelector(`[data-close="${closeDataName}"]`);

    closeBtn?.addEventListener('click', () => lavashCloseModal(dialogId));
    backdrop?.addEventListener('click', () => lavashCloseModal(dialogId));
  }

  function bindRightToolsActions() {
    document.querySelectorAll('.right-tools .tool-item[data-tool]').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';

      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;

        if (tool === 'rating') {
          lavashOpenModal('ratingModal');
          return;
        }

        if (tool === 'guide') {
          lavashOpenModal('guideModal');
          return;
        }

        if (tool === 'refresh') {
          window.location.reload();
        }
      });
    });

    bindGenericModal('ratingModal', 'ratingModalClose', 'rating-modal');
    bindGenericModal('guideModal', 'guideModalClose', 'guide-modal');

    if (window.__lavashRightToolsEscBound !== true) {
      window.__lavashRightToolsEscBound = true;

      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        lavashCloseModal('ratingModal');
        lavashCloseModal('guideModal');
      });
    }
  }

  function bindDictsModeDialog() {
    const trigger = document.getElementById('dictsModeTrigger');
    const dialog = document.getElementById('dictsModeDialog');

    if (!trigger || !dialog) return;

    const closeBtn = document.getElementById('dictsModeDialogClose');
    const backdrop = dialog.querySelector('[data-close="dicts-mode-dialog"]');
    const modeButtons = dialog.querySelectorAll('[data-dicts-mode]');
    const addBtn = document.getElementById('dictsAddDictionaryBtn');

    function openDialog() {
      dialog.classList.remove('hidden');
      dialog.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lavash-modal-open');
    }

    function closeDialog() {
      dialog.classList.add('hidden');
      dialog.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lavash-modal-open');
    }

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openDialog();
    });

    closeBtn?.addEventListener('click', closeDialog);
    backdrop?.addEventListener('click', closeDialog);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !dialog.classList.contains('hidden')) {
        closeDialog();
      }
    });

    modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeButtons.forEach((item) => item.classList.remove('is-active'));
        btn.classList.add('is-active');

        const mode = btn.dataset.dictsMode;

        if (typeof window.setDictsViewMode === 'function') {
          window.setDictsViewMode(mode);
        } else {
          document.dispatchEvent(new CustomEvent('lavash:dicts-mode-change', {
            detail: { mode }
          }));
        }

        closeDialog();
      });
    });

    addBtn?.addEventListener('click', () => {
      if (typeof window.openAddDictionaryModal === 'function') {
        window.openAddDictionaryModal();
      }

      closeDialog();
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
