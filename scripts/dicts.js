(() => {
  const STORAGE_KEY = 'lavash_dicts_view_mode';

  const SELECTORS = {
    root: [
      '#dictsPage',
      '#dictsRoot',
      '#dictsViewRoot',
      '.dicts-page',
      '.dicts-root',
      '[data-page="dicts"]',
      '#workspaceBody'
    ],
    carouselWrap: [
      '#dictsCarouselView',
      '#dictsCarousel',
      '.dicts-carousel-view',
      '.dicts-view--carousel-block',
      '[data-dicts-view="carousel"]'
    ],
    schemaWrap: [
      '#dictsSchemaView',
      '#dictsSchema',
      '.dicts-schema-view',
      '.dicts-view--schema-block',
      '[data-dicts-view="schema"]'
    ],
    addDictionaryButtons: [
      '#addDictionaryBtn',
      '#openAddDictionaryModalBtn',
      '[data-action="add-dictionary"]',
      '[data-open="add-dictionary-modal"]',
      '.js-add-dictionary'
    ],
    addDictionaryModal: [
      '#addDictionaryModal',
      '#dictionaryCreateModal',
      '#dictCreateModal',
      '.add-dictionary-modal',
      '[data-modal="add-dictionary"]'
    ],
    closeModalButtons: [
      '[data-close-modal]',
      '.modal-close',
      '.js-modal-close'
    ],
    carouselTriggers: [
      '[data-mode="carousel"]',
      '[data-view="carousel"]',
      '[data-dicts-mode-trigger="carousel"]',
      '.js-mode-carousel'
    ],
    schemaTriggers: [
      '[data-mode="schema"]',
      '[data-view="schema"]',
      '[data-dicts-mode-trigger="schema"]',
      '.js-mode-schema'
    ]
  };

  function firstExisting(selectors, root = document) {
    for (const selector of selectors) {
      const node = root.querySelector(selector);
      if (node) return node;
    }
    return null;
  }

  function allExisting(selectors, root = document) {
    const result = [];
    selectors.forEach((selector) => {
      root.querySelectorAll(selector).forEach((node) => result.push(node));
    });
    return result;
  }

  function getRoot() {
    return firstExisting(SELECTORS.root) || document.body;
  }

  function normalizeMode(mode) {
    return mode === 'schema' ? 'schema' : 'carousel';
  }

  function saveMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.warn('dicts.js: failed to save mode', error);
    }
  }

  function loadMode() {
    try {
      return normalizeMode(localStorage.getItem(STORAGE_KEY) || 'carousel');
    } catch (error) {
      console.warn('dicts.js: failed to load mode', error);
      return 'carousel';
    }
  }

  function setDisplay(node, visible) {
    if (!node) return;
    node.style.display = visible ? '' : 'none';
    node.hidden = !visible;
    node.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  function syncDialogButtons(mode) {
    const dialogButtons = document.querySelectorAll('#dictsModeDialog [data-dicts-mode]');
    dialogButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.dictsMode === mode);
    });
  }

  function syncExternalTriggers(mode) {
    const carouselTriggers = allExisting(SELECTORS.carouselTriggers);
    const schemaTriggers = allExisting(SELECTORS.schemaTriggers);

    carouselTriggers.forEach((btn) => {
      btn.classList.toggle('is-active', mode === 'carousel');
      btn.setAttribute('aria-pressed', mode === 'carousel' ? 'true' : 'false');
    });

    schemaTriggers.forEach((btn) => {
      btn.classList.toggle('is-active', mode === 'schema');
      btn.setAttribute('aria-pressed', mode === 'schema' ? 'true' : 'false');
    });
  }

  function applyRootClasses(root, mode) {
    root.classList.remove('dicts-view--carousel', 'dicts-view--schema');
    root.classList.add(mode === 'schema' ? 'dicts-view--schema' : 'dicts-view--carousel');
    root.setAttribute('data-dicts-view-mode', mode);
  }

  function toggleKnownViewBlocks(mode) {
    const carouselWrap = firstExisting(SELECTORS.carouselWrap);
    const schemaWrap = firstExisting(SELECTORS.schemaWrap);

    if (carouselWrap || schemaWrap) {
      setDisplay(carouselWrap, mode === 'carousel');
      setDisplay(schemaWrap, mode === 'schema');
    }
  }

  function clickNativeTrigger(mode) {
    const selectors = mode === 'schema' ? SELECTORS.schemaTriggers : SELECTORS.carouselTriggers;
    const nativeBtn = firstExisting(selectors);

    if (!nativeBtn) return false;

    const isInsideDialog = !!nativeBtn.closest('#dictsModeDialog');
    if (isInsideDialog) return false;

    nativeBtn.click();
    return true;
  }

  function updateView(mode, options = {}) {
    const normalizedMode = normalizeMode(mode);
    const root = getRoot();

    applyRootClasses(root, normalizedMode);
    toggleKnownViewBlocks(normalizedMode);
    syncDialogButtons(normalizedMode);
    syncExternalTriggers(normalizedMode);

    if (!options.silentNativeTrigger) {
      clickNativeTrigger(normalizedMode);
    }

    saveMode(normalizedMode);

    document.dispatchEvent(new CustomEvent('lavash:dicts-view-updated', {
      detail: { mode: normalizedMode }
    }));
  }

  function openModalNode(modal) {
    if (!modal) return false;

    modal.classList.remove('hidden', 'is-hidden');
    modal.classList.add('is-open', 'open', 'active');
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lavash-modal-open');
    return true;
  }

  function openAddDictionaryModal() {
    const realButton = firstExisting(SELECTORS.addDictionaryButtons);
    if (realButton) {
      realButton.click();
      return;
    }

    const modal = firstExisting(SELECTORS.addDictionaryModal);
    if (openModalNode(modal)) return;

    console.warn('dicts.js: add dictionary trigger/modal not found');
  }

  function bindNativeModeButtons() {
    const carouselTriggers = allExisting(SELECTORS.carouselTriggers).filter(
      (btn) => !btn.closest('#dictsModeDialog')
    );
    const schemaTriggers = allExisting(SELECTORS.schemaTriggers).filter(
      (btn) => !btn.closest('#dictsModeDialog')
    );

    carouselTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        updateView('carousel', { silentNativeTrigger: true });
      });
    });

    schemaTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        updateView('schema', { silentNativeTrigger: true });
      });
    });
  }

  function bindFallbackModalClose() {
    const modal = firstExisting(SELECTORS.addDictionaryModal);
    if (!modal) return;

    const closeButtons = allExisting(SELECTORS.closeModalButtons, modal);
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.classList.remove('is-open', 'open', 'active');
        modal.classList.add('hidden');
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lavash-modal-open');
      });
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('is-open', 'open', 'active');
        modal.classList.add('hidden');
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lavash-modal-open');
      }
    });
  }

  function initDictsPage() {
    const root = getRoot();
    if (!root) return;

    bindNativeModeButtons();
    bindFallbackModalClose();

    const initialMode = loadMode();
    updateView(initialMode, { silentNativeTrigger: false });
  }

  window.setDictsViewMode = function setDictsViewMode(mode) {
    updateView(mode);
  };

  window.openAddDictionaryModal = function openAddDictionaryModalGlobal() {
    openAddDictionaryModal();
  };

  document.addEventListener('DOMContentLoaded', initDictsPage);

  document.addEventListener('lavash:dicts-mode-change', (event) => {
    const mode = event?.detail?.mode || 'carousel';
    updateView(mode);
  });
})();
