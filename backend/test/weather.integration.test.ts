import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { DataOrigin, MonitoredAreaType } from '../src/common/domain/enums';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'clima.integracao@example.com';

  backend.register({
    name: 'Clima Integracao',
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

function assertWeatherResponseShape(response: ReturnType<ReturnType<typeof createOrbitGuardFireBackend>['getLatestWeather']>): void {
  assertExactKeys(response, [
    'dataOrigin',
    'humidityPercent',
    'id',
    'monitoredAreaId',
    'observedAt',
    'precipitationMm',
    'sourceLabel',
    'temperatureC',
    'usedFallback',
    'windSpeedMs',
  ]);
}

function runLiveSnapshotScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area climatica viva',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    accessToken,
  );

  const observedAt = new Date('2026-06-07T13:00:00.000Z');
  backend.store.upsertWeatherSnapshot({
    id: randomUUID(),
    monitoredAreaId: area.id,
    dataOrigin: DataOrigin.LIVE,
    observedAt,
    temperatureC: 29.4,
    precipitationMm: 2.1,
    humidityPercent: 55,
    windSpeedMs: 3.2,
    sourceLabel: 'nasa-power-live',
    createdAt: observedAt,
    updatedAt: observedAt,
  });

  const response = backend.getLatestWeather(area.id, accessToken);

  assertWeatherResponseShape(response);
  assert.equal(response.dataOrigin, DataOrigin.LIVE);
  assert.equal(response.usedFallback, false);
  assert.equal(response.sourceLabel, 'nasa-power-live');
  assert.equal(response.observedAt, observedAt.toISOString());
  assert.equal(response.temperatureC, 29.4);
  assert.equal(response.precipitationMm, 2.1);
  assert.equal(response.humidityPercent, 55);
  assert.equal(response.windSpeedMs, 3.2);
}

function runExternalErrorFallbackScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area com erro externo',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    accessToken,
  );

  const originalGetLatestWeatherSnapshot = backend.store.getLatestWeatherSnapshot.bind(backend.store);
  backend.store.getLatestWeatherSnapshot = (() => {
    throw new Error('NASA POWER timeout');
  }) as typeof backend.store.getLatestWeatherSnapshot;

  const response = (() => {
    try {
      return backend.getLatestWeather(area.id, accessToken);
    } finally {
      backend.store.getLatestWeatherSnapshot = originalGetLatestWeatherSnapshot;
    }
  })();

  assertWeatherResponseShape(response);
  assert.equal(response.dataOrigin, DataOrigin.FALLBACK);
  assert.equal(response.usedFallback, true);
  assert.equal(response.sourceLabel, 'mock-scenario-critical');
  assert.equal(response.temperatureC, 33.2);
  assert.equal(response.precipitationMm, 0);
  assert.equal(response.humidityPercent, 28);
  assert.equal(response.windSpeedMs, 4.1);
}

function runSimulatedCoherentResponseScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area mock coerente',
      type: MonitoredAreaType.RURAL_COMMUNITY,
      latitude: -15.6854,
      longitude: -47.8123,
      radiusKm: 6,
    },
    accessToken,
  );

  const response = backend.getLatestWeather(area.id, accessToken);

  assertWeatherResponseShape(response);
  assert.equal(response.dataOrigin, DataOrigin.FALLBACK);
  assert.equal(response.usedFallback, true);
  assert.equal(response.sourceLabel, 'mock-scenario-moderate');
  assert.equal(response.temperatureC, 32.6);
  assert.equal(response.precipitationMm, 0.4);
  assert.equal(response.humidityPercent, 38);
  assert.equal(response.windSpeedMs, 5.3);
}

runLiveSnapshotScenario();
runExternalErrorFallbackScenario();
runSimulatedCoherentResponseScenario();

console.log('weather integration checks passed');
