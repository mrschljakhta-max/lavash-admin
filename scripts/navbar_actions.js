(() => {
  const ACTION_EVENT = 'lavash:right-nav-action';

  function openModal(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return false;

    dialog.classList.remove('hidden');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lavash-modal-open');
    return true;
  }

  function closeModal(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return false;

    dialog.classList.add('hidden');
    dialog.setAttribute('aria-hidden', 'true');

    if (!document.querySelector('.lavash-modal:not(.hidden)')) {
      document.body.classList.remove('lavash-modal-open');
    }

    return true;
  }

  function refreshCurrentRoute() {
    if (window.LAVASH_ROUTER?.loadLavashView) {
      window.LAVASH_ROUTER.loadLavashView();
      return true;
    }

    window.location.reload();
    return true;
  }

  const defaultHandlers = {
    'pending.rating': () => openModal('ratingModal'),
    'pending.guide': () => openModal('guideModal'),
    'pending.refresh': refreshCurrentRoute,

    'dicts.rating': () => openModal('ratingModal'),
    'dicts.mode': () => openModal('dictsModeDialog'),
    'dicts.table': () => {
      if (typeof window.setDictsViewMode === 'function') {
        window.setDictsViewMode('table');
        return true;
      }
      document.dispatchEvent(new CustomEvent('lavash:dicts-mode-change', { detail: { mode: 'table' } }));
      return true;
    },
    'dicts.refresh': refreshCurrentRoute,

    'logs.rating': () => openModal('ratingModal'),
    'logs.guide': () => openModal('guideModal'),
    'logs.refresh': refreshCurrentRoute,

    // Upload actions are mostly handled inside upload.js through existing data-upload-tool bindings.
    // These events are kept here to make the right navbar architecture consistent and ready for Supabase.
    'upload.queue': () => true,
    'upload.validate': () => true,
    'upload.parse': () => true,
    'upload.extract': () => true,
    'upload.database': () => true,
    'upload.start': () => true
  };

  function getPageHandlers() {
    return window.LAVASH_PAGE_ACTIONS || window.LAVASH_NAVBAR_ACTIONS || {};
  }

  function handleAction(action, sourceButton = null) {
    if (!action) return false;

    const detail = {
      action,
      button: sourceButton,
      pageKey: document.getElementById('rightTools')?.dataset.pageKey || ''
    };

    document.dispatchEvent(new CustomEvent(ACTION_EVENT, { detail }));

    const pageHandlers = getPageHandlers();
    const pageHandler = pageHandlers[action] || pageHandlers[action.split('.').pop()];

    if (typeof pageHandler === 'function') {
      pageHandler(detail);
      return true;
    }

    if (typeof defaultHandlers[action] === 'function') {
      defaultHandlers[action](detail);
      return true;
    }

    console.warn('[Lavash Navbar] Немає обробника для дії:', action);
    return false;
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-nav-action]');
    if (!button) return;

    const action = button.dataset.navAction;
    if (!action) return;

    handleAction(action, button);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    closeModal('ratingModal');
    closeModal('guideModal');
    closeModal('dictsModeDialog');
  });

  window.LAVASH_NAVBAR = {
    handleAction,
    openModal,
    closeModal,
    refreshCurrentRoute
  };
})();
