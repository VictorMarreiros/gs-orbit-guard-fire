import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { BackendLogger, type BackendLogEntry } from '../src/common/logging/backend-logger';
import { MonitoredAreaType } from '../src/common/domain/enums';

class RecordingLogSink {
  readonly entries: BackendLogEntry[] = [];

  write(entry: BackendLogEntry): void {
    this.entries.push(entry);
  }
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
  areaId: string;
  sink: RecordingLogSink;
} {
  const sink = new RecordingLogSink();
  const backend = createOrbitGuardFireBackend({ logger: new BackendLogger(sink) });
  sink.entries.length = 0;
  const email = 'observability@example.com';

  backend.register({
    name: 'Observability User',
    email,
    password: 'SenhaSegura789!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura789!',
  });

  const area = backend.createMonitoredArea(
    {
      name: 'Area observada',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    loginResponse.accessToken,
  );

  return {
    backend,
    accessToken: loginResponse.accessToken,
    areaId: area.id,
    sink,
  };
}

function assertNoSensitiveDetails(entry: BackendLogEntry): void {
  assert.equal(Object.prototype.hasOwnProperty.call(entry.details, 'latitude'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.details, 'longitude'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.details, 'accessToken'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.details, 'passwordHash'), false);
}

function runMockCollectionFallbackScenario(): void {
  const { backend, accessToken, areaId, sink } = createAuthenticatedBackend();
  const originalUpsertFireEvent = backend.store.upsertFireEvent.bind(backend.store);
  backend.store.upsertFireEvent = (() => {
    throw new Error('NASA FIRMS timeout');
  }) as typeof backend.store.upsertFireEvent;

  const response = backend.getFireEvents(areaId, { periodHours: 24 }, accessToken);

  backend.store.upsertFireEvent = originalUpsertFireEvent;

  assert.equal(response.source.usedFallback, true);
  assert.equal(response.summary.total, 4);

  const fireLogs = sink.entries.filter((entry) => entry.scope === 'fire-events');
  assert.deepEqual(
    fireLogs.map((entry) => ({ level: entry.level, event: entry.event })),
    [
      { level: 'INFO', event: 'mock-collection-start' },
      { level: 'ERROR', event: 'mock-collection-failure' },
      { level: 'INFO', event: 'mock-collection-success' },
    ],
  );
  assert.equal(fireLogs[1]?.details.errorMessage, 'NASA FIRMS timeout');
  fireLogs.forEach(assertNoSensitiveDetails);
}

function runRiskCalculationFailureScenario(): void {
  const { backend, accessToken, areaId, sink } = createAuthenticatedBackend();
  const originalGetByAreaId = backend.fireEventsService.getByAreaId.bind(backend.fireEventsService);
  backend.fireEventsService.getByAreaId = (() => {
    throw new Error('fire events unavailable');
  }) as typeof backend.fireEventsService.getByAreaId;

  assert.throws(() => backend.calculateRisk(areaId, { periodHours: 24 }, accessToken), /fire events unavailable/);

  backend.fireEventsService.getByAreaId = originalGetByAreaId;

  const riskLogs = sink.entries.filter((entry) => entry.scope === 'risk-engine');
  assert.deepEqual(
    riskLogs.map((entry) => ({ level: entry.level, event: entry.event })),
    [
      { level: 'INFO', event: 'risk-calculation-start' },
      { level: 'ERROR', event: 'risk-calculation-failure' },
    ],
  );
  assert.equal(riskLogs[1]?.details.errorMessage, 'fire events unavailable');
  riskLogs.forEach(assertNoSensitiveDetails);
}

function runAlertGenerationSuccessScenario(): void {
  const { backend, accessToken, areaId, sink } = createAuthenticatedBackend();

  const risk = backend.calculateRisk(areaId, { periodHours: 24 }, accessToken);

  assert.equal(risk.alertTriggered, true);

  const alertLogs = sink.entries.filter((entry) => entry.scope === 'alerts');
  assert.deepEqual(
    alertLogs.map((entry) => ({ level: entry.level, event: entry.event })),
    [
      { level: 'INFO', event: 'alert-generation-start' },
      { level: 'INFO', event: 'alert-generation-success' },
    ],
  );
  assert.equal(alertLogs[1]?.details.alertStatus, 'ACTIVE');
  assert.equal(alertLogs[1]?.details.alertLevel, 'CRITICAL');
  alertLogs.forEach(assertNoSensitiveDetails);
}

function runAlertGenerationFailureScenario(): void {
  const { backend, accessToken, areaId, sink } = createAuthenticatedBackend();
  const originalUpsertAlert = backend.store.upsertAlert.bind(backend.store);
  backend.store.upsertAlert = (() => {
    throw new Error('alert store unavailable');
  }) as typeof backend.store.upsertAlert;

  assert.throws(() => backend.calculateRisk(areaId, { periodHours: 24 }, accessToken), /alert store unavailable/);

  backend.store.upsertAlert = originalUpsertAlert;

  const alertLogs = sink.entries.filter((entry) => entry.scope === 'alerts');
  assert.deepEqual(
    alertLogs.map((entry) => ({ level: entry.level, event: entry.event })),
    [
      { level: 'INFO', event: 'alert-generation-start' },
      { level: 'ERROR', event: 'alert-generation-failure' },
    ],
  );
  assert.equal(alertLogs[1]?.details.errorMessage, 'alert store unavailable');
  alertLogs.forEach(assertNoSensitiveDetails);
}

runMockCollectionFallbackScenario();
runRiskCalculationFailureScenario();
runAlertGenerationSuccessScenario();
runAlertGenerationFailureScenario();

console.log('observability logging checks passed');
