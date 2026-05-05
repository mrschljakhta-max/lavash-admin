(() => {
  let records = [
    {
      id: 'uav-001',
      title: 'БПЛА Shahed-136',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'Shahed-136',
      unknownType: 'uav',
      createdAt: '08.05.2024 10:24',
      station: 'Radar_01',
      settlement: 'с. Гора',
      region: 'Київська обл.',
      coordinates: '50.3489° N, 30.9590° E',
      type: 'Ударний БПЛА',
      model: 'Shahed-136',
      ownership: 'ворожий',
      source: 'raw_word_events',
      confidence: 72
    },
    {
      id: 'uav-002',
      title: 'БПЛА Lancet-3',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'Ланцет-3',
      unknownType: 'uav',
      createdAt: '08.05.2024 11:45',
      station: 'Radar_05',
      settlement: 'м. Харків',
      region: 'Харківська обл.',
      coordinates: '49.9935° N, 36.2304° E',
      type: 'Баражуючий боєприпас',
      model: 'Lancet-3',
      ownership: 'ворожий',
      source: 'raw_word_events',
      confidence: 64
    },
    {
      id: 'uav-003',
      title: 'БПЛА Zala 421',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'Zala 421',
      unknownType: 'uav',
      createdAt: '08.05.2024 12:10',
      station: 'Radar_04',
      settlement: 'с. Іванівка',
      region: 'Чернігівська обл.',
      coordinates: '51.2380° N, 31.2980° E',
      type: 'Розвідувальний БПЛА',
      model: 'Zala 421',
      ownership: 'ворожий',
      source: 'raw_excel_events',
      confidence: 81
    },
    {
      id: 'settlement-001',
      title: 'НП Часів Яр',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Часів Яр',
      unknownType: 'settlement',
      createdAt: '08.05.2024 09:15',
      station: 'Radar_02',
      settlement: 'Часів Яр',
      hromada: 'Часовоярська',
      district: 'Бахмутський',
      region: 'Донецька обл.',
      lat: '48.5937',
      lon: '37.8572',
      source: 'dict_pending',
      confidence: 58
    },
    {
      id: 'settlement-002',
      title: 'НП Кудрівка',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Кудрівка',
      unknownType: 'settlement',
      createdAt: '08.05.2024 13:22',
      station: 'Radar_03',
      settlement: 'Кудрівка',
      hromada: 'Сосницька',
      district: 'Корюківський',
      region: 'Чернігівська обл.',
      lat: '51.6351',
      lon: '32.7164',
      source: 'dict_pending',
      confidence: 62
    },
    {
      id: 'settlement-003',
      title: 'НП Новоєгорівка',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Новоєгорівка',
      unknownType: 'settlement',
      createdAt: '08.05.2024 14:05',
      station: 'Radar_01',
      settlement: 'Новоєгорівка',
      hromada: 'Коломийчиська',
      district: 'Сватівський',
      region: 'Луганська обл.',
      lat: '49.4750',
      lon: '37.8900',
      source: 'raw_word_events',
      confidence: 51
    },
    {
      id: 'unit-001',
      title: 'Підрозділ 2 АДн',
      status: 'unknown',
      dataType: 'Підрозділ',
      mainValue: '2 АДн',
      unknownType: 'unit',
      createdAt: '08.05.2024 19:48',
      station: '—',
      settlement: 'м. Бахмут',
      parentUnit: '45 оабр',
      source: 'telegram_parse',
      confidence: 67
    },
    {
      id: 'unit-002',
      title: 'Підрозділ 1 батарея',
      status: 'unknown',
      dataType: 'Підрозділ',
      mainValue: '1 батарея',
      unknownType: 'unit',
      createdAt: '08.05.2024 20:11',
      station: '—',
      settlement: '—',
      parentUnit: '2 АДн',
      source: 'raw_excel_events',
      confidence: 74
    },
    {
      id: 'unit-003',
      title: 'Підрозділ РЕБ-група',
      status: 'unknown',
      dataType: 'Підрозділ',
      mainValue: 'РЕБ-група',
      unknownType: 'unit',
      createdAt: '08.05.2024 21:02',
      station: '—',
      settlement: '—',
      parentUnit: 'служба РЕБ',
      source: 'manual_import',
      confidence: 49
    },
    {
      id: 'station-001',
      title: 'Станція Radar_07',
      status: 'unknown',
      dataType: 'Станція',
      mainValue: 'Radar_07',
      unknownType: 'station',
      createdAt: '08.05.2024 15:33',
      station: 'Radar_07',
      settlement: 'с. Гора',
      region: 'Київська обл.',
      source: 'raw_word_events',
      confidence: 61
    },
    {
      id: 'station-002',
      title: 'Станція Халк',
      status: 'unknown',
      dataType: 'Станція',
      mainValue: 'Халк',
      unknownType: 'station',
      createdAt: '08.05.2024 16:07',
      station: 'Халк',
      settlement: 'м. Словʼянськ',
      region: 'Донецька обл.',
      source: 'raw_word_events',
      confidence: 77
    },
    {
      id: 'station-003',
      title: 'Станція Медельїн',
      status: 'unknown',
      dataType: 'Станція',
      mainValue: 'Медельїн',
      unknownType: 'station',
      createdAt: '08.05.2024 16:42',
      station: 'Медельїн',
      settlement: 'м. Ізюм',
      region: 'Харківська обл.',
      source: 'raw_word_events',
      confidence: 69
    },
    {
      id: 'object-001',
      title: 'Обʼєкт прикриття ОКП',
      status: 'unknown',
      dataType: 'Обʼєкт прикриття',
      mainValue: 'ОКП',
      unknownType: 'object',
      createdAt: '08.05.2024 17:12',
      station: 'Radar_06',
      settlement: 'с. Гора',
      unitOwner: '2 АДн',
      source: 'request_form',
      confidence: 83
    },
    {
      id: 'object-002',
      title: 'Обʼєкт прикриття ПУ',
      status: 'unknown',
      dataType: 'Обʼєкт прикриття',
      mainValue: 'ПУ дивізіону',
      unknownType: 'object',
      createdAt: '08.05.2024 17:38',
      station: 'Radar_01',
      settlement: 'м. Краматорськ',
      unitOwner: '1 АДн',
      source: 'request_form',
      confidence: 57
    },
    {
      id: 'object-003',
      title: 'Обʼєкт прикриття склад БК',
      status: 'unknown',
      dataType: 'Обʼєкт прикриття',
      mainValue: 'Склад БК',
      unknownType: 'object',
      createdAt: '08.05.2024 18:20',
      station: 'Radar_08',
      settlement: 'м. Дружківка',
      unitOwner: '45 оабр',
      source: 'request_form',
      confidence: 66
    },
    {
      id: 'record-001',
      title: 'Невідомий запис #117',
      status: 'unknown',
      dataType: 'Запис',
      mainValue: '323 10 30.04.2026 BMuIK0I',
      unknownType: 'record',
      createdAt: '08.05.2024 22:18',
      station: '—',
      settlement: '—',
      source: 'ocr_fragment',
      confidence: 22
    },
    {
      id: 'record-002',
      title: 'Невідомий запис #118',
      status: 'unknown',
      dataType: 'Запис',
      mainValue: 'E3BT / KponHBa / Aenbra',
      unknownType: 'record',
      createdAt: '08.05.2024 22:31',
      station: '—',
      settlement: '—',
      source: 'ocr_fragment',
      confidence: 18
    },
    {
      id: 'record-003',
      title: 'Невідомий запис #119',
      status: 'unknown',
      dataType: 'Запис',
      mainValue: 'рядок не класифіковано',
      unknownType: 'record',
      createdAt: '08.05.2024 22:44',
      station: '—',
      settlement: '—',
      source: 'raw_text',
      confidence: 12
    },
    {
      id: 'uav-004',
      title: 'БПЛА SuperCam',
      status: 'unknown',
      dataType: 'БПЛА',
      mainValue: 'SuperCam',
      unknownType: 'uav',
      createdAt: '08.05.2024 23:05',
      station: 'Radar_09',
      settlement: 'м. Купʼянськ',
      type: 'Розвідувальний БПЛА',
      model: 'SuperCam',
      ownership: 'ворожий',
      source: 'raw_word_events',
      confidence: 73
    },
    {
      id: 'settlement-004',
      title: 'НП Новоселівка',
      status: 'unknown',
      dataType: 'Населений пункт',
      mainValue: 'Новоселівка',
      unknownType: 'settlement',
      createdAt: '08.05.2024 23:31',
      station: 'Radar_10',
      settlement: 'Новоселівка',
      hromada: 'Лиманська',
      district: 'Краматорський',
      region: 'Донецька обл.',
      lat: '48.9880',
      lon: '37.8090',
      source: 'dict_pending',
      confidence: 47
    }
  ];

  const OPERATOR_RANKS = [
    { id: 1, title: 'Стажер', min: 0, max: 100, note: 'Перші перевірки та знайомство з картками' },
    { id: 2, title: 'Молодший оператор', min: 100, max: 200, note: 'Початкова стабільність у рішеннях' },
    { id: 3, title: 'Оператор', min: 200, max: 350, note: 'Стабільна обробка записів без помилок' },
    { id: 4, title: 'Навідник', min: 350, max: 500, note: 'Швидке сортування та контроль якості' },
    { id: 5, title: 'Аналітик I', min: 500, max: 700, note: 'Висока точність рішень і темп роботи' },
    { id: 6, title: 'Аналітик II', min: 700, max: 900, note: 'Поточний преміум-ранг оператора' },
    { id: 7, title: 'Старший аналітик', min: 900, max: 1500, note: 'Ведення складних записів і перевірка інших' },
    { id: 8, title: 'Майстер обробки', min: 1500, max: 3000, note: 'Максимальна продуктивність у зміні' },
    { id: 9, title: 'Експерт даних', min: 3000, max: 6000, note: 'Глибока перевірка й точність нормалізації' },
    { id: 10, title: 'Контролер якості', min: 6000, max: 10000, note: 'Контроль правильності рішень операторів' },
    { id: 11, title: 'Куратор системи', min: 10000, max: 20000, note: 'Кураторство процесу та стабільності обробки' },
    { id: 12, title: 'Архітектор даних', min: 20000, max: 35000, note: 'Складна логіка довідників і структури даних' },
    { id: 13, title: 'Командир аналітики', min: 35000, max: 60000, note: 'Керування темпом і якістю всієї зміни' },
    { id: 14, title: 'Легенда системи', min: 60000, max: 100000, note: 'Елітний рівень стабільності та продуктивності' },
    { id: 15, title: 'Верховний оператор', min: 100000, max: Infinity, note: 'Найвищий ранг редактора Lavash Admin' }
  ];

  const state = {
    active: 0,
    xp: 842,
    xpMax: 900,
    todayXp: 222,
    level: 6,
    rank: 'Аналітик II',
    streak: 7,
    accuracy: 92,
    isResolving: false
  };


  const pendingRuntime = {
    db: null,
    loading: false,
    loadedFromSupabase: false,
    lastError: null
  };

  const operatorRuntime = {
    email: null,
    profileLoaded: false,
    lastProfileError: null
  };

  function createSupabaseClient() {
    if (pendingRuntime.db) return pendingRuntime.db;

    const cfg = window.APP_CONFIG || {};
    const url = cfg.supabaseUrl;
    const key = cfg.supabaseAnonKey;

    if (!url || !key || !window.supabase?.createClient) {
      pendingRuntime.lastError = 'Supabase config/client missing';
      return null;
    }

    pendingRuntime.db = window.supabase.createClient(url, key, {
      auth: {
        storage: window.sessionStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return pendingRuntime.db;
  }

  function normalizePendingValue(value) {
    return String(value ?? '')
      .replace(/ /g, ' ')
      .replace(/[«»"“”]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeDictValue(value) {
    return normalizePendingValue(value)
      .toLowerCase()
      .replace(/[ʼ’`]/g, "'")
      .replace(/[–—−]/g, '-')
      .trim();
  }

  function mapPendingType(row) {
    const field = String(row.field_name || '').toLowerCase();
    const table = String(row.resolved_table || row.resolved_dict_table || '').toLowerCase();

    if (field.includes('uav') || table.includes('uav')) return 'uav';
    if (field.includes('settlement') || table.includes('settlement')) return 'settlement';
    if (field.includes('station') || table.includes('station')) return 'station';
    if (field.includes('unit') || table.includes('unit')) return 'unit';
    if (field.includes('object') || table.includes('object')) return 'object';
    return 'record';
  }

  function getDictTableForType(type, fallbackTable) {
    if (fallbackTable) return fallbackTable;
    return {
      uav: 'dict_uav',
      settlement: 'dict_settlements',
      station: 'dict_stations',
      unit: 'dict_units',
      object: 'dict_cover_objects'
    }[type] || null;
  }

  function getDisplayTypeLabel(type) {
    return getUnknownConfig(type).shortLabel || 'Запис';
  }

  function groupPendingRows(rows) {
    const groups = new Map();

    rows.forEach((row) => {
      const rawValue = normalizePendingValue(row.raw_value || row.normalized_candidate);
      if (!rawValue) return;

      const type = mapPendingType(row);
      const resolvedTable = row.resolved_table || row.resolved_dict_table || getDictTableForType(type);
      // Групуємо не по field_name, а по суті значення.
      // Бо одне й те саме значення може прилетіти як settlement_raw / settlement_id тощо.
      const key = [type, rawValue, resolvedTable || ''].join('::');

      if (!groups.has(key)) {
        groups.set(key, {
          type,
          fieldName: row.field_name || '',
          fieldNames: new Set(),
          rawValue,
          normalizedCandidate: row.normalized_candidate || normalizeDictValue(rawValue),
          resolvedTable,
          ids: [],
          sourceTable: row.source_table || 'dict_pending',
          createdAt: row.created_at || null,
          cnt: 0
        });
      }

      const group = groups.get(key);
      if (row.field_name) group.fieldNames.add(row.field_name);
      group.ids.push(row.id);
      group.cnt += 1;
      if (!group.createdAt && row.created_at) group.createdAt = row.created_at;
    });

    return [...groups.values()]
      .map((group) => ({
        ...group,
        fieldName: group.fieldNames?.size ? [...group.fieldNames].join(', ') : group.fieldName
      }))
      .sort((a, b) => b.cnt - a.cnt);
  }

  function pendingGroupToRecord(group, index) {
    const config = getUnknownConfig(group.type);
    const mainValue = group.rawValue || group.normalizedCandidate || 'Невідоме значення';

    return {
      id: `pending-${group.type}-${index}-${group.ids[0]}`,
      pendingIds: group.ids,
      pendingCount: group.cnt,
      fieldName: group.fieldName,
      resolvedTable: group.resolvedTable,
      normalizedCandidate: group.normalizedCandidate,
      title: `${config.shortLabel} ${mainValue}`,
      status: 'unknown',
      dataType: config.shortLabel,
      mainValue,
      unknownType: group.type,
      createdAt: group.createdAt ? new Date(group.createdAt).toLocaleString('uk-UA') : '—',
      source: group.sourceTable || 'dict_pending',
      confidence: Math.min(95, Math.max(20, 40 + Math.min(group.cnt, 50))),
      settlement: group.type === 'settlement' ? mainValue : '—',
      station: group.type === 'station' ? mainValue : '—',
      model: group.type === 'uav' ? mainValue : '',
      parentUnit: group.type === 'unit' ? '' : undefined,
      unitOwner: group.type === 'object' ? '' : undefined
    };
  }

  function getEmptyQueueRecord() {
    return {
      id: 'empty-queue',
      title: 'Черга порожня',
      status: 'valid',
      dataType: 'Готово',
      mainValue: 'Pending чистий',
      unknownType: 'record',
      createdAt: new Date().toLocaleString('uk-UA'),
      source: 'dict_pending',
      confidence: 100,
      pendingIds: [],
      pendingCount: 0
    };
  }

  async function loadPendingRecordsFromSupabase() {
    const db = createSupabaseClient();
    if (!db) return false;

    pendingRuntime.loading = true;
    pendingRuntime.lastError = null;

    try {
      const { data, error } = await db
        .from('dict_pending')
        .select('id,source_table,source_record_id,field_name,raw_value,normalized_candidate,decision_status,resolved_table,resolved_dict_table,created_at')
        .eq('decision_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const grouped = groupPendingRows(data || []);
      records = grouped.length ? grouped.map(pendingGroupToRecord) : [getEmptyQueueRecord()];
      state.active = 0;
      pendingRuntime.loadedFromSupabase = true;
      return true;
    } catch (err) {
      pendingRuntime.lastError = err?.message || String(err);
      console.error('Pending load error:', err);
      return false;
    } finally {
      pendingRuntime.loading = false;
    }
  }

  async function dictRowExists(db, tableName, normalizedName) {
    const { data, error } = await db
      .from(tableName)
      .select('id')
      .eq('normalized_name', normalizedName)
      .limit(1);

    if (error) return { exists: false, error };
    return { exists: Boolean(data?.length), error: null };
  }

  async function insertDictValue(record) {
    const db = createSupabaseClient();
    if (!db) throw new Error('Supabase client missing');

    const type = record.unknownType || 'record';
    const tableName = getDictTableForType(type, record.resolvedTable);
    if (!tableName) throw new Error(`Для типу ${type} ще не визначено таблицю довідника`);

    const name = normalizePendingValue(record.mainValue || record.normalizedCandidate || record.title);
    const normalizedName = normalizeDictValue(record.normalizedCandidate || record.mainValue || name);
    if (!name || !normalizedName) throw new Error('Порожня назва для довідника');

    const existing = await dictRowExists(db, tableName, normalizedName);
    if (existing.error) console.warn('Dict exists check warning:', existing.error.message);
    if (existing.exists) return { inserted: false, tableName, name, normalizedName };

    const payload = { name, normalized_name: normalizedName };

    if (type === 'settlement') {
      if (record.hromada) payload.hromada = record.hromada;
      if (record.district) payload.district = record.district;
      if (record.region) payload.region = record.region;
      if (record.lat) payload.lat = Number(record.lat);
      if (record.lon) payload.lon = Number(record.lon);
    }

    const { error } = await db.from(tableName).insert(payload);
    if (error) throw error;

    return { inserted: true, tableName, name, normalizedName };
  }

  async function updatePendingDecision(record, status, extra = {}) {
    const db = createSupabaseClient();
    if (!db) throw new Error('Supabase client missing');
    if (!record.pendingIds?.length) return { updated: 0 };

    const patch = {
      decision_status: status,
      resolved_at: new Date().toISOString(),
      ...extra
    };

    const { error } = await db
      .from('dict_pending')
      .update(patch)
      .in('id', record.pendingIds);

    if (error) throw error;
    return { updated: record.pendingIds.length };
  }


  async function findMatchingPendingIds(record) {
    const db = createSupabaseClient();
    if (!db) throw new Error('Supabase client missing');

    const ids = new Set(record.pendingIds || []);
    const rawValue = normalizePendingValue(record.mainValue || record.rawValue);
    const normalizedCandidate = normalizeDictValue(record.normalizedCandidate || rawValue);

    async function collectBy(column, value) {
      if (!value) return;

      let query = db
        .from('dict_pending')
        .select('id')
        .eq('decision_status', 'pending')
        .eq(column, value)
        .limit(10000);

      const { data, error } = await query;
      if (error) throw error;
      (data || []).forEach((row) => row?.id && ids.add(row.id));
    }

    // Охоплюємо всі дублікати: і ті, що прийшли як raw_value,
    // і ті, що мають те саме normalized_candidate.
    await collectBy('raw_value', rawValue);
    await collectBy('normalized_candidate', normalizedCandidate);

    return [...ids];
  }

  async function updateAllMatchingPendingDecision(record, status, extra = {}) {
    const db = createSupabaseClient();
    if (!db) throw new Error('Supabase client missing');

    const ids = await findMatchingPendingIds(record);
    if (!ids.length) return { updated: 0 };

    const patch = {
      decision_status: status,
      resolved_at: new Date().toISOString(),
      ...extra
    };

    const { error } = await db
      .from('dict_pending')
      .update(patch)
      .in('id', ids);

    if (error) throw error;
    return { updated: ids.length };
  }

  async function resolveRecordAction(record, action) {
    if (!record || record.id === 'empty-queue') return;

    if (action === 'confirm') {
      const inserted = await insertDictValue(record);
      const updated = await updateAllMatchingPendingDecision(record, 'approved', {
        operator_comment: `UI approve → ${inserted.tableName}: ${inserted.name}`
      });
      return { ...inserted, updatedPending: updated.updated };
    }

    if (action === 'ignore') {
      const updated = await updateAllMatchingPendingDecision(record, 'ignored', {
        ignore_reason: 'UI ignore'
      });
      return { ignored: true, updatedPending: updated.updated };
    }

    return { skipped: true };
  }

  function formatXP(value) {
    if (value === Infinity) return '100k+';
    if (value >= 100000) return `${Math.round(value / 1000)}k+`;
    if (value >= 10000) return `${Math.round(value / 1000)}k`;
    if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
    return String(value);
  }

  function getRankByXp(xp) {
    return OPERATOR_RANKS.find((rank) => xp >= rank.min && xp < rank.max) || OPERATOR_RANKS[OPERATOR_RANKS.length - 1];
  }

  function syncRankState() {
    const currentRank = getRankByXp(state.xp);
    state.level = currentRank.id;
    state.rank = currentRank.title;
    state.xpMax = currentRank.max;
    return currentRank;
  }


  async function getOperatorEmail() {
    if (operatorRuntime.email) return operatorRuntime.email;

    const db = createSupabaseClient();
    if (!db) return 'local_operator@lavash.local';

    try {
      const { data, error } = await db.auth.getUser();
      const user = data?.user;

      if (!error && user) {
        operatorRuntime.email = user.email || user.id || 'unknown_operator@lavash.local';
        return operatorRuntime.email;
      }
    } catch (err) {
      console.warn('Operator auth read warning:', err);
    }

    operatorRuntime.email = window.sessionStorage.getItem('lavash_operator_email') || 'local_operator@lavash.local';
    return operatorRuntime.email;
  }

  async function loadOperatorProfile() {
    const db = createSupabaseClient();
    if (!db) return null;

    const userEmail = await getOperatorEmail();

    try {
      const { data: profile, error } = await db
        .from('operator_profiles')
        .select('*')
        .eq('user_email', userEmail)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        const rank = getRankByXp(0);
        const payload = {
          user_email: userEmail,
          display_name: userEmail.split('@')[0],
          xp: 0,
          level: rank.id,
          rank_name: rank.title,
          approved_count: 0,
          ignored_count: 0,
          skipped_count: 0,
          updated_at: new Date().toISOString()
        };

        const { data: created, error: createError } = await db
          .from('operator_profiles')
          .insert(payload)
          .select('*')
          .single();

        if (createError) throw createError;
        applyOperatorProfileToState(created);
        operatorRuntime.profileLoaded = true;
        return created;
      }

      applyOperatorProfileToState(profile);
      operatorRuntime.profileLoaded = true;
      return profile;
    } catch (err) {
      operatorRuntime.lastProfileError = err?.message || String(err);
      console.warn('Operator profile load error:', err);
      return null;
    }
  }

  function applyOperatorProfileToState(profile) {
    if (!profile) return;

    state.xp = Number(profile.xp || 0);
    const rank = getRankByXp(state.xp);
    state.level = rank.id;
    state.rank = rank.title;
    state.xpMax = rank.max;

    state.approvedCount = Number(profile.approved_count || 0);
    state.ignoredCount = Number(profile.ignored_count || 0);
    state.skippedCount = Number(profile.skipped_count || 0);
  }

  async function saveOperatorAction(action, record, xpDelta) {
    const db = createSupabaseClient();
    if (!db) return null;

    const userEmail = await getOperatorEmail();
    const now = new Date().toISOString();

    try {
      const { data: profile } = await db
        .from('operator_profiles')
        .select('*')
        .eq('user_email', userEmail)
        .maybeSingle();

      const currentXp = Number(profile?.xp || 0);
      const nextXp = currentXp + Number(xpDelta || 0);
      const nextRank = getRankByXp(nextXp);

      const patch = {
        user_email: userEmail,
        display_name: profile?.display_name || userEmail.split('@')[0],
        xp: nextXp,
        level: nextRank.id,
        rank_name: nextRank.title,
        approved_count: Number(profile?.approved_count || 0) + (action === 'confirm' ? 1 : 0),
        ignored_count: Number(profile?.ignored_count || 0) + (action === 'ignore' ? 1 : 0),
        skipped_count: Number(profile?.skipped_count || 0) + (action === 'skip' ? 1 : 0),
        updated_at: now
      };

      const { data: saved, error: saveError } = await db
        .from('operator_profiles')
        .upsert(patch, { onConflict: 'user_email' })
        .select('*')
        .single();

      if (saveError) throw saveError;

      await db.from('operator_activity_log').insert({
        user_email: userEmail,
        action_type: action,
        entity_type: record?.unknownType || null,
        raw_value: record?.mainValue || record?.rawValue || null,
        pending_id: record?.pendingIds?.[0] || null,
        xp_delta: Number(xpDelta || 0),
        created_at: now
      });

      applyOperatorProfileToState(saved);
      return saved;
    } catch (err) {
      operatorRuntime.lastProfileError = err?.message || String(err);
      console.warn('Operator stats save error:', err);
      return null;
    }
  }

  function getRankProgress() {
    const currentRank = syncRankState();
    if (currentRank.max === Infinity) return 100;

    const range = currentRank.max - currentRank.min;
    const value = state.xp - currentRank.min;
    return Math.max(0, Math.min(100, Math.round((value / range) * 100)));
  }

  function getXpToNextLabel() {
    const currentRank = syncRankState();
    if (currentRank.max === Infinity) return 'максимальний ранг';

    const left = Math.max(0, currentRank.max - state.xp);
    return `${left.toLocaleString('uk-UA')} XP до наступного рангу`;
  }

  function getRankIconSrc(level = state.level) {
    return `/lavash-admin/assets/ranks/rank-${String(level).padStart(2, '0')}.png?v=12`;
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function getRoot() {
    return qs('.workspace-body') || qs('.workspace-body--page') || qs('#app');
  }

  function getStatusLabel(status) {
    return {
      new: 'Новий',
      unknown: 'Невідомий',
      warning: 'Сумнівний',
      error: 'Невідомий запис',
      valid: 'Валідний',
      skipped: 'Пропущений',
      fixed: 'Виправлений'
    }[status] || 'Новий';
  }

  function getStatusColor(status) {
    return {
      new: '#55dfff',
      unknown: '#f5a524',
      warning: '#f5a524',
      error: '#f5a524',
      valid: '#25d889',
      skipped: '#8d58ff',
      fixed: '#55dfff'
    }[status] || '#55dfff';
  }

  function getChevron(level) {
    if (level <= 10) return '▰';
    if (level <= 20) return '▰▰';
    if (level <= 30) return '▰▰▰';
    if (level <= 40) return '▰▰▰▰';
    return '⚡';
  }

  function getTier(level) {
    if (level <= 10) return 'blue';
    if (level <= 20) return 'green';
    if (level <= 30) return 'orange';
    if (level <= 40) return 'red';
    return 'violet';
  }

  function getVisibleRecords() {
    const total = records.length;

    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (state.active + offset + total) % total;
      return {
        record: records[index],
        index,
        slot: offset
      };
    });
  }

  function renderRightRankList() {
    syncRankState();

    const currentIndex = Math.max(0, OPERATOR_RANKS.findIndex((rank) => rank.id === state.level));
    const from = Math.max(0, Math.min(OPERATOR_RANKS.length - 5, currentIndex - 2));
    const ranks = OPERATOR_RANKS.slice(from, from + 5);

    return ranks.map((rank) => `
      <div class="pg-right-rank-row ${rank.id === state.level ? 'is-current' : ''}">
        <span><img src="${getRankIconSrc(rank.id)}" alt="" loading="lazy"></span>
        <b>${rank.id}</b>
        <em>${rank.title}</em>
      </div>
    `).join('');
  }

  function renderRightPanel() {
    const rightTools =
      document.querySelector('.right-tools__inner') ||
      document.querySelector('.right-tools');

    if (!rightTools) return;

    const progress = getRankProgress();
    const oldPanel = document.getElementById('pendingGameRightPanel');
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'pendingGameRightPanel';
    panel.className = 'pg-right-panel';

    panel.innerHTML = `
      <section class="pg-right-card">
        <h3>Ваш прогрес</h3>

        <div class="pg-right-user">
          <div class="pg-right-avatar">OP</div>
          <div>
            <strong>Operator_07</strong>
            <span>ID: OP-7721</span>
          </div>
        </div>

        <div class="pg-right-rank">
          <span>${getChevron(state.level)}</span>
          <strong>${state.rank}</strong>
        </div>

        <div class="pg-right-track">
          <div style="width:${progress}%"></div>
        </div>

        <div class="pg-right-stats">
          <div><b>+${state.todayXp}</b><span>XP сьогодні</span></div>
          <div><b>${state.accuracy}%</b><span>точність</span></div>
          <div><b>${state.streak}</b><span>streak</span></div>
        </div>
      </section>

      <section class="pg-right-card">
        <h3>Обробка</h3>
        <div class="pg-right-counter">
          <strong>${state.active + 1}</strong>
          <span>/</span>
          <strong>${records.length}</strong>
        </div>
        <p class="pg-right-note">Поточний запис / всього у черзі</p>
      </section>

      <section class="pg-right-card">
        <h3>Гарячі клавіші</h3>
        <div class="pg-right-hotkeys">
          <span>← →</span><p>перемотка карток</p>
          <span>Shift+A</span><p>ігнор</p>
          <span>Shift+S</span><p>пропуск</p>
          <span>Shift+D</span><p>підтвердити</p>
          <span>Space</span><p>flip / edit</p>
          <span>Esc</span><p>скасувати</p>
        </div>
      </section>

      <section class="pg-right-card">
        <h3>Ранги</h3>
        <div class="pg-right-ranks">
          ${renderRightRankList()}
        </div>
      </section>

      <section class="pg-right-card">
        <h3>Досягнення</h3>
        <div class="pg-right-achievements">
          <p>✅ 10 записів без помилки</p>
          <p>✅ 100 підтверджених записів</p>
          <p>✅ 5 виправлень підряд</p>
          <p>✅ Точність понад 90%</p>
        </div>
      </section>
    `;

    rightTools.appendChild(panel);
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const progress = getRankProgress();
    const activeRecord = records[state.active];
    const activeUnknownConfig = getUnknownConfig(activeRecord.unknownType || 'record');
    document.documentElement.style.setProperty('--pg-accent-status', activeUnknownConfig.color || getStatusColor(activeRecord.status));

    root.innerHTML = `
      <section class="pg-page pg-page--game" id="pendingGamePage">
        <div class="pg-bg-orb pg-bg-orb--left"></div>
        <div class="pg-bg-orb pg-bg-orb--right"></div>

        <div class="pg-game-hud" aria-hidden="true">
          <aside class="pg-hud-rank-card">
            <div class="pg-rank-emblem" aria-hidden="true">
              <img src="${getRankIconSrc()}" alt="">
            </div>
            <div class="pg-rank-info">
              <span class="pg-hud-rank-card__kicker">Ранг</span>
              <strong>${state.rank}</strong>
              <small>Рівень ${state.level}</small>
            </div>
          </aside>

          <aside
            class="pg-hud-xp-card"
            style="--pg-ring-progress:${progress * 3.6}deg; --pg-xp-progress:${progress}%; --pg-ring-accent:${activeUnknownConfig.color};"
          >
            <div class="pg-hud-xp-ring">
              <div class="pg-hud-xp-ring__core">
                <strong>${state.xp}</strong>
                <span>XP</span>
              </div>
            </div>
            <div class="pg-hud-xp-info">
              <span>XP</span>
              <strong>${state.xp.toLocaleString('uk-UA')}</strong>
              <div class="pg-hud-xp-bar"><i></i></div>
              <small>${getXpToNextLabel()}</small>
            </div>
          </aside>
        </div>

        <main class="pg-stage">
          <section class="pg-carousel-wrap" data-pg-carousel-wrap>
            <div class="pg-carousel">
              ${getVisibleRecords().map(({ record, index, slot }) => renderCard(record, index, slot)).join('')}
            </div>
          </section>
        </main>

       <div class="pg-xp-pop" id="pgXpPop">+10 XP</div>
      </section>
    `;

    bind();

    window.LAVASH_PENDING_RANK_XP?.set({
      level: state.level,
      xp: state.xp,
      xpMax: state.xpMax,
      rank: state.rank,
      accent: activeUnknownConfig.color
    });
  }

  function getUnknownConfig(type) {
    const configs = {
      uav: {
        label: 'Невідомий БПЛА',
        shortLabel: 'БПЛА',
        iconUrl: '../assets/icons/unknown/uav.svg',
        color: '#38dfff',
        bg1: 'rgba(18, 78, 190, .92)',
        bg2: 'rgba(8, 28, 82, .96)'
      },
      settlement: {
        label: 'Невідомий населений пункт',
        shortLabel: 'НП',
        iconUrl: '../assets/icons/unknown/settlement.svg',
        color: '#ffd84d',
        bg1: 'rgba(255, 196, 45, .96)',
        bg2: 'rgba(142, 86, 0, .96)'
      },
      unit: {
        label: 'Невідомий підрозділ',
        shortLabel: 'Підрозділ',
        iconUrl: '../assets/icons/unknown/unit.svg',
        color: '#ff5f7e',
        bg1: 'rgba(112, 22, 50, .92)',
        bg2: 'rgba(55, 14, 34, .96)'
      },
      station: {
        label: 'Невідома станція',
        shortLabel: 'Станція',
        iconUrl: '../assets/icons/unknown/station.svg',
        color: '#37e6b2',
        bg1: 'rgba(8, 96, 84, .92)',
        bg2: 'rgba(6, 44, 54, .96)'
      },
      object: {
        label: 'Невідомий об’єкт прикриття',
        shortLabel: 'Об’єкт',
        iconUrl: '../assets/icons/unknown/object.svg',
        color: '#9b7cff',
        bg1: 'rgba(76, 45, 158, .92)',
        bg2: 'rgba(34, 24, 76, .96)'
      },
      record: {
        label: 'Невідомий запис',
        shortLabel: 'Запис',
        iconUrl: '../assets/icons/unknown/record.svg',
        color: '#d8dfff',
        bg1: 'rgba(72, 80, 110, .88)',
        bg2: 'rgba(22, 28, 48, .96)'
      }
    };

    return configs[type] || configs.record;
  }

  function getUnknownIconUrl(type) {
    return getUnknownConfig(type).iconUrl;
  }

  function getUnknownLabel(type) {
    return getUnknownConfig(type).label;
  }

  function getDataIcon(type) {
    return getUnknownConfig(type).shortLabel;
  }

  function safeValue(value, fallback = '—') {
    return value === undefined || value === null || value === '' ? fallback : value;
  }

  function escapeAttr(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderCustomSelect(field, options, selectedValue, placeholder = 'Не обрано') {
    const normalizedOptions = options || [];
    const selected = normalizedOptions.find(([value]) => value === selectedValue);
    const currentValue = selected ? selected[0] : '';
    const currentLabel = selected ? selected[1] : placeholder;

    return `
      <div
        class="pg-select"
        data-field="${field}"
        data-value="${escapeAttr(currentValue)}"
        tabindex="0"
        role="button"
        aria-label="${escapeAttr(currentLabel)}"
      >
        <div class="pg-select__head">
          <span>${currentLabel}</span>
          <b>⌄</b>
        </div>

        <div class="pg-select__dropdown">
          ${normalizedOptions.map(([value, label]) => `
            <button
              type="button"
              class="pg-select__item ${value === currentValue ? 'is-selected' : ''}"
              data-value="${escapeAttr(value)}"
            >${label}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function getUnknownTypeOptionList() {
    return [
      ['uav', 'БПЛА'],
      ['settlement', 'Населений пункт'],
      ['object', 'Обʼєкт прикриття'],
      ['unit', 'Підрозділ'],
      ['station', 'Станція'],
      ['record', 'Невідомий запис']
    ];
  }

  function getOwnershipOptionList() {
    return [
      ['ворожий', 'Ворожий'],
      ['україна', 'Україна'],
      ['спільний', 'Спільний']
    ];
  }

  function getUnitOptionList(includeEmpty = true) {
    const values = [
      '45 оабр',
      'служба РЕБ',
      '1 АДн',
      '2 АДн',
      '3 АДн',
      '1 батарея',
      '2 батарея',
      'РЕБ-група'
    ].map((value) => [value, value]);

    return includeEmpty ? [['', 'Не обрано'], ...values] : values;
  }

  function getUnknownTypeOptions(selectedType) {
    const types = [
      ['uav', 'БПЛА'],
      ['settlement', 'Населений пункт'],
      ['object', 'Обʼєкт прикриття'],
      ['unit', 'Підрозділ'],
      ['station', 'Станція'],
      ['record', 'Невідомий запис']
    ];

    return types.map(([value, label]) => `
      <option value="${value}" ${value === selectedType ? 'selected' : ''}>${label}</option>
    `).join('');
  }

  function renderOwnershipOptions(selectedValue) {
    const values = [
      ['ворожий', 'Ворожий'],
      ['україна', 'Україна'],
      ['спільний', 'Спільний']
    ];

    return values.map(([value, label]) => `
      <option value="${value}" ${value === selectedValue ? 'selected' : ''}>${label}</option>
    `).join('');
  }

  function renderUnitOptions(selectedValue) {
    const values = [
      '45 оабр',
      'служба РЕБ',
      '1 АДн',
      '2 АДн',
      '3 АДн',
      '1 батарея',
      '2 батарея',
      'РЕБ-група'
    ];

    const selected = selectedValue || '';
    const options = values.map((value) => `
      <option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>
    `).join('');

    return `<option value="" ${!selected ? 'selected' : ''}>Не обрано</option>${options}`;
  }

  function renderTypeSpecificEditFields(record, unknownType) {
    if (unknownType === 'uav') {
      return `
        <label>
          <span>Приналежність</span>
          ${renderCustomSelect('ownership', getOwnershipOptionList(), record.ownership || 'ворожий')}
        </label>
      `;
    }

    if (unknownType === 'settlement') {
      return `
        <label><span>Громада</span><input data-field="hromada" value="${safeValue(record.hromada, '')}" /></label>
        <label><span>Район</span><input data-field="district" value="${safeValue(record.district, '')}" /></label>
        <label><span>Область</span><input data-field="region" value="${safeValue(record.region, '')}" /></label>
        <label><span>Lat</span><input data-field="lat" value="${safeValue(record.lat, '')}" /></label>
        <label><span>Lon</span><input data-field="lon" value="${safeValue(record.lon, '')}" /></label>
      `;
    }

    if (unknownType === 'object') {
      return `
        <label>
          <span>Підрозділ, до якого належить</span>
          ${renderCustomSelect('unitOwner', getUnitOptionList(), record.unitOwner || '')}
        </label>
      `;
    }

    if (unknownType === 'unit') {
      return `
        <label>
          <span>Батьківський підрозділ</span>
          ${renderCustomSelect('parentUnit', getUnitOptionList(), record.parentUnit || '')}
        </label>
      `;
    }

    return '';
  }

  function getVisualImage(record, unknownType) {
    if (unknownType === 'uav') return '../assets/img/uav/shahed-136.png';
    return getUnknownIconUrl(unknownType);
  }

  function renderCard(record, index, slot) {
    const active = slot === 0 ? 'is-active' : '';
    const unknownType = record.unknownType || 'record';
    const unknownConfig = getUnknownConfig(unknownType);
    const mainValue = record.mainValue || record.model || record.settlement || record.title || 'Невідоме значення';
    const visualImage = getVisualImage(record, unknownType);

    return `
      <article
        class="pg-card ${active} pg-card--${record.status}"
        data-index="${index}"
        data-slot="${slot}"
        data-status="${record.status || 'unknown'}"
        data-unknown-type="${unknownType}"
        style="--pg-card-accent:${unknownConfig.color}; --pg-card-bg-1:${unknownConfig.bg1}; --pg-card-bg-2:${unknownConfig.bg2};"
      >
        <div class="pg-card__inner">
          <div class="pg-card__face pg-card__front">
            <div class="pg-card__topline">
              <div class="pg-card__status">
                <span class="pg-status-dot"></span>
                ${unknownConfig.label}
              </div>
              <button class="pg-card__star" type="button" aria-label="Позначити">☆</button>
            </div>

            <div class="pg-card__content">
              <div class="pg-data">
                <div class="pg-data__value">${mainValue}</div>
              </div>

              <div class="pg-visual pg-visual--${unknownType}">
                <div class="pg-radar-core"></div>

                <img
                  class="pg-uav-img pg-unknown-visual-img"
                  src="${visualImage}"
                  alt="${mainValue}"
                  loading="lazy"
                />
              </div>
            </div>

            <small>Клік — редагувати / Space — flip</small>
          </div>

          <div class="pg-card__face pg-card__back">
            <div class="pg-edit-head">
              <h3>Редагування запису</h3>
            </div>

            <div class="pg-edit-grid pg-edit-grid--clean">
              <label>
                <span>Тип обʼєкта</span>
                ${renderCustomSelect('unknownType', getUnknownTypeOptionList(), unknownType)}
              </label>

              <div class="pg-readonly-field">
                <span>Теперішнє значення</span>
                <strong>${mainValue}</strong>
              </div>

              <label class="pg-edit-wide">
                <span>Редагування назви</span>
                <input data-field="mainValue" value="${mainValue}" placeholder="Введи правильну назву" />
              </label>

              ${renderTypeSpecificEditFields(record, unknownType)}
            </div>

            <button class="pg-save-btn" type="button">Зберегти зміни</button>
          </div>
        </div>
      </article>
    `;
  }

  function updateActiveRecordField(field, value) {
    const record = records[state.active];
    if (!record) return;

    record[field] = value;

    if (field === 'unknownType') {
      const config = getUnknownConfig(value);
      record.dataType = config.shortLabel;
      record.status = 'unknown';
      record.resolvedTable = getDictTableForType(value, null) || record.resolvedTable;
    }
  }

  function saveActiveCardEdits(card) {
    const record = records[state.active];
    if (!record) return;

    card.querySelectorAll('[data-field]').forEach((field) => {
      const key = field.dataset.field;
      if (!key) return;

      record[key] = field.dataset.value !== undefined ? field.dataset.value : field.value;
    });

    if (record.mainValue) {
      record.title = `${record.dataType || getUnknownConfig(record.unknownType).shortLabel} ${record.mainValue}`;
      if (record.unknownType === 'uav') record.model = record.mainValue;
      if (record.unknownType === 'settlement') record.settlement = record.mainValue;
      if (record.unknownType === 'station') record.station = record.mainValue;
    }

    syncActiveCardFront(card, record);
    showSavePulse(card);
  }

  function syncActiveCardFront(card, record) {
    const unknownType = record.unknownType || 'uav';
    const unknownConfig = getUnknownConfig(unknownType);
    const mainValue = escapeHtml(record.mainValue || record.model || record.settlement || record.station || record.title || 'Невідомий запис');
    const frontValue = card.querySelector('.pg-card__front .pg-data__value');
    const frontStatus = card.querySelector('.pg-card__front .pg-card__status');
    const visual = card.querySelector('.pg-card__front .pg-visual');
    const image = card.querySelector('.pg-card__front .pg-unknown-visual-img');

    card.dataset.unknownType = unknownType;
    card.dataset.status = record.status || 'unknown';
    card.style.setProperty('--pg-card-accent', unknownConfig.color);
    card.style.setProperty('--pg-card-bg-1', unknownConfig.bg1);
    card.style.setProperty('--pg-card-bg-2', unknownConfig.bg2);

    if (frontValue) frontValue.textContent = mainValue;
    if (frontStatus) {
      frontStatus.innerHTML = `<span class="pg-status-dot"></span>${unknownConfig.label}`;
    }
    if (visual) {
      visual.className = `pg-visual pg-visual--${unknownType}`;
    }
    if (image) {
      image.src = getVisualImage(record, unknownType);
      image.alt = mainValue;
    }
  }

  function showSavePulse(card) {
    const back = card.querySelector('.pg-card__back');
    const button = card.querySelector('.pg-save-btn');

    // Старі класи прибираємо повністю — саме вони давали велику пляму
    card.classList.remove('is-saved-pulse');
    card.classList.remove('is-save-complete');

    if (button) {
      button.disabled = true;
      button.classList.add('is-saved');
      button.innerHTML = '<span class="pg-save-btn__check">✓</span> Збережено';
    }

    // Маленький акуратний бейдж підтвердження
    if (back) {
      back.querySelector('.pg-save-toast')?.remove();

      const toast = document.createElement('div');
      toast.className = 'pg-save-toast';
      toast.innerHTML = '<span>✓</span> Збережено';
      back.appendChild(toast);

      window.setTimeout(() => {
        toast.classList.add('is-hiding');
      }, 900);

      window.setTimeout(() => {
        toast.remove();
      }, 1250);
    }

    // Легкий імпульс рамки без зміни transform, щоб не ламати flip
    card.classList.add('is-save-soft-pulse');

    window.setTimeout(() => {
      card.classList.remove('is-save-soft-pulse');

      if (button) {
        button.disabled = false;
        button.classList.remove('is-saved');
        button.textContent = 'Зберегти зміни';
      }
    }, 1250);
  }

  function bindCardDrag(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    card.addEventListener('pointerdown', (event) => {
      if (event.target.closest('input, textarea, select, option, button, label, .pg-select')) return;
      if (card.classList.contains('is-flipped')) return;

      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      currentX = 0;
      currentY = 0;

      card.dataset.dragAction = '';
      card.setPointerCapture(event.pointerId);
      card.classList.add('is-dragging');
    });

    card.addEventListener('pointermove', (event) => {
      if (!isDragging) return;

      currentX = event.clientX - startX;
      currentY = event.clientY - startY;

      const rotate = currentX / 28;
      card.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px) rotate(${rotate}deg) scale(1)`;

      if (currentX > 120) {
        card.dataset.dragAction = 'confirm';
      } else if (currentX < -120) {
        card.dataset.dragAction = 'ignore';
      } else if (currentY > 110) {
        card.dataset.dragAction = 'skip';
      } else {
        card.dataset.dragAction = '';
      }
    });

    card.addEventListener('pointerup', (event) => {
      if (!isDragging) return;

      isDragging = false;
      card.releasePointerCapture(event.pointerId);
      card.classList.remove('is-dragging');

      const dragAction = card.dataset.dragAction;
      card.dataset.dragAction = '';

      if (currentX > 160 || dragAction === 'confirm') {
        handleAction('confirm');
        return;
      }

      if (currentX < -160 || dragAction === 'ignore') {
        handleAction('ignore');
        return;
      }

      if (currentY > 140 || dragAction === 'skip') {
        handleAction('skip');
        return;
      }

      card.style.transform = '';
      currentX = 0;
      currentY = 0;
    });

    card.addEventListener('pointercancel', () => {
      isDragging = false;
      card.classList.remove('is-dragging');
      card.dataset.dragAction = '';
      card.style.transform = '';
    });
  }

  function bindCardTilt(card) {
    card.addEventListener('pointermove', (event) => {
      if (card.classList.contains('is-dragging')) return;
      if (card.classList.contains('is-flipped')) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = y * -8;
      const rotateY = x * 10;

      card.style.setProperty('--pg-tilt-x', `${rotateX}deg`);
      card.style.setProperty('--pg-tilt-y', `${rotateY}deg`);
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--pg-tilt-x');
      card.style.removeProperty('--pg-tilt-y');
    });
  }


  function bindRadarInteraction(card) {
    const radar = card.querySelector('.pg-radar-core');
    const uav = card.querySelector('.pg-uav-img');

    if (!radar) return;

    card.addEventListener('pointermove', (event) => {
      if (card.classList.contains('is-dragging')) return;
      if (card.classList.contains('is-flipped')) return;

      const rect = card.getBoundingClientRect();

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      radar.style.setProperty('--pg-radar-angle', `${angle}deg`);
      radar.classList.add('is-tracking');

      if (uav) {
        const px = dx * 0.018;
        const py = dy * 0.018;

        uav.style.setProperty('--pg-uav-x', `${px}px`);
        uav.style.setProperty('--pg-uav-y', `${py}px`);
        uav.classList.add('is-parallax');
      }
    });

    card.addEventListener('pointerleave', () => {
      radar.classList.remove('is-tracking');
      radar.style.removeProperty('--pg-radar-angle');

      if (uav) {
        uav.classList.remove('is-parallax');
        uav.style.removeProperty('--pg-uav-x');
        uav.style.removeProperty('--pg-uav-y');
      }
    });
  }


  function bindRadarLock(card) {
    let lockTimer = null;

    const clearLock = () => {
      if (lockTimer) {
        clearTimeout(lockTimer);
        lockTimer = null;
      }
      card.classList.remove('is-locked');
    };

    card.addEventListener('pointerenter', () => {
      clearLock();

      lockTimer = setTimeout(() => {
        if (!card.classList.contains('is-dragging') && !card.classList.contains('is-flipped')) {
          card.classList.add('is-locked');
        }
      }, 420);
    });

    card.addEventListener('pointerleave', clearLock);

    card.addEventListener('pointerdown', () => {
      if (card.classList.contains('is-flipped')) return;
      card.classList.remove('is-locked');
    });
  }

  function bindCustomSelects(card) {
    card.querySelectorAll('.pg-select').forEach((select) => {
      const head = select.querySelector('.pg-select__head');
      const label = select.querySelector('.pg-select__head span');
      const items = select.querySelectorAll('.pg-select__item');

      const closeOthers = () => {
        card.querySelectorAll('.pg-select.is-open').forEach((opened) => {
          if (opened !== select) opened.classList.remove('is-open');
        });
      };

      head?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeOthers();
        select.classList.toggle('is-open');
      });

      select.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          event.preventDefault();
          event.stopPropagation();
          closeOthers();
          select.classList.toggle('is-open');
        }

        if (event.code === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          select.classList.remove('is-open');
        }
      });

      items.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const value = item.dataset.value || '';
          const text = item.textContent.trim();

          select.dataset.value = value;
          if (label) label.textContent = text;

          items.forEach((node) => node.classList.remove('is-selected'));
          item.classList.add('is-selected');
          select.classList.remove('is-open');

          select.dispatchEvent(new CustomEvent('pg-select-change', {
            bubbles: true,
            detail: { field: select.dataset.field, value, label: text }
          }));
        });
      });
    });
  }


  function bindCardScrollLock(card) {
    const back = card.querySelector('.pg-card__back');
    const scrollable = card.querySelector('.pg-edit-grid, .pg-edit-grid--clean');

    if (!back || !scrollable) return;

    card.addEventListener('wheel', (event) => {
      const isBack = event.target.closest('.pg-card__back');

      // На front активної картки колесо не повинно випадково перемикати карусель.
      if (!isBack) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const canScroll = scrollable.scrollHeight > scrollable.clientHeight;

      if (!canScroll) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;
      const nextScrollTop = Math.max(0, Math.min(maxScrollTop, scrollable.scrollTop + event.deltaY));

      scrollable.scrollTop = nextScrollTop;

      // Головне: wheel не пробивається до carousel.
      event.preventDefault();
      event.stopPropagation();
    }, { passive: false });
  }

  function bind() {
    document.querySelectorAll('.pg-card.is-active').forEach((card) => {
      bindCardDrag(card);
      bindCardTilt(card);
      bindRadarInteraction(card);
      bindRadarLock(card);
      bindCustomSelects(card);
      bindCardScrollLock(card);

      card.addEventListener('click', (event) => {
        if (event.target.closest('input, textarea, select, option, button, label, .pg-select')) return;
        if (card.classList.contains('is-dragging')) return;
        card.classList.toggle('is-flipped');
      });

      card.querySelector('[data-field="unknownType"]')?.addEventListener('pg-select-change', (event) => {
        event.stopPropagation();
        updateActiveRecordField('unknownType', event.detail.value);
        render();
        qs('.pg-card.is-active')?.classList.add('is-flipped');
      });

      card.querySelector('.pg-save-btn')?.addEventListener('click', (event) => {
        event.stopPropagation();
        saveActiveCardEdits(card);
      });
    });

    const carousel = qs('[data-pg-carousel-wrap]');
    if (carousel) {
      let wheelLock = false;

      carousel.addEventListener('wheel', (event) => {
        const activeCardUnderCursor = event.target.closest('.pg-card.is-active');

        if (activeCardUnderCursor) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        event.preventDefault();

        if (wheelLock || state.isResolving) return;
        wheelLock = true;

        if (event.deltaY > 0 || event.deltaX > 0) {
          next();
        } else {
          prev();
        }

        setTimeout(() => {
          wheelLock = false;
        }, 360);
      }, { passive: false });
    }
  }

  function prev() {
    if (state.isResolving) return;
    state.active = (state.active - 1 + records.length) % records.length;
    render();
  }

  function next() {
    if (state.isResolving) return;
    state.active = (state.active + 1) % records.length;
    render();
  }

  function getActionLabel(action) {
    return {
      ignore: 'ПРОІГНОРОВАНО',
      confirm: 'ПОГОДЖЕНО',
      skip: 'ПРОПУСКАЄМО'
    }[action] || '';
  }

  async function handleAction(action) {
    if (state.isResolving) return;

    const activeRecord = records[state.active];
    const activeCard = qs('.pg-card.is-active');
    const page = qs('#pendingGamePage');

    state.isResolving = true;

    try {
      if (action === 'confirm' && activeCard?.classList.contains('is-flipped')) {
        saveActiveCardEdits(activeCard);
      }

      await resolveRecordAction(activeRecord, action);

      const xpMap = {
        ignore: 8,
        confirm: 10,
        skip: 5
      };

      const xp = xpMap[action] || 5;
      const savedProfile = await saveOperatorAction(action, activeRecord, xp);

      if (!savedProfile) {
        state.xp += xp;
        syncRankState();
      }

      state.todayXp += xp;
      window.LAVASH_PENDING_RANK_XP?.addXP(xp);

      if (page) {
        page.dataset.actionFlash = action;
        page.dataset.actionLabel = getActionLabel(action);
      }

      if (activeCard) {
        activeCard.style.transform = '';
        activeCard.classList.remove(
          'is-key-ignore',
          'is-key-confirm',
          'is-key-skip',
          'is-resolving-ignore',
          'is-resolving-confirm',
          'is-resolving-skip'
        );

        void activeCard.offsetWidth;
        activeCard.classList.add(`is-key-${action}`);
      }

      showXpPop(xp);

      setTimeout(async () => {
        if (action === 'confirm' || action === 'ignore') {
          await loadPendingRecordsFromSupabase();
        } else {
          state.active = (state.active + 1) % Math.max(records.length, 1);
        }

        state.isResolving = false;

        if (page) {
          page.dataset.actionFlash = '';
          page.dataset.actionLabel = '';
        }

        render();
      }, 620);
    } catch (err) {
      state.isResolving = false;
      console.error('Pending resolve error:', err);
      alert(`Не вдалося виконати дію: ${err?.message || err}`);
      render();
    }
  }

  function showXpPop(xp) {
    const pop = qs('#pgXpPop');
    if (!pop) return;

    pop.textContent = `+${xp} XP`;
    pop.classList.remove('is-visible');
    void pop.offsetWidth;
    pop.classList.add('is-visible');
  }

  function bindHotkeys() {
  document.addEventListener('keydown', (event) => {
    if (!qs('#pendingGamePage')) return;

    const isTyping = event.target?.closest?.('input, textarea, select, option, .pg-select');

    if (isTyping) {
      if (event.key === 'Escape') {
        event.preventDefault();
        qs('.pg-card.is-active')?.classList.remove('is-flipped');
      }
      return;
    }

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      prev();
      return;
    }

    if (event.code === 'ArrowRight') {
      event.preventDefault();
      next();
      return;
    }

    if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.code === 'KeyA') {
      event.preventDefault();
      handleAction('confirm');
      return;
    }

    if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.code === 'KeyS') {
      event.preventDefault();
      handleAction('skip');
      return;
    }

    if (!event.shiftKey && !event.ctrlKey && !event.altKey && event.code === 'KeyD') {
      event.preventDefault();
      handleAction('ignore');
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      qs('.pg-card.is-active')?.classList.toggle('is-flipped');
      return;
    }

    if (event.code === 'Escape') {
      event.preventDefault();
      qs('.pg-card.is-active')?.classList.remove('is-flipped');
    }
  });
}

  async function init() {
    syncRankState();
    render();

    await loadOperatorProfile();
    syncRankState();

    window.LAVASH_PENDING_RANK_XP?.init({
      level: state.level,
      xp: state.xp,
      xpMax: state.xpMax,
      rank: state.rank
    });

    await loadPendingRecordsFromSupabase();
    render();

    if (!window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__) {
      window.__LAVASH_PENDING_GAME_HOTKEYS_BOUND__ = true;
      bindHotkeys();
    }

    if (!window.__LAVASH_PENDING_SELECT_CLOSE_BOUND__) {
      window.__LAVASH_PENDING_SELECT_CLOSE_BOUND__ = true;
      document.addEventListener('click', () => {
        document.querySelectorAll('.pg-select.is-open').forEach((select) => {
          select.classList.remove('is-open');
        });
      });
    }
  }

  window.LAVASH_PENDING_GAME = {
    init
  };
})();