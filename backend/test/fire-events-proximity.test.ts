import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { classifyFireEventRelevance } from '../src/common/domain/fire-event-proximity';
import { DataOrigin, FireEventRelevance, FireEventSource, MonitoredAreaType } from '../src/common/domain/enums';
import { OrbitGuardStore } from '../src/integrations/memory/orbitguard-store';
import { MonitoredAreasService } from '../src/monitored-areas/monitored-areas.service';
import { FireEventsService } from '../src/fire-events/fire-events.service';
import { WeatherService } from '../src/weather/weather.service';
import { RiskEngineService } from '../src/risk-engine/risk-engine.service';

const userId = 'user-456';

function run(): void {
  assert.equal(classifyFireEventRelevance(2, 10, 5), FireEventRelevance.INSIDE);
  assert.equal(classifyFireEventRelevance(14.9, 10, 5), FireEventRelevance.NEARBY);
  assert.equal(classifyFireEventRelevance(16, 10, 5), FireEventRelevance.OUTSIDE);

  const store = new OrbitGuardStore();
  const monitoredAreasService = new MonitoredAreasService(store);
  const fireEventsService = new FireEventsService(store, monitoredAreasService);
  const weatherService = new WeatherService(store, monitoredAreasService);
  const riskEngineService = new RiskEngineService(store, monitoredAreasService, fireEventsService, weatherService);

  const area = monitoredAreasService.create(
    {
      name: 'Area teste periferica',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.5,
      longitude: -47.5,
      radiusKm: 2,
    },
    userId,
  );

  const now = new Date();
  const outsideEvent = store.upsertFireEvent({
    id: randomUUID(),
    externalId: 'outside-001',
    source: FireEventSource.MOCK,
    dataOrigin: DataOrigin.FALLBACK,
    latitude: -15.1,
    longitude: -47.1,
    detectedAt: new Date(now.getTime() - 60 * 60 * 1000),
    recordedAt: now,
    distanceKm: 18,
    relevance: FireEventRelevance.OUTSIDE,
    createdAt: now,
    updatedAt: now,
  });

  store.upsertAreaFireEvent({
    id: randomUUID(),
    monitoredAreaId: area.id,
    fireEventId: outsideEvent.id,
    distanceKm: 18,
    relevance: FireEventRelevance.OUTSIDE,
    consideredAt: now,
  });

  const fireEvents = fireEventsService.getByAreaId(area.id, { periodHours: 24 }, userId);
  assert.equal(fireEvents.summary.total, 0);
  assert.equal(fireEvents.items.length, 0);

  const risk = riskEngineService.calculate(area.id, userId, 24, true);
  assert.equal(risk.score, 0);
  assert.equal(risk.level, 'LOW');
  assert.equal(risk.contributingSignals.fireEventsConsidered, 0);
}

run();

console.log('fire-events proximity checks passed');
