import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { DataOrigin, FireEventRelevance, FireEventSource, MonitoredAreaType, RiskLevel } from '../src/common/domain/enums';

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'resiliencia.integracao@example.com';

  backend.register({
    name: 'Resiliencia Integracao',
    email,
    password: 'SenhaSegura321!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura321!',
  });

  return {
    backend,
    accessToken: loginResponse.accessToken,
  };
}

function run(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area resiliente',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    accessToken,
  );

  const originalUpsertFireEvent = backend.store.upsertFireEvent.bind(backend.store);
  backend.store.upsertFireEvent = (() => {
    throw new Error('NASA FIRMS timeout');
  }) as typeof backend.store.upsertFireEvent;

  const fireEvents = backend.getFireEvents(area.id, { periodHours: 24 }, accessToken);

  assert.deepEqual(fireEvents.source, {
    mode: DataOrigin.FALLBACK,
    provider: FireEventSource.MOCK,
    usedFallback: true,
  });
  assert.equal(fireEvents.summary.total, 4);
  assert.equal(fireEvents.summary.insideCount, 2);
  assert.equal(fireEvents.summary.nearbyCount, 2);
  assert.equal(fireEvents.items.length, 4);
  assert.ok(fireEvents.items.every((item) => item.dataOrigin === DataOrigin.FALLBACK));
  assert.ok(fireEvents.items.every((item) => item.source === FireEventSource.MOCK));

  const originalGetLatestWeatherSnapshot = backend.store.getLatestWeatherSnapshot.bind(backend.store);
  backend.store.getLatestWeatherSnapshot = (() => {
    throw new Error('NASA POWER timeout');
  }) as typeof backend.store.getLatestWeatherSnapshot;

  const weather = backend.getLatestWeather(area.id, accessToken);

  assert.equal(weather.dataOrigin, DataOrigin.FALLBACK);
  assert.equal(weather.usedFallback, true);
  assert.equal(weather.sourceLabel, 'mock-scenario-critical');
  assert.equal(weather.temperatureC, 33.2);
  assert.equal(weather.precipitationMm, 0);
  assert.equal(weather.humidityPercent, 28);
  assert.equal(weather.windSpeedMs, 4.1);

  backend.store.upsertFireEvent = originalUpsertFireEvent;
  backend.store.getLatestWeatherSnapshot = originalGetLatestWeatherSnapshot;

  const risk = backend.calculateRisk(area.id, { periodHours: 24 }, accessToken);
  const alerts = backend.listAlerts({}, accessToken);
  const dashboard = backend.getDashboardSummary(accessToken);

  assert.equal(risk.level, RiskLevel.CRITICAL);
  assert.equal(risk.score, 95);
  assert.equal(risk.alertTriggered, true);
  assert.equal(risk.dataSources.fireEvents, DataOrigin.FALLBACK);
  assert.equal(risk.dataSources.weather, DataOrigin.FALLBACK);
  assert.ok(risk.factors.some((factor) => factor.code === 'NEAR_FIRE_CRITICAL'));
  assert.ok(risk.factors.some((factor) => factor.code === 'FIRE_CLUSTER'));

  assert.equal(alerts.total, 1);
  assert.equal(alerts.items[0]?.level, RiskLevel.CRITICAL);
  assert.equal(alerts.items[0]?.areaName, area.name);

  assert.equal(dashboard.activeAlertsCount, 1);
  assert.equal(dashboard.hasActiveAlerts, true);
  assert.equal(dashboard.priorityAreas[0]?.areaName, area.name);
  assert.equal(dashboard.priorityAreas[0]?.score, 95);

  assert.ok(fireEvents.items.some((item) => item.relevance === FireEventRelevance.INSIDE));
  assert.ok(fireEvents.items.some((item) => item.relevance === FireEventRelevance.NEARBY));
}

run();

console.log('resilience integration checks passed');
