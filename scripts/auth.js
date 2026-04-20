if (!window.APP_CONFIG?.supabaseUrl || !window.APP_CONFIG?.supabaseAnonKey) {
  throw new Error('APP_CONFIG is missing. Check config.js');
}

const authSb = supabase.createClient(
  window.APP_CONFIG.supabaseUrl,
  window.APP_CONFIG.supabaseAnonKey,
  {
    auth: {
      storage: window.sessionStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
); 

const APP_ENTRY = '/lavash-admin/pages/app.html#pending';
const LOGIN_PAGE = '/lavash-admin/pages/index.html';

const VIEWS = [
  'authViewLogin',
  'authViewRegister',
  'authViewEnroll',
  'authViewVerify',
  'authViewBlocked'
];

let currentEnrollFactor = null;
let pendingLoginFactorId = null;

function el(id) {
  return document.getElementById(id);
}

function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function showView(id) {
  VIEWS.forEach((viewId) => el(viewId)?.classList.add('hidden'));
  el(id)?.classList.remove('hidden');
}

function setSubtitle(text) {
  const node = el('authSubtitle');
  if (!node) return;

  const value = String(text || '').trim();

  if (!value) {
    node.textContent = '';
    node.classList.add('hidden');
    return;
  }

  node.textContent = value;
  node.classList.remove('hidden');
}

function setStatus(text, kind = 'neutral') {
  const dot = el('authStatusDot');
  const label = el('authStatusText');
  if (!dot || !label) return;

  dot.classList.remove('ok', 'error');
  if (kind === 'ok') dot.classList.add('ok');
  if (kind === 'error') dot.classList.add('error');

  label.textContent = text;
}

function setBrandMode(mode) {
  const brand = el('authBrandZone');
  const enrollHero = el('authEnrollHero');
  const card = el('authCard');
  const tabs = el('authTabs');
  const signOutBtn = el('authSignOutBtn');

  const isEnroll = mode === 'enroll';

  if (brand) {
    brand.style.display = isEnroll ? 'none' : '';
    brand.classList.toggle('hidden', isEnroll);
  }

  if (enrollHero) {
    enrollHero.style.display = isEnroll ? 'grid' : 'none';
    enrollHero.classList.toggle('hidden', !isEnroll);
  }

  if (tabs) {
    tabs.style.display = isEnroll ? 'none' : '';
    tabs.classList.toggle('hidden', isEnroll);
  }

  if (signOutBtn) {
    signOutBtn.classList.add('hidden');
    signOutBtn.style.display = 'none';
  }

  if (card) {
    card.classList.toggle('enroll-mode', isEnroll);
  }
}

function activateTab(mode) {
  const isLogin = mode === 'login';

  el('tabLoginBtn')?.classList.toggle('active', isLogin);
  el('tabRegisterBtn')?.classList.toggle('active', !isLogin);
  el('tabLoginBtn')?.setAttribute('aria-selected', String(isLogin));
  el('tabRegisterBtn')?.setAttribute('aria-selected', String(!isLogin));

  showView(isLogin ? 'authViewLogin' : 'authViewRegister');
  el('authTabs')?.classList.remove('hidden');

  const signOutBtn = el('authSignOutBtn');
  if (signOutBtn) {
    signOutBtn.classList.add('hidden');
    signOutBtn.style.display = 'none';
  }

  setBrandMode('default');
  setSubtitle('');
  setStatus(isLogin ? 'Введи email і пароль' : 'Заповни дані для реєстрації');
}

function togglePasswordVisibility(targetId, btn) {
  const input = el(targetId);
  if (!input) return;

  const next = input.type === 'password' ? 'text' : 'password';
  input.type = next;
  btn.textContent = next === 'password' ? '👁' : '🙈';
}

function normalizeErrorMessage(error) {
  if (!error) return 'Невідома помилка';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;

  try {
    return JSON.stringify(error);
  } catch {
    return 'Невідома помилка';
  }
}

function normalizeOtpValue(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 6);
}

function getOtpInputs(containerId) {
  return qsa('.otp-input', el(containerId));
}

function collectOtpCode(containerId, hiddenInputId) {
  const code = getOtpInputs(containerId).map((input) => input.value).join('');
  const hidden = el(hiddenInputId);
  if (hidden) hidden.value = code;
  return code;
}

function clearOtp(containerId, hiddenInputId) {
  getOtpInputs(containerId).forEach((input) => {
    input.value = '';
  });

  const hidden = el(hiddenInputId);
  if (hidden) hidden.value = '';
}

function focusFirstOtp(containerId) {
  const first = getOtpInputs(containerId)[0];
  first?.focus();
}

function fillOtp(containerId, hiddenInputId, code) {
  const digits = normalizeOtpValue(code).split('');
  const inputs = getOtpInputs(containerId);

  inputs.forEach((input, index) => {
    input.value = digits[index] || '';
  });

  const hidden = el(hiddenInputId);
  if (hidden) hidden.value = digits.join('');

  const firstEmpty = inputs.find((input) => !input.value);
  (firstEmpty || inputs[inputs.length - 1])?.focus();
}

function setupOtpGroup(containerId, hiddenInputId) {
  const container = el(containerId);
  if (!container) return;

  const inputs = getOtpInputs(containerId);

  inputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
      const raw = event.target.value || '';
      const normalized = raw.replace(/\D/g, '');

      if (!normalized) {
        event.target.value = '';
        collectOtpCode(containerId, hiddenInputId);
        return;
      }

      if (normalized.length > 1) {
        fillOtp(containerId, hiddenInputId, normalized);
        return;
      }

      event.target.value = normalized;
      collectOtpCode(containerId, hiddenInputId);

      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
        inputs[index + 1].select();
      }
    });

    input.addEventListener('keydown', (event) => {
      const key = event.key;

      if (key === 'Backspace') {
        if (input.value) {
          input.value = '';
          collectOtpCode(containerId, hiddenInputId);
          event.preventDefault();
          return;
        }

        if (index > 0) {
          inputs[index - 1].value = '';
          inputs[index - 1].focus();
          collectOtpCode(containerId, hiddenInputId);
          event.preventDefault();
        }
        return;
      }

      if (key === 'ArrowLeft' && index > 0) {
        inputs[index - 1].focus();
        event.preventDefault();
        return;
      }

      if (key === 'ArrowRight' && index < inputs.length - 1) {
        inputs[index + 1].focus();
        event.preventDefault();
        return;
      }

      if (key === ' ' || (key.length === 1 && !/\d/.test(key))) {
        event.preventDefault();
      }
    });

    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const pasted = normalizeOtpValue(event.clipboardData?.getData('text') || '');
      if (!pasted) return;
      fillOtp(containerId, hiddenInputId, pasted);
    });

    input.addEventListener('focus', () => {
      input.select();
    });
  });
}

async function logActivity(action, payload = {}, explicitUser = null) {
  try {
    let user = explicitUser || null;

    if (!user) {
      const authResp = await authSb.auth.getUser();
      user = authResp?.data?.user || null;
    }

    const row = {
      user_id: user?.id || null,
      action: action || 'unknown',
      details: JSON.stringify({
        actor_email: user?.email || payload.actor_email || null,
        status: payload.status || 'info',
        message: payload.message || null,
        entity_type: payload.entity_type || null,
        entity_id: payload.entity_id || null,
        meta: payload.meta || {}
      })
    };

    const { error } = await authSb.from('activity_logs').insert([row]);
    if (error) console.warn('activity_logs insert warning:', error);
  } catch (err) {
    console.warn('activity_logs crashed but ignored:', err);
  }
}

async function signOutAuth() {
  try {
    await authSb.auth.signOut();
  } catch (err) {
    console.warn('signOut failed:', err);
  }

  currentEnrollFactor = null;
  pendingLoginFactorId = null;

  clearOtp('mfaEnrollOtp', 'mfaEnrollCodeInput');
  clearOtp('mfaVerifyOtp', 'mfaVerifyCodeInput');

  setBrandMode('default');
  activateTab('login');
  showView('authViewLogin');
  el('authSignOutBtn')?.classList.add('hidden');
  setSubtitle('');
  setStatus('Сеанс завершено');

  window.location.replace(LOGIN_PAGE);
}

async function ensureAllowedUser(user) {
  const { data, error } = await authSb
    .from('allowed_users')
    .select('email,is_active')
    .eq('email', user.email)
    .maybeSingle();

  if (error) throw error;

  return !!(data && data.is_active !== false);
}

async function syncProfile(user) {
  try {
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Оператор';
    const row = {
      id: user.id,
      email: user.email,
      display_name: displayName,
      is_active: true
    };

    let resp = await authSb.from('profiles').upsert(row, { onConflict: 'id' });
    if (!resp.error) return true;

    resp = await authSb
      .from('profiles')
      .update({
        email: row.email,
        display_name: row.display_name,
        is_active: row.is_active
      })
      .eq('id', row.id);

    if (!resp.error) return true;

    console.warn('profiles sync skipped:', resp.error);
    return false;
  } catch (err) {
    console.warn('syncProfile crashed but ignored:', err);
    return false;
  }
}

async function getMfaState() {
  const [aalResp, factorResp] = await Promise.all([
    authSb.auth.mfa.getAuthenticatorAssuranceLevel(),
    authSb.auth.mfa.listFactors()
  ]);

  if (aalResp.error) throw aalResp.error;
  if (factorResp.error) throw factorResp.error;

  return {
    aal: aalResp.data,
    factors: factorResp.data?.totp || []
  };
}

function renderQrCode(qrValue, mountId = 'mfaQrMountHero') {
  const mount = el(mountId);
  if (!mount) {
    console.error('QR mount not found:', mountId);
    return;
  }

  mount.innerHTML = '';

  if (!qrValue) {
    mount.innerHTML = '<div style="color:#fff">QR недоступний</div>';
    return;
  }

  if (qrValue.startsWith('data:image')) {
    const img = document.createElement('img');
    img.src = qrValue;
    img.alt = 'QR код для 2FA';
    img.className = 'auth-qr-image';
    mount.appendChild(img);
    return;
  }

  if (qrValue.trim().startsWith('<svg')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = qrValue;
    const svg = wrapper.querySelector('svg');
    if (svg) {
      svg.classList.add('auth-qr-svg');
      svg.style.display = 'block';
      svg.style.width = '220px';
      svg.style.height = '220px';
      svg.style.background = '#fff';
      svg.style.borderRadius = '16px';
      svg.style.padding = '10px';
      mount.appendChild(svg);
      return;
    }
  }

  const img = document.createElement('img');
  img.src = `data:image/svg+xml;utf-8,${encodeURIComponent(qrValue)}`;
  img.alt = 'QR код для 2FA';
  img.className = 'auth-qr-image';
  mount.appendChild(img);
}

async function startMfaEnroll() {
  try {
    setBrandMode('enroll');
    showView('authViewEnroll');
    el('authSignOutBtn')?.classList.add('hidden');
    setSubtitle('');
    setStatus('Створюємо QR-код…');

    clearOtp('mfaEnrollOtp', 'mfaEnrollCodeInput');

    const { data, error } = await authSb.auth.mfa.enroll({ factorType: 'totp' });
    if (error) throw error;

    currentEnrollFactor = data;
    renderQrCode(data?.totp?.qr_code || '', 'mfaQrMountHero');

    if (el('mfaSecretText')) {
      el('mfaSecretText').textContent = data?.totp?.secret || '';
    }

    setStatus('Скануй QR-код і введи 6-значний код', 'ok');
    setTimeout(() => focusFirstOtp('mfaEnrollOtp'), 40);
  } catch (err) {
    console.error('startMfaEnroll failed:', err);
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

async function finishMfaEnroll(event) {
  event?.preventDefault();

  try {
    const code = collectOtpCode('mfaEnrollOtp', 'mfaEnrollCodeInput');

    if (!currentEnrollFactor?.id || code.length !== 6) {
      setStatus('Введи повний 6-значний код із застосунку', 'error');
      return;
    }

    setStatus('Перевіряємо код…');

    const challenge = await authSb.auth.mfa.challenge({
      factorId: currentEnrollFactor.id
    });

    if (challenge.error) throw challenge.error;

    const verify = await authSb.auth.mfa.verify({
      factorId: currentEnrollFactor.id,
      challengeId: challenge.data.id,
      code
    });

    if (verify.error) throw verify.error;

    await logActivity('mfa_enroll', {
      status: 'ok',
      message: 'Користувач підключив 2FA.'
    });

    setStatus('2FA підключено. Перевіряємо доступ…', 'ok');
    currentEnrollFactor = null;

    await handlePostAuthLanding();
  } catch (err) {
    console.error('finishMfaEnroll failed:', err);
    clearOtp('mfaEnrollOtp', 'mfaEnrollCodeInput');
    focusFirstOtp('mfaEnrollOtp');
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

async function openVerifyMfaView(factorId) {
  pendingLoginFactorId = factorId;
  setBrandMode('default');
  showView('authViewVerify');
  el('authSignOutBtn')?.classList.add('hidden');
  setSubtitle('');
  clearOtp('mfaVerifyOtp', 'mfaVerifyCodeInput');
  setStatus('Введи код із застосунку автентифікації');
  setTimeout(() => focusFirstOtp('mfaVerifyOtp'), 40);
}

async function verifyMfaLogin(event) {
  event?.preventDefault();

  try {
    const code = collectOtpCode('mfaVerifyOtp', 'mfaVerifyCodeInput');

    if (!pendingLoginFactorId) {
      setStatus('Не знайдено активний фактор 2FA', 'error');
      return;
    }

    if (code.length !== 6) {
      setStatus('Введи повний 6-значний код', 'error');
      return;
    }

    setStatus('Перевіряємо код…');

    const challenge = await authSb.auth.mfa.challenge({
      factorId: pendingLoginFactorId
    });

    if (challenge.error) throw challenge.error;

    const verify = await authSb.auth.mfa.verify({
      factorId: pendingLoginFactorId,
      challengeId: challenge.data.id,
      code
    });

    if (verify.error) throw verify.error;

    await logActivity('mfa_verify', {
      status: 'ok',
      message: 'Користувач успішно підтвердив 2FA.'
    });

    setStatus('Код підтверджено. Перевіряємо доступ…', 'ok');
    await handlePostAuthLanding();
  } catch (err) {
    console.error('verifyMfaLogin failed:', err);
    clearOtp('mfaVerifyOtp', 'mfaVerifyCodeInput');
    focusFirstOtp('mfaVerifyOtp');
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  try {
    const email = el('loginEmailInput')?.value.trim();
    const password = el('loginPasswordInput')?.value || '';

    if (!email || !password) {
      setStatus('Введи email і пароль', 'error');
      return;
    }

    setStatus('Виконуємо вхід…');

    const { data, error } = await authSb.auth.signInWithPassword({ email, password });

    if (error) {
      await logActivity('login_failed', {
        status: 'error',
        message: error.message,
        actor_email: email
      });

      setStatus(error.message, 'error');
      return;
    }

    await logActivity(
      'login_success',
      {
        status: 'ok',
        message: 'Користувач успішно пройшов email/password.',
        actor_email: email
      },
      data?.user || null
    );

    await handlePostAuthLanding();
  } catch (err) {
    console.error('handleLoginSubmit fatal:', err);
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();

  try {
    const email = el('registerEmailInput')?.value.trim();
    const password = el('registerPasswordInput')?.value || '';
    const passwordConfirm = el('registerPasswordConfirmInput')?.value || '';

    if (!email || !password || !passwordConfirm) {
      setStatus('Заповни всі поля для реєстрації', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      setStatus('Паролі не співпадають', 'error');
      return;
    }

    if (password.length < 6) {
      setStatus('Пароль має містити щонайменше 6 символів', 'error');
      return;
    }

    setStatus('Створюємо акаунт…');

    const { data, error } = await authSb.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: email.split('@')[0]
        }
      }
    });

    if (error) {
      await logActivity('register_failed', {
        status: 'error',
        message: error.message,
        actor_email: email
      });

      setStatus(error.message, 'error');
      return;
    }

    await logActivity(
      'register_success',
      {
        status: 'ok',
        message: 'Користувача зареєстровано.',
        actor_email: email
      },
      data?.user || null
    );

    if (data?.session) {
      setStatus('Акаунт створено. Налаштуй 2FA', 'ok');
      await startMfaEnroll();
      return;
    }

    setStatus('Акаунт створено. Тепер увійди, щоб продовжити', 'ok');
    activateTab('login');

    if (el('loginEmailInput')) el('loginEmailInput').value = email;
    if (el('registerPasswordInput')) el('registerPasswordInput').value = '';
    if (el('registerPasswordConfirmInput')) el('registerPasswordConfirmInput').value = '';
  } catch (err) {
    console.error('handleRegisterSubmit fatal:', err);
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

async function handleBlocked(user) {
  setBrandMode('default');
  showView('authViewBlocked');
  el('authSignOutBtn')?.classList.add('hidden');
  setSubtitle('');

  const blockedNode = el('blockedMessage');
  if (blockedNode) {
    blockedNode.textContent = `Користувач ${user.email} успішно автентифікований, але не має доступу до Lavash. Зверніться до адміністратора.`;
  }

  setStatus('Доступ заборонено', 'error');
}

async function handlePostAuthLanding() {
  try {
    const authResp = await authSb.auth.getUser();
    const user = authResp?.data?.user || null;

    if (!user) {
      activateTab('login');
      return;
    }

    const { aal, factors } = await getMfaState();

    if (!factors.length) {
      await startMfaEnroll();
      return;
    }

    const firstFactor = factors[0];
    if (aal?.currentLevel !== 'aal2') {
      await openVerifyMfaView(firstFactor.id);
      return;
    }

    const allowed = await ensureAllowedUser(user);
    if (!allowed) {
      await logActivity(
        'access_denied_whitelist',
        {
          status: 'error',
          message: 'Користувача немає в allowed_users або is_active = false.',
          actor_email: user.email
        },
        user
      );

      await handleBlocked(user);
      return;
    }

    await syncProfile(user);

    await logActivity(
      'access_granted',
      {
        status: 'ok',
        message: 'Користувач успішно увійшов у систему.',
        actor_email: user.email
      },
      user
    );

    setStatus('Вхід виконано. Переходимо до системи…', 'ok');
    window.location.replace(APP_ENTRY);
  } catch (err) {
    console.error('handlePostAuthLanding failed:', err);
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

async function handleEnrollBack() {
  await signOutAuth();
}

async function handleVerifyBack() {
  await signOutAuth();
}

async function initExistingSession() {
  try {
    const { data, error } = await authSb.auth.getSession();
    if (error) throw error;

    if (data?.session) {
      await handlePostAuthLanding();
    } else {
      activateTab('login');
    }
  } catch (err) {
    console.error('initExistingSession failed:', err);
    activateTab('login');
    setStatus(normalizeErrorMessage(err), 'error');
  }
}

function bindEvents() {
  el('tabLoginBtn')?.addEventListener('click', () => activateTab('login'));
  el('tabRegisterBtn')?.addEventListener('click', () => activateTab('register'));
  el('switchToLoginBtn')?.addEventListener('click', () => activateTab('login'));

  qsa('.field-toggle').forEach((btn) => {
    btn.addEventListener('click', () => togglePasswordVisibility(btn.dataset.target, btn));
  });

  el('loginForm')?.addEventListener('submit', handleLoginSubmit);
  el('registerForm')?.addEventListener('submit', handleRegisterSubmit);
  el('mfaEnrollForm')?.addEventListener('submit', finishMfaEnroll);
  el('mfaVerifyForm')?.addEventListener('submit', verifyMfaLogin);

  el('blockedBackBtn')?.addEventListener('click', signOutAuth);
  el('authSignOutBtn')?.addEventListener('click', signOutAuth);
  el('enrollBackBtn')?.addEventListener('click', handleEnrollBack);
  el('verifyBackBtn')?.addEventListener('click', handleVerifyBack);

  setupOtpGroup('mfaEnrollOtp', 'mfaEnrollCodeInput');
  setupOtpGroup('mfaVerifyOtp', 'mfaVerifyCodeInput');
}

async function initAuthPage() {
  bindEvents();
  activateTab('login');
  await initExistingSession();
}

window.LAVASH_AUTH = {
  async protectAppPage() {
    const { data, error } = await authSb.auth.getUser();
    if (error) {
      console.error('protectAppPage getUser failed:', error);
      window.location.replace('/lavash-admin/pages/index.html');
      return null;
    }

    const user = data?.user || null;
    if (!user) {
      window.location.replace('/lavash-admin/pages/index.html');
      return null;
    }

    return user;
  },

  async logout() {
    try {
      const { error } = await authSb.auth.signOut();
      if (error) throw error;
      window.location.replace('/lavash-admin/pages/index.html');
    } catch (err) {
      console.error('logout failed:', err);
      window.location.replace('/lavash-admin/pages/index.html');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const isAuthPage = path.endsWith('/pages/index.html') || path.endsWith('/index.html');

  if (isAuthPage) {
    initAuthPage();
  }
});
