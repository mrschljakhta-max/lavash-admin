const LAVASH_VIEW_ROUTES = {
  pending: {
    title: 'Черга перевірки',
    view: '/lavash-admin/pages/views/pending.html',
    pageKey: 'editor',
    useRightTools: true,
    contentClass: 'workspace-body--split',
    rightToolsVariant: 'default',
    extraCss: [],
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
    useRightTools: true,
    contentClass: 'workspace-body--page',
    rightToolsVariant: 'upload',
    extraCss: [],
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
    useRightTools: true,
    contentClass: 'workspace-body--page',
    rightToolsVariant: 'default',
    extraCss: ['/lavash-admin/styles/dicts.css?v=12'],
    init: async () => {
      if (window.initDictsPage) {
        await window.initDictsPage();
      }
    }
  },

  logs: {
    title: 'Логування',
    view: '/lavash-admin/pages/views/logs.html',
    pageKey: 'logs',
    useRightTools: false,
    contentClass: 'workspace-body--page',
    rightToolsVariant: 'default',
    extraCss: [],
    init: async () => {
      if (window.initLogsPage) {
        await window.initLogsPage();
      }
    }
  }
};

function ensureRouteCss(hrefs = []) {
  document.querySelectorAll('link[data-route-css="true"]').forEach((node) => node.remove());

  hrefs.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.routeCss = 'true';
    document.head.appendChild(link);
  });
}

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '').trim();
  return hash || 'pending';
}

async function loadLavashView(routeName) {
  const route = LAVASH_VIEW_ROUTES[routeName] || LAVASH_VIEW_ROUTES.pending;

  const user = await window.LAVASH_AUTH?.protectAppPage?.();
  if (!user) return;

  ensureRouteCss(route.extraCss || []);

  initLavashLayout({
    pageKey: route.pageKey,
    title: route.title,
    statusText: 'Підключено',
    content: '<div class="placeholder-card">Завантаження сторінки...</div>',
    useRightTools: route.useRightTools,
    contentClass: route.contentClass,
    rightToolsVariant: route.rightToolsVariant
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
    contentMount.innerHTML = `<div class="placeholder-card">Помилка завантаження сторінки.</div>`;
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
