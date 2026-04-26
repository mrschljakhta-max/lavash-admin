(() => {
  function getPendingElements() {
    return {
      searchInput:
        document.getElementById('searchInput') ||
        document.getElementById('pendingSearchInput'),

      statusFilter:
        document.getElementById('statusFilter') ||
        document.getElementById('pendingStatusFilter'),

      typeFilter:
        document.getElementById('typeFilter') ||
        document.getElementById('pendingTypeFilter'),

      refreshBtn:
        document.getElementById('refreshBtn') ||
        document.getElementById('pendingRefreshBtn'),

      pageRoot:
        document.getElementById('pendingPage') ||
        document.querySelector('[data-page="pending"]') ||
        document.querySelector('.pending-page') ||
        document.querySelector('.workspace-body') ||
        document.querySelector('.workspace-body--page')
    };
  }

  function isPendingPage() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash === '' || hash === 'pending';
  }

  function hydrateFilterOptions(options = {}) {
    const { searchInput, statusFilter, typeFilter } = getPendingElements();

    if (searchInput) searchInput.value = options.search ?? '';
    if (statusFilter) statusFilter.value = options.status ?? 'all';
    if (typeFilter) typeFilter.value = options.type ?? 'all';
  }

  async function loadPendingRows() {
    if (!isPendingPage()) return [];

    hydrateFilterOptions({
      search: '',
      status: 'all',
      type: 'all'
    });

    console.log('Pending rows loaded');
    return [];
  }

  function renderPendingScene() {
    const root =
      document.querySelector('.workspace-body') ||
      document.querySelector('.workspace-body--page') ||
      document.getElementById('app');

    if (!root) {
      console.warn('Pending root not found');
      return;
    }

    root.innerHTML = `
      <div class="pending-scene">
        <div class="rank-bar">
          <div class="rank-bar__track">
            <div class="rank-bar__fill" style="width: 38%"></div>
          </div>
          <div class="rank-bar__label">
            ⭐ Рівень 12 — Аналітик II · XP 740 / 1000
          </div>
        </div>

        <div class="carousel">
          ${[1, 2, 3, 4, 5].map((i) => `
            <div class="card ${i === 3 ? 'active' : ''}">
              <div class="card-inner">
                <div class="card-front">
                  <h3>Запис #${i}</h3>
                  <p>БПЛА: Shahed-136</p>
                  <p>Станція: Radar_0${i}</p>
                  <p>НП: с. Гора</p>
                  <small>Клік — переглянути / редагувати</small>
                </div>

                <div class="card-back">
                  <label>Тип БПЛА</label>
                  <input value="Ударний БПЛА" />

                  <label>Модель</label>
                  <input value="Shahed-136" />

                  <label>Населений пункт</label>
                  <input value="с. Гора" />

                  <label>Коментар</label>
                  <textarea>Потребує перевірки координат...</textarea>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="control-panel">
          <button class="btn ignore">✖ Ігнорувати</button>
          <button class="btn approve">✔ Підтвердити</button>
          <button class="btn skip">➡ Пропустити</button>
        </div>
      </div>
    `;

    initPendingInteractions();
  }

  function initPendingInteractions() {
    document.querySelectorAll('.card.active').forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  function bindPendingEvents() {
    const { refreshBtn } = getPendingElements();

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        loadPendingRows().catch((error) => {
          console.error('pending refresh error:', error);
        });
      });
    }
  }

  async function initPendingPage() {
    if (!isPendingPage()) return;

    bindPendingEvents();

    try {
      await loadPendingRows();
    } catch (error) {
      console.warn('pending load warning:', error);
    }

    renderPendingScene();
  }

  window.LAVASH_PENDING = {
    initPendingPage,
    loadPendingRows,
    renderPendingScene
  };
})();
