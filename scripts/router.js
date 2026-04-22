(() => {
  const routes = {
    pending: {
      title: 'Редактор',
      page: '/lavash-admin/pages/pending_v3.html',
      key: 'pending',
      loader: async () => {
        if (window.LAVASH_PENDING?.initPendingPage) {
          await window.LAVASH_PENDING.initPendingPage();
        }
      }
    },

    upload: {
      title: 'Завантаження',
      page: '/lavash-admin/pages/upload.html',
      key: 'upload',
      loader: async () => {
        if (window.LAVASH_UPLOAD?.initUploadPage) {
          await window.LAVASH_UPLOAD.initUploadPage();
        }
      }
    },

    dicts: {
      title: 'Довідники',
      page: '/lavash-admin/pages/dicts.html',
      key: 'dicts',
      loader: async () => {
        if (window.LAVASH_DICTS?.initDictsPage) {
          await window.LAVASH_DICTS.initDictsPage();
        } else if (window.initDictsPage) {
          await window.initDictsPage();
        }
      }
    },

    logs: {
      title: 'Логування',
      page: '/lavash-admin/pages/logs.html',
      key: 'logs',
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
    return routes[hash] ? hash : 'pending';
  }

  async function fetchPageHtml(url) {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Не вдалося завантажити сторінку: ${url} (${response.status})`);
    }

    const rawHtml = await response.text();
    return extractRenderableHtml(rawHtml);
  }

  function extractRenderableHtml(rawHtml) {
    const hasHtmlTag = /<html[\s>]/i.test(rawHtml);
    const hasBodyTag = /<body[\s>]/i.test(rawHtml);

    if (!hasHtmlTag && !hasBodyTag) {
      return rawHtml;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    if (doc.body) {
      return doc.body.innerHTML;
    }

    return rawHtml;
  }

  async function loadLavashView() {
    const routeKey = getRouteKey();
    const route = routes[routeKey];

    if (!route) return;

    const pageHtml = await fetchPageHtml(route.page);

    if (typeof window.initLavashLayout === 'function') {
      window.initLavashLayout({
        pageKey: route.key,
        title: route.title,
        statusText: 'Підключено',
        content: pageHtml,
        useRightTools: true,
        contentClass: 'workspace-body--page',
        rightToolsVariant: route.key === 'upload' ? 'upload' : 'default'
      });
    }

    if (typeof window.hydrateLavashUser === 'function') {
      await window.hydrateLavashUser();
    }

    if (typeof route.loader === 'function') {
      await route.loader();
    }
  }

  async function safeLoadLavashView() {
    try {
      await loadLavashView();
    } catch (error) {
      console.error('router load error:', error);

      const workspace = document.getElementById('workspaceBody') || document.getElementById('app');
      if (workspace) {
        workspace.innerHTML = `
          <div style="padding:24px;color:#fff;">
            <h2 style="margin:0 0 12px;">Помилка завантаження сторінки</h2>
            <div style="opacity:.8;">${String(error.message || error)}</div>
          </div>
        `;
      }
    }
  }

  window.addEventListener('hashchange', () => {
    safeLoadLavashView();
  });

  window.addEventListener('DOMContentLoaded', () => {
    safeLoadLavashView();
  });

  window.LAVASH_ROUTER = {
    loadLavashView: safeLoadLavashView
  };
})();
