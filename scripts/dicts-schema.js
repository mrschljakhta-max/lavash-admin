(() => {
  function initSchemaView() {
    const root = document.getElementById('dictsSchemaRoot');
    if (!root) return;

    root.classList.add('dicts-schema-root');

    root.innerHTML = `
      <div class="dicts-schema-grid"></div>

      <div class="dicts-schema-empty">
        <div>
          <h3>Режим схеми</h3>
          <p>Тут буде відображення довідників у вигляді папок та таблиць зі звʼязками.</p>
        </div>
      </div>
    `;
  }

  window.LAVASH_DICTS_SCHEMA = {
    initSchemaView
  };
})();
