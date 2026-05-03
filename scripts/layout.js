
function lavashGetRightToolsConfig(pageKey) {
  const config = {
    logs: [
      { action: 'lock', icon: 'lock', label: 'Блокування' },
      { action: 'refresh', icon: 'refresh', label: 'Оновити' }
    ]
  };

  return config[pageKey] || [];
}
