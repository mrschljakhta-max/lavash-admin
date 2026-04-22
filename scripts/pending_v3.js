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

    const els = getPendingElements();
    if (!els.pageRoot && !els.searchInput && !els.statusFilter && !els.typeFilter) {
      return;
    }

    bindPendingEvents();
    await loadPendingRows();
  }

  window.LAVASH_PENDING = {
    initPendingPage,
    loadPendingRows
  };
})();(() => {
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

    const els = getPendingElements();
    if (!els.pageRoot && !els.searchInput && !els.statusFilter && !els.typeFilter) {
      return;
    }

    bindPendingEvents();
    await loadPendingRows();
  }

  window.LAVASH_PENDING = {
    initPendingPage,
    loadPendingRows
  };
})();
