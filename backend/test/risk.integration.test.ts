import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { DataOrigin, MonitoredAreaType, RiskLevel, RiskSeverity } from '../src/common/domain/enums';
import { RiskCalculationResponseDto } from '../src/risk-engine/contracts/risk.contracts';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'risco.integracao@example.com';

  backend.register({
    name: 'Risco Integracao',
    email,
    password: 'SenhaSegura987!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura987!',
  });

  return {
    backend,
    accessToken: loginResponse.accessToken,
  };
}

function assertRiskResponseShape(response: RiskCalculationResponseDto): void {
  assertExactKeys(response, [
    'alertTriggered',
    'contributingSignals',
    'dataSources',
    'evaluatedAt',
    'factors',
    'id',
    'level',
    'monitoredAreaId',
    'periodHours',
    'score',
    'severity',
    'summary',
  ]);

  assertExactKeys(response.contributingSignals, [
    'fireEventsConsidered',
    'insideFireEvents',
    'nearbyFireEvents',
  ]);
  assertExactKeys(response.dataSources, ['fireEvents', 'weather']);
  assert.ok(new Date(response.evaluatedAt).toISOString() === response.evaluatedAt);
}

function createArea(
  backend: ReturnType<typeof createOrbitGuardFireBackend>,
  accessToken: string,
  input: {
    name: string;
    type: MonitoredAreaType;
    latitude: number;
    longitude: number;
    radiusKm: number;
  },
): { id: string } {
  return backend.createMonitoredArea(input, accessToken);
}

function runLowRiskScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();
  const area = createArea(backend, accessToken, {
    name: 'Area Baixo Risco',
    type: MonitoredAreaType.RURAL_PROPERTY,
    latitude: -15.92,
    longitude: -47.74,
    radiusKm: 3,
  });

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true }, accessToken);
  const alerts = backend.listAlerts({}, accessToken);

  assertRiskResponseShape(risk);
  assert.equal(risk.monitoredAreaId, area.id);
  assert.equal(risk.periodHours, 24);
  assert.equal(risk.score, 0);
  assert.equal(risk.level, RiskLevel.LOW);
  assert.equal(risk.severity, RiskSeverity.INFO);
  assert.deepEqual(risk.factors, []);
  assert.deepEqual(risk.contributingSignals, {
    fireEventsConsidered: 0,
    insideFireEvents: 0,
    nearbyFireEvents: 0,
  });
  assert.deepEqual(risk.dataSources, {
    fireEvents: DataOrigin.FALLBACK,
    weather: DataOrigin.FALLBACK,
  });
  assert.equal(risk.alertTriggered, false);
  assert.equal(alerts.total, 0);
  assert.deepEqual(alerts.items, []);
}

function runModerateRiskScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();
  const area = createArea(backend, accessToken, {
    name: 'Area Moderada',
    type: MonitoredAreaType.RURAL_COMMUNITY,
    latitude: -15.6854,
    longitude: -47.8123,
    radiusKm: 6,
  });

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true }, accessToken);
  const alerts = backend.listAlerts({}, accessToken);

  assertRiskResponseShape(risk);
  assert.equal(risk.monitoredAreaId, area.id);
  assert.equal(risk.periodHours, 24);
  assert.equal(risk.score, 45);
  assert.equal(risk.level, RiskLevel.MODERATE);
  assert.equal(risk.severity, RiskSeverity.ATTENTION);
  assert.deepEqual(risk.factors.map((factor) => factor.code), [
    'NEAR_FIRE_WARNING',
    'HIGH_TEMP',
    'LOW_RAIN',
  ]);
  assert.deepEqual(risk.contributingSignals, {
    fireEventsConsidered: 2,
    insideFireEvents: 0,
    nearbyFireEvents: 2,
  });
  assert.deepEqual(risk.dataSources, {
    fireEvents: DataOrigin.FALLBACK,
    weather: DataOrigin.FALLBACK,
  });
  assert.equal(risk.alertTriggered, false);
  assert.equal(alerts.total, 0);
  assert.deepEqual(alerts.items, []);
}

function runCriticalRiskScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();
  const area = createArea(backend, accessToken, {
    name: 'Area Critica',
    type: MonitoredAreaType.RURAL_PROPERTY,
    latitude: -15.7801,
    longitude: -47.9292,
    radiusKm: 10,
  });

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true }, accessToken);
  const alerts = backend.listAlerts({}, accessToken);

  assertRiskResponseShape(risk);
  assert.equal(risk.monitoredAreaId, area.id);
  assert.equal(risk.periodHours, 24);
  assert.equal(risk.score, 95);
  assert.equal(risk.level, RiskLevel.CRITICAL);
  assert.equal(risk.severity, RiskSeverity.DANGER);
  assert.deepEqual(risk.factors.map((factor) => factor.code), [
    'NEAR_FIRE_CRITICAL',
    'FIRE_CLUSTER',
    'HIGH_TEMP',
    'LOW_HUMIDITY',
    'LOW_RAIN',
  ]);
  assert.deepEqual(risk.contributingSignals, {
    fireEventsConsidered: 4,
    insideFireEvents: 2,
    nearbyFireEvents: 2,
  });
  assert.deepEqual(risk.dataSources, {
    fireEvents: DataOrigin.FALLBACK,
    weather: DataOrigin.FALLBACK,
  });
  assert.equal(risk.alertTriggered, true);
  assert.equal(alerts.total, 1);
  assert.equal(alerts.items[0]?.monitoredAreaId, area.id);
  assert.equal(alerts.items[0]?.level, RiskLevel.CRITICAL);
  assert.equal(alerts.items[0]?.severity, RiskSeverity.DANGER);
  assert.equal(alerts.items[0]?.title, 'Risco critico de queimada');
}

runLowRiskScenario();
runModerateRiskScenario();
runCriticalRiskScenario();

console.log('risk integration checks passed');
