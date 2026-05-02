// FIXED ROUTER
const routes = {
  pending: '/lavash-admin/pages/pending_v3.html',
  upload: '/lavash-admin/pages/upload.html',
  dicts: '/lavash-admin/pages/dicts.html',
  logs: '/lavash-admin/pages/logs.html'
};

function loadPage(route) {
  const container = document.getElementById('app');
  fetch(routes[route])
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      window.dispatchEvent(new Event('page:loaded'));
    });
}

window.addEventListener('hashchange', () => {
  const route = location.hash.replace('#', '') || 'pending';
  loadPage(route);
});

window.addEventListener('DOMContentLoaded', () => {
  const route = location.hash.replace('#', '') || 'pending';
  loadPage(route);
});
