import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { MonitoredAreaType } from '../src/common/domain/enums';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'mapa.suporte@example.com';

  backend.register({
    name: 'Mapa Suporte',
    email,
    password: 'SenhaSegura789!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura789!',
  });

  return {
    backend,
    accessToken: loginResponse.accessToken,
  };
}

function runSpatialMapScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const createdArea = backend.createMonitoredArea(
    {
      name: 'Fazenda Santa Luzia',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    accessToken,
  );

  const mapResponse = backend.getMonitoredArea(createdArea.id, accessToken);
  const fireEventsResponse = backend.getFireEvents(createdArea.id, { periodHours: 24 }, accessToken);

  assertExactKeys(mapResponse, ['area', 'mapContext']);
  assert.deepEqual(mapResponse.area, createdArea);
  assert.deepEqual(mapResponse.mapContext.center, {
    latitude: -15.7801,
    longitude: -47.9292,
  });
  assert.equal(mapResponse.mapContext.monitoredRadiusKm, 10);
  assert.equal(mapResponse.mapContext.operationalRadiusKm, 15);
  assert.deepEqual(mapResponse.mapContext.legend, [
    { key: 'area-center', label: 'Centro da area' },
    { key: 'monitored-radius', label: 'Raio monitorado' },
    { key: 'operational-radius', label: 'Vizinhanca operacional' },
    { key: 'fire-inside', label: 'Foco dentro do raio' },
    { key: 'fire-nearby', label: 'Foco proximo ao raio' },
  ]);

  assert.deepEqual(fireEventsResponse.source, {
    mode: 'FALLBACK',
    provider: 'MOCK',
    usedFallback: true,
  });
  assert.equal(fireEventsResponse.areaId, createdArea.id);
  assert.equal(fireEventsResponse.periodHours, 24);
  assert.equal(fireEventsResponse.summary.total, 4);
  assert.equal(fireEventsResponse.summary.insideCount, 2);
  assert.equal(fireEventsResponse.summary.nearbyCount, 2);
  assert.equal(fireEventsResponse.items.length, 4);
  assert.ok(fireEventsResponse.items.some((item) => item.relevance === 'INSIDE'));
  assert.ok(fireEventsResponse.items.some((item) => item.relevance === 'NEARBY'));
  assert.ok(
    fireEventsResponse.items.every(
      (item) => item.distanceKm <= mapResponse.mapContext.operationalRadiusKm,
    ),
  );
}

runSpatialMapScenario();

console.log('monitored area map integration checks passed');
