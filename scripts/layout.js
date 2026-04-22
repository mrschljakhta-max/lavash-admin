// ===== RIGHT NAVBAR BUILDER =====

function lavashBuildRightTools(pageKey = '') {
  const rightBar = document.getElementById('rightToolbar');
  if (!rightBar) return;

  rightBar.innerHTML = `
    <div class="right-tools">

      ${pageKey === 'dicts' ? `
      <div class="dicts-mode-switcher" id="dictsModeSwitcher">

        <!-- КНОПКА -->
        <button class="tool-item" id="dictsModeTrigger">
          <span>▦</span>
          <span>Режими</span>
        </button>

        <!-- POPOVER -->
        <div class="dicts-mode-popover" id="dictsModePopover">

          <button class="mode-btn" data-mode="carousel">
            <span>🎞</span>
            <span>Карусель</span>
          </button>

          <button class="mode-btn" data-mode="schema">
            <span>🧩</span>
            <span>Схема</span>
          </button>

          <button class="mode-btn add-dict">
            <span>＋</span>
            <span>Додати довідник</span>
          </button>

        </div>
      </div>
      ` : ''}

      <button class="tool-item">🔍 Пошук</button>
      <button class="tool-item">⚙ Фільтри</button>
      <button class="tool-item">🔄 Оновити</button>

    </div>
  `;
}


// ===== INIT =====

function initDictsModes() {
  const trigger = document.getElementById('dictsModeTrigger');
  const popover = document.getElementById('dictsModePopover');

  if (!trigger || !popover) return;

  // toggle popover
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    popover.classList.toggle('active');
  });

  // click outside
  document.addEventListener('click', () => {
    popover.classList.remove('active');
  });

  // режими
  popover.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      const carousel = document.getElementById('dictsCarouselView');
      const schema = document.getElementById('dictsSchemaView');

      if (mode === 'carousel') {
        carousel.style.display = 'block';
        schema.style.display = 'none';
      }

      if (mode === 'schema') {
        carousel.style.display = 'none';
        schema.style.display = 'block';
      }

      popover.classList.remove('active');
    });
  });

  // додати довідник
  const addBtn = popover.querySelector('.add-dict');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      alert('Тут буде створення довідника');
      popover.classList.remove('active');
    });
  }
}
