const LAVASH_VIEW_ROUTES = {
  pending: {
    title: 'Черга перевірки',
    view: '/lavash-admin/pages/views/pending.html',
    pageKey: 'editor',
    useRightTools: true,
    init: async () => {
      if (window.initPendingPage) {
        await window.initPendingPage();
      }
    }
  },
  upload: {
    title: 'Завантаження',
    view: '/lavash-admin/pages/views/upload.html',
    pageKey: 'upload',
    useRightTools: false,
    init: async () => {
      if (window.initUploadPage) {
        await window.initUploadPage();
      }
    }
  },
  dicts: {
    title: 'Довідники',
    view: '/lavash-admin/pages/views/dicts.html',
    pageKey: 'dicts',
    useRightTools: false,
    init: async () => {}
  },
  logs: {
    title: 'Логування',
    view: '/lavash-admin/pages/views/logs.html',
    pageKey: 'logs',
    useRightTools: false,
    init: async () => {}
  }
};

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '').trim();
  return hash || 'pending';
}

async function loadLavashView(routeName) {
  const route = LAVASH_VIEW_ROUTES[routeName] || LAVASH_VIEW_ROUTES.pending;

  const user = await window.LAVASH_AUTH?.protectAppPage?.();
  if (!user) return;

  initLavashLayout({
    pageKey: route.pageKey,
    title: route.title,
    statusText: 'Підключено',
    content: '<div class="placeholder-card">Завантаження сторінки...</div>',
    useRightTools: route.useRightTools
  });

  await hydrateLavashUser();

  const contentMount = document.getElementById('workspaceBody');
  if (!contentMount) return;

  try {
    const response = await fetch(route.view, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Не вдалося завантажити ${route.view}`);
    }

    const html = await response.text();
    contentMount.innerHTML = html;

    if (typeof route.init === 'function') {
      await route.init();
    }
  } catch (error) {
    console.error('loadLavashView failed:', error);
    contentMount.innerHTML = `
      <div class="placeholder-card">
        Помилка завантаження сторінки.
      </div>
    `;
  }
}

function bindLavashHashRouter() {
  window.addEventListener('hashchange', () => {
    loadLavashView(getRouteFromHash());
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  bindLavashHashRouter();
  await loadLavashView(getRouteFromHash());
});
