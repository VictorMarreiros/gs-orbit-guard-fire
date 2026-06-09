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

function runOperationalMetricsScenario(): void {
  const backend = createOrbitGuardFireBackend({ logger: new BackendLogger(new RecordingLogSink()) });
  const initialMetrics = backend.getOperationalMetrics();

  const loginResponse = backend.login({
    email: 'maria@example.com',
    password: 'SenhaSegura123!',
  });
  const area = backend.createMonitoredArea(
    {
      name: 'Area operacional',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    loginResponse.accessToken,
  );
  const accessToken = loginResponse.accessToken;
  const areaId = area.id;

  assert.equal(initialMetrics.dashboard.monitoredAreasCount, 3);
  assert.equal(initialMetrics.dashboard.activeAlertsCount, 1);
  assert.equal(initialMetrics.dashboard.averageRiskScore, 47);
  assert.deepEqual(initialMetrics.integrationFailures, {
    startup: 0,
    fireEvents: 0,
    weather: 0,
    risk: 0,
    alerts: 0,
    total: 0,
  });

  const originalUpsertFireEvent = backend.store.upsertFireEvent.bind(backend.store);
  backend.store.upsertFireEvent = (() => {
    throw new Error('fire event collector unavailable');
  }) as typeof backend.store.upsertFireEvent;

  const fireEventsResponse = backend.getFireEvents(areaId, { periodHours: 24 }, accessToken);
  assert.equal(fireEventsResponse.source.usedFallback, true);

  backend.store.upsertFireEvent = originalUpsertFireEvent;

  const originalGetLatestWeatherSnapshot = backend.store.getLatestWeatherSnapshot.bind(backend.store);
  backend.store.getLatestWeatherSnapshot = (() => {
    throw new Error('weather collector unavailable');
  }) as typeof backend.store.getLatestWeatherSnapshot;

  const weatherResponse = backend.getLatestWeather(areaId, accessToken);
  assert.equal(weatherResponse.usedFallback, true);

  backend.store.getLatestWeatherSnapshot = originalGetLatestWeatherSnapshot;

  const originalFireEventsService = backend.fireEventsService.getByAreaId.bind(backend.fireEventsService);
  backend.fireEventsService.getByAreaId = (() => {
    throw new Error('risk dependency unavailable');
  }) as typeof backend.fireEventsService.getByAreaId;

  assert.throws(() => backend.calculateRisk(areaId, { periodHours: 24 }, accessToken), /risk dependency unavailable/);

  backend.fireEventsService.getByAreaId = originalFireEventsService;

  const originalUpsertAlert = backend.store.upsertAlert.bind(backend.store);
  backend.store.upsertAlert = (() => {
    throw new Error('alert writer unavailable');
  }) as typeof backend.store.upsertAlert;

  assert.throws(() => backend.calculateRisk(areaId, { periodHours: 24 }, accessToken), /alert writer unavailable/);

  backend.store.upsertAlert = originalUpsertAlert;

  const finalMetrics = backend.getOperationalMetrics(accessToken);

  assert.equal(finalMetrics.dashboard.activeAlertsCount, 1);
  assert.equal(finalMetrics.dashboard.averageRiskScore > 0, true);
  assert.deepEqual(finalMetrics.integrationFailures, {
    startup: 0,
    fireEvents: 1,
    weather: 1,
    risk: 1,
    alerts: 1,
    total: 4,
  });
}

runOperationalMetricsScenario();

console.log('operational metrics checks passed');
