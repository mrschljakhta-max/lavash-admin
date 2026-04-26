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
        document.querySelector('.pending-page')
    };
  }

  function isPendingPage() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash === '' || hash === 'pending';
  }

  function hydrateFilterOptions(options = {}) {
    const { searchInput, statusFilter, typeFilter } = getPendingElements();

    if (searchInput) {
      searchInput.value = options.search ?? '';
    }

    if (statusFilter) {
      statusFilter.value = options.status ?? 'all';
    }

    if (typeFilter) {
      typeFilter.value = options.type ?? 'all';
    }
  }

  async function loadPendingRows() {
    const els = getPendingElements();

    if (!isPendingPage()) return;
    if (!els.pageRoot && !els.searchInput && !els.statusFilter && !els.typeFilter) {
      return;
    }

    hydrateFilterOptions({
      search: '',
      status: 'all',
      type: 'all'
    });

    console.log('Pending rows loaded');
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
  function isPendingPage() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash === '' || hash === 'pending';
  }

  function hydrateFilterOptions(options = {}) {
    const { searchInput, statusFilter, typeFilter } = getPendingElements();

    if (searchInput) {
      searchInput.value = options.search ?? '';
    }

    if (statusFilter) {
      statusFilter.value = options.status ?? 'all';
    }

    if (typeFilter) {
      typeFilter.value = options.type ?? 'all';
    }
  }

  async function loadPendingRows() {
    const els = getPendingElements();

    if (!isPendingPage()) return;
    if (!els.pageRoot && !els.searchInput && !els.statusFilter && !els.typeFilter) {
      return;
    }

    hydrateFilterOptions({
      search: '',
      status: 'all',
      type: 'all'
    });

    console.log('Pending rows loaded');
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

    const els = getPendingElements();
    if (!els.pageRoot && !els.searchInput && !els.statusFilter && !els.typeFilter) {
      return;
    }

    bindPendingEvents();
    await loadPendingRows();

    renderPendingScene(); // 🔥 ОЦЕ ДОДАЄШ
  }

  window.LAVASH_PENDING = {
    initPendingPage,
    loadPendingRows
  };
})();
function renderPendingScene() {
  const root =
    document.getElementById('app') ||
    document.querySelector('.workspace-body');

  if (!root) return;

  root.innerHTML = `
    <div class="pending-scene">

      <!-- PROGRESS / RANK -->
      <div class="rank-bar">
        <div class="rank-bar__track">
          <div class="rank-bar__fill" style="width: 38%"></div>
        </div>
        <div class="rank-bar__label">
          ⭐ Рівень 12 — Старший спеціаліст
        </div>
      </div>

      <!-- CAROUSEL -->
      <div class="carousel">

        ${[1,2,3,4,5].map(i => `
          <div class="card ${i === 3 ? 'active' : ''}">
            <div class="card-inner">

              <!-- FRONT -->
              <div class="card-front">
                <h3>Запис #${i}</h3>
                <p>БпЛА: Shahed</p>
                <p>Локація: Харків</p>
              </div>

              <!-- BACK -->
              <div class="card-back">
                <input value="Shahed" />
                <input value="Харків" />
                <textarea>Коментар...</textarea>
              </div>

            </div>
          </div>
        `).join('')}

      </div>

      <!-- CONTROL PANEL -->
      <div class="control-panel">
        <button class="btn approve">✔ Підтвердити</button>
        <button class="btn ignore">✖ Ігнорувати</button>
        <button class="btn skip">➡ Пропустити</button>
      </div>

    </div>
  `;

  initPendingInteractions();
}
function initPendingInteractions() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}
