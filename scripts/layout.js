function lavashCurrentPageKey() {
  const hash = window.location.hash || '';
  if (hash.includes('dicts')) return 'dicts';
  return '';
}

function lavashBuildDefaultRightTools(pageKey = lavashCurrentPageKey()) {
  const isDictsPage = pageKey === 'dicts';

  return `
    <aside class="right-tools" id="rightTools">
      <div class="right-tools__inner">

        <div class="right-tools__top">
          <span class="right-tools__title">Інструменти</span>
        </div>

        <div class="right-tools__menu">

          ${isDictsPage ? `
          <div id="dictsModeSwitcher">
            <button class="tool-item" id="dictsModeTrigger">
              <span>Режими</span>
            </button>

            <div class="dicts-mode-switcher__popover hidden" id="dictsModePopover">
              <button class="dicts-mode-action is-active" data-dicts-mode="carousel">
                Карусель
              </button>

              <button class="dicts-mode-action" data-dicts-mode="schema">
                Схема
              </button>

              <button class="dicts-mode-action dicts-mode-action--accent" id="dictsAddDictionaryBtn">
                + Додати довідник
              </button>
            </div>
          </div>
          ` : ''}

          <button class="tool-item">Пошук</button>
          <button class="tool-item">Фільтри</button>
          <button class="tool-item">Оновити</button>

        </div>
      </div>
    </aside>
  `;
}
