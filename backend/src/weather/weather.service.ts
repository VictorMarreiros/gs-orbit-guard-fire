import { DataOrigin } from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { WeatherSnapshotResponseDto } from './contracts/weather.contracts';
import { WeatherSnapshotEntity } from './entities/weather-snapshot.entity';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { buildMockScenario } from '../integrations/mocks/mock-data';
import { interpretWeatherForRisk } from '../common/domain/weather-rules';
import { BackendLogger, BackendLoggerLike } from '../common/logging/backend-logger';
import { OperationalMetricsRecorder } from '../common/metrics/operational-metrics';

export class WeatherService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
    private readonly logger: BackendLoggerLike = new BackendLogger(),
    private readonly operationalMetricsRecorder: OperationalMetricsRecorder = new OperationalMetricsRecorder(),
  ) {}

  getLatestByAreaId(areaId: string, userId: string): WeatherSnapshotResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const scenario = buildMockScenario(area);
    let existingSnapshot: WeatherSnapshotEntity | undefined;

    this.logger.info('weather', 'mock-collection-start', 'Starting mock weather collection.', {
      areaId,
    });

    try {
      existingSnapshot = this.store.getLatestWeatherSnapshot(areaId);
    } catch (error) {
      this.operationalMetricsRecorder.recordIntegrationFailure('weather');
      const response = this.buildFallbackResponse(areaId, scenario);
      this.logger.error('weather', 'mock-collection-failure', 'Mock weather collection failed; using fallback dataset.', {
        areaId,
        usedFallback: true,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      this.logger.info('weather', 'mock-collection-success', 'Mock weather collection completed using fallback dataset.', {
        areaId,
        usedFallback: true,
        sourceLabel: response.sourceLabel,
      });
      return response;
    }

    if (!existingSnapshot) {
      const response = this.createAndReturnFallbackSnapshot(areaId, scenario);
      this.logger.info('weather', 'mock-collection-success', 'Mock weather collection completed using fallback dataset.', {
        areaId,
        usedFallback: true,
        sourceLabel: response.sourceLabel,
      });
      return response;
    }

    const interpretation = interpretWeatherForRisk(existingSnapshot, scenario.weather);
    if (interpretation.usedFallback) {
      const response = this.updateAndReturnFallbackSnapshot(existingSnapshot, scenario, interpretation);
      this.logger.info('weather', 'mock-collection-success', 'Mock weather collection completed using fallback normalization.', {
        areaId,
        usedFallback: true,
        sourceLabel: response.sourceLabel,
      });
      return response;
    }

    const response = {
      id: existingSnapshot.id,
      monitoredAreaId: existingSnapshot.monitoredAreaId,
      dataOrigin: existingSnapshot.dataOrigin,
      sourceLabel: existingSnapshot.sourceLabel,
      observedAt: existingSnapshot.observedAt.toISOString(),
      temperatureC: interpretation.temperatureC,
      precipitationMm: interpretation.precipitationMm,
      humidityPercent: interpretation.humidityPercent,
      windSpeedMs: interpretation.windSpeedMs,
      usedFallback: existingSnapshot.dataOrigin !== DataOrigin.LIVE,
    };
    this.logger.info('weather', 'mock-collection-success', 'Mock weather collection completed.', {
      areaId,
      usedFallback: response.usedFallback,
      sourceLabel: response.sourceLabel,
      dataOrigin: response.dataOrigin,
    });
    return response;
  }

  private createAndReturnFallbackSnapshot(
    areaId: string,
    scenario: ReturnType<typeof buildMockScenario>,
  ): WeatherSnapshotResponseDto {
    const snapshot = this.upsertFallbackSnapshot(areaId, scenario);
    return this.toResponse(snapshot, true);
  }

  private updateAndReturnFallbackSnapshot(
    snapshot: WeatherSnapshotEntity,
    scenario: ReturnType<typeof buildMockScenario>,
    interpretation: ReturnType<typeof interpretWeatherForRisk>,
  ): WeatherSnapshotResponseDto {
    const updatedSnapshot = this.upsertFallbackSnapshot(snapshot.monitoredAreaId, scenario, snapshot.id, snapshot.createdAt);
    return {
      ...this.toResponse(updatedSnapshot, true),
      temperatureC: interpretation.temperatureC,
      precipitationMm: interpretation.precipitationMm,
      humidityPercent: interpretation.humidityPercent,
      windSpeedMs: interpretation.windSpeedMs,
    };
  }

  private buildFallbackResponse(
    areaId: string,
    scenario: ReturnType<typeof buildMockScenario>,
  ): WeatherSnapshotResponseDto {
    const snapshot = this.buildFallbackSnapshot(areaId, scenario);
    return this.toResponse(snapshot, true);
  }

  private upsertFallbackSnapshot(
    areaId: string,
    scenario: ReturnType<typeof buildMockScenario>,
    snapshotId?: string,
    createdAt?: Date,
  ): WeatherSnapshotEntity {
    const now = new Date();
    const snapshot: WeatherSnapshotEntity = {
      id: snapshotId ?? randomUUID(),
      monitoredAreaId: areaId,
      dataOrigin: DataOrigin.FALLBACK,
      observedAt: scenario.weather.observedAt,
      temperatureC: scenario.weather.temperatureC,
      precipitationMm: scenario.weather.precipitationMm,
      humidityPercent: scenario.weather.humidityPercent,
      windSpeedMs: scenario.weather.windSpeedMs,
      sourceLabel: scenario.weather.sourceLabel,
      createdAt: createdAt ?? now,
      updatedAt: now,
    };

    this.store.upsertWeatherSnapshot(snapshot);
    return snapshot;
  }

  private buildFallbackSnapshot(
    areaId: string,
    scenario: ReturnType<typeof buildMockScenario>,
  ): WeatherSnapshotEntity {
    return {
      id: randomUUID(),
      monitoredAreaId: areaId,
      dataOrigin: DataOrigin.FALLBACK,
      observedAt: scenario.weather.observedAt,
      temperatureC: scenario.weather.temperatureC,
      precipitationMm: scenario.weather.precipitationMm,
      humidityPercent: scenario.weather.humidityPercent,
      windSpeedMs: scenario.weather.windSpeedMs,
      sourceLabel: scenario.weather.sourceLabel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private toResponse(snapshot: WeatherSnapshotEntity, usedFallback: boolean): WeatherSnapshotResponseDto {
    return {
      id: snapshot.id,
      monitoredAreaId: snapshot.monitoredAreaId,
      dataOrigin: snapshot.dataOrigin,
      sourceLabel: snapshot.sourceLabel,
      observedAt: snapshot.observedAt.toISOString(),
      temperatureC: snapshot.temperatureC,
      precipitationMm: snapshot.precipitationMm,
      humidityPercent: snapshot.humidityPercent,
      windSpeedMs: snapshot.windSpeedMs,
      usedFallback,
    };
  }
}
