import { DataOrigin } from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { NotFoundApplicationError } from '../common/errors';
import { WeatherSnapshotResponseDto } from './contracts/weather.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { buildMockScenario, fallbackOrigin } from '../integrations/mocks/mock-data';
import { interpretWeatherForRisk } from '../common/domain/weather-rules';

export class WeatherService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
  ) {}

  getLatestByAreaId(areaId: string, userId: string): WeatherSnapshotResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const scenario = buildMockScenario(area);
    const existingSnapshot = this.store.getLatestWeatherSnapshot(areaId);

    if (!existingSnapshot) {
      const now = new Date();
      this.store.upsertWeatherSnapshot({
        id: randomUUID(),
        monitoredAreaId: areaId,
        dataOrigin: DataOrigin.FALLBACK,
        observedAt: scenario.weather.observedAt,
        temperatureC: scenario.weather.temperatureC,
        precipitationMm: scenario.weather.precipitationMm,
        humidityPercent: scenario.weather.humidityPercent,
        windSpeedMs: scenario.weather.windSpeedMs,
        sourceLabel: scenario.weather.sourceLabel,
        createdAt: now,
        updatedAt: now,
      });
    }

    const snapshot = this.store.getLatestWeatherSnapshot(areaId);
    if (!snapshot) {
      throw new NotFoundApplicationError('Snapshot climatico nao encontrado.', 'WEATHER_SNAPSHOT_NOT_FOUND');
    }

    const interpretation = interpretWeatherForRisk(snapshot, scenario.weather);
    if (interpretation.usedFallback && existingSnapshot) {
      const now = new Date();
      this.store.upsertWeatherSnapshot({
        ...snapshot,
        dataOrigin: DataOrigin.FALLBACK,
        observedAt: scenario.weather.observedAt,
        temperatureC: interpretation.temperatureC,
        precipitationMm: interpretation.precipitationMm,
        humidityPercent: interpretation.humidityPercent,
        windSpeedMs: interpretation.windSpeedMs,
        sourceLabel: scenario.weather.sourceLabel,
        updatedAt: now,
      });
    }

    const responseObservedAt = interpretation.usedFallback ? scenario.weather.observedAt : snapshot.observedAt;
    const responseSourceLabel = interpretation.usedFallback ? scenario.weather.sourceLabel : snapshot.sourceLabel;

    return {
      id: snapshot.id,
      monitoredAreaId: snapshot.monitoredAreaId,
      dataOrigin: fallbackOrigin(),
      sourceLabel: responseSourceLabel,
      observedAt: responseObservedAt.toISOString(),
      temperatureC: interpretation.temperatureC,
      precipitationMm: interpretation.precipitationMm,
      humidityPercent: interpretation.humidityPercent,
      windSpeedMs: interpretation.windSpeedMs,
      usedFallback: true,
    };
  }
}
