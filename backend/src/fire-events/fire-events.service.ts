import { randomUUID } from 'crypto';
import { DataOrigin, FireEventRelevance, FireEventSource } from '../common/domain/enums';
import { roundTo } from '../common/domain/math';
import {
  FireEventItemDto,
  FireEventsResponseDto,
  GetFireEventsQueryDto,
} from './contracts/fire-events.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { buildMockScenario, fallbackOrigin, fallbackSource } from '../integrations/mocks/mock-data';
import { FireEventEntity } from './entities/fire-event.entity';

export class FireEventsService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
  ) {}

  getByAreaId(areaId: string, query: GetFireEventsQueryDto, userId: string): FireEventsResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const periodHours = query.periodHours ?? 24;
    const scenario = buildMockScenario(area);

    this.store.setScenario(area.id, scenario.key);
    this.ensureSeededFireEvents(area.id, scenario);

    const links = this.store.listFireEventsByArea(area.id).filter((entry) => {
      const ageHours = (Date.now() - entry.fireEvent.detectedAt.getTime()) / (60 * 60 * 1000);
      return ageHours <= periodHours;
    });

    const items: FireEventItemDto[] = links.map(({ fireEvent, link }) => ({
      id: fireEvent.id,
      externalId: fireEvent.externalId ?? undefined,
      source: fireEvent.source,
      dataOrigin: fireEvent.dataOrigin,
      latitude: Number(fireEvent.latitude),
      longitude: Number(fireEvent.longitude),
      detectedAt: fireEvent.detectedAt.toISOString(),
      distanceKm: Number(link.distanceKm),
      relevance: link.relevance,
      intensity: fireEvent.intensity ? Number(fireEvent.intensity) : undefined,
      confidence: fireEvent.confidence ? Number(fireEvent.confidence) : undefined,
    }));

    return {
      areaId,
      periodHours,
      source: {
        mode: fallbackOrigin(),
        provider: fallbackSource(),
        usedFallback: true,
      },
      summary: {
        total: items.length,
        insideCount: items.filter((item) => item.relevance === FireEventRelevance.INSIDE).length,
        nearbyCount: items.filter((item) => item.relevance === FireEventRelevance.NEARBY).length,
      },
      items,
    };
  }

  private ensureSeededFireEvents(areaId: string, scenario: ReturnType<typeof buildMockScenario>): void {
    if (this.store.listFireEventsByArea(areaId).length > 0) {
      return;
    }

    const now = new Date();
    for (const generated of scenario.fireEvents) {
      const fireEvent = this.store.upsertFireEvent({
        id: randomUUID(),
        externalId: generated.externalId,
        source: FireEventSource.MOCK,
        dataOrigin: DataOrigin.FALLBACK,
        latitude: roundTo(generated.latitude, 6),
        longitude: roundTo(generated.longitude, 6),
        detectedAt: generated.detectedAt,
        recordedAt: now,
        intensity: roundTo(generated.intensity, 2),
        confidence: roundTo(generated.confidence, 2),
        createdAt: now,
        updatedAt: now,
      } as FireEventEntity);

      this.store.upsertAreaFireEvent({
        id: randomUUID(),
        monitoredAreaId: areaId,
        fireEventId: fireEvent.id,
        distanceKm: roundTo(generated.distanceKm, 2),
        relevance: generated.relevance,
        consideredAt: now,
      });
    }
  }
}
