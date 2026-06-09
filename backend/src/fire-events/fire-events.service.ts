import { randomUUID } from 'crypto';
import { DataOrigin, FireEventRelevance, FireEventSource } from '../common/domain/enums';
import { isRelevantFireEvent } from '../common/domain/fire-event-proximity';
import { roundTo } from '../common/domain/math';
import { BackendLogger, BackendLoggerLike } from '../common/logging/backend-logger';
import {
  FireEventItemDto,
  FireEventsResponseDto,
  GetFireEventsQueryDto,
} from './contracts/fire-events.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { buildMockScenario, fallbackOrigin, fallbackSource } from '../integrations/mocks/mock-data';
import { FireEventEntity } from './entities/fire-event.entity';
import { OperationalMetricsRecorder } from '../common/metrics/operational-metrics';

export class FireEventsService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
    private readonly logger: BackendLoggerLike = new BackendLogger(),
    private readonly operationalMetricsRecorder: OperationalMetricsRecorder = new OperationalMetricsRecorder(),
  ) {}

  getByAreaId(areaId: string, query: GetFireEventsQueryDto, userId: string): FireEventsResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const periodHours = query.periodHours ?? 24;
    const scenario = buildMockScenario(area);

    this.logger.info('fire-events', 'mock-collection-start', 'Starting mock fire-event collection.', {
      areaId,
      periodHours,
    });
    this.store.setScenario(area.id, scenario.key);
    try {
      this.ensureSeededFireEvents(area.id, scenario);
      const response = this.buildResponse(area.id, periodHours, area.radiusKm, area.operationalBufferKm);
      this.logger.info('fire-events', 'mock-collection-success', 'Mock fire-event collection completed.', {
        areaId,
        periodHours,
        total: response.summary.total,
        insideCount: response.summary.insideCount,
        nearbyCount: response.summary.nearbyCount,
        usedFallback: false,
      });
      return response;
    } catch (error) {
      this.operationalMetricsRecorder.recordIntegrationFailure('fire-events');
      const fallbackResponse = this.buildFallbackResponse(area.id, periodHours, area.radiusKm, area.operationalBufferKm, scenario);
      this.logger.error('fire-events', 'mock-collection-failure', 'Mock fire-event collection failed; using fallback dataset.', {
        areaId,
        periodHours,
        usedFallback: true,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      this.logger.info('fire-events', 'mock-collection-success', 'Mock fire-event collection completed using fallback dataset.', {
        areaId,
        periodHours,
        total: fallbackResponse.summary.total,
        insideCount: fallbackResponse.summary.insideCount,
        nearbyCount: fallbackResponse.summary.nearbyCount,
        usedFallback: true,
      });
      return fallbackResponse;
    }
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

  private buildResponse(
    areaId: string,
    periodHours: number,
    areaRadiusKm: number,
    operationalBufferKm: number,
  ): FireEventsResponseDto {
    const links = this.store.listFireEventsByArea(areaId).filter((entry) => {
      const ageHours = (Date.now() - entry.fireEvent.detectedAt.getTime()) / (60 * 60 * 1000);
      return ageHours <= periodHours;
    });

    return this.toResponse(areaId, periodHours, links, areaRadiusKm, operationalBufferKm);
  }

  private buildFallbackResponse(
    areaId: string,
    periodHours: number,
    areaRadiusKm: number,
    operationalBufferKm: number,
    scenario: ReturnType<typeof buildMockScenario>,
  ): FireEventsResponseDto {
    const links = scenario.fireEvents
      .filter((fireEvent) => {
        const ageHours = (Date.now() - fireEvent.detectedAt.getTime()) / (60 * 60 * 1000);
        return ageHours <= periodHours;
      })
      .map((fireEvent) => ({
        fireEvent: {
          id: randomUUID(),
          externalId: fireEvent.externalId,
          source: FireEventSource.MOCK,
          dataOrigin: DataOrigin.FALLBACK,
          latitude: fireEvent.latitude,
          longitude: fireEvent.longitude,
          detectedAt: fireEvent.detectedAt,
          recordedAt: fireEvent.detectedAt,
          intensity: fireEvent.intensity,
          confidence: fireEvent.confidence,
          createdAt: fireEvent.detectedAt,
          updatedAt: fireEvent.detectedAt,
        } as FireEventEntity,
        link: {
          id: randomUUID(),
          monitoredAreaId: areaId,
          fireEventId: randomUUID(),
          distanceKm: fireEvent.distanceKm,
          relevance: fireEvent.relevance,
          consideredAt: fireEvent.detectedAt,
        },
      }))
      .filter((entry) =>
        isRelevantFireEvent(entry.link.distanceKm, areaRadiusKm, operationalBufferKm),
      );

    return this.toResponse(areaId, periodHours, links, areaRadiusKm, operationalBufferKm);
  }

  private toResponse(
    areaId: string,
    periodHours: number,
    links: Array<{ fireEvent: FireEventEntity; link: { distanceKm: number; relevance: FireEventRelevance } }>,
    areaRadiusKm: number,
    operationalBufferKm: number,
  ): FireEventsResponseDto {
    const items: FireEventItemDto[] = links
      .filter(({ link }) => isRelevantFireEvent(link.distanceKm, areaRadiusKm, operationalBufferKm))
      .map(({ fireEvent, link }) => ({
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
}
