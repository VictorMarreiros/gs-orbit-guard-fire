const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class MockClassList {
  constructor() {
    this._classes = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this._classes.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this._classes.delete(token));
  }

  toggle(token, force) {
    if (force === true) {
      this._classes.add(token);
      return true;
    }

    if (force === false) {
      this._classes.delete(token);
      return false;
    }

    if (this._classes.has(token)) {
      this._classes.delete(token);
      return false;
    }

    this._classes.add(token);
    return true;
  }

  contains(token) {
    return this._classes.has(token);
  }
}

class MockElement {
  constructor(tagName, id = '') {
    this.tagName = tagName.toLowerCase();
    this.id = id;
    this.style = {};
    this.dataset = {};
    this.attributes = new Map();
    this.classList = new MockClassList();
    this.children = [];
    this.parentElement = null;
    this.value = '';
    this.defaultValue = '';
    this.textContent = '';
    this.innerHTML = '';
    this.hidden = false;
    this.disabled = false;
    this._listeners = new Map();
    this._fieldWrapper = null;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  addEventListener(type, handler) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, []);
    }

    this._listeners.get(type).push(handler);
  }

  dispatchEvent(eventOrType) {
    const event =
      typeof eventOrType === 'string'
        ? { type: eventOrType }
        : { ...eventOrType };

    event.target = event.target || this;
    event.currentTarget = this;
    event.defaultPrevented = false;
    event.preventDefault = () => {
      event.defaultPrevented = true;
    };

    const handlers = this._listeners.get(event.type) || [];
    handlers.forEach((handler) => handler(event));
    return !event.defaultPrevented;
  }

  click() {
    this.dispatchEvent('click');
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  reset() {
    this.children.forEach((child) => {
      if (typeof child.defaultValue === 'string') {
        child.value = child.defaultValue;
      }
    });
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'aria-invalid') {
      this.attributes.set(name, String(value));
    }
    if (name === 'hidden') {
      this.hidden = true;
    }
  }

  removeAttribute(name) {
    this.attributes.delete(name);
    if (name === 'hidden') {
      this.hidden = false;
    }
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  closest(selector) {
    if (selector === '.field') {
      if (this._fieldWrapper) {
        return this._fieldWrapper;
      }

      if (this.parentElement && this.parentElement.classList.contains('field')) {
        return this.parentElement;
      }
    }

    return null;
  }
}

class MockDocument {
  constructor() {
    this.activeElement = null;
    this._elementsById = new Map();
    this._workspaceTabs = [];
    this.body = new MockElement('body', 'body');
    this.body.ownerDocument = this;
    this.documentElement = new MockElement('html', 'html');
    this.documentElement.ownerDocument = this;
    this.hero = new MockElement('section', 'hero');
    this.hero.classList.add('hero');
    this.hero.ownerDocument = this;
  }

  register(element) {
    element.ownerDocument = this;
    if (element.id) {
      this._elementsById.set(element.id, element);
    }
    return element;
  }

  createElement(tagName) {
    const element = new MockElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  getElementById(id) {
    return this._elementsById.get(id) || null;
  }

  querySelector(selector) {
    if (selector === '.hero') {
      return this.hero;
    }

    return null;
  }

  querySelectorAll(selector) {
    if (selector === '[data-workspace-step]') {
      return this._workspaceTabs;
    }

    return [];
  }
}

function buildSessionStorage() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

function createField(document, inputId, tagName = 'input') {
  const field = document.register(new MockElement('div'));
  field.classList.add('field');

  const input = document.register(new MockElement(tagName, inputId));
  input.parentElement = field;
  input._fieldWrapper = field;
  input.defaultValue = '';
  field.appendChild(input);

  return { field, input };
}

function createPrototypeEnvironment() {
  const document = new MockDocument();
  const sessionStorage = buildSessionStorage();

  const registry = {};

  function add(tagName, id) {
    const element = document.register(new MockElement(tagName, id));
    registry[id] = element;
    return element;
  }

  const hero = document.hero;

  const ids = [
    ['div', 'login-view'],
    ['div', 'app-view'],
    ['form', 'login-form'],
    ['div', 'login-error'],
    ['div', 'success-banner'],
    ['button', 'theme-toggle'],
    ['input', 'email'],
    ['input', 'password'],
    ['button', 'demo-fill'],
    ['button', 'logout-button'],
    ['div', 'current-user'],
    ['div', 'current-permissions'],
    ['div', 'current-token'],
    ['div', 'current-expiry'],
    ['div', 'permission-denied-card'],
    ['div', 'permission-denied-message'],
    ['span', 'permission-denied-chip'],
    ['button', 'private-area-toggle'],
    ['form', 'area-form'],
    ['input', 'area-name'],
    ['select', 'area-type'],
    ['input', 'area-latitude'],
    ['input', 'area-longitude'],
    ['input', 'area-radius'],
    ['div', 'area-status'],
    ['div', 'area-success'],
    ['div', 'area-invalid-summary'],
    ['div', 'area-form-error'],
    ['div', 'area-empty-state'],
    ['div', 'area-summary-grid'],
    ['div', 'map-status'],
    ['div', 'map-empty'],
    ['div', 'map-loading-state'],
    ['div', 'map-loading-title'],
    ['div', 'map-loading-detail'],
    ['div', 'map-surface'],
    ['strong', 'map-center-label'],
    ['div', 'map-context-text'],
    ['div', 'map-legend'],
    ['div', 'map-fire-summary'],
    ['div', 'map-fire-markers'],
    ['div', 'map-fallback-banner'],
    ['strong', 'map-fallback-title'],
    ['span', 'map-fallback-text'],
    ['span', 'map-fallback-source'],
    ['span', 'map-fallback-mode'],
    ['div', 'risk-status'],
    ['div', 'risk-empty-state'],
    ['div', 'risk-fallback-banner'],
    ['strong', 'risk-fallback-title'],
    ['span', 'risk-fallback-text'],
    ['span', 'risk-fallback-source'],
    ['span', 'risk-fallback-mode'],
    ['div', 'risk-loading-state'],
    ['div', 'risk-loading-title'],
    ['div', 'risk-loading-detail'],
    ['div', 'risk-result'],
    ['span', 'risk-score-value'],
    ['span', 'risk-level-pill'],
    ['span', 'risk-severity'],
    ['div', 'risk-score-summary'],
    ['div', 'risk-score-brief'],
    ['div', 'risk-factor-list'],
    ['div', 'alert-status-chip'],
    ['div', 'alert-empty-state'],
    ['div', 'alert-panel'],
    ['strong', 'alert-title'],
    ['span', 'alert-summary'],
    ['span', 'alert-status'],
    ['span', 'alert-channel'],
    ['span', 'alert-level'],
    ['span', 'alert-severity'],
    ['div', 'alert-message'],
    ['div', 'alert-causes'],
    ['div', 'alert-actions'],
    ['div', 'dashboard-status-chip'],
    ['div', 'dashboard-empty-state'],
    ['div', 'dashboard-panel'],
    ['div', 'dashboard-areas-count'],
    ['div', 'dashboard-alerts-count'],
    ['div', 'dashboard-average-score'],
    ['div', 'dashboard-fire-count'],
    ['div', 'dashboard-risk-levels'],
    ['div', 'dashboard-priority-list'],
    ['div', 'dashboard-executive-note'],
    ['div', 'notification-status-chip'],
    ['div', 'notification-empty-state'],
    ['div', 'notification-panel'],
    ['div', 'notification-time'],
    ['strong', 'notification-headline'],
    ['span', 'notification-subhead'],
    ['span', 'notification-badge'],
    ['div', 'notification-body'],
    ['div', 'notification-actions'],
    ['div', 'notification-context'],
    ['div', 'risk-layout'],
    ['div', 'risk-fire-summary'],
    ['span', 'risk-source-chip'],
    ['div', 'risk-weather-grid'],
    ['div', 'risk-signal-list'],
    ['div', 'risk-narrative'],
    ['span', 'risk-fire-count'],
    ['span', 'risk-fire-distance'],
    ['div', 'workspace-active-label'],
    ['div', 'workspace-footer-brand'],
    ['div', 'workspace-footer-status'],
    ['button', 'workspace-prev'],
    ['button', 'workspace-next'],
    ['button', 'area-reset'],
    ['div', 'summary-name'],
    ['div', 'summary-type'],
    ['div', 'summary-center'],
    ['div', 'summary-radius'],
    ['div', 'area-name-error'],
    ['div', 'area-type-error'],
    ['div', 'area-latitude-error'],
    ['div', 'area-longitude-error'],
    ['div', 'area-radius-error'],
    ['button', 'fallback-toggle'],
  ];

  ids.forEach(([tagName, id]) => add(tagName, id));

  const areaFields = {
    name: createField(document, 'area-name'),
    type: createField(document, 'area-type', 'select'),
    latitude: createField(document, 'area-latitude'),
    longitude: createField(document, 'area-longitude'),
    radiusKm: createField(document, 'area-radius'),
  };

  const loginFields = {
    email: createField(document, 'email'),
    password: createField(document, 'password'),
  };

  // Restore the original input/select registrations.
  registry.email = loginFields.email.input;
  registry.password = loginFields.password.input;
  registry['area-name'] = areaFields.name.input;
  registry['area-type'] = areaFields.type.input;
  registry['area-latitude'] = areaFields.latitude.input;
  registry['area-longitude'] = areaFields.longitude.input;
  registry['area-radius'] = areaFields.radiusKm.input;

  const forms = {
    loginForm: registry['login-form'],
    areaForm: registry['area-form'],
  };

  forms.loginForm.children.push(loginFields.email.input, loginFields.password.input);
  forms.areaForm.children.push(
    areaFields.name.input,
    areaFields.type.input,
    areaFields.latitude.input,
    areaFields.longitude.input,
    areaFields.radiusKm.input,
  );

  loginFields.email.input.defaultValue = 'maria@example.com';
  loginFields.password.input.defaultValue = 'SenhaSegura123!';

  loginFields.email.input.value = 'maria@example.com';
  loginFields.password.input.value = 'SenhaSegura123!';
  areaFields.name.input.value = '';
  areaFields.type.input.value = '';
  areaFields.latitude.input.value = '';
  areaFields.longitude.input.value = '';
  areaFields.radiusKm.input.value = '';

  const workspaceTabs = ['A', 'B', 'C'].map((step) => {
    const tab = new MockElement('button');
    tab.dataset.workspaceStep = step;
    tab.classList.add('workspace-tab');
    tab.ownerDocument = document;
    return tab;
  });
  workspaceTabs[0].classList.add('is-active');
  document._workspaceTabs = workspaceTabs;

  // Button/textual controls.
  ['login-view', 'app-view', 'success-banner', 'area-success', 'area-invalid-summary', 'map-loading-state', 'risk-loading-state', 'map-surface', 'risk-empty-state', 'risk-result', 'risk-layout', 'alert-empty-state', 'alert-panel', 'dashboard-empty-state', 'dashboard-panel', 'notification-empty-state', 'notification-panel', 'permission-denied-card', 'map-fallback-banner', 'risk-fallback-banner'].forEach(
    (id) => {
      if (registry[id]) {
        registry[id].hidden = false;
      }
    },
  );

  // Set initial hidden states to match the prototype.
  registry['app-view'].style.display = 'none';
  registry['theme-toggle'].textContent = 'Ativar modo claro';
  registry['success-banner'].style.display = 'none';
  registry['area-success'].style.display = 'none';
  registry['map-loading-state'].hidden = true;
  registry['risk-loading-state'].hidden = true;
  registry['map-surface'].hidden = true;
  registry['risk-empty-state'].hidden = false;
  registry['risk-result'].hidden = true;
  registry['risk-layout'].hidden = true;
  registry['alert-panel'].hidden = true;
  registry['dashboard-panel'].hidden = true;
  registry['notification-panel'].hidden = true;
  registry['permission-denied-card'].hidden = true;
  registry['map-fallback-banner'].hidden = true;
  registry['risk-fallback-banner'].hidden = true;
  registry['workspace-footer-brand'].textContent = 'OrbitGuard Fire | fluxo demonstrativo';

  const windowObj = {
    document,
    sessionStorage,
    setTimeout(callback) {
      callback();
      return 1;
    },
    clearTimeout() {},
  };
  windowObj.window = windowObj;
  windowObj.Intl = Intl;
  windowObj.Date = Date;
  windowObj.console = console;
  windowObj.navigator = { userAgent: 'mock-browser' };
  windowObj.HTMLElement = MockElement;

  const context = vm.createContext({
    console,
    document,
    window: windowObj,
    sessionStorage,
    Intl,
    Date,
    setTimeout: windowObj.setTimeout.bind(windowObj),
    clearTimeout: windowObj.clearTimeout.bind(windowObj),
    globalThis: null,
  });

  context.globalThis = context;
  context.window = windowObj;
  context.document = document;
  context.sessionStorage = sessionStorage;
  context.Intl = Intl;
  context.Date = Date;

  return {
    context,
    document,
    sessionStorage,
    elements: registry,
    workspaceTabs,
    loginForm: forms.loginForm,
    areaForm: forms.areaForm,
    loginFields,
    areaFields,
  };
}

function loadPrototype(env) {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const jsPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.js');
  const jsSource = fs.readFileSync(jsPath, 'utf8');

  // The HTML is read to make the test explicit about the artifact being exercised.
  assert.ok(fs.existsSync(htmlPath), 'prototype HTML should exist');

  vm.runInContext(jsSource, env.context, { timeout: 1000 });
}

function assertLoginCopyInHtml() {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');

  assert.match(htmlSource, /<title>OrbitGuard Fire - Acesso ao fluxo<\/title>/);
  assert.match(htmlSource, /Acesso ao fluxo operacional do MVP demonstrativo/);
  assert.match(htmlSource, /Acesso preparado \| sessão pronta/);
  assert.match(htmlSource, /Capa principal/);
  assert.match(htmlSource, /Entre e siga para o monitoramento\./);
  assert.match(htmlSource, /class="story-brand"/);
  assert.match(htmlSource, /Acessar o fluxo/);
  assert.match(htmlSource, /Preencher acesso/);
  assert.doesNotMatch(htmlSource, /Access token|403 demonstrativo|Conta de teste|ambiente de teste/);
}

function assertLoadingCopyInHtml() {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');

  assert.match(htmlSource, /Montando o mapa/);
  assert.match(htmlSource, /Estamos montando o mapa da area\./);
  assert.match(htmlSource, /Em instantes voce vera o centro, o raio e os focos relevantes\./);
  assert.match(htmlSource, /Montando o resumo de risco/);
  assert.match(htmlSource, /Estamos montando o resumo de risco da area\./);
  assert.match(htmlSource, /Em instantes voce vera score, causas e a proxima acao\./);
  assert.doesNotMatch(htmlSource, /Consultando area monitorada|Calculando risco|Preparando o resumo de risco/);
}

function assertThemeToggleCopyInHtml() {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');

  assert.match(htmlSource, /id="theme-toggle"/);
  assert.match(htmlSource, /Ativar modo claro/);
  assert.doesNotMatch(htmlSource, /Ativar modo escuro/);
}

function assertHeroBrandingCopyInHtml() {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');

  assert.match(htmlSource, /logo\/1-logo\.png/);
  assert.match(htmlSource, /logo\/3-logo\.png/);
  assert.match(htmlSource, /logo\/2-logo\.png/);
  assert.match(htmlSource, /class="story-brand"/);
  assert.match(htmlSource, /class="section-brand"/);
  assert.match(htmlSource, /class="story-brand"[\s\S]*?src="logo\/3-logo\.png"/);
  assert.match(
    htmlSource,
    /class="section-brand section-brand-featured"[\s\S]*?src="logo\/2-logo\.png"[\s\S]*?<h3 id="login-title">Acessar o fluxo<\/h3>/,
  );
  assert.match(htmlSource, /class="section-brand-copy"/);
  assert.match(htmlSource, /Capa principal/);
  assert.match(htmlSource, /Leitura operacional/);
  assert.equal(countOccurrences(htmlSource, 'logo/3-logo.png'), 1);
  assert.equal(countOccurrences(htmlSource, 'logo/2-logo.png'), 1);
}

function assertSurfaceHierarchyInHtml() {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');

  assert.match(
    htmlSource,
    /class="section-brand section-brand-featured"[\s\S]*?<h3 id="login-title">Acessar o fluxo<\/h3>/,
  );
  assert.match(
    htmlSource,
    /<h3 id="area-form-title">Cadastro de area<\/h3>[\s\S]*?<form class="form-card" id="area-form" novalidate>/,
  );
  assert.match(
    htmlSource,
    /<h3 id="risk-map-title">Mapa de risco<\/h3>[\s\S]*?<div class="map-layout">/,
  );
  assert.match(
    htmlSource,
    /<h3 id="risk-calculation-title">Experiencia de calculo<\/h3>[\s\S]*?<div class="risk-empty" id="risk-empty-state">/,
  );
  assert.match(
    htmlSource,
    /<h3 id="alert-details-title">Detalhe do alerta<\/h3>[\s\S]*?<div class="alert-empty" id="alert-empty-state">/,
  );
  assert.match(
    htmlSource,
    /<h3 id="dashboard-title">Dashboard gerencial<\/h3>[\s\S]*?<div class="dashboard-empty" id="dashboard-empty-state">/,
  );
  assert.match(
    htmlSource,
    /<h3 id="notification-title">Demonstracao de notificacao visual<\/h3>[\s\S]*?<div class="notification-layout" id="notification-panel" hidden>/,
  );
  assert.match(
    htmlSource,
    /class="map-brand"[\s\S]*?<div class="mini-card map-context">/,
  );
}

function assertMapBrandingSupportCopyInHtml() {
  const htmlPath = path.resolve(__dirname, 'orbitguard-fire-prototipo-v2.html');
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');

  assert.match(htmlSource, /class="map-brand"/);
  assert.match(
    htmlSource,
    /class="map-brand"[\s\S]*Apoio visual discreto para a leitura espacial\./,
  );
  assert.doesNotMatch(htmlSource, /class="map-brand"[\s\S]*src="logo\/1-logo\.png"/);
  assert.equal(countOccurrences(htmlSource, 'logo/1-logo.png'), 2);
}

function submitLogin(env, email, password) {
  env.loginFields.email.input.value = email;
  env.loginFields.password.input.value = password;
  env.loginForm.dispatchEvent('submit');
}

function submitArea(env, area) {
  env.areaFields.name.input.value = area.name;
  env.areaFields.type.input.value = area.type;
  env.areaFields.latitude.input.value = area.latitude;
  env.areaFields.longitude.input.value = area.longitude;
  env.areaFields.radiusKm.input.value = area.radiusKm;
  env.areaForm.dispatchEvent('submit');
}

function countOccurrences(text, pattern) {
  const matches = text.match(new RegExp(pattern, 'g'));
  return matches ? matches.length : 0;
}

function stripHtmlTags(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getVisibleSurfaceText(element) {
  const parts = [];
  const textContent = (element.textContent || '').trim();
  const innerText = stripHtmlTags(element.innerHTML || '');

  if (textContent) {
    parts.push(textContent);
  }

  if (innerText && innerText !== textContent) {
    parts.push(innerText);
  }

  return parts.join(' ').trim();
}

function assertNoInternalLanguageInVisibleSurface(env) {
  const visibleSurfaceText = Object.values(env.elements)
    .filter((element) => element && !element.hidden && element.style.display !== 'none')
    .map(getVisibleSurfaceText)
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  [
    /\bmock\b/,
    /\bfallback\b/,
    /\bseed\b/,
    /\btoken\b/,
    /\bpayload\b/,
    /\bdebug\b/,
    /\bin-app\b/,
    /\baccess token\b/,
    /\bjwt\b/,
    /\bendpoint\b/,
  ].forEach((pattern) => {
    assert.doesNotMatch(visibleSurfaceText, pattern);
  });
}

function runSuccessfulAreaFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);
  assertHeroBrandingCopyInHtml();
  assertSurfaceHierarchyInHtml();
  assertMapBrandingSupportCopyInHtml();
  assertLoginCopyInHtml();
  assertLoadingCopyInHtml();

  env.elements['demo-fill'].dispatchEvent('click');
  assert.equal(
    env.elements['success-banner'].textContent,
    'Campos prontos. Agora entre para continuar.',
  );
  assert.equal(env.elements['login-error'].textContent, '');

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');

  assert.equal(env.elements['app-view'].style.display, 'grid');
  assert.equal(env.elements['login-view'].style.display, 'none');
  assert.equal(env.elements['current-user'].textContent, 'Maria Oliveira (maria@example.com)');
  assert.equal(env.elements['current-token'].textContent, 'Sessão ativa');

  submitArea(env, {
    name: 'Fazenda Santa Luzia',
    type: 'RURAL_PROPERTY',
    latitude: '-15.7801',
    longitude: '-47.9292',
    radiusKm: '10',
  });

  assert.equal(env.elements['area-success'].style.display, 'block');
  assert.equal(env.elements['area-success'].textContent, 'Area salva. Prossiga para o mapa e o risco.');
  assert.equal(env.elements['area-summary-grid'].hidden, false);
  assert.equal(env.elements['summary-name'].textContent, 'Fazenda Santa Luzia');
  assert.equal(env.elements['summary-type'].textContent, 'RURAL_PROPERTY');
  assert.equal(env.elements['summary-center'].textContent, '-15.780100, -47.929200');
  assert.equal(env.elements['summary-radius'].textContent, '10 km');
  assert.match(
    env.elements['area-status'].textContent,
    /^Area salva\. Mapa pronto \(2 dentro \/ 2 proximos\)$/,
  );
  assert.equal(env.elements['map-surface'].hidden, false);
  assert.equal(env.elements['map-status'].textContent, 'Mapa pronto. Prossiga para o risco.');
  assert.equal(env.elements['map-center-label'].textContent, 'Fazenda Santa Luzia');
  assert.equal(
    env.elements['map-context-text'].textContent,
    'Fazenda Santa Luzia em -15.780100, -47.929200. Raio monitorado de 10 km com vizinhanca operacional de 15 km.',
  );
  assert.equal(env.elements['map-legend'].innerHTML.includes('Centro da area'), true);
  assert.equal(env.elements['map-legend'].innerHTML.includes('Vizinhanca operacional'), true);
  assert.equal(env.elements['map-fire-summary'].innerHTML.includes('Foco 1 Dentro do raio'), true);
  assert.equal(env.elements['map-fire-summary'].innerHTML.includes('Foco 4 Proximo ao raio'), true);
  assert.equal(countOccurrences(env.elements['map-fire-markers'].innerHTML, 'class="map-fire-marker"'), 4);
  assert.equal(countOccurrences(env.elements['map-fire-markers'].innerHTML, 'inside" aria-hidden="true"'), 2);
  assert.equal(countOccurrences(env.elements['map-fire-markers'].innerHTML, 'nearby" aria-hidden="true"'), 2);
  assert.equal(env.elements['workspace-footer-status'].textContent, 'Sessão 2 de 3 ativa.');
  assert.equal(env.document.activeElement, null);
  assertNoInternalLanguageInVisibleSurface(env);
}

function runLoadingCopyFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);
  assertLoadingCopyInHtml();

  env.context.showMapLoadingState({ name: 'Fazenda Santa Luzia' });
  assert.equal(env.elements['map-status'].textContent, 'Mapa em preparacao para Fazenda Santa Luzia.');
  assert.equal(env.elements['map-loading-title'].textContent, 'Estamos montando o mapa da area de Fazenda Santa Luzia.');
  assert.equal(
    env.elements['map-loading-detail'].textContent,
    'Em instantes voce vera o centro, o raio e os focos relevantes.',
  );

  env.context.showRiskLoadingState({ name: 'Fazenda Santa Luzia' });
  assert.equal(
    env.elements['risk-status'].textContent,
    'Resumo de risco em preparacao para Fazenda Santa Luzia.',
  );
  assert.equal(
    env.elements['risk-loading-title'].textContent,
    'Estamos montando o resumo de risco da area de Fazenda Santa Luzia.',
  );
  assert.equal(
    env.elements['risk-loading-detail'].textContent,
    'Em instantes voce vera score, causas e a proxima acao.',
  );
  assertNoInternalLanguageInVisibleSurface(env);
}

function runThemeToggleFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);
  assertThemeToggleCopyInHtml();

  assert.equal(env.document.body.getAttribute('data-theme'), 'dark');
  assert.equal(env.document.body.classList.contains('theme-dark'), true);
  assert.equal(env.document.body.classList.contains('theme-light'), false);
  assert.equal(env.document.documentElement.getAttribute('data-theme'), 'dark');
  assert.equal(env.elements['theme-toggle'].textContent, 'Ativar modo claro');
  assert.equal(env.elements['theme-toggle'].getAttribute('aria-pressed'), 'false');

  env.elements['theme-toggle'].dispatchEvent('click');

  assert.equal(env.document.body.getAttribute('data-theme'), 'light');
  assert.equal(env.document.body.classList.contains('theme-light'), true);
  assert.equal(env.document.body.classList.contains('theme-dark'), false);
  assert.equal(env.document.documentElement.getAttribute('data-theme'), 'light');
  assert.equal(env.elements['theme-toggle'].textContent, 'Ativar modo escuro');
  assert.equal(env.elements['theme-toggle'].getAttribute('aria-pressed'), 'true');
  assert.equal(env.sessionStorage.getItem('orbitguard-fire-demo-theme'), 'light');

  env.elements['theme-toggle'].dispatchEvent('click');

  assert.equal(env.document.body.getAttribute('data-theme'), 'dark');
  assert.equal(env.elements['theme-toggle'].textContent, 'Ativar modo claro');
  assert.equal(env.elements['theme-toggle'].getAttribute('aria-pressed'), 'false');
  assert.equal(env.sessionStorage.getItem('orbitguard-fire-demo-theme'), 'dark');
  assertNoInternalLanguageInVisibleSurface(env);
}

function runLoginMessageCopyFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);

  submitLogin(env, 'usuario-invalido@example.com', 'senha-invalida');
  assert.equal(
    env.elements['login-error'].textContent,
    'Email ou senha inválidos. Use o acesso pronto para continuar.',
  );
  assert.equal(env.elements['success-banner'].style.display, 'none');

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');
  assert.equal(
    env.elements['success-banner'].textContent,
    'Acesso confirmado. Prossiga para cadastrar a area.',
  );
  assertNoInternalLanguageInVisibleSurface(env);
}

function runInvalidAreaFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');
  env.elements['area-reset'].dispatchEvent('click');
  assert.equal(
    env.elements['area-empty-state'].textContent,
    'Cadastre uma area para continuar.',
  );
  assert.equal(
    env.elements['map-empty'].innerHTML.includes('Cadastre uma area para ver o mapa.'),
    true,
  );
  assert.equal(
    env.elements['map-empty'].innerHTML.includes('O centro, o raio e os focos aparecem aqui.'),
    true,
  );
  assert.equal(
    env.elements['map-context-text'].textContent,
    'Cadastre uma area para liberar o mapa.',
  );
  assert.equal(
    env.elements['risk-empty-state'].textContent,
    'Cadastre uma area para ver focos e clima.',
  );
  assert.equal(
    env.elements['alert-empty-state'].textContent,
    'Nenhum alerta ativo no momento. Continue acompanhando a area.',
  );
  assert.equal(
    env.elements['dashboard-empty-state'].textContent,
    'Nenhum alerta ativo para esta area. O resumo fica pronto quando o risco subir.',
  );
  assert.equal(env.elements['dashboard-priority-list'].innerHTML, '');
  assert.equal(
    env.elements['dashboard-executive-note'].textContent,
    'Cadastre uma area para ver os indicadores do dashboard.',
  );
  assert.equal(
    env.elements['notification-empty-state'].textContent,
    'Nenhuma notificacao ativa. O preview aparece quando o risco subir.',
  );

  submitArea(env, {
    name: '  ',
    type: '',
    latitude: '',
    longitude: '200',
    radiusKm: '0',
  });

  assert.equal(env.elements['area-invalid-summary'].classList.contains('visible'), true);
  assert.equal(
    env.elements['area-form-error'].textContent,
    'Preencha os campos obrigatórios para salvar a área.',
  );
  assert.equal(env.elements['area-name-error'].textContent, 'Informe um nome entre 3 e 80 caracteres.');
  assert.equal(env.elements['area-type-error'].textContent, 'Selecione um tipo de area valido.');
  assert.equal(env.elements['area-latitude-error'].textContent, 'Informe uma latitude valida entre -90 e 90.');
  assert.equal(env.elements['area-longitude-error'].textContent, 'Informe uma longitude valida entre -180 e 180.');
  assert.equal(env.elements['area-radius-error'].textContent, 'Informe um raio de monitoramento entre 0.1 km e 50 km.');
  assert.equal(env.elements['area-status'].textContent, 'Revise os campos');
  assert.equal(env.document.activeElement, env.areaFields.name.input);
  assert.equal(env.elements['area-success'].style.display, 'none');
  assertNoInternalLanguageInVisibleSurface(env);
}

function runRiskFlowWithFallbackScenario() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');
  submitArea(env, {
    name: 'Fazenda Santa Luzia',
    type: 'RURAL_PROPERTY',
    latitude: '-15.7801',
    longitude: '-47.9292',
    radiusKm: '10',
  });

  assert.equal(env.elements['risk-result'].hidden, false);
  assert.equal(env.elements['risk-score-value'].textContent, '95');
  assert.equal(env.elements['risk-level-pill'].textContent, 'Crítico');
  assert.equal(env.elements['risk-severity'].textContent, 'Prioridade: Alta');
  assert.equal(env.elements['risk-source-chip'].textContent, 'Dados preparados');
  assert.equal(env.elements['risk-factor-list'].innerHTML.includes('NEAR_FIRE_CRITICAL'), true);
  assert.equal(env.elements['alert-panel'].hidden, false);
  assert.equal(env.elements['alert-status-chip'].textContent, 'Alerta Crítico ativo');
  assert.equal(env.elements['alert-title'].textContent, 'Alerta crítico em Fazenda Santa Luzia');
  assert.equal(
    env.elements['alert-summary'].textContent,
    'Fazenda Santa Luzia tem risco critico nas ultimas 24 horas com foco criticamente proximo e concentracao recente de focos.',
  );
  assert.equal(env.elements['alert-status'].textContent, 'Ativo');
  assert.equal(env.elements['alert-channel'].textContent, 'Visual');
  assert.equal(env.elements['alert-level'].textContent, 'Crítico');
  assert.equal(env.elements['alert-severity'].textContent, 'Alta');
  assert.equal(env.elements['alert-message'].textContent, 'Acompanhe a area agora e reduza atividades de risco.');
  assert.equal(countOccurrences(env.elements['alert-causes'].innerHTML, 'alert-list-item'), 5);
  assert.equal(
    env.elements['alert-causes'].innerHTML.includes('Ao menos um foco ficou a ate 5 km da area monitorada.'),
    true,
  );
  assert.equal(countOccurrences(env.elements['alert-actions'].innerHTML, 'alert-list-item'), 3);
  assert.equal(
    env.elements['alert-actions'].innerHTML.includes('Acione a vigilancia local imediatamente.'),
    true,
  );
  assert.equal(
    env.elements['risk-score-summary'].textContent,
    'Fazenda Santa Luzia tem risco critico nas ultimas 24 horas com foco criticamente proximo e concentracao recente de focos.',
  );
  assert.match(env.elements['risk-score-brief'].textContent, /area pede acao imediata/i);
  assert.match(env.elements['dashboard-executive-note'].textContent, /maior risco e merece acompanhamento prioritario/i);
  assert.equal(env.elements['dashboard-panel'].hidden, false);
  assert.equal(env.elements['dashboard-alerts-count'].textContent, '1');
  assert.equal(env.elements['notification-status-chip'].textContent, 'Notificacao ativa');
  assert.equal(env.elements['notification-panel'].hidden, false);
  assert.equal(env.elements['notification-empty-state'].hidden, true);
  assert.equal(env.elements['notification-headline'].textContent, 'Alerta crítico em Fazenda Santa Luzia');
  assert.equal(env.elements['notification-subhead'].textContent, 'Alerta visual | Alta');
  assert.equal(env.elements['notification-badge'].textContent, 'Crítico');
  assert.equal(
    env.elements['notification-body'].textContent,
    'Area Fazenda Santa Luzia: Fazenda Santa Luzia tem risco critico nas ultimas 24 horas com foco criticamente proximo e concentracao recente de focos.',
  );
  assert.equal(env.elements['notification-context'].textContent, 'Prévia da mensagem.');
  assert.equal(countOccurrences(env.elements['notification-actions'].innerHTML, 'alert-chip'), 2);
  assert.match(env.elements['notification-time'].textContent, /^\d{2}:\d{2}$/);
  assert.equal(
    env.elements['workspace-footer-brand'].textContent,
    'OrbitGuard Fire | fluxo demonstrativo',
  );

  env.elements['fallback-toggle'].dispatchEvent('click');

  assert.equal(env.elements['map-fallback-banner'].hidden, false);
  assert.equal(env.elements['risk-fallback-banner'].hidden, false);
  assert.equal(env.elements['map-fallback-title'].textContent, 'Dados preparados em uso');
  assert.equal(
    env.elements['map-fallback-text'].textContent,
    'As fontes externas estão indisponíveis agora. O mapa segue com dados preparados para manter a leitura da área.',
  );
  assert.equal(env.elements['map-fallback-source'].textContent, 'Dados preparados');
  assert.equal(env.elements['map-fallback-mode'].textContent, 'Consulta mantida');
  assert.equal(env.elements['risk-fallback-title'].textContent, 'Dados preparados em uso');
  assert.equal(
    env.elements['risk-fallback-text'].textContent,
    'As fontes externas estão indisponíveis agora. O cálculo segue com dados preparados para manter a leitura do risco.',
  );
  assert.equal(env.elements['risk-fallback-source'].textContent, 'Dados preparados');
  assert.equal(env.elements['risk-fallback-mode'].textContent, 'Consulta mantida');
  assert.equal(env.elements['risk-source-chip'].textContent, 'Dados preparados');
  assert.equal(env.elements['map-status'].textContent, 'Mapa pronto com dados preparados');
  assert.equal(env.elements['risk-status'].textContent, 'Score calculado: 95/100');
  assert.equal(env.elements['risk-score-value'].textContent, '95');
  assert.equal(env.elements['alert-panel'].hidden, false);
  assert.equal(env.elements['alert-message'].textContent, 'Acompanhe a area agora e reduza atividades de risco.');
  assert.equal(env.elements['dashboard-panel'].hidden, false);
  assert.equal(env.elements['dashboard-alerts-count'].textContent, '1');
  assert.equal(env.elements['notification-panel'].hidden, false);
  assert.equal(env.elements['notification-subhead'].textContent, 'Alerta visual | Alta');
  assert.equal(env.elements['notification-body'].textContent.includes('Fazenda Santa Luzia'), true);
  assertNoInternalLanguageInVisibleSurface(env);
}

function runDashboardEmptyStateFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');
  submitArea(env, {
    name: 'Sitio Boa Esperanca',
    type: 'RURAL_PROPERTY',
    latitude: '-16.1200',
    longitude: '-47.8900',
    radiusKm: '4',
  });

  assert.equal(env.elements['risk-score-value'].textContent, '0');
  assert.equal(env.elements['risk-level-pill'].textContent, 'Baixo');
  assert.equal(env.elements['alert-panel'].hidden, true);
  assert.equal(env.elements['dashboard-panel'].hidden, false);
  assert.equal(env.elements['dashboard-status-chip'].textContent, 'Dashboard sem alertas ativos em Sitio Boa Esperanca');
  assert.equal(env.elements['dashboard-empty-state'].hidden, false);
  assert.equal(
    env.elements['dashboard-empty-state'].textContent,
    'Nenhum alerta ativo para Sitio Boa Esperanca. O resumo fica pronto quando o risco subir.',
  );
  assert.equal(env.elements['dashboard-alerts-count'].textContent, '0');
  assert.equal(env.elements['notification-status-chip'].textContent, 'Sem notificacao ativa');
  assert.equal(env.elements['notification-empty-state'].hidden, false);
  assert.equal(
    env.elements['notification-empty-state'].textContent,
    'Nenhuma notificacao ativa. O preview aparece quando o risco subir.',
  );
  assert.equal(env.elements['notification-panel'].hidden, true);
  assert.equal(
    env.elements['notification-body'].textContent,
    'Nenhuma notificacao ativa. O preview aparece quando o risco subir.',
  );
  assert.equal(
    env.elements['notification-context'].textContent,
    'Cadastre uma area para ver a notificacao.',
  );
  assert.equal(env.elements['dashboard-average-score'].textContent, '0');
  assert.equal(env.elements['dashboard-fire-count'].textContent, '0');
  assert.equal(
    env.elements['map-fire-summary'].innerHTML.includes('O mapa segue pronto para a proxima area.'),
    true,
  );
  assert.equal(
    env.elements['risk-fire-summary'].innerHTML.includes('O score segue com os demais sinais da area.'),
    true,
  );
  assert.equal(
    env.elements['dashboard-priority-list'].innerHTML.includes('O dashboard segue pronto para a proxima ocorrencia.'),
    true,
  );
  assert.equal(
    env.elements['dashboard-executive-note'].textContent,
    'A area Sitio Boa Esperanca segue controlada sem alertas ativos.',
  );
  assertNoInternalLanguageInVisibleSurface(env);
}

function main() {
  runLoginMessageCopyFlow();
  runLoadingCopyFlow();
  runThemeToggleFlow();
  runSuccessfulAreaFlow();
  runInvalidAreaFlow();
  runRiskFlowWithFallbackScenario();
  runDashboardEmptyStateFlow();
  console.log('orbitguard-fire prototype area flow checks passed');
}

main();
