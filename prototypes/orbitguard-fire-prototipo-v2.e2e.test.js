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

function runSuccessfulAreaFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');
  assert.equal(env.elements['app-view'].style.display, 'grid');
  assert.equal(env.elements['login-view'].style.display, 'none');
  assert.equal(env.elements['current-user'].textContent, 'Maria Oliveira (maria@example.com)');

  submitArea(env, {
    name: 'Fazenda Santa Luzia',
    type: 'RURAL_PROPERTY',
    latitude: '-15.7801',
    longitude: '-47.9292',
    radiusKm: '10',
  });

  assert.equal(env.elements['area-success'].style.display, 'block');
  assert.match(env.elements['area-success'].textContent, /Area cadastrada com sucesso/i);
  assert.equal(env.elements['area-summary-grid'].hidden, false);
  assert.equal(env.elements['summary-name'].textContent, 'Fazenda Santa Luzia');
  assert.equal(env.elements['summary-type'].textContent, 'RURAL_PROPERTY');
  assert.equal(env.elements['summary-center'].textContent, '-15.780100, -47.929200');
  assert.equal(env.elements['summary-radius'].textContent, '10 km');
  assert.match(env.elements['area-status'].textContent, /Area cadastrada e pronta para o mapa/i);
  assert.equal(env.elements['map-surface'].hidden, false);
  assert.equal(env.elements['map-status'].textContent, 'Mapa pronto para leitura operacional');
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
}

function runInvalidAreaFlow() {
  const env = createPrototypeEnvironment();
  loadPrototype(env);

  submitLogin(env, 'maria@example.com', 'SenhaSegura123!');
  env.elements['area-reset'].dispatchEvent('click');

  submitArea(env, {
    name: '  ',
    type: '',
    latitude: '',
    longitude: '200',
    radiusKm: '0',
  });

  assert.equal(env.elements['area-invalid-summary'].classList.contains('visible'), true);
  assert.equal(env.elements['area-form-error'].textContent, 'Corrija os campos destacados antes de seguir para o mapa e o calculo.');
  assert.equal(env.elements['area-name-error'].textContent, 'Informe um nome entre 3 e 80 caracteres.');
  assert.equal(env.elements['area-type-error'].textContent, 'Selecione um tipo de area valido.');
  assert.equal(env.elements['area-latitude-error'].textContent, 'Informe uma latitude valida entre -90 e 90.');
  assert.equal(env.elements['area-longitude-error'].textContent, 'Informe uma longitude valida entre -180 e 180.');
  assert.equal(env.elements['area-radius-error'].textContent, 'Informe um raio de monitoramento entre 0.1 km e 50 km.');
  assert.equal(env.elements['area-status'].textContent, 'Cadastro com ajustes pendentes');
  assert.equal(env.document.activeElement, env.areaFields.name.input);
  assert.equal(env.elements['area-success'].style.display, 'none');
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
  assert.equal(env.elements['risk-level-pill'].textContent, 'CRITICAL');
  assert.equal(env.elements['risk-severity'].textContent, 'Severidade: DANGER');
  assert.equal(env.elements['risk-source-chip'].textContent, 'Fonte: mock controlado');
  assert.equal(env.elements['risk-factor-list'].innerHTML.includes('NEAR_FIRE_CRITICAL'), true);
  assert.equal(env.elements['alert-panel'].hidden, false);
  assert.equal(env.elements['alert-status-chip'].textContent, 'Alerta critico ativo');
  assert.equal(env.elements['alert-title'].textContent, 'Risco critico de queimada em Fazenda Santa Luzia');
  assert.equal(
    env.elements['alert-summary'].textContent,
    'Fazenda Santa Luzia apresenta risco critico nas ultimas 24 horas com foco criticamente proximo e concentracao recente de focos.',
  );
  assert.equal(env.elements['alert-status'].textContent, 'ACTIVE');
  assert.equal(env.elements['alert-channel'].textContent, 'IN_APP');
  assert.equal(env.elements['alert-level'].textContent, 'CRITICAL');
  assert.equal(env.elements['alert-severity'].textContent, 'DANGER');
  assert.match(env.elements['alert-message'].textContent, /ultimas 24 horas/i);
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
    'Fazenda Santa Luzia apresenta risco critico nas ultimas 24 horas com foco criticamente proximo e concentracao recente de focos.',
  );
  assert.match(env.elements['risk-score-brief'].textContent, /alerta preventivo/i);
  assert.match(env.elements['dashboard-executive-note'].textContent, /maior risco demonstrativo/i);
  assert.equal(env.elements['dashboard-panel'].hidden, false);
  assert.equal(env.elements['dashboard-alerts-count'].textContent, '1');
  assert.equal(env.elements['notification-status-chip'].textContent, 'Notificacao ativa');
  assert.equal(env.elements['notification-panel'].hidden, false);
  assert.equal(env.elements['notification-empty-state'].hidden, true);
  assert.equal(env.elements['notification-headline'].textContent, 'Risco critico de queimada em Fazenda Santa Luzia');
  assert.equal(env.elements['notification-subhead'].textContent, 'IN_APP | DANGER');
  assert.equal(env.elements['notification-badge'].textContent, 'CRITICAL');
  assert.equal(
    env.elements['notification-body'].textContent,
    'Area Fazenda Santa Luzia: Fazenda Santa Luzia apresenta risco critico nas ultimas 24 horas com foco criticamente proximo e concentracao recente de focos.',
  );
  assert.equal(env.elements['notification-context'].textContent, 'Preview mobile alinhado ao alerta preventivo gerado pelo score.');
  assert.equal(countOccurrences(env.elements['notification-actions'].innerHTML, 'alert-chip'), 2);
  assert.match(env.elements['notification-time'].textContent, /^\d{2}:\d{2}$/);

  env.elements['fallback-toggle'].dispatchEvent('click');

  assert.equal(env.elements['map-fallback-banner'].hidden, false);
  assert.equal(env.elements['risk-fallback-banner'].hidden, false);
  assert.equal(env.elements['map-fallback-source'].textContent, 'FALHA EXTERNA -> MOCK');
  assert.equal(env.elements['risk-fallback-source'].textContent, 'FALHA EXTERNA -> MOCK');
  assert.equal(env.elements['risk-source-chip'].textContent, 'Fonte: fallback local');
  assert.equal(env.elements['map-status'].textContent, 'Mapa pronto com fallback local');
  assert.equal(env.elements['risk-status'].textContent, 'Score calculado: 95/100');
  assert.equal(env.elements['risk-score-value'].textContent, '95');
  assert.equal(env.elements['alert-panel'].hidden, false);
  assert.match(env.elements['alert-message'].textContent, /ultimas 24 horas/i);
  assert.equal(env.elements['dashboard-panel'].hidden, false);
  assert.equal(env.elements['dashboard-alerts-count'].textContent, '1');
  assert.equal(env.elements['notification-panel'].hidden, false);
  assert.equal(env.elements['notification-subhead'].textContent, 'IN_APP | DANGER');
  assert.equal(env.elements['notification-body'].textContent.includes('Fazenda Santa Luzia'), true);
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
  assert.equal(env.elements['risk-level-pill'].textContent, 'LOW');
  assert.equal(env.elements['alert-panel'].hidden, true);
  assert.equal(env.elements['dashboard-panel'].hidden, false);
  assert.equal(env.elements['dashboard-status-chip'].textContent, 'Dashboard sem alertas ativos em Sitio Boa Esperanca');
  assert.equal(env.elements['dashboard-empty-state'].hidden, false);
  assert.equal(
    env.elements['dashboard-empty-state'].textContent,
    'Nao ha alertas ativos para Sitio Boa Esperanca neste momento. O dashboard permanece util para acompanhar a area monitorada e o historico recente.',
  );
  assert.equal(env.elements['dashboard-alerts-count'].textContent, '0');
  assert.equal(env.elements['notification-status-chip'].textContent, 'Sem notificacao ativa');
  assert.equal(env.elements['notification-empty-state'].hidden, false);
  assert.equal(env.elements['notification-panel'].hidden, true);
  assert.equal(env.elements['dashboard-average-score'].textContent, '0');
  assert.equal(env.elements['dashboard-fire-count'].textContent, '0');
  assert.equal(env.elements['dashboard-priority-list'].innerHTML.includes('Nenhuma area prioritaria no momento'), true);
  assert.equal(
    env.elements['dashboard-executive-note'].textContent,
    'A area Sitio Boa Esperanca permanece em leitura controlada; o dashboard mostra um estado vazio sem alertas ativos.',
  );
}

function main() {
  runSuccessfulAreaFlow();
  runInvalidAreaFlow();
  runRiskFlowWithFallbackScenario();
  runDashboardEmptyStateFlow();
  console.log('orbitguard-fire prototype area flow checks passed');
}

main();
