const STORAGE_KEY = 'orbitguard-fire-demo-session';
      const DEMO_USER = {
        id: 'cb81a12d-9c0b-47bd-b0fd-32516f3d95d4',
        name: 'Maria Oliveira',
        email: 'maria@example.com',
        role: 'DEMO_USER',
        authProvider: 'DEMO',
        isDemoUser: true,
      };

      const DEMO_SESSION = {
        accessToken: 'orbitguard_demo_token_20260607',
        expiresAt: '2026-06-08T14:00:00.000Z',
        permissions: {
          canManageAreas: true,
          canViewPrivateAreas: false,
          canAcknowledgeAlerts: true,
        },
      };

      const hero = document.querySelector('.hero');
      const loginView = document.getElementById('login-view');
      const appView = document.getElementById('app-view');
      const loginForm = document.getElementById('login-form');
      const loginError = document.getElementById('login-error');
      const successBanner = document.getElementById('success-banner');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const demoFillButton = document.getElementById('demo-fill');
      const logoutButton = document.getElementById('logout-button');
      const currentUser = document.getElementById('current-user');
      const currentPermissions = document.getElementById('current-permissions');
      const currentToken = document.getElementById('current-token');
      const currentExpiry = document.getElementById('current-expiry');
      const permissionDeniedCard = document.getElementById('permission-denied-card');
      const permissionDeniedMessage = document.getElementById('permission-denied-message');
      const permissionDeniedChip = document.getElementById('permission-denied-chip');
      const privateAreaToggle = document.getElementById('private-area-toggle');
      const areaForm = document.getElementById('area-form');
      const areaNameInput = document.getElementById('area-name');
      const areaTypeInput = document.getElementById('area-type');
      const areaLatitudeInput = document.getElementById('area-latitude');
      const areaLongitudeInput = document.getElementById('area-longitude');
      const areaRadiusInput = document.getElementById('area-radius');
      const areaStatus = document.getElementById('area-status');
      const areaSuccess = document.getElementById('area-success');
      const areaInvalidSummary = document.getElementById('area-invalid-summary');
      const areaFormError = document.getElementById('area-form-error');
      const areaEmptyState = document.getElementById('area-empty-state');
      const areaSummaryGrid = document.getElementById('area-summary-grid');
      const mapStatus = document.getElementById('map-status');
      const mapEmpty = document.getElementById('map-empty');
      const mapLoadingState = document.getElementById('map-loading-state');
      const mapLoadingTitle = document.getElementById('map-loading-title');
      const mapLoadingDetail = document.getElementById('map-loading-detail');
      const mapSurface = document.getElementById('map-surface');
      const mapCenterLabel = document.getElementById('map-center-label');
      const mapContextText = document.getElementById('map-context-text');
      const mapLegend = document.getElementById('map-legend');
      const mapFireSummary = document.getElementById('map-fire-summary');
      const mapFireMarkers = document.getElementById('map-fire-markers');
      const mapFallbackBanner = document.getElementById('map-fallback-banner');
      const mapFallbackTitle = document.getElementById('map-fallback-title');
      const mapFallbackText = document.getElementById('map-fallback-text');
      const mapFallbackSource = document.getElementById('map-fallback-source');
      const mapFallbackMode = document.getElementById('map-fallback-mode');
      const riskStatus = document.getElementById('risk-status');
      const riskEmptyState = document.getElementById('risk-empty-state');
      const riskFallbackBanner = document.getElementById('risk-fallback-banner');
      const riskFallbackTitle = document.getElementById('risk-fallback-title');
      const riskFallbackText = document.getElementById('risk-fallback-text');
      const riskFallbackSource = document.getElementById('risk-fallback-source');
      const riskFallbackMode = document.getElementById('risk-fallback-mode');
      const riskLoadingState = document.getElementById('risk-loading-state');
      const riskLoadingTitle = document.getElementById('risk-loading-title');
      const riskLoadingDetail = document.getElementById('risk-loading-detail');
      const riskResult = document.getElementById('risk-result');
      const riskScoreValue = document.getElementById('risk-score-value');
      const riskLevelPill = document.getElementById('risk-level-pill');
      const riskSeverity = document.getElementById('risk-severity');
      const riskScoreSummary = document.getElementById('risk-score-summary');
      const riskScoreBrief = document.getElementById('risk-score-brief');
      const riskFactorList = document.getElementById('risk-factor-list');
      const alertStatusChip = document.getElementById('alert-status-chip');
      const alertEmptyState = document.getElementById('alert-empty-state');
      const alertPanel = document.getElementById('alert-panel');
      const alertTitle = document.getElementById('alert-title');
      const alertSummary = document.getElementById('alert-summary');
      const alertStatus = document.getElementById('alert-status');
      const alertChannel = document.getElementById('alert-channel');
      const alertLevel = document.getElementById('alert-level');
      const alertSeverity = document.getElementById('alert-severity');
      const alertMessage = document.getElementById('alert-message');
      const alertCauses = document.getElementById('alert-causes');
      const alertActions = document.getElementById('alert-actions');
      const dashboardStatusChip = document.getElementById('dashboard-status-chip');
      const dashboardEmptyState = document.getElementById('dashboard-empty-state');
      const dashboardPanel = document.getElementById('dashboard-panel');
      const dashboardAreasCount = document.getElementById('dashboard-areas-count');
      const dashboardAlertsCount = document.getElementById('dashboard-alerts-count');
      const dashboardAverageScore = document.getElementById('dashboard-average-score');
      const dashboardFireCount = document.getElementById('dashboard-fire-count');
      const dashboardRiskLevels = document.getElementById('dashboard-risk-levels');
      const dashboardPriorityList = document.getElementById('dashboard-priority-list');
      const dashboardExecutiveNote = document.getElementById('dashboard-executive-note');
      const notificationStatusChip = document.getElementById('notification-status-chip');
      const notificationEmptyState = document.getElementById('notification-empty-state');
      const notificationPanel = document.getElementById('notification-panel');
      const notificationTime = document.getElementById('notification-time');
      const notificationHeadline = document.getElementById('notification-headline');
      const notificationSubhead = document.getElementById('notification-subhead');
      const notificationBadge = document.getElementById('notification-badge');
      const notificationBody = document.getElementById('notification-body');
      const notificationActions = document.getElementById('notification-actions');
      const notificationContext = document.getElementById('notification-context');
      const riskLayout = document.getElementById('risk-layout');
      const riskFireSummary = document.getElementById('risk-fire-summary');
      const riskSourceChip = document.getElementById('risk-source-chip');
      const riskWeatherGrid = document.getElementById('risk-weather-grid');
      const riskSignalList = document.getElementById('risk-signal-list');
      const riskNarrative = document.getElementById('risk-narrative');
      const riskFireCount = document.getElementById('risk-fire-count');
      const riskFireDistance = document.getElementById('risk-fire-distance');
      const workspaceTabs = Array.from(document.querySelectorAll('[data-workspace-step]'));
      const workspaceActiveLabel = document.getElementById('workspace-active-label');
      const workspaceFooterStatus = document.getElementById('workspace-footer-status');
      const workspacePrevButton = document.getElementById('workspace-prev');
      const workspaceNextButton = document.getElementById('workspace-next');
      const areaResetButton = document.getElementById('area-reset');
      const summaryName = document.getElementById('summary-name');
      const summaryType = document.getElementById('summary-type');
      const summaryCenter = document.getElementById('summary-center');
      const summaryRadius = document.getElementById('summary-radius');
      const areaNameError = document.getElementById('area-name-error');
      const areaTypeError = document.getElementById('area-type-error');
      const areaLatitudeError = document.getElementById('area-latitude-error');
      const areaLongitudeError = document.getElementById('area-longitude-error');
      const areaRadiusError = document.getElementById('area-radius-error');
      const fallbackToggle = document.getElementById('fallback-toggle');

      const AREA_STORAGE_KEY = 'orbitguard-fire-demo-area';
      const DATA_SOURCE_STORAGE_KEY = 'orbitguard-fire-demo-source-mode';
      const AREA_TYPES = new Set([
        'RURAL_PROPERTY',
        'RURAL_COMMUNITY',
        'SCHOOL',
        'CONSERVATION_AREA',
        'INDIGENOUS_TERRITORY',
      ]);
      const DATA_SOURCE_MODES = {
        LIVE: 'LIVE',
        FALLBACK: 'FALLBACK',
      };
      const WORKSPACE_STEPS = ['A', 'B', 'C'];
      const AREA_FORM_FIELDS = {
        name: {
          input: areaNameInput,
          error: areaNameError,
        },
        type: {
          input: areaTypeInput,
          error: areaTypeError,
        },
        latitude: {
          input: areaLatitudeInput,
          error: areaLatitudeError,
        },
        longitude: {
          input: areaLongitudeInput,
          error: areaLongitudeError,
        },
        radiusKm: {
          input: areaRadiusInput,
          error: areaRadiusError,
        },
      };
      const MAP_LOADING_DELAY_MS = 520;
      const RISK_LOADING_DELAY_MS = 640;
      let mapLoadingTimer = null;
      let riskLoadingTimer = null;
      let dataSourceMode = loadDataSourceMode();
      let isPrivateAreaDenied = false;

      function getWorkspaceStepIndex(step) {
        return WORKSPACE_STEPS.indexOf(step);
      }

      function setWorkspaceStep(step) {
        appView.dataset.activeStep = step;

        workspaceTabs.forEach((tab) => {
          const isActive = tab.dataset.workspaceStep === step;
          tab.classList.toggle('is-active', isActive);
          tab.setAttribute('aria-pressed', String(isActive));
        });

        if (workspaceActiveLabel) {
          const labels = {
            A: 'Sessão A ativa',
            B: 'Sessão B ativa',
            C: 'Sessão C ativa',
          };
          workspaceActiveLabel.textContent = labels[step] || 'Sessão A ativa';
        }

        if (workspaceFooterStatus) {
          const stepIndex = getWorkspaceStepIndex(step);
          const visibleStep = stepIndex >= 0 ? stepIndex + 1 : 1;
          workspaceFooterStatus.textContent = `Sessão ${visibleStep} de 3 ativa.`;
        }

        if (workspacePrevButton) {
          workspacePrevButton.disabled = step === 'A';
        }

        if (workspaceNextButton) {
          workspaceNextButton.disabled = step === 'C';
        }
      }

      function clearDemoFlowTimers() {
        if (mapLoadingTimer !== null) {
          window.clearTimeout(mapLoadingTimer);
          mapLoadingTimer = null;
        }

        if (riskLoadingTimer !== null) {
          window.clearTimeout(riskLoadingTimer);
          riskLoadingTimer = null;
        }
      }

      function loadDataSourceMode() {
        const raw = sessionStorage.getItem(DATA_SOURCE_STORAGE_KEY);
        if (raw === DATA_SOURCE_MODES.FALLBACK) {
          return DATA_SOURCE_MODES.FALLBACK;
        }

        return DATA_SOURCE_MODES.LIVE;
      }

      function saveDataSourceMode(mode) {
        sessionStorage.setItem(DATA_SOURCE_STORAGE_KEY, mode);
      }

      function getDataSourceState() {
        const isFallback = dataSourceMode === DATA_SOURCE_MODES.FALLBACK;

        return {
          isFallback,
          modeLabel: isFallback ? 'FALLBACK ATIVO' : 'CONSULTA PREPARADA',
          sourceLabel: isFallback ? 'FALHA EXTERNA -> MOCK' : 'MOCK CONTROLADO',
          bannerTitle: isFallback
            ? 'Falha externa simulada nas fontes de dados'
            : 'Fontes externas prontas para consulta',
          bannerText: isFallback
            ? 'NASA FIRMS e NASA POWER foram marcadas como indisponiveis. O fluxo segue com fallback local e cenarios mockados coerentes.'
            : 'O prototipo segue com cenarios mockados controlados, pronto para substituir a origem externa sem quebrar o fluxo.',
        };
      }

      function renderDataSourceFallbackState() {
        const sourceState = getDataSourceState();
        const hidden = !sourceState.isFallback;

        mapFallbackBanner.hidden = hidden;
        riskFallbackBanner.hidden = hidden;
        fallbackToggle.textContent = sourceState.isFallback
          ? 'Restaurar fontes preparadas'
          : 'Simular falha externa';

        if (sourceState.isFallback) {
          mapFallbackTitle.textContent = sourceState.bannerTitle;
          mapFallbackText.textContent = sourceState.bannerText;
          mapFallbackSource.textContent = sourceState.sourceLabel;
          mapFallbackMode.textContent = sourceState.modeLabel;
          riskFallbackTitle.textContent = sourceState.bannerTitle;
          riskFallbackText.textContent = sourceState.bannerText;
          riskFallbackSource.textContent = sourceState.sourceLabel;
          riskFallbackMode.textContent = sourceState.modeLabel;
        }

        return sourceState;
      }

      function showMapLoadingState(area) {
        mapStatus.textContent = `Consultando mapa de ${area.name}`;
        mapEmpty.hidden = true;
        mapSurface.hidden = true;
        mapLoadingState.hidden = false;
        mapLoadingTitle.textContent = `Buscando focos de calor em torno de ${area.name}.`;
        mapLoadingDetail.textContent =
          `O mapa demonstrativo esta preparando o centro, o raio de ${area.radiusKm} km e a vizinhanca operacional.`;
      }

      function showRiskLoadingState(area) {
        riskStatus.textContent = `Calculando risco de ${area.name}`;
        riskEmptyState.hidden = true;
        riskResult.hidden = true;
        riskLayout.hidden = true;
        riskLoadingState.hidden = false;
        riskLoadingTitle.textContent = `Consolidando focos, clima e score para ${area.name}.`;
        riskLoadingDetail.textContent =
          'O sistema esta calculando a severidade, o alerta e o resumo executivo do cenÃ¡rio.';
      }

      function showMapLoadingState(area) {
        const sourceState = getDataSourceState();
        mapStatus.textContent = sourceState.isFallback
          ? `Consultando mapa de ${area.name} com fallback local`
          : `Consultando mapa de ${area.name}`;
        mapEmpty.hidden = true;
        mapSurface.hidden = true;
        mapLoadingState.hidden = false;
        mapLoadingTitle.textContent = sourceState.isFallback
          ? `Fonte externa indisponivel. Usando fallback local para ${area.name}.`
          : `Buscando focos de calor em torno de ${area.name}.`;
        mapLoadingDetail.textContent = sourceState.isFallback
          ? `A visualizacao segue operacional com dados mockados do cenario correspondente, sem interromper o mapa de ${area.radiusKm} km.`
          : `O mapa demonstrativo esta preparando o centro, o raio de ${area.radiusKm} km e a vizinhanca operacional.`;
      }

      function showRiskLoadingState(area) {
        const sourceState = getDataSourceState();
        riskStatus.textContent = sourceState.isFallback
          ? `Calculando risco de ${area.name} com fallback local`
          : `Calculando risco de ${area.name}`;
        riskEmptyState.hidden = true;
        riskResult.hidden = true;
        riskLayout.hidden = true;
        riskLoadingState.hidden = false;
        riskLoadingTitle.textContent = sourceState.isFallback
          ? `Fonte externa indisponivel. Consolidando fallback para ${area.name}.`
          : `Consolidando focos, clima e score para ${area.name}.`;
        riskLoadingDetail.textContent = sourceState.isFallback
          ? 'O sistema esta finalizando o cenario mockado correspondente para manter score, alerta e dashboard consistentes.'
          : 'O sistema esta calculando a severidade, o alerta e o resumo executivo do cenÃ¡rio.';
      }

      function hideLoadingStates() {
        mapLoadingState.hidden = true;
        riskLoadingState.hidden = true;
      }

      function resolveDemoScenario(area) {
        const radiusKm = Number(area.radiusKm);

        if (radiusKm >= 9) {
          return 'CRITICAL';
        }

        if (radiusKm >= 5) {
          return 'MODERATE';
        }

        return 'LOW';
      }

      const MAP_LEGEND_ITEMS = [
        {
          key: 'center',
          label: 'Centro da area',
          description: 'Ponto de referencia espacial usado para o monitoramento.',
        },
        {
          key: 'monitored',
          label: 'Raio monitorado',
          description: 'Area principal usada para leitura e protecao imediata.',
        },
        {
          key: 'operational',
          label: 'Vizinhanca operacional',
          description: 'Faixa de ate +5 km usada para alerta preventivo.',
        },
        {
          key: 'inside',
          label: 'Foco dentro do raio',
          description: 'Ocorrencia diretamente sobre a area monitorada.',
        },
        {
          key: 'nearby',
          label: 'Foco proximo',
          description: 'Ocorrencia dentro da faixa operacional expandida.',
        },
      ];

      function formatPermissions(permissions) {
        return [
          permissions.canManageAreas ? 'gerenciar areas' : 'sem gestao de areas',
          permissions.canViewPrivateAreas ? 'ver areas privadas' : 'sem areas privadas',
          permissions.canAcknowledgeAlerts ? 'confirmar alertas' : 'sem confirmacao de alertas',
        ].join(' | ');
      }

      function roundKm(value) {
        return Number(value.toFixed(1));
      }

      function classifyRiskScore(score) {
        if (score <= 30) {
          return { level: 'LOW', severity: 'INFO' };
        }

        if (score <= 60) {
          return { level: 'MODERATE', severity: 'ATTENTION' };
        }

        if (score <= 85) {
          return { level: 'HIGH', severity: 'WARNING' };
        }

        return { level: 'CRITICAL', severity: 'DANGER' };
      }

      function buildRiskSummary(areaName, factors, level) {
        const factorLabels = factors.slice(0, 2).map((factor) => factor.label.toLowerCase());
        const detail = factorLabels.length ? ` com ${factorLabels.join(' e ')}` : '';
        return `${areaName} apresenta risco ${level.toLowerCase()} nas ultimas 24 horas${detail}.`;
      }

      function buildAlertFromAnalysis(area, analysis, weather) {
        if (!analysis.alertTriggered) {
          return {
            hasAlert: false,
            status: 'ACKNOWLEDGED',
            channel: 'IN_APP',
            level: analysis.level,
            severity: analysis.severity,
            title: `Sem alerta ativo para ${area.name}`,
            summary: 'O risco atual ainda nao exige alerta preventivo ativo.',
            message: 'O score permanece abaixo do gatilho de alerta preventivo.',
            causes: [
              'Nenhum alerta preventivo foi disparado para o cenÃ¡rio demonstrativo.',
            ],
            actions: [
              'Continue acompanhando a area monitorada.',
              'Revise o mapa e o score se houver mudanca no clima ou novos focos.',
            ],
          };
        }

        const causeMap = {
          NEAR_FIRE_CRITICAL: 'Ao menos um foco ficou a ate 5 km da area monitorada.',
          NEAR_FIRE_WARNING: 'Focos relevantes apareceram entre 5 km e 10 km da area monitorada.',
          FIRE_CLUSTER: 'Foram detectados 3 ou mais focos relevantes na janela de 24h.',
          HIGH_TEMP: 'A temperatura observada ultrapassou 32 C.',
          LOW_HUMIDITY: 'A umidade relativa ficou abaixo de 30%.',
          LOW_RAIN: 'A precipitacao observada ficou abaixo de 1 mm.',
          STRONG_WIND: 'A velocidade do vento ultrapassou 8 m/s.',
        };

        const causeLabels = analysis.factors.map((factor) => causeMap[factor.code] || factor.reason);
        const actions = [];

        if (analysis.level === 'CRITICAL') {
          actions.push('Acione a vigilancia local imediatamente.');
          actions.push('Reduza atividades de risco e remova fontes de ignicao proximas.');
          actions.push('Monitore focos e clima com reavaliacao nas proximas horas.');
        } else {
          actions.push('Mantenha monitoramento reforcado da area.');
          actions.push('Revise a situacao se novos focos surgirem ou o clima piorar.');
        }

        return {
          hasAlert: true,
          status: 'ACTIVE',
          channel: 'IN_APP',
          level: analysis.level,
          severity: analysis.severity,
          title:
            analysis.level === 'CRITICAL'
              ? `Risco critico de queimada em ${area.name}`
              : `Risco alto de queimada em ${area.name}`,
          summary: analysis.summary,
          message: analysis.summary,
          causes: causeLabels,
          actions,
        };
      }

      function buildDashboardSummary(area, analysis, fireEvents) {
        const levelCounts = {
          LOW: 0,
          MODERATE: 0,
          HIGH: 0,
          CRITICAL: 0,
        };

        levelCounts[analysis.level] = 1;

        return {
          generatedAt: new Date(),
          monitoredAreasCount: 1,
          activeAlertsCount: analysis.alertTriggered ? 1 : 0,
          averageRiskScore: analysis.score,
          recentFireEventsCount: fireEvents.length,
          areasByRiskLevel: levelCounts,
          priorityAreas: analysis.alertTriggered
            ? [
                {
                  monitoredAreaId: area.id,
                  areaName: area.name,
                  level: analysis.level,
                  score: analysis.score,
                  activeAlertCount: 1,
                  recentFireEvents: fireEvents.length,
                },
              ]
            : [],
          hasActiveAlerts: analysis.alertTriggered,
        };
      }

      function renderDashboard(area, analysis, fireEvents) {
        const dashboard = buildDashboardSummary(area, analysis, fireEvents);

        dashboardStatusChip.textContent = dashboard.hasActiveAlerts
          ? 'Dashboard com alerta ativo'
          : `Dashboard sem alertas ativos em ${area.name}`;
        dashboardEmptyState.hidden = dashboard.hasActiveAlerts;
        dashboardEmptyState.textContent = dashboard.hasActiveAlerts
          ? 'A visao consolidada esta populada com areas prioritarias, score medio e alertas ativos.'
          : `Nao ha alertas ativos para ${area.name} neste momento. O dashboard permanece util para acompanhar a area monitorada e o historico recente.`;
        dashboardPanel.hidden = false;
        dashboardAreasCount.textContent = String(dashboard.monitoredAreasCount);
        dashboardAlertsCount.textContent = String(dashboard.activeAlertsCount);
        dashboardAverageScore.textContent = String(dashboard.averageRiskScore);
        dashboardFireCount.textContent = String(dashboard.recentFireEventsCount);
        dashboardRiskLevels.innerHTML = Object.entries(dashboard.areasByRiskLevel)
          .map(([level, count]) => {
            return `
              <span class="source-chip">${level}: ${count}</span>
            `;
          })
          .join('');

        if (dashboard.priorityAreas.length === 0) {
          dashboardPriorityList.innerHTML = `
            <div class="priority-item">
              <div>
                <strong>Nenhuma area prioritaria no momento</strong>
                <span>O estado vazio confirma que o dashboard permanece util mesmo sem alerta ativo.</span>
              </div>
            </div>
          `;
        } else {
          dashboardPriorityList.innerHTML = dashboard.priorityAreas
            .map((item) => {
              return `
                <div class="priority-item">
                  <div>
                    <strong>${item.areaName}</strong>
                    <span>${item.recentFireEvents} focos recentes | ${item.activeAlertCount} alerta ativo | nivel ${item.level}</span>
                  </div>
                  <div class="priority-score">${item.score}/100</div>
                </div>
              `;
            })
            .join('');
        }

        dashboardExecutiveNote.textContent = dashboard.hasActiveAlerts
          ? `A area ${area.name} concentra o maior risco demonstrativo e deve ser acompanhada com prioridade operacional.`
          : `A area ${area.name} permanece em leitura controlada; o dashboard mostra um estado vazio sem alertas ativos.`;

        return dashboard;
      }

      function buildNotificationPreview(area, analysis, alert) {
        const isActive = alert.hasAlert;
        const timeLabel = new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date());

        return {
          isActive,
          timeLabel,
          headline: alert.title,
          subhead: `${alert.channel} | ${alert.severity}`,
          badge: alert.level,
          body: isActive
            ? `Area ${area.name}: ${alert.summary}`
            : `Area ${area.name}: nenhuma notificacao ativa neste momento.`,
          actions: isActive
            ? analysis.level === 'CRITICAL'
              ? ['Ver mapa', 'Reforcar vigilancia']
              : ['Abrir alerta', 'Acompanhar area']
            : ['Atualizar status'],
          context: isActive
            ? 'Preview mobile alinhado ao alerta preventivo gerado pelo score.'
            : 'Preview inativo porque o score ainda nao exigiu notificacao.',
        };
      }

      function renderNotification(area, analysis, alert) {
        const notification = buildNotificationPreview(area, analysis, alert);

        notificationStatusChip.textContent = notification.isActive
          ? 'Notificacao ativa'
          : 'Sem notificacao ativa';
        notificationEmptyState.hidden = notification.isActive;
        notificationPanel.hidden = !notification.isActive;
        notificationTime.textContent = notification.timeLabel;
        notificationHeadline.textContent = notification.headline;
        notificationSubhead.textContent = notification.subhead;
        notificationBadge.textContent = notification.badge;
        notificationBody.textContent = notification.body;
        notificationContext.textContent = notification.context;
        notificationActions.innerHTML = notification.actions
          .map((action) => `<span class="alert-chip">${action}</span>`)
          .join('');

        return notification;
      }

      function renderAlertDetail(area, analysis, weather) {
        const alert = buildAlertFromAnalysis(area, analysis, weather);

        if (!alert.hasAlert) {
          alertStatusChip.textContent = `Sem alerta ativo em ${area.name}`;
          alertEmptyState.textContent = `A area ${area.name} ainda nao gerou um alerta ativo. Quando o score atingir um nivel alto ou critico, o detalhe exibira causas, resumo e recomendacoes praticas.`;
          alertEmptyState.hidden = false;
          alertPanel.hidden = true;
          return alert;
        }

        alertStatusChip.textContent = `Alerta ${alert.level.toLowerCase()} ativo`;
        alertEmptyState.hidden = true;
        alertPanel.hidden = false;
        alertTitle.textContent = alert.title;
        alertSummary.textContent = alert.summary;
        alertStatus.textContent = alert.status;
        alertChannel.textContent = alert.channel;
        alertLevel.textContent = alert.level;
        alertSeverity.textContent = alert.severity;
        alertMessage.textContent = alert.message;
        alertCauses.innerHTML = alert.causes
          .map((cause) => {
            return `
              <div class="alert-list-item">
                <span class="legend-swatch inside" aria-hidden="true"></span>
                <div>
                  <strong>Causa identificada</strong>
                  <span>${cause}</span>
                </div>
              </div>
            `;
          })
          .join('');
        alertActions.innerHTML = alert.actions
          .map((action) => {
            return `
              <div class="alert-list-item">
                <span class="legend-swatch nearby" aria-hidden="true"></span>
                <div>
                  <strong>Acao recomendada</strong>
                  <span>${action}</span>
                </div>
              </div>
            `;
          })
          .join('');

        return alert;
      }

      function calculateRiskScore(area, fireEvents, weather) {
        const relevantItems = fireEvents.filter((fire) => fire.relevance !== 'OUTSIDE');
        const nearestDistance = relevantItems.length
          ? Math.min(...relevantItems.map((fire) => fire.distanceKm))
          : Number.POSITIVE_INFINITY;
        const factors = [];
        let score = 0;

        if (nearestDistance <= 5) {
          score += 25;
          factors.push({
            code: 'NEAR_FIRE_CRITICAL',
            label: 'Foco criticamente proximo',
            points: 25,
            reason: 'Ao menos um foco foi detectado a ate 5 km da area monitorada.',
          });
        } else if (nearestDistance <= 10) {
          score += 15;
          factors.push({
            code: 'NEAR_FIRE_WARNING',
            label: 'Foco proximo',
            points: 15,
            reason: 'Foi detectado foco relevante entre 5 km e 10 km da area monitorada.',
          });
        }

        if (relevantItems.length >= 3) {
          score += 20;
          factors.push({
            code: 'FIRE_CLUSTER',
            label: 'Concentracao recente de focos',
            points: 20,
            reason: 'Tres ou mais focos relevantes foram detectados na janela analisada.',
          });
        }

        if (weather.temperatureC > 32) {
          score += 15;
          factors.push({
            code: 'HIGH_TEMP',
            label: 'Temperatura elevada',
            points: 15,
            reason: 'A temperatura observada ultrapassou 32 C.',
          });
        }

        if (weather.humidityPercent < 30) {
          score += 20;
          factors.push({
            code: 'LOW_HUMIDITY',
            label: 'Baixa umidade',
            points: 20,
            reason: 'A umidade relativa ficou abaixo de 30%.',
          });
        }

        if (weather.precipitationMm < 1) {
          score += 15;
          factors.push({
            code: 'LOW_RAIN',
            label: 'Ausencia de chuva',
            points: 15,
            reason: 'A precipitacao observada foi menor que 1 mm.',
          });
        }

        if (weather.windSpeedMs > 8) {
          score += 10;
          factors.push({
            code: 'STRONG_WIND',
            label: 'Vento forte',
            points: 10,
            reason: 'A velocidade do vento ficou acima de 8 m/s.',
          });
        }

        score = Math.min(score, 100);
        const classification = classifyRiskScore(score);
        const summary = buildRiskSummary(area.name, factors, classification.level);

        return {
          score,
          level: classification.level,
          severity: classification.severity,
          summary,
          factors,
          nearestDistance,
          relevantCount: relevantItems.length,
          alertTriggered: classification.level === 'HIGH' || classification.level === 'CRITICAL',
        };
      }

      function createDemoFireEvents(area) {
        const scenario = resolveDemoScenario(area);
        const radiusKm = Number(area.radiusKm);
        const operationalRadiusKm = radiusKm + 5;

        if (scenario === 'LOW') {
          return [];
        }

        if (scenario === 'MODERATE') {
          return [
            {
              id: 'mock-fire-001',
              label: 'Foco 1',
              relevance: 'NEARBY',
              distanceKm: roundKm(Math.min(operationalRadiusKm - 1.2, radiusKm + 1.8)),
              angle: 148,
            },
            {
              id: 'mock-fire-002',
              label: 'Foco 2',
              relevance: 'NEARBY',
              distanceKm: roundKm(Math.min(operationalRadiusKm - 0.4, radiusKm + 3.6)),
              angle: 224,
            },
          ];
        }

        const insidePrimary = Math.min(
          Math.max(radiusKm * 0.35, Math.min(0.05, radiusKm * 0.5)),
          radiusKm * 0.9,
        );
        const insideSecondary = Math.min(
          Math.max(radiusKm * 0.62, Math.min(0.08, radiusKm * 0.75)),
          radiusKm * 0.95,
        );
        const nearbyPrimary = Math.min(
          operationalRadiusKm - 1.6,
          radiusKm + Math.max(1.2, Math.min(2.4, radiusKm * 0.18)),
        );
        const nearbySecondary = Math.min(
          operationalRadiusKm - 0.4,
          radiusKm + Math.max(3, Math.min(4.2, radiusKm * 0.32)),
        );

        return [
          {
            id: 'mock-fire-001',
            label: 'Foco 1',
            relevance: 'INSIDE',
            distanceKm: roundKm(insidePrimary),
            angle: 318,
          },
          {
            id: 'mock-fire-002',
            label: 'Foco 2',
            relevance: 'INSIDE',
            distanceKm: roundKm(insideSecondary),
            angle: 38,
          },
          {
            id: 'mock-fire-003',
            label: 'Foco 3',
            relevance: 'NEARBY',
            distanceKm: roundKm(nearbyPrimary),
            angle: 146,
          },
          {
            id: 'mock-fire-004',
            label: 'Foco 4',
            relevance: 'NEARBY',
            distanceKm: roundKm(nearbySecondary),
            angle: 220,
          },
        ];
      }

      function createDemoWeatherSnapshot(area) {
        const scenario = resolveDemoScenario(area);
        const now = new Date();

        if (scenario === 'CRITICAL') {
          return {
            observedAt: now,
            temperatureC: 33.2,
            precipitationMm: 0,
            humidityPercent: 28,
            windSpeedMs: 4.1,
            sourceLabel: 'mock-scenario-critical',
          };
        }

        if (scenario === 'MODERATE') {
          return {
            observedAt: now,
            temperatureC: 32.6,
            precipitationMm: 0.4,
            humidityPercent: 38,
            windSpeedMs: 5.3,
            sourceLabel: 'mock-scenario-moderate',
          };
        }

        return {
          observedAt: now,
          temperatureC: 27.6,
          precipitationMm: 4.8,
          humidityPercent: 61,
          windSpeedMs: 2.7,
          sourceLabel: 'mock-scenario-low',
        };
      }

      function renderLegend() {
        mapLegend.innerHTML = MAP_LEGEND_ITEMS.map((item) => {
          return `
            <div class="legend-item">
              <span class="legend-swatch ${item.key}" aria-hidden="true"></span>
              <div>
                <strong>${item.label}</strong>
                <span>${item.description}</span>
              </div>
            </div>
          `;
        }).join('');
      }

      function renderFireSummary(fireEvents) {
        if (fireEvents.length === 0) {
          mapFireSummary.innerHTML = `
            <div class="fire-item">
              <span class="legend-swatch nearby" aria-hidden="true"></span>
              <div>
                <strong>Nenhum foco relevante encontrado</strong>
                <span>O fluxo demonstrativo continua valido e segue para a leitura do clima.</span>
              </div>
            </div>
          `;
          return;
        }

        mapFireSummary.innerHTML = fireEvents
          .map((fire) => {
            const tag = fire.relevance === 'INSIDE' ? 'Dentro do raio' : 'Proximo ao raio';
            return `
              <div class="fire-item">
                <span class="legend-swatch ${fire.relevance === 'INSIDE' ? 'inside' : 'nearby'}" aria-hidden="true"></span>
                <div>
                  <strong>${fire.label} ${tag}</strong>
                  <span>${fire.distanceKm} km do centro | ${fire.relevance === 'INSIDE' ? 'destaque primario' : 'destaque secundario'}</span>
                </div>
              </div>
            `;
          })
          .join('');
      }

      function renderRiskFireSummary(fireEvents, operationalRadiusKm) {
        if (fireEvents.length === 0) {
          riskFireSummary.innerHTML = `
            <div class="signal-item">
              <span class="legend-swatch nearby" aria-hidden="true"></span>
              <div>
                <strong>Nenhum foco relevante encontrado</strong>
                <span>O fluxo demonstrativo permanece funcional e usa o estado vazio do cenÃ¡rio baixo.</span>
              </div>
            </div>
          `;
          riskFireCount.textContent = '0 focos relevantes';
          riskFireDistance.textContent = 'Sem distancia calculada';
          return;
        }

        const nearestDistance = Math.min(...fireEvents.map((fire) => fire.distanceKm));
        riskFireCount.textContent = `${fireEvents.length} focos relevantes`;
        riskFireDistance.textContent = `Mais proximo: ${nearestDistance.toFixed(1)} km`;
        riskFireSummary.innerHTML = fireEvents
          .map((fire) => {
            const tag = fire.relevance === 'INSIDE' ? 'Dentro do raio' : 'Faixa operacional';
            const distanceLabel =
              fire.distanceKm <= operationalRadiusKm
                ? `${fire.distanceKm.toFixed(1)} km do centro`
                : `${fire.distanceKm.toFixed(1)} km fora do raio`;

            return `
              <div class="signal-item">
                <span class="legend-swatch ${fire.relevance === 'INSIDE' ? 'inside' : 'nearby'}" aria-hidden="true"></span>
                <div>
                  <strong>${fire.label} - ${tag}</strong>
                  <span>${distanceLabel} | intensidade ${fire.relevance === 'INSIDE' ? 'alta' : 'moderada'}</span>
                </div>
              </div>
            `;
          })
          .join('');
      }

      function renderRiskWeather(weather) {
        riskWeatherGrid.innerHTML = `
          <div class="weather-tile">
            <div class="label">Temperatura</div>
            <div class="value">${weather.temperatureC.toFixed(1)} C</div>
          </div>
          <div class="weather-tile">
            <div class="label">Umidade</div>
            <div class="value">${weather.humidityPercent}%</div>
          </div>
          <div class="weather-tile">
            <div class="label">Chuva</div>
            <div class="value">${weather.precipitationMm.toFixed(1)} mm</div>
          </div>
          <div class="weather-tile">
            <div class="label">Vento</div>
            <div class="value">${weather.windSpeedMs.toFixed(1)} m/s</div>
          </div>
          <div class="weather-tile">
            <div class="label">Fonte</div>
            <div class="value">${weather.sourceLabel}</div>
          </div>
          <div class="weather-tile">
            <div class="label">Observacao</div>
            <div class="value">${new Date(weather.observedAt).toLocaleString('pt-BR')}</div>
          </div>
        `;
      }

      function renderRiskResult(area, fireEvents, weather) {
        const analysis = calculateRiskScore(area, fireEvents, weather);

        riskResult.hidden = false;
        riskResult.dataset.level = analysis.level;
        riskScoreValue.textContent = String(analysis.score);
        riskLevelPill.textContent = analysis.level;
        riskLevelPill.className = `risk-level-pill ${analysis.level.toLowerCase()}`;
        riskSeverity.textContent = `Severidade: ${analysis.severity}`;
        riskScoreSummary.textContent = analysis.summary;
        riskScoreBrief.textContent = analysis.alertTriggered
          ? 'O cenÃ¡rio ultrapassa o limiar de alerta preventivo e precisa de leitura imediata.'
          : 'O cenÃ¡rio permanece abaixo do gatilho de alerta preventivo, mas continua explicito no score.';

        if (analysis.factors.length === 0) {
          riskFactorList.innerHTML = `
            <div class="risk-factor-item">
              <div class="meta">Sem fatores de risco</div>
              <strong>Score em faixa controlada</strong>
              <span>O cenÃ¡rio de demonstraÃ§Ã£o nao encontrou sinais relevantes para elevar a pontuacao.</span>
            </div>
          `;
        } else {
          riskFactorList.innerHTML = analysis.factors
            .map((factor) => {
              return `
                <div class="risk-factor-item">
                  <div class="meta">${factor.code} | +${factor.points} pontos</div>
                  <strong>${factor.label}</strong>
                  <span>${factor.reason}</span>
                </div>
              `;
            })
            .join('');
        }

        riskStatus.textContent = `Score calculado: ${analysis.score}/100`;
        riskNarrative.textContent = analysis.summary;
        return analysis;
      }

      function renderRiskSignals(fireEvents, weather) {
        const relevantItems = fireEvents.filter((fire) => fire.relevance !== 'OUTSIDE');
        const nearestDistance = relevantItems.length
          ? Math.min(...relevantItems.map((fire) => fire.distanceKm))
          : Number.POSITIVE_INFINITY;
        const signals = [];

        if (nearestDistance <= 5) {
          signals.push({
            tone: 'danger',
            label: 'Foco criticamente proximo',
            detail: 'Um foco apareceu a ate 5 km da area monitorada.',
          });
        } else if (nearestDistance <= 10) {
          signals.push({
            tone: 'warning',
            label: 'Foco proximo',
            detail: 'Um foco foi registrado entre 5 km e 10 km da area monitorada.',
          });
        }

        if (relevantItems.length >= 3) {
          signals.push({
            tone: 'warning',
            label: 'Concentracao recente',
            detail: 'Tres ou mais focos relevantes entram na janela de 24h.',
          });
        }

        if (weather.temperatureC > 32) {
          signals.push({
            tone: 'danger',
            label: 'Temperatura elevada',
            detail: 'A temperatura observada passou do limiar de 32 C.',
          });
        }

        if (weather.humidityPercent < 30) {
          signals.push({
            tone: 'warning',
            label: 'Baixa umidade',
            detail: 'A umidade relativa ficou abaixo de 30%.',
          });
        }

        if (weather.precipitationMm < 1) {
          signals.push({
            tone: 'warning',
            label: 'Ausencia de chuva',
            detail: 'A precipitacao observada ficou abaixo de 1 mm.',
          });
        }

        if (weather.windSpeedMs > 8) {
          signals.push({
            tone: 'warning',
            label: 'Vento forte',
            detail: 'A velocidade do vento ultrapassou 8 m/s.',
          });
        }

        if (signals.length === 0) {
          signals.push({
            tone: 'info',
            label: 'Sem sinais extremos',
            detail: 'O cenÃ¡rio baixo mantÃ©m o score em faixa controlada.',
          });
        }

        riskSignalList.innerHTML = signals
          .map((signal) => {
            return `
              <div class="signal-item">
                <span class="legend-swatch ${signal.tone === 'danger' ? 'inside' : signal.tone === 'warning' ? 'nearby' : 'center'}" aria-hidden="true"></span>
                <div>
                  <strong>${signal.label}</strong>
                  <span>${signal.detail}</span>
                </div>
              </div>
            `;
          })
          .join('');
      }

      function renderRiskExperience(area) {
        const fireEvents = createDemoFireEvents(area);
        const weather = createDemoWeatherSnapshot(area);
        const operationalRadiusKm = Number(area.radiusKm) + 5;
        const analysis = renderRiskResult(area, fireEvents, weather);
        const alert = renderAlertDetail(area, analysis, weather);
        renderDashboard(area, analysis, fireEvents);
        renderNotification(area, analysis, alert);

        riskEmptyState.hidden = true;
        riskLayout.hidden = false;
        riskResult.hidden = false;
        renderRiskFireSummary(fireEvents, operationalRadiusKm);
        renderRiskWeather(weather);
        renderRiskSignals(fireEvents, weather);
        riskNarrative.textContent = analysis.summary;
      }

      function renderEmptyRiskExperience() {
        hideLoadingStates();
        riskStatus.textContent = 'Aguardando area cadastrada';
        riskEmptyState.hidden = false;
        riskResult.hidden = true;
        alertStatusChip.textContent = 'Sem alerta ativo';
        alertEmptyState.textContent =
          'A area cadastrada ainda nao gerou um alerta ativo. Quando o score atingir um nivel alto, o detalhe exibira causas, resumo e recomendacoes praticas.';
        alertEmptyState.hidden = false;
        alertPanel.hidden = true;
        alertTitle.textContent = 'Risco preventivo de queimada';
        alertSummary.textContent =
          'O detalhamento do alerta mostra por que o cenÃ¡rio foi classificado como critico.';
        alertStatus.textContent = 'ACTIVE';
        alertChannel.textContent = 'IN_APP';
        alertLevel.textContent = 'CRITICAL';
        alertSeverity.textContent = 'DANGER';
        alertMessage.textContent =
          'Focos proximos e clima seco elevam fortemente o risco nas ultimas 24 horas.';
        alertCauses.innerHTML = '';
        alertActions.innerHTML = '';
        dashboardStatusChip.textContent = 'Aguardando area cadastrada';
        dashboardEmptyState.hidden = false;
        dashboardEmptyState.textContent =
          'Cadastre uma area para visualizar as agregacoes do dashboard. O estado vazio mostra que o MVP permanece coerente mesmo sem alertas ativos.';
        dashboardPanel.hidden = true;
        dashboardAreasCount.textContent = '0';
        dashboardAlertsCount.textContent = '0';
        dashboardAverageScore.textContent = '0';
        dashboardFireCount.textContent = '0';
        dashboardRiskLevels.innerHTML = '';
        dashboardPriorityList.innerHTML = '';
        dashboardExecutiveNote.textContent =
          'O dashboard consolida o estado atual da area para apoio a decisao.';
        notificationStatusChip.textContent = 'Sem notificacao ativa';
        notificationEmptyState.hidden = false;
        notificationPanel.hidden = true;
        notificationTime.textContent = '--:--';
        notificationHeadline.textContent = 'Risco preventivo de queimada';
        notificationSubhead.textContent = 'IN_APP | DANGER';
        notificationBadge.textContent = 'CRITICAL';
        notificationBody.textContent =
          'Focos proximos e clima seco elevam fortemente o risco nas ultimas 24 horas.';
        notificationContext.textContent =
          'A notificacao segue o mesmo resumo do alerta preventivo e funciona como demonstracao visual, sem envio real.';
        notificationActions.innerHTML = '';
        riskResult.removeAttribute('data-level');
        riskScoreValue.textContent = '0';
        riskLevelPill.textContent = 'LOW';
        riskLevelPill.className = 'risk-level-pill low';
        riskSeverity.textContent = 'Severidade: INFO';
        riskScoreSummary.textContent =
          'O resultado calculado aparece aqui quando os focos e o clima sao avaliados em conjunto.';
        riskScoreBrief.textContent =
          'O score sintetiza os principais sinais do cenÃ¡rio e antecipa se o fluxo deve evoluir para alerta preventivo.';
        riskLayout.hidden = true;
        riskFireSummary.innerHTML = '';
        riskWeatherGrid.innerHTML = '';
        riskSignalList.innerHTML = '';
        riskFactorList.innerHTML = '';
        riskNarrative.textContent =
          'Cadastrar uma area libera os focos de calor e o snapshot climatico que alimentam o calculo de risco.';
        riskFireCount.textContent = '0 focos relevantes';
        riskFireDistance.textContent = 'Distancia indefinida';
      }

      function renderFireMarkers(fireEvents, operationalRadiusKm) {
        mapFireMarkers.innerHTML = fireEvents
          .map((fire) => {
            const ratio = Math.min(fire.distanceKm / operationalRadiusKm, 1);
            const offset = ratio * 36;
            const radians = (fire.angle * Math.PI) / 180;
            const x = 50 + Math.cos(radians) * offset;
            const y = 50 + Math.sin(radians) * offset;
            const relevanceLabel = fire.relevance === 'INSIDE' ? 'inside' : 'nearby';
            return `
              <div class="map-fire-marker" style="--x:${x.toFixed(2)}%; --y:${y.toFixed(2)}%;" aria-label="${fire.label}, ${fire.distanceKm} km do centro, ${relevanceLabel}">
                <span class="fire-pin ${relevanceLabel}" aria-hidden="true"></span>
                <div>
                  <strong>${fire.label}</strong>
                  <span>${fire.distanceKm} km | ${relevanceLabel}</span>
                </div>
              </div>
            `;
          })
          .join('');
      }

      function renderMap(area) {
        const operationalRadiusKm = Number(area.radiusKm) + 5;
        const fireEvents = createDemoFireEvents(area);
        const insideCount = fireEvents.filter((fire) => fire.relevance === 'INSIDE').length;
        const nearbyCount = fireEvents.length - insideCount;

        mapLoadingState.hidden = true;
        mapStatus.textContent = 'Mapa pronto para leitura operacional';
        mapEmpty.hidden = true;
        mapSurface.hidden = false;
        mapCenterLabel.textContent = area.name;
        mapContextText.textContent =
          `${area.name} em ${area.latitude.toFixed(6)}, ${area.longitude.toFixed(6)}. Raio monitorado de ${area.radiusKm} km com vizinhanca operacional de ${operationalRadiusKm} km.`;
        renderLegend();
        renderFireSummary(fireEvents);
        renderFireMarkers(fireEvents, operationalRadiusKm);
        areaStatus.textContent = `Area cadastrada e pronta para o mapa (${insideCount} dentro / ${nearbyCount} proximos)`;

        showRiskLoadingState(area);
        riskLoadingTimer = window.setTimeout(() => {
          riskLoadingTimer = null;
          renderRiskExperience(area);
        }, RISK_LOADING_DELAY_MS);
      }

      function startAreaFlow(area) {
        clearDemoFlowTimers();
        hideLoadingStates();
        renderEmptyRiskExperience();
        setWorkspaceStep('B');
        showMapLoadingState(area);
        showRiskLoadingState(area);
        mapLoadingTimer = window.setTimeout(() => {
          mapLoadingTimer = null;
          renderMap(area);
        }, MAP_LOADING_DELAY_MS);
      }

      function renderApp(session) {
        hero.classList.add('is-authenticated');
        loginView.style.display = 'none';
        appView.style.display = 'grid';
        setWorkspaceStep('A');
        successBanner.style.display = 'none';
        loginError.textContent = '';
        currentUser.textContent = `${session.user.name} (${session.user.email})`;
        currentPermissions.textContent = formatPermissions(session.permissions);
        currentToken.textContent = session.session.accessToken;
        currentExpiry.textContent = new Date(session.session.expiresAt).toLocaleString('pt-BR');
        renderPermissionDeniedState(loadArea());
        renderLegend();
        restoreArea();
      }

      function renderLogin() {
        hero.classList.remove('is-authenticated');
        loginView.style.display = 'block';
        appView.style.display = 'none';
        setWorkspaceStep('A');
        loginError.textContent = '';
        successBanner.style.display = 'none';
      }

      function saveSession(session) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      }

      function saveArea(area) {
        sessionStorage.setItem(AREA_STORAGE_KEY, JSON.stringify(area));
      }

      function loadSession() {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return null;
        }

        try {
          return JSON.parse(raw);
        } catch (error) {
          sessionStorage.removeItem(STORAGE_KEY);
          return null;
        }
      }

      function loadArea() {
        const raw = sessionStorage.getItem(AREA_STORAGE_KEY);
        if (!raw) {
          return null;
        }

        try {
          return JSON.parse(raw);
        } catch (error) {
          sessionStorage.removeItem(AREA_STORAGE_KEY);
          return null;
        }
      }

      function clearAreaErrors() {
        Object.values(AREA_FORM_FIELDS).forEach(({ input, error }) => {
          error.textContent = '';
          input.removeAttribute('aria-invalid');
          input.closest('.field')?.classList.remove('is-invalid');
        });
        areaInvalidSummary.classList.remove('visible');
        areaFormError.textContent = '';
      }

      function setAreaFieldError(fieldName, message) {
        const field = AREA_FORM_FIELDS[fieldName];
        field.error.textContent = message;
        field.input.setAttribute('aria-invalid', 'true');
        field.input.closest('.field')?.classList.add('is-invalid');
      }

      function focusFirstAreaError(errors) {
        const firstError = errors[0];
        if (firstError && AREA_FORM_FIELDS[firstError]) {
          AREA_FORM_FIELDS[firstError].input.focus();
        }
      }

      function renderArea(area) {
        renderPermissionDeniedState(area);
        areaStatus.textContent = 'Area cadastrada e pronta para o mapa';
        areaSuccess.style.display = 'block';
        areaSuccess.textContent =
          'Area cadastrada com sucesso. O fluxo agora pode seguir para mapa, focos e calculo de risco.';
        areaEmptyState.hidden = true;
        areaSummaryGrid.hidden = false;
        summaryName.textContent = area.name;
        summaryType.textContent = area.type;
        summaryCenter.textContent = `${area.latitude.toFixed(6)}, ${area.longitude.toFixed(6)}`;
        summaryRadius.textContent = `${area.radiusKm} km`;
        if (isPrivateAreaDenied) {
          setWorkspaceStep('A');
          renderPermissionDeniedExperience(area);
          return;
        }
        setWorkspaceStep('B');
        renderDefaultMapEmptyState();
        startAreaFlow(area);
      }

      function restoreArea() {
        clearDemoFlowTimers();
        const area = loadArea();
        if (area) {
          renderArea(area);
        } else {
          setWorkspaceStep('A');
          renderPermissionDeniedState(null);
          renderDefaultMapEmptyState();
          areaStatus.textContent = 'Sem area cadastrada';
          areaSuccess.style.display = 'none';
          areaEmptyState.hidden = false;
          areaEmptyState.textContent =
            'Nenhuma area foi cadastrada ainda. Use o formulario acima para iniciar o fluxo.';
          areaSummaryGrid.hidden = true;
          mapStatus.textContent = 'Aguardando area cadastrada';
        mapEmpty.hidden = false;
        mapSurface.hidden = true;
          mapCenterLabel.textContent = '--';
          mapContextText.textContent =
            'Cadastrar uma area libera o contexto espacial e a leitura do raio operacional.';
          mapFireSummary.innerHTML = '';
          mapFireMarkers.innerHTML = '';
          renderEmptyRiskExperience();
          hideLoadingStates();
        }
      }

      function resetAreaForm() {
        clearDemoFlowTimers();
        isPrivateAreaDenied = false;
        setWorkspaceStep('A');
        renderPermissionDeniedState(null);
        renderDefaultMapEmptyState();
        areaForm.reset();
        clearAreaErrors();
        areaSuccess.style.display = 'none';
        areaStatus.textContent = 'Sem area cadastrada';
        areaEmptyState.hidden = false;
        areaEmptyState.textContent =
          'Nenhuma area foi cadastrada ainda. Use o formulario acima para iniciar o fluxo.';
        areaSummaryGrid.hidden = true;
        mapStatus.textContent = 'Aguardando area cadastrada';
        mapEmpty.hidden = false;
        mapSurface.hidden = true;
        mapCenterLabel.textContent = '--';
        mapContextText.textContent =
          'Cadastrar uma area libera o contexto espacial e a leitura do raio operacional.';
        mapFireSummary.innerHTML = '';
        mapFireMarkers.innerHTML = '';
        renderEmptyRiskExperience();
        hideLoadingStates();
        sessionStorage.removeItem(AREA_STORAGE_KEY);
      }

      function renderMap(area) {
        const sourceState = renderDataSourceFallbackState();
        const operationalRadiusKm = Number(area.radiusKm) + 5;
        const fireEvents = createDemoFireEvents(area);
        const insideCount = fireEvents.filter((fire) => fire.relevance === 'INSIDE').length;
        const nearbyCount = fireEvents.length - insideCount;

        mapLoadingState.hidden = true;
        mapStatus.textContent = sourceState.isFallback
          ? 'Mapa pronto com fallback local'
          : 'Mapa pronto para leitura operacional';
        mapEmpty.hidden = true;
        mapSurface.hidden = false;
        mapCenterLabel.textContent = area.name;
        mapContextText.textContent = sourceState.isFallback
          ? `${area.name} em ${area.latitude.toFixed(6)}, ${area.longitude.toFixed(6)}. As fontes externas estao indisponiveis e o mapa usa fallback local com raio monitorado de ${area.radiusKm} km e vizinhanca operacional de ${operationalRadiusKm} km.`
          : `${area.name} em ${area.latitude.toFixed(6)}, ${area.longitude.toFixed(6)}. Raio monitorado de ${area.radiusKm} km com vizinhanca operacional de ${operationalRadiusKm} km.`;
        renderLegend();
        renderFireSummary(fireEvents);
        renderFireMarkers(fireEvents, operationalRadiusKm);
        areaStatus.textContent = sourceState.isFallback
          ? `Area cadastrada com fallback local (${insideCount} dentro / ${nearbyCount} proximos)`
          : `Area cadastrada e pronta para o mapa (${insideCount} dentro / ${nearbyCount} proximos)`;

        showRiskLoadingState(area);
        riskLoadingTimer = window.setTimeout(() => {
          riskLoadingTimer = null;
          renderRiskExperience(area);
        }, RISK_LOADING_DELAY_MS);
      }

      function renderRiskExperience(area) {
        const sourceState = renderDataSourceFallbackState();
        const fireEvents = createDemoFireEvents(area);
        const weather = createDemoWeatherSnapshot(area);
        const operationalRadiusKm = Number(area.radiusKm) + 5;
        weather.sourceLabel = sourceState.isFallback
          ? `${weather.sourceLabel} | fallback local`
          : `${weather.sourceLabel} | mock controlado`;
        riskSourceChip.textContent = sourceState.isFallback
          ? 'Fonte: fallback local'
          : 'Fonte: mock controlado';

        const analysis = renderRiskResult(area, fireEvents, weather);
        const alert = renderAlertDetail(area, analysis, weather);
        renderDashboard(area, analysis, fireEvents);
        renderNotification(area, analysis, alert);

        riskEmptyState.hidden = true;
        riskLayout.hidden = false;
        riskResult.hidden = false;
        renderRiskFireSummary(fireEvents, operationalRadiusKm);
        renderRiskWeather(weather);
        renderRiskSignals(fireEvents, weather);
        riskNarrative.textContent = analysis.summary;
      }

      function renderEmptyRiskExperience() {
        const sourceState = renderDataSourceFallbackState();
        hideLoadingStates();
        renderPermissionDeniedState(null);
        riskStatus.textContent = 'Aguardando area cadastrada';
        riskEmptyState.hidden = false;
        riskResult.hidden = true;
        alertStatusChip.textContent = 'Sem alerta ativo';
        alertEmptyState.textContent =
          'A area cadastrada ainda nao gerou um alerta ativo. Quando o score atingir um nivel alto, o detalhe exibira causas, resumo e recomendacoes praticas.';
        alertEmptyState.hidden = false;
        alertPanel.hidden = true;
        alertTitle.textContent = 'Risco preventivo de queimada';
        alertSummary.textContent =
          'O detalhamento do alerta mostra por que o cenÃ¡rio foi classificado como critico.';
        alertStatus.textContent = 'ACTIVE';
        alertChannel.textContent = 'IN_APP';
        alertLevel.textContent = 'CRITICAL';
        alertSeverity.textContent = 'DANGER';
        alertMessage.textContent =
          'Focos proximos e clima seco elevam fortemente o risco nas ultimas 24 horas.';
        alertCauses.innerHTML = '';
        alertActions.innerHTML = '';
        dashboardStatusChip.textContent = 'Aguardando area cadastrada';
        dashboardEmptyState.hidden = false;
        dashboardEmptyState.textContent =
          'Cadastre uma area para visualizar as agregacoes do dashboard. O estado vazio mostra que o MVP permanece coerente mesmo sem alertas ativos.';
        dashboardPanel.hidden = true;
        dashboardAreasCount.textContent = '0';
        dashboardAlertsCount.textContent = '0';
        dashboardAverageScore.textContent = '0';
        dashboardFireCount.textContent = '0';
        dashboardRiskLevels.innerHTML = '';
        dashboardPriorityList.innerHTML = '';
        dashboardExecutiveNote.textContent =
          'O dashboard consolida o estado atual da area para apoio a decisao.';
        notificationStatusChip.textContent = 'Sem notificacao ativa';
        notificationEmptyState.hidden = false;
        notificationPanel.hidden = true;
        notificationTime.textContent = '--:--';
        notificationHeadline.textContent = 'Risco preventivo de queimada';
        notificationSubhead.textContent = 'IN_APP | DANGER';
        notificationBadge.textContent = 'CRITICAL';
        notificationBody.textContent =
          'Focos proximos e clima seco elevam fortemente o risco nas ultimas 24 horas.';
        notificationContext.textContent =
          'A notificacao segue o mesmo resumo do alerta preventivo e funciona como demonstracao visual, sem envio real.';
        notificationActions.innerHTML = '';
        riskResult.removeAttribute('data-level');
        riskScoreValue.textContent = '0';
        riskLevelPill.textContent = 'LOW';
        riskLevelPill.className = 'risk-level-pill low';
        riskSeverity.textContent = 'Severidade: INFO';
        riskScoreSummary.textContent =
          'O resultado calculado aparece aqui quando os focos e o clima sao avaliados em conjunto.';
        riskScoreBrief.textContent =
          'O score sintetiza os principais sinais do cenÃ¡rio e antecipa se o fluxo deve evoluir para alerta preventivo.';
        riskLayout.hidden = true;
        riskFireSummary.innerHTML = '';
        riskWeatherGrid.innerHTML = '';
        riskSignalList.innerHTML = '';
        riskFactorList.innerHTML = '';
        riskNarrative.textContent =
          'Cadastrar uma area libera os focos de calor e o snapshot climatico que alimentam o calculo de risco.';
        riskFireCount.textContent = '0 focos relevantes';
        riskFireDistance.textContent = 'Distancia indefinida';
        riskSourceChip.textContent = sourceState.isFallback
          ? 'Fonte: fallback local'
          : 'Fonte: mock controlado';
        mapFallbackBanner.hidden = true;
        riskFallbackBanner.hidden = true;
      }

      function renderPermissionDeniedState(area) {
        const canViewPrivateAreas = DEMO_SESSION.permissions.canViewPrivateAreas;
        permissionDeniedCard.hidden = !isPrivateAreaDenied;
        privateAreaToggle.textContent = isPrivateAreaDenied
          ? 'Voltar ao fluxo normal'
          : 'Simular area privada';
        privateAreaToggle.setAttribute('aria-pressed', String(isPrivateAreaDenied));

        if (!isPrivateAreaDenied) {
          permissionDeniedMessage.textContent =
            'O usuario demo nao tem permissao para visualizar detalhes de areas privadas.';
          permissionDeniedChip.textContent = canViewPrivateAreas
            ? 'Permissao liberada'
            : '403 demonstrativo';
          return;
        }

        const areaLabel = area?.name ?? 'Area privada demonstrativa';
        permissionDeniedMessage.textContent = canViewPrivateAreas
          ? `A sessao atual poderia visualizar ${areaLabel}, mas o bloqueio foi mantido para demonstracao.`
          : `A sessao demo tentou acessar ${areaLabel}, mas nao possui permissao para ver areas privadas.`;
        permissionDeniedChip.textContent = canViewPrivateAreas
          ? 'Permissao simulada'
          : '403 demonstrativo';
      }

      function renderPermissionDeniedExperience(area) {
        const areaLabel = area?.name ?? 'area privada';

        clearDemoFlowTimers();
        hideLoadingStates();
        renderDataSourceFallbackState();
        renderPermissionDeniedState(area);

        areaStatus.textContent = 'Acesso restrito a area privada';
        areaSuccess.style.display = 'none';
        areaEmptyState.hidden = false;
        areaEmptyState.textContent =
          'Resumo oculto para area privada sem permissao. Nome, coordenadas, tipo e raio ficam indisponiveis neste estado demonstrativo.';
        areaSummaryGrid.hidden = true;
        mapStatus.textContent = 'Acesso restrito';
        mapEmpty.hidden = false;
        mapEmpty.innerHTML = `
          <div>
            <strong>Visualizacao bloqueada</strong>
            <span>O usuario demo nao tem permissao para abrir detalhes desta area privada. O mapa preserva a privacidade e nao exibe coordenadas, raio ou focos.</span>
          </div>
        `;
        mapSurface.hidden = true;
        mapCenterLabel.textContent = '--';
        mapContextText.textContent =
          `Acesso negado para ${areaLabel}. Solicite permissao para visualizar detalhes espaciais da area privada.`;
        mapFireSummary.innerHTML = '';
        mapFireMarkers.innerHTML = '';
        mapFallbackBanner.hidden = true;

        riskStatus.textContent = 'Acesso restrito';
        riskEmptyState.hidden = false;
        riskEmptyState.textContent =
          'O calculo de risco nao exibe fatores, clima ou focos enquanto a area privada estiver sem autorizacao.';
        riskResult.hidden = true;
        riskLayout.hidden = true;
        riskFactorList.innerHTML = '';
        riskFireSummary.innerHTML = '';
        riskWeatherGrid.innerHTML = '';
        riskSignalList.innerHTML = '';
        riskNarrative.textContent =
          'A permissao negada bloqueia a leitura operacional sem apagar a area cadastrada no fluxo demonstrativo.';
        riskFireCount.textContent = 'Restrito';
        riskFireDistance.textContent = 'Restrito';
        riskSourceChip.textContent = 'Fonte: acesso restrito';
        riskFallbackBanner.hidden = true;

        alertStatusChip.textContent = 'Acesso restrito';
        alertEmptyState.hidden = false;
        alertEmptyState.textContent =
          'O detalhe do alerta nao e apresentado para area privada sem permissao. Nivel, causas e recomendacoes ficam ocultos.';
        alertPanel.hidden = true;

        dashboardStatusChip.textContent = 'Acesso restrito';
        dashboardEmptyState.hidden = false;
        dashboardEmptyState.textContent =
          'O dashboard nao inclui indicadores da area privada sem permissao, preservando o estado demonstrativo de acesso negado.';
        dashboardPanel.hidden = true;
        dashboardAreasCount.textContent = '0';
        dashboardAlertsCount.textContent = '0';
        dashboardAverageScore.textContent = '0';
        dashboardFireCount.textContent = '0';
        dashboardRiskLevels.innerHTML = '';
        dashboardPriorityList.innerHTML = '';
        dashboardExecutiveNote.textContent =
          'Indicadores restritos ate que a sessao tenha permissao para visualizar areas privadas.';

        notificationStatusChip.textContent = 'Permissao negada';
        notificationEmptyState.hidden = true;
        notificationPanel.hidden = false;
        notificationTime.textContent = new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date());
        notificationHeadline.textContent = 'Notificacao restrita';
        notificationSubhead.textContent = 'IN_APP | ACESSO_RESTRITO';
        notificationBadge.textContent = '403';
        notificationBody.textContent =
          `Area privada: os detalhes do alerta de ${areaLabel} estao ocultos para esta sessao demo.`;
        notificationContext.textContent =
          'Estado demonstrativo de permissao negada: a notificacao informa o bloqueio sem revelar nivel, causa, coordenadas ou recomendacoes sensiveis.';
        notificationActions.innerHTML = ['Solicitar acesso', 'Voltar ao fluxo']
          .map((action) => `<span class="alert-chip">${action}</span>`)
          .join('');
      }

      function renderDefaultMapEmptyState() {
        mapEmpty.innerHTML = `
          <div>
            <strong>Cadastre uma area para visualizar o mapa</strong>
            <span>
              O prototipo mostra aqui o centro, o raio monitorado, a vizinhanca
              operacional e os focos relevantes.
            </span>
          </div>
        `;
      }

      function createDemoSession() {
        return {
          user: DEMO_USER,
          permissions: DEMO_SESSION.permissions,
          session: {
            isDemoSession: true,
            authProvider: 'DEMO',
            expiresAt: DEMO_SESSION.expiresAt,
            accessToken: DEMO_SESSION.accessToken,
          },
        };
      }

      demoFillButton.addEventListener('click', () => {
        emailInput.value = 'maria@example.com';
        passwordInput.value = 'SenhaSegura123!';
        emailInput.focus();
        successBanner.style.display = 'block';
        successBanner.textContent = 'Credenciais demo preenchidas. Clique em "Entrar e continuar".';
        loginError.textContent = '';
      });

      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (email !== 'maria@example.com' || password !== 'SenhaSegura123!') {
          loginError.textContent = 'Credenciais invalidas. Use a conta demonstrativa do MVP.';
          successBanner.style.display = 'none';
          return;
        }

        const session = createDemoSession();
        saveSession(session);
        successBanner.style.display = 'block';
        successBanner.textContent = 'Autenticacao demonstrativa concluida. Sessao liberada para o fluxo principal.';
        renderApp(session);
      });

      areaForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearAreaErrors();

        const errors = [];
        const name = areaNameInput.value.trim();
        const type = areaTypeInput.value;
        const latitudeRaw = areaLatitudeInput.value.trim();
        const longitudeRaw = areaLongitudeInput.value.trim();
        const radiusRaw = areaRadiusInput.value.trim();
        const latitude = Number(latitudeRaw);
        const longitude = Number(longitudeRaw);
        const radiusKm = Number(radiusRaw);

        if (name.length < 3 || name.length > 80) {
          setAreaFieldError('name', 'Informe um nome entre 3 e 80 caracteres.');
          errors.push('name');
        }

        if (!AREA_TYPES.has(type)) {
          setAreaFieldError('type', 'Selecione um tipo de area valido.');
          errors.push('type');
        }

        if (latitudeRaw === '' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
          setAreaFieldError('latitude', 'Informe uma latitude valida entre -90 e 90.');
          errors.push('latitude');
        }

        if (longitudeRaw === '' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
          setAreaFieldError('longitude', 'Informe uma longitude valida entre -180 e 180.');
          errors.push('longitude');
        }

        if (radiusRaw === '' || !Number.isFinite(radiusKm) || radiusKm < 0.1 || radiusKm > 50) {
          setAreaFieldError(
            'radiusKm',
            'Informe um raio de monitoramento entre 0.1 km e 50 km.',
          );
          errors.push('radiusKm');
        }

        if (errors.length > 0) {
          areaInvalidSummary.classList.add('visible');
          areaFormError.textContent =
            'Corrija os campos destacados antes de seguir para o mapa e o calculo.';
          areaSuccess.style.display = 'none';
          areaStatus.textContent = 'Cadastro com ajustes pendentes';
          focusFirstAreaError(errors);
          return;
        }

        const area = {
          id: 'demo-area-95fb2c22',
          name,
          type,
          latitude: Number(latitude.toFixed(6)),
          longitude: Number(longitude.toFixed(6)),
          radiusKm,
        };

        saveArea(area);
        renderArea(area);
      });

      areaResetButton.addEventListener('click', resetAreaForm);

      privateAreaToggle.addEventListener('click', () => {
        isPrivateAreaDenied = !isPrivateAreaDenied;
        const area = loadArea();

        if (isPrivateAreaDenied) {
          renderPermissionDeniedExperience(area);
          return;
        }

        renderPermissionDeniedState(area);
        if (area) {
          renderArea(area);
        } else {
          renderDefaultMapEmptyState();
          renderEmptyRiskExperience();
          areaStatus.textContent = 'Sem area cadastrada';
          areaSuccess.style.display = 'none';
          areaEmptyState.hidden = false;
          areaEmptyState.textContent =
            'Nenhuma area foi cadastrada ainda. Use o formulario acima para iniciar o fluxo.';
          areaSummaryGrid.hidden = true;
          mapStatus.textContent = 'Aguardando area cadastrada';
          mapEmpty.hidden = false;
          mapSurface.hidden = true;
        }
      });

      logoutButton.addEventListener('click', () => {
        clearDemoFlowTimers();
        isPrivateAreaDenied = false;
        renderPermissionDeniedState(null);
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(AREA_STORAGE_KEY);
        emailInput.value = 'maria@example.com';
        passwordInput.value = 'SenhaSegura123!';
        areaForm.reset();
        clearAreaErrors();
        renderLogin();
      });

      fallbackToggle.addEventListener('click', () => {
        dataSourceMode =
          dataSourceMode === DATA_SOURCE_MODES.FALLBACK
            ? DATA_SOURCE_MODES.LIVE
            : DATA_SOURCE_MODES.FALLBACK;
        saveDataSourceMode(dataSourceMode);
        const area = loadArea();
        if (isPrivateAreaDenied) {
          renderPermissionDeniedExperience(area);
          return;
        }

        if (area) {
          renderArea(area);
        } else {
          renderDataSourceFallbackState();
          renderEmptyRiskExperience();
        }
      });

      workspaceTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          setWorkspaceStep(tab.dataset.workspaceStep);
        });
      });

      function moveWorkspaceStep(direction) {
        const currentStep = appView.dataset.activeStep || 'A';
        const currentIndex = getWorkspaceStepIndex(currentStep);
        const nextIndex = Math.min(
          WORKSPACE_STEPS.length - 1,
          Math.max(0, currentIndex + direction),
        );
        setWorkspaceStep(WORKSPACE_STEPS[nextIndex]);
      }

      if (workspacePrevButton) {
        workspacePrevButton.addEventListener('click', () => moveWorkspaceStep(-1));
      }

      if (workspaceNextButton) {
        workspaceNextButton.addEventListener('click', () => moveWorkspaceStep(1));
      }

      const existingSession = loadSession();
      if (existingSession) {
        renderApp(existingSession);
      } else {
        setWorkspaceStep('A');
      }

      renderLegend();
      renderDataSourceFallbackState();
