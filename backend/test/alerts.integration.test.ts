import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { AlertStatus, MonitoredAreaType, RiskLevel } from '../src/common/domain/enums';
import { AlertsResponseDto } from '../src/alerts/contracts/alerts.contracts';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function assertAlertsResponseShape(response: AlertsResponseDto, expectedEmptyState: boolean): void {
  const expectedKeys = ['items', 'total', 'filters'];
  if (expectedEmptyState) {
    expectedKeys.push('emptyStateMessage');
  }

  assertExactKeys(response, expectedKeys);
  assert.ok(response.filters && typeof response.filters === 'object');
  assert.ok(Array.isArray(response.items));
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'alertas.integracao@example.com';

  backend.register({
    name: 'Alertas Integracao',
    email,
    password: 'SenhaSegura456!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura456!',
  });

  return {
    backend,
    accessToken: loginResponse.accessToken,
  };
}

function runPopulatedListScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const alerts = backend.listAlerts();

  assertAlertsResponseShape(alerts, false);
  assert.equal(alerts.total, 1);
  assert.equal(alerts.items.length, 1);
  assert.deepEqual(alerts.filters, {});
  assert.equal(alerts.emptyStateMessage, undefined);

  const alert = alerts.items[0];
  assert.ok(alert);
  assertExactKeys(alert, [
    'areaName',
    'channel',
    'id',
    'level',
    'monitoredAreaId',
    'severity',
    'status',
    'summary',
    'title',
    'triggeredAt',
  ]);
}

function runFilteredListScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const monitoredAreas = backend.listMonitoredAreas();
  const criticalArea = monitoredAreas[0];

  assert.ok(criticalArea, 'Expected demo area to exist');

  const alertsByLevel = backend.listAlerts({
    level: RiskLevel.CRITICAL,
  });

  const alertsByArea = backend.listAlerts({
    monitoredAreaId: criticalArea.id,
  });

  assertAlertsResponseShape(alertsByLevel, false);
  assert.equal(alertsByLevel.total, 1);
  assert.equal(alertsByLevel.items.length, 1);
  assert.deepEqual(alertsByLevel.filters, {
    level: RiskLevel.CRITICAL,
  });
  assert.equal(alertsByLevel.items[0]?.level, RiskLevel.CRITICAL);
  assert.equal(alertsByLevel.items[0]?.status, AlertStatus.ACTIVE);

  assertAlertsResponseShape(alertsByArea, false);
  assert.equal(alertsByArea.total, 1);
  assert.equal(alertsByArea.items.length, 1);
  assert.deepEqual(alertsByArea.filters, {
    monitoredAreaId: criticalArea.id,
  });
  assert.equal(alertsByArea.items[0]?.monitoredAreaId, criticalArea.id);
}

function runEmptyStateScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const emptyAlerts = backend.listAlerts({}, accessToken);

  assertAlertsResponseShape(emptyAlerts, true);
  assert.equal(emptyAlerts.total, 0);
  assert.equal(emptyAlerts.items.length, 0);
  assert.deepEqual(emptyAlerts.filters, {});
  assert.equal(emptyAlerts.emptyStateMessage, 'Nenhum alerta ativo para as areas monitoradas no momento.');
}

function runMultiAlertScenario(): void {
  const backend = createOrbitGuardFireBackend();

  const customArea = backend.createMonitoredArea(
    {
      name: 'Area Critica Adicional',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
  );

  backend.calculateRisk(customArea.id, { periodHours: 24, forceMock: true });

  const alerts = backend.listAlerts({
    status: AlertStatus.ACTIVE,
    level: RiskLevel.CRITICAL,
  });

  assertAlertsResponseShape(alerts, false);
  assert.equal(alerts.total, 2);
  assert.equal(alerts.items.length, 2);
  assert.deepEqual(alerts.filters, {
    status: AlertStatus.ACTIVE,
    level: RiskLevel.CRITICAL,
  });
  assert.ok(alerts.items.every((item) => item.level === RiskLevel.CRITICAL));
  assert.ok(alerts.items.every((item) => item.status === AlertStatus.ACTIVE));
  assert.ok(
    alerts.items.some((item) => item.monitoredAreaId === customArea.id),
    'Expected filtered alerts to include the newly created monitored area',
  );
}

runPopulatedListScenario();
runFilteredListScenario();
runEmptyStateScenario();
runMultiAlertScenario();

console.log('alerts integration checks passed');
