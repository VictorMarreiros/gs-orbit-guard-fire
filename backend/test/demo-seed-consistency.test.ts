import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { RiskLevel } from '../src/common/domain/enums';

function runDemoSeedConsistencyScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const loginResponse = backend.login({
    email: 'maria@example.com',
    password: 'SenhaSegura123!',
  });
  const sessionContext = backend.me(loginResponse.accessToken);
  const accessToken = loginResponse.accessToken;

  assert.equal(sessionContext.user.email, 'maria@example.com');
  assert.equal(sessionContext.user.name, 'Maria Oliveira');
  assert.equal(sessionContext.session.isDemoSession, true);
  assert.equal(sessionContext.permissions.canManageAreas, true);
  assert.equal(sessionContext.permissions.canViewPrivateAreas, false);

  const monitoredAreas = backend.listMonitoredAreas(accessToken);
  assert.equal(monitoredAreas.length, 3);
  assert.deepEqual(
    monitoredAreas.map((area) => area.name).sort(),
    ['Cooperativa Esperanca', 'Escola Verde', 'Fazenda Santa Luzia'].sort(),
  );

  const dashboard = backend.getDashboardSummary(accessToken);
  assert.equal(dashboard.monitoredAreasCount, 3);
  assert.equal(dashboard.activeAlertsCount, 1);
  assert.equal(dashboard.averageRiskScore, 47);
  assert.equal(dashboard.recentFireEventsCount, 6);
  assert.deepEqual(dashboard.areasByRiskLevel, {
    [RiskLevel.LOW]: 1,
    [RiskLevel.MODERATE]: 1,
    [RiskLevel.HIGH]: 0,
    [RiskLevel.CRITICAL]: 1,
  });
  assert.equal(dashboard.hasActiveAlerts, true);

  const criticalArea = monitoredAreas.find((area) => area.name === 'Fazenda Santa Luzia');
  const moderateArea = monitoredAreas.find((area) => area.name === 'Cooperativa Esperanca');
  const lowArea = monitoredAreas.find((area) => area.name === 'Escola Verde');

  assert.ok(criticalArea, 'Expected the demo bootstrap to include Fazenda Santa Luzia.');
  assert.ok(moderateArea, 'Expected the demo bootstrap to include Cooperativa Esperanca.');
  assert.ok(lowArea, 'Expected the demo bootstrap to include Escola Verde.');

  const criticalFireEvents = backend.getFireEvents(criticalArea.id, { periodHours: 24 }, accessToken);
  const moderateFireEvents = backend.getFireEvents(moderateArea.id, { periodHours: 24 }, accessToken);
  const lowFireEvents = backend.getFireEvents(lowArea.id, { periodHours: 24 }, accessToken);

  assert.equal(criticalFireEvents.summary.total, 4);
  assert.equal(criticalFireEvents.summary.insideCount, 2);
  assert.equal(criticalFireEvents.summary.nearbyCount, 2);
  assert.equal(criticalFireEvents.source.usedFallback, true);

  assert.equal(moderateFireEvents.summary.total, 2);
  assert.equal(moderateFireEvents.summary.insideCount, 0);
  assert.equal(moderateFireEvents.summary.nearbyCount, 2);
  assert.equal(moderateFireEvents.source.usedFallback, true);

  assert.equal(lowFireEvents.summary.total, 0);
  assert.equal(lowFireEvents.summary.insideCount, 0);
  assert.equal(lowFireEvents.summary.nearbyCount, 0);
  assert.equal(lowFireEvents.source.usedFallback, true);

  const criticalWeather = backend.getLatestWeather(criticalArea.id, accessToken);
  const moderateWeather = backend.getLatestWeather(moderateArea.id, accessToken);
  const lowWeather = backend.getLatestWeather(lowArea.id, accessToken);

  assert.equal(criticalWeather.sourceLabel, 'mock-scenario-critical');
  assert.equal(criticalWeather.usedFallback, true);
  assert.equal(moderateWeather.sourceLabel, 'mock-scenario-moderate');
  assert.equal(moderateWeather.usedFallback, true);
  assert.equal(lowWeather.sourceLabel, 'mock-scenario-low');
  assert.equal(lowWeather.usedFallback, true);

  const criticalRisk = backend.calculateRisk(criticalArea.id, { periodHours: 24, forceMock: true }, accessToken);
  const moderateRisk = backend.calculateRisk(moderateArea.id, { periodHours: 24, forceMock: true }, accessToken);
  const lowRisk = backend.calculateRisk(lowArea.id, { periodHours: 24, forceMock: true }, accessToken);

  assert.equal(criticalRisk.level, RiskLevel.CRITICAL);
  assert.equal(moderateRisk.level, RiskLevel.MODERATE);
  assert.equal(lowRisk.level, RiskLevel.LOW);
  assert.equal(criticalRisk.alertTriggered, true);
  assert.equal(moderateRisk.alertTriggered, false);
  assert.equal(lowRisk.alertTriggered, false);
}

runDemoSeedConsistencyScenario();

console.log('demo seed consistency checks passed');
