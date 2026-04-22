(() => {
  const routes = {
    pending: {
      title: 'Редактор',
      loader: async () => {
        if (window.LAVASH_PENDING?.initPendingPage) {
          await window.LAVASH_PENDING.initPendingPage();
        }
      }
    },

    upload: {
      title: 'Завантаження',
      loader: async () => {
        if (window.LAVASH_UPLOAD?.initUploadPage) {
          await window.LAVASH_UPLOAD.initUploadPage();
        }
      }
    },

    dicts: {
      title: 'Довідники',
      loader: async () => {
        if (window.LAVASH_DICTS?.initDictsPage) {
          await window.LAVASH_DICTS.initDictsPage();
        }
      }
    },

    logs: {
      title: 'Логування',
      loader: async () => {
        if (window.LAVASH_LOGS?.initLogsPage) {
          await window.LAVASH_LOGS.initLogsPage();
        }
      }
    }
  };

  function getRouteKey() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return 'pending';
    if (routes[hash]) return hash;
    return 'pending';
  }

  async function loadLavashView() {
    const routeKey = getRouteKey();
    const route = routes[routeKey];

    if (!route) return;

    if (typeof window.initLavashLayout === 'function') {
      window.initLavashLayout({
        pageKey: routeKey,
        title: route.title,
        statusText: 'Підключено',
        content: '',
        useRightTools: true,
        contentClass: 'workspace-body--page',
        rightToolsVariant: routeKey === 'upload' ? 'upload' : 'default'
      });
    }

    if (typeof window.hydrateLavashUser === 'function') {
      await window.hydrateLavashUser();
    }

    if (typeof route.loader === 'function') {
      await route.loader();
    }
  }

  window.addEventListener('hashchange', () => {
    loadLavashView().catch((error) => {
      console.error('router hashchange error:', error);
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    loadLavashView().catch((error) => {
      console.error('router init error:', error);
    });
  });

  window.LAVASH_ROUTER = {
    loadLavashView
  };
})();
