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

  function lavashIconSvg(name) {
    const icons = {
      trophy: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 21h8"></path>
          <path d="M12 17v4"></path>
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"></path>
          <path d="M7 6H4a2 2 0 0 0 2 4h1"></path>
          <path d="M17 6h3a2 2 0 0 1-2 4h-1"></path>
        </svg>`,
      guide: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"></path>
          <path d="M8 7h8"></path>
          <path d="M8 11h6"></path>
        </svg>`,
      modes: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="7" height="7" rx="1.6"></rect>
          <rect x="14" y="4" width="7" height="7" rx="1.6"></rect>
          <rect x="3" y="15" width="7" height="6" rx="1.6"></rect>
          <path d="M14 18h7"></path>
          <path d="M17.5 15v6"></path>
        </svg>`,
      lock: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="5" y="10" width="14" height="10" rx="2"></rect>
          <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
          <path d="M12 14v2"></path>
        </svg>`,
      ranks: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 14.98 7.3 17.45l.9-5.23-3.8-3.7 5.25-.76L12 3Z"></path>
          <path d="M5 21h14"></path>
          <path d="M8 18h8"></path>
        </svg>`
    };

    return icons[name] || icons.guide;
  }

  function lavashToolButton(tool) {
    const extraClass = tool.className ? ` ${tool.className}` : '';
    const attrs = [
      `class="tool-item${extraClass}"`,
      'type="button"',
      `title="${tool.title}"`
    ];

    if (tool.id) attrs.push(`id="${tool.id}"`);
    if (tool.action) attrs.push(`data-tool="${tool.action}"`);
    if (tool.ariaHasPopup) attrs.push('aria-haspopup="dialog"');
    if (tool.ariaControls) attrs.push(`aria-controls="${tool.ariaControls}"`);

    const iconHtml = tool.img
      ? `<span class="tool-item__icon-wrap"><img src="${tool.img}" alt="" class="tool-item__icon" /></span>`
      : `<span class="tool-item__icon-wrap tool-item__icon-wrap--svg">${lavashIconSvg(tool.icon)}</span>`;

    return `
      <button ${attrs.join(' ')}>
        ${iconHtml}
        <span class="tool-item__label">${tool.label}</span>
      </button>
    `;
  }

  function lavashGetRightToolsConfig(pageKey) {
    const commonRefresh = {
      action: 'refresh',
      label: 'Оновити',
      title: 'Оновити поточну сторінку',
      img: '/lavash-admin/assets/icons/tool-refresh.svg?v=12'
    };

    const configs = {
      pending: [
        { action: 'rating', icon: 'trophy', label: 'Рейтинг', title: 'Рейтинг користувачів' },
        { action: 'guide', icon: 'guide', label: 'Інструкція', title: 'Інструкція до роботи з картками' },
        { action: 'operator-ranks', icon: 'ranks', label: 'Ранги', title: 'Ранги оператора' },
        commonRefresh
      ],
      dicts: [
        {
          id: 'dictsModeTrigger',
          icon: 'modes',
          label: 'Режими',
          title: 'Режими довідників',
          className: 'tool-item--dicts-mode',
          ariaHasPopup: true,
          ariaControls: 'dictsModeDialog'
        },
        { action: 'rating', icon: 'trophy', label: 'Рейтинг', title: 'Рейтинг користувачів' },
        { action: 'guide', icon: 'guide', label: 'Інструкція', title: 'Інструкція до роботи з довідниками' },
        commonRefresh
      ],
      logs: [
        { action: 'logs-lock', icon: 'lock', label: 'Замок', title: 'Повернути замок / скинути вихор доступу' },
        { action: 'guide', icon: 'guide', label: 'Інструкція', title: 'Інструкція до логування' },
        commonRefresh
      ]
    };

    return configs[pageKey] || configs.pending;
  }

  function lavashBuildDefaultRightTools(pageKey = lavashCurrentPageKey()) {
    const isDictsPage = pageKey === 'dicts';
    const tools = lavashGetRightToolsConfig(pageKey);

    return `
      <aside class="right-tools" id="rightTools" data-page-tools="${pageKey}">
        <div class="right-tools__inner">
          <div class="right-tools__top">
            <div class="right-tools__title-wrap">
              <span class="right-tools__title">Інструменти</span>
            </div>
          </div>

          <div class="right-tools__menu" aria-label="Інструменти сторінки">
            ${tools.map(lavashToolButton).join('')}
          </div>

          ${isDictsPage ? '' : '<div class="right-tools__panel" id="layoutRightPanel"></div>'}
        </div>
      </aside>
    `;
  }

  function lavashBuildUploadRightTools() {
    return `
      <aside class="right-tools right-tools--upload right-tools--upload-clean" id="rightTools" data-page-key="upload">
        <div class="right-tools__inner">
          <div class="right-tools__top right-tools__top--upload-clean">
            <div class="right-tools__title-wrap">
              <span class="right-tools__title">Процес</span>
              <span class="right-tools__subtitle">завантаження</span>
            </div>
          </div>

          <div class="upload-process" aria-label="Етапи завантаження">
            <button class="upload-process__step upload-process__step--queue is-active" type="button" data-upload-tool="queue" id="uploadStepQueue">
              <span class="upload-process__badge">1</span>
              <span class="upload-process__body">
                <span class="upload-process__title">Завантаження</span>
                <span class="upload-process__meta"><span id="uploadStepQueueCount">0</span> файлів у черзі</span>
              </span>
            </button>

            <span class="upload-process__line" aria-hidden="true"></span>

            <button class="upload-process__step" type="button" data-upload-tool="validate" id="uploadStageValidateBlock">
              <span class="upload-process__badge">2</span>
              <span class="upload-process__body">
                <span class="upload-process__title">Обробка</span>
                <span class="upload-process__meta">перевірка · парсинг · події</span>
              </span>
            </button>

            <span class="upload-process__line" aria-hidden="true"></span>

            <button class="upload-process__step upload-process__step--start" type="button" id="uploadStartSideBtn" disabled>
              <span class="upload-process__badge">
                <img src="/lavash-admin/assets/icons/upload/bolt.svg?v=14" alt="" />
              </span>
              <span class="upload-process__body">
                <span class="upload-process__title">Запуск</span>
                <span class="upload-process__meta"><span id="uploadRunCount">додай файл</span></span>
              </span>
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

  function lavashBuildOperatorRanksModal() {
    const ranks = [
      { title: 'Стажер', level: 'Рівень 1', xp: '0–99 XP', note: 'Перші перевірки та знайомство з картками' },
      { title: 'Молодший оператор', level: 'Рівень 2', xp: '100–199 XP', note: 'Початкова стабільність у рішеннях' },
      { title: 'Оператор', level: 'Рівень 3', xp: '200–349 XP', note: 'Стабільна обробка записів без помилок' },
      { title: 'Навідник', level: 'Рівень 4', xp: '350–499 XP', note: 'Швидке сортування та контроль якості' },
      { title: 'Аналітик I', level: 'Рівень 5', xp: '500–699 XP', note: 'Висока точність рішень і темп роботи' },
      { title: 'Аналітик II', level: 'Рівень 6', xp: '700–899 XP', note: 'Поточний преміум-ранг оператора' },
      { title: 'Старший аналітик', level: 'Рівень 7', xp: '900–1.5k XP', note: 'Ведення складних записів і перевірка інших' },
      { title: 'Майстер обробки', level: 'Рівень 8', xp: '1.5k–3k XP', note: 'Максимальна продуктивність у зміні' },
      { title: 'Експерт даних', level: 'Рівень 9', xp: '3k–6k XP', note: 'Глибока перевірка й точність нормалізації' },
      { title: 'Контролер якості', level: 'Рівень 10', xp: '6k–10k XP', note: 'Контроль правильності рішень операторів' },
      { title: 'Куратор системи', level: 'Рівень 11', xp: '10k–20k XP', note: 'Кураторство процесу та стабільності обробки' },
      { title: 'Архітектор даних', level: 'Рівень 12', xp: '20k–35k XP', note: 'Складна логіка довідників і структури даних' },
      { title: 'Командир аналітики', level: 'Рівень 13', xp: '35k–60k XP', note: 'Керування темпом і якістю всієї зміни' },
      { title: 'Легенда системи', level: 'Рівень 14', xp: '60k–100k XP', note: 'Елітний рівень стабільності та продуктивності' },
      { title: 'Верховний оператор', level: 'Рівень 15', xp: '100k+ XP', note: 'Найвищий ранг редактора Lavash Admin' }
    ];

    return `
      <div class="lavash-modal hidden" id="operatorRanksModal" aria-hidden="true">
        <div class="lavash-modal__backdrop" data-close="operator-ranks-modal"></div>

        <div class="lavash-modal__card lavash-modal__card--operator-ranks" role="dialog" aria-modal="true" aria-labelledby="operatorRanksModalTitle">
          <div class="lavash-modal__header">
            <div>
              <h3 class="lavash-modal__title" id="operatorRanksModalTitle">Ранги оператора</h3>
              <p class="lavash-modal__subtitle">15 рівнів прогресу з готовими значками з assets/ranks</p>
            </div>

            <button class="lavash-modal__close" id="operatorRanksModalClose" type="button" aria-label="Закрити">
              <span>✕</span>
            </button>
          </div>

          <div class="lavash-ranks-grid" aria-label="Список рангів оператора">
            ${ranks.map((rank, index) => {
              const rankNo = String(index + 1).padStart(2, '0');
              const isCurrent = index === 5;

              return `
                <article class="lavash-rank-card ${isCurrent ? 'is-current' : ''}">
                  <span class="lavash-rank-card__place">${rankNo}</span>
                  <span class="lavash-rank-card__badge">
                    <img src="/lavash-admin/assets/ranks/rank-${rankNo}.png?v=12" alt="${rank.title}" loading="lazy" />
                  </span>
                  <span class="lavash-rank-card__main">
                    <strong>${rank.title}</strong>
                    <small>${rank.note}</small>
                  </span>
                  <span class="lavash-rank-card__meta">
                    <b>${rank.level}</b>
                    <small>${rank.xp}</small>
                  </span>
                </article>
              `;
            }).join('')}
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
      ${lavashBuildOperatorRanksModal()}
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

        if (tool === 'operator-ranks') {
          lavashOpenModal('operatorRanksModal');
          return;
        }

        if (tool === 'logs-lock') {
          document.getElementById('logsLockAgainBtn')?.click();
          document.getElementById('logsResetBtn')?.click();
          return;
        }

        if (tool === 'refresh') {
          const refreshEvent = new CustomEvent('lavash:right-tools-refresh', {
            bubbles: true,
            cancelable: true,
            detail: { pageKey: lavashCurrentPageKey() }
          });

          document.dispatchEvent(refreshEvent);

          if (refreshEvent.defaultPrevented) return;

          if (window.LAVASH_ROUTER?.loadLavashView) {
            window.LAVASH_ROUTER.loadLavashView();
            return;
          }

          window.location.reload();
        }
      });
    });

    bindGenericModal('ratingModal', 'ratingModalClose', 'rating-modal');
    bindGenericModal('guideModal', 'guideModalClose', 'guide-modal');
    bindGenericModal('operatorRanksModal', 'operatorRanksModalClose', 'operator-ranks-modal');

    if (window.__lavashRightToolsEscBound !== true) {
      window.__lavashRightToolsEscBound = true;

      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        lavashCloseModal('ratingModal');
        lavashCloseModal('guideModal');
        lavashCloseModal('operatorRanksModal');
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
