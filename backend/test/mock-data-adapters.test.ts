import assert from 'node:assert/strict';
import { MonitoredAreaType } from '../src/common/domain/enums';
import { OrbitGuardStore } from '../src/integrations/memory/orbitguard-store';
import { FireEventsService } from '../src/fire-events/fire-events.service';
import { MonitoredAreasService } from '../src/monitored-areas/monitored-areas.service';
import { WeatherService } from '../src/weather/weather.service';

const userId = 'user-mock-adapters';

function createServices(): {
  store: OrbitGuardStore;
  monitoredAreasService: MonitoredAreasService;
  fireEventsService: FireEventsService;
  weatherService: WeatherService;
} {
  const store = new OrbitGuardStore();
  const monitoredAreasService = new MonitoredAreasService(store);

  return {
    store,
    monitoredAreasService,
    fireEventsService: new FireEventsService(store, monitoredAreasService),
    weatherService: new WeatherService(store, monitoredAreasService),
  };
}

function createArea(monitoredAreasService: MonitoredAreasService, radiusKm: number) {
  return monitoredAreasService.create(
    {
      name: `Area mock ${radiusKm}`,
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.78,
      longitude: -47.92,
      radiusKm,
    },
    userId,
  );
}

function assertWeatherResponse(
  response: ReturnType<WeatherService['getLatestByAreaId']>,
  expected: {
    sourceLabel: string;
    temperatureC: number;
    precipitationMm: number;
    humidityPercent: number;
    windSpeedMs: number;
  },
): void {
  assert.equal(response.dataOrigin, 'FALLBACK');
  assert.equal(response.usedFallback, true);
  assert.equal(response.sourceLabel, expected.sourceLabel);
  assert.equal(response.temperatureC, expected.temperatureC);
  assert.equal(response.precipitationMm, expected.precipitationMm);
  assert.equal(response.humidityPercent, expected.humidityPercent);
  assert.equal(response.windSpeedMs, expected.windSpeedMs);
  assert.equal(new Date(response.observedAt).toISOString(), response.observedAt);
}

function run(): void {
  {
    const { monitoredAreasService, fireEventsService, weatherService } = createServices();
    const area = createArea(monitoredAreasService, 10);

    const fireEvents = fireEventsService.getByAreaId(area.id, { periodHours: 24 }, userId);
    assert.deepEqual(fireEvents.source, {
      mode: 'FALLBACK',
      provider: 'MOCK',
      usedFallback: true,
    });
    assert.equal(fireEvents.summary.total, 4);
    assert.equal(fireEvents.summary.insideCount, 2);
    assert.equal(fireEvents.summary.nearbyCount, 2);
    assert.equal(fireEvents.items.length, 4);
    assert.ok(fireEvents.items.every((item) => item.dataOrigin === 'FALLBACK'));
    assert.ok(fireEvents.items.every((item) => item.source === 'MOCK'));
    assert.ok(fireEvents.items.every((item) => item.distanceKm > 0));

    assertWeatherResponse(weatherService.getLatestByAreaId(area.id, userId), {
      sourceLabel: 'mock-scenario-critical',
      temperatureC: 33.2,
      precipitationMm: 0,
      humidityPercent: 28,
      windSpeedMs: 4.1,
    });
  }

  {
    const { monitoredAreasService, fireEventsService, weatherService } = createServices();
    const area = createArea(monitoredAreasService, 6);

    const fireEvents = fireEventsService.getByAreaId(area.id, { periodHours: 24 }, userId);
    assert.deepEqual(fireEvents.source, {
      mode: 'FALLBACK',
      provider: 'MOCK',
      usedFallback: true,
    });
    assert.equal(fireEvents.summary.total, 2);
    assert.equal(fireEvents.summary.insideCount, 0);
    assert.equal(fireEvents.summary.nearbyCount, 2);
    assert.equal(fireEvents.items.length, 2);
    assert.ok(fireEvents.items.every((item) => item.relevance === 'NEARBY'));

    assertWeatherResponse(weatherService.getLatestByAreaId(area.id, userId), {
      sourceLabel: 'mock-scenario-moderate',
      temperatureC: 32.6,
      precipitationMm: 0.4,
      humidityPercent: 38,
      windSpeedMs: 5.3,
    });
  }

  {
    const { monitoredAreasService, fireEventsService, weatherService } = createServices();
    const area = createArea(monitoredAreasService, 3);

    const fireEvents = fireEventsService.getByAreaId(area.id, { periodHours: 24 }, userId);
    assert.deepEqual(fireEvents.source, {
      mode: 'FALLBACK',
      provider: 'MOCK',
      usedFallback: true,
    });
    assert.equal(fireEvents.summary.total, 0);
    assert.equal(fireEvents.summary.insideCount, 0);
    assert.equal(fireEvents.summary.nearbyCount, 0);
    assert.equal(fireEvents.items.length, 0);

    assertWeatherResponse(weatherService.getLatestByAreaId(area.id, userId), {
      sourceLabel: 'mock-scenario-low',
      temperatureC: 27.6,
      precipitationMm: 4.8,
      humidityPercent: 61,
      windSpeedMs: 2.7,
    });
  }
}

run();

console.log('mock data adapter checks passed');
