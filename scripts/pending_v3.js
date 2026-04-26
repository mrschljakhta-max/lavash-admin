(() => {
  function isPendingPage() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash === '' || hash === 'pending';
  }

  async function initPendingPage() {
    if (!isPendingPage()) return;

    if (window.LAVASH_PENDING_GAME?.init) {
      window.LAVASH_PENDING_GAME.init();
    }
  }

  window.LAVASH_PENDING = {
    initPendingPage
  };
})();
