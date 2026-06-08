import assert from 'node:assert/strict';
import { DashboardService } from '../src/dashboard/dashboard.service';
import { AlertsService } from '../src/alerts/alerts.service';
import { FireEventsService } from '../src/fire-events/fire-events.service';
import { MonitoredAreasService } from '../src/monitored-areas/monitored-areas.service';
import { RiskEngineService } from '../src/risk-engine/risk-engine.service';
import { WeatherService } from '../src/weather/weather.service';
import { OrbitGuardStore } from '../src/integrations/memory/orbitguard-store';
import { MonitoredAreaType, RiskLevel } from '../src/common/domain/enums';

const userId = 'user-dashboard';

function createServices(): {
  store: OrbitGuardStore;
  monitoredAreasService: MonitoredAreasService;
  fireEventsService: FireEventsService;
  weatherService: WeatherService;
  riskEngineService: RiskEngineService;
  alertsService: AlertsService;
  dashboardService: DashboardService;
} {
  const store = new OrbitGuardStore();
  const monitoredAreasService = new MonitoredAreasService(store);
  const fireEventsService = new FireEventsService(store, monitoredAreasService);
  const weatherService = new WeatherService(store, monitoredAreasService);
  const riskEngineService = new RiskEngineService(
    store,
    monitoredAreasService,
    fireEventsService,
    weatherService,
  );
  const alertsService = new AlertsService(store, monitoredAreasService);
  const dashboardService = new DashboardService(store);

  return {
    store,
    monitoredAreasService,
    fireEventsService,
    weatherService,
    riskEngineService,
    alertsService,
    dashboardService,
  };
}

function createArea(
  monitoredAreasService: MonitoredAreasService,
  input: {
    name: string;
    type: MonitoredAreaType;
    latitude: number;
    longitude: number;
    radiusKm: number;
  },
): { id: string } {
  return monitoredAreasService.create(input, userId);
}

function calculateAndPersistRisk(
  services: Pick<
    ReturnType<typeof createServices>,
    'riskEngineService' | 'alertsService'
  >,
  areaId: string,
  periodHours = 24,
): void {
  const risk = services.riskEngineService.calculate(areaId, userId, periodHours, true);
  services.alertsService.upsertFromRiskCalculation(risk, userId);
}

function runEmptyStateScenario(): void {
  const { dashboardService } = createServices();

  const summary = dashboardService.getSummary(userId);

  assert.equal(summary.monitoredAreasCount, 0);
  assert.equal(summary.activeAlertsCount, 0);
  assert.equal(summary.averageRiskScore, 0);
  assert.equal(summary.recentFireEventsCount, 0);
  assert.deepEqual(summary.areasByRiskLevel, {
    LOW: 0,
    MODERATE: 0,
    HIGH: 0,
    CRITICAL: 0,
  });
  assert.deepEqual(summary.priorityAreas, []);
  assert.equal(summary.hasActiveAlerts, false);
  assert.equal(new Date(summary.generatedAt).toISOString(), summary.generatedAt);
}

function runPopulatedStateScenario(): void {
  const services = createServices();

  const lowArea = createArea(services.monitoredAreasService, {
    name: 'Area Base',
    type: MonitoredAreaType.RURAL_PROPERTY,
    latitude: -15.92,
    longitude: -47.74,
    radiusKm: 3,
  });

  const moderateArea = createArea(services.monitoredAreasService, {
    name: 'Area Moderada',
    type: MonitoredAreaType.RURAL_COMMUNITY,
    latitude: -15.68,
    longitude: -47.81,
    radiusKm: 6,
  });

  const criticalArea = createArea(services.monitoredAreasService, {
    name: 'Area Critica',
    type: MonitoredAreaType.CONSERVATION_AREA,
    latitude: -15.78,
    longitude: -47.93,
    radiusKm: 10,
  });

  calculateAndPersistRisk(services, lowArea.id);
  calculateAndPersistRisk(services, moderateArea.id);
  calculateAndPersistRisk(services, criticalArea.id);

  const summary = services.dashboardService.getSummary(userId);

  assert.equal(summary.monitoredAreasCount, 3);
  assert.equal(summary.activeAlertsCount, 1);
  assert.equal(summary.averageRiskScore, 47);
  assert.equal(summary.recentFireEventsCount, 6);
  assert.deepEqual(summary.areasByRiskLevel, {
    LOW: 1,
    MODERATE: 1,
    HIGH: 0,
    CRITICAL: 1,
  });
  assert.equal(summary.hasActiveAlerts, true);
  assert.deepEqual(
    summary.priorityAreas.map((area) => ({
      monitoredAreaId: area.monitoredAreaId,
      areaName: area.areaName,
      level: area.level,
      score: area.score,
      activeAlertCount: area.activeAlertCount,
      recentFireEvents: area.recentFireEvents,
    })),
    [
      {
        monitoredAreaId: criticalArea.id,
        areaName: 'Area Critica',
        level: RiskLevel.CRITICAL,
        score: 95,
        activeAlertCount: 1,
        recentFireEvents: 4,
      },
      {
        monitoredAreaId: moderateArea.id,
        areaName: 'Area Moderada',
        level: RiskLevel.MODERATE,
        score: 45,
        activeAlertCount: 0,
        recentFireEvents: 2,
      },
      {
        monitoredAreaId: lowArea.id,
        areaName: 'Area Base',
        level: RiskLevel.LOW,
        score: 0,
        activeAlertCount: 0,
        recentFireEvents: 0,
      },
    ],
  );
}

runEmptyStateScenario();
runPopulatedStateScenario();

console.log('dashboard service checks passed');
