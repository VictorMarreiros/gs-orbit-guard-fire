import { DataOrigin } from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { WeatherSnapshotResponseDto } from './contracts/weather.contracts';
import { WeatherSnapshotEntity } from './entities/weather-snapshot.entity';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { buildMockScenario } from '../integrations/mocks/mock-data';
import { interpretWeatherForRisk } from '../common/domain/weather-rules';

export class WeatherService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
  ) {}

  getLatestByAreaId(areaId: string, userId: string): WeatherSnapshotResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const scenario = buildMockScenario(area);
    let existingSnapshot: WeatherSnapshotEntity | undefined;

    try {
      existingSnapshot = this.store.getLatestWeatherSnapshot(areaId);
    } catch {
      return this.buildFallbackResponse(areaId, scenario);
    }

    if (!existingSnapshot) {
      return this.createAndReturnFallbackSnapshot(areaId, scenario);
    }

    const interpretation = interpretWeatherForRisk(existingSnapshot, scenario.weather);
    if (interpretation.usedFallback) {
      return this.updateAndReturnFallbackSnapshot(existingSnapshot, scenario, interpretation);
    }

    return {
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
