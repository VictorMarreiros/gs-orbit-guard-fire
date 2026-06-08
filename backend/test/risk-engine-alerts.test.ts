import assert from 'node:assert/strict';
import { OrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { MonitoredAreaType, RiskLevel, RiskSeverity } from '../src/common/domain/enums';

function createBackend(): OrbitGuardFireBackend {
  return new OrbitGuardFireBackend();
}

function createArea(
  backend: OrbitGuardFireBackend,
  input: {
    name: string;
    type: MonitoredAreaType;
    latitude: number;
    longitude: number;
    radiusKm: number;
  },
): { id: string } {
  return backend.createMonitoredArea(input);
}

function seedWeatherSnapshot(
  backend: OrbitGuardFireBackend,
  areaId: string,
  patch: {
    temperatureC: number;
    precipitationMm: number;
    humidityPercent: number;
    windSpeedMs: number;
  },
): void {
  backend.getLatestWeather(areaId);
  const snapshot = backend.store.getLatestWeatherSnapshot(areaId);

  assert.ok(snapshot);

  backend.store.upsertWeatherSnapshot({
    ...snapshot,
    ...patch,
    updatedAt: new Date(),
  });
}

function assertRiskOutcome(
  backend: OrbitGuardFireBackend,
  areaId: string,
  expected: {
    score: number;
    level: RiskLevel;
    severity: RiskSeverity;
    factorCodes: string[];
    alertTriggered: boolean;
  },
): void {
  const risk = backend.calculateRisk(areaId, { periodHours: 24, forceMock: true });
  const alert = backend.store.resolveExistingActiveAlert(areaId);

  assert.equal(risk.score, expected.score);
  assert.equal(risk.level, expected.level);
  assert.equal(risk.severity, expected.severity);
  assert.deepEqual(
    risk.factors.map((factor) => factor.code),
    expected.factorCodes,
  );
  assert.equal(risk.alertTriggered, expected.alertTriggered);

  if (expected.alertTriggered) {
    assert.ok(alert);
    assert.equal(alert.monitoredAreaId, areaId);
    assert.equal(alert.riskScoreId, risk.id);
    assert.equal(alert.level, expected.level);
    assert.equal(alert.severity, expected.severity);
    assert.equal(alert.summary, risk.summary);
  } else {
    assert.equal(alert, undefined);
  }
}

function runLowRiskScenario(): void {
  const backend = createBackend();
  const area = createArea(backend, {
    name: 'Area Baixo Risco',
    type: MonitoredAreaType.RURAL_PROPERTY,
    latitude: -15.78,
    longitude: -47.92,
    radiusKm: 3,
  });

  assertRiskOutcome(backend, area.id, {
    score: 0,
    level: RiskLevel.LOW,
    severity: RiskSeverity.INFO,
    factorCodes: [],
    alertTriggered: false,
  });
}

function runModerateRiskScenario(): void {
  const backend = createBackend();
  const area = createArea(backend, {
    name: 'Area Moderada',
    type: MonitoredAreaType.RURAL_COMMUNITY,
    latitude: -15.6854,
    longitude: -47.8123,
    radiusKm: 6,
  });

  assertRiskOutcome(backend, area.id, {
    score: 45,
    level: RiskLevel.MODERATE,
    severity: RiskSeverity.ATTENTION,
    factorCodes: ['NEAR_FIRE_WARNING', 'HIGH_TEMP', 'LOW_RAIN'],
    alertTriggered: false,
  });
}

function runHighRiskScenario(): void {
  const backend = createBackend();
  const area = createArea(backend, {
    name: 'Area Alto Risco',
    type: MonitoredAreaType.CONSERVATION_AREA,
    latitude: -15.7012,
    longitude: -47.8411,
    radiusKm: 6,
  });

  seedWeatherSnapshot(backend, area.id, {
    temperatureC: 33.5,
    precipitationMm: 0.2,
    humidityPercent: 24,
    windSpeedMs: 9.1,
  });

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true });
  const alert = backend.store.resolveExistingActiveAlert(area.id);

  assert.equal(risk.score, 75);
  assert.equal(risk.level, RiskLevel.HIGH);
  assert.equal(risk.severity, RiskSeverity.WARNING);
  assert.deepEqual(risk.factors.map((factor) => factor.code), [
    'NEAR_FIRE_WARNING',
    'HIGH_TEMP',
    'LOW_HUMIDITY',
    'LOW_RAIN',
    'STRONG_WIND',
  ]);
  assert.equal(risk.alertTriggered, true);
  assert.ok(alert);
  assert.equal(alert.level, RiskLevel.HIGH);
  assert.equal(alert.severity, RiskSeverity.WARNING);
  assert.equal(alert.title, 'Risco alto de queimada');
  assert.equal(alert.recommendedActions[0], 'Intensifique o monitoramento da area nas proximas horas.');
  assert.match(alert.message, /Area Alto Risco em risco high/i);
  assert.match(alert.message, /foco proximo/i);
  assert.match(alert.message, /temperatura elevada/i);
  assert.match(alert.message, /baixa umidade/i);
  assert.deepEqual(alert.recommendedActions, [
    'Intensifique o monitoramento da area nas proximas horas.',
    'Afaste pessoas e equipamentos das bordas da area monitorada.',
    'Evite qualquer atividade que possa gerar faisca, fogo ou dispersao de chamas.',
  ]);
}

function runCriticalRiskScenario(): void {
  const backend = createBackend();
  const area = createArea(backend, {
    name: 'Area Critica',
    type: MonitoredAreaType.RURAL_PROPERTY,
    latitude: -15.7801,
    longitude: -47.9292,
    radiusKm: 10,
  });

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true });
  const alert = backend.store.resolveExistingActiveAlert(area.id);

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
  assert.equal(risk.alertTriggered, true);
  assert.ok(alert);
  assert.equal(alert.level, RiskLevel.CRITICAL);
  assert.equal(alert.severity, RiskSeverity.DANGER);
  assert.equal(alert.title, 'Risco critico de queimada');
  assert.equal(alert.recommendedActions[0], 'Reforce a vigilancia local agora.');
  assert.match(alert.message, /Area Critica em risco critical/i);
  assert.match(alert.message, /foco criticamente proximo/i);
  assert.match(alert.message, /concentracao recente de focos/i);
  assert.match(alert.message, /temperatura elevada/i);
  assert.deepEqual(alert.recommendedActions, [
    'Reforce a vigilancia local agora.',
    'Afaste pessoas e equipamentos das bordas da area monitorada.',
    'Monitore a evolucao dos focos nas proximas horas.',
  ]);
}

runLowRiskScenario();
runModerateRiskScenario();
runHighRiskScenario();
runCriticalRiskScenario();

console.log('risk engine and alert checks passed');
