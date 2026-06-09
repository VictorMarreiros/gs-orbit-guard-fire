import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { RiskLevel } from '../src/common/domain/enums';
import { DashboardSummaryResponseDto } from '../src/dashboard/contracts/dashboard.contracts';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function assertDashboardResponseShape(response: DashboardSummaryResponseDto): void {
  assertExactKeys(response, [
    'activeAlertsCount',
    'areasByRiskLevel',
    'averageRiskScore',
    'generatedAt',
    'hasActiveAlerts',
    'monitoredAreasCount',
    'priorityAreas',
    'recentFireEventsCount',
  ]);

  assertExactKeys(response.areasByRiskLevel, [
    RiskLevel.LOW,
    RiskLevel.MODERATE,
    RiskLevel.HIGH,
    RiskLevel.CRITICAL,
  ]);
  assert.ok(Array.isArray(response.priorityAreas));
  assert.ok(new Date(response.generatedAt).toISOString() === response.generatedAt);
}

function runDemoDashboardScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const monitoredAreas = backend.listMonitoredAreas();

  const summary = backend.getDashboardSummary();

  assertDashboardResponseShape(summary);
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
    monitoredAreas
      .map((area) => ({
        monitoredAreaId: area.id,
        areaName: area.name,
        level:
          area.name === 'Fazenda Santa Luzia'
            ? RiskLevel.CRITICAL
            : area.name === 'Cooperativa Esperanca'
              ? RiskLevel.MODERATE
              : RiskLevel.LOW,
        score:
          area.name === 'Fazenda Santa Luzia'
            ? 95
            : area.name === 'Cooperativa Esperanca'
              ? 45
              : 0,
        activeAlertCount: area.name === 'Fazenda Santa Luzia' ? 1 : 0,
        recentFireEvents:
          area.name === 'Fazenda Santa Luzia'
            ? 4
            : area.name === 'Cooperativa Esperanca'
              ? 2
              : 0,
      }))
      .sort((left, right) => right.score - left.score),
  );
}

function runEmptyDashboardScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const email = 'dashboard.vazio@example.com';

  backend.register({
    name: 'Dashboard Vazio',
    email,
    password: 'SenhaSegura321!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura321!',
  });

  const summary = backend.getDashboardSummary(loginResponse.accessToken);

  assertDashboardResponseShape(summary);
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
}

runDemoDashboardScenario();
runEmptyDashboardScenario();

console.log('dashboard integration checks passed');
