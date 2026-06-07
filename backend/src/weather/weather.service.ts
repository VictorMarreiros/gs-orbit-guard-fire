import { DataOrigin } from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { NotFoundApplicationError } from '../common/errors';
import { WeatherSnapshotResponseDto } from './contracts/weather.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { buildMockScenario, fallbackOrigin } from '../integrations/mocks/mock-data';

export class WeatherService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
  ) {}

  getLatestByAreaId(areaId: string, userId: string): WeatherSnapshotResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const scenario = buildMockScenario(area);

    if (!this.store.getLatestWeatherSnapshot(areaId)) {
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

    return {
      id: snapshot.id,
      monitoredAreaId: snapshot.monitoredAreaId,
      dataOrigin: fallbackOrigin(),
      sourceLabel: snapshot.sourceLabel,
      observedAt: snapshot.observedAt.toISOString(),
      temperatureC: Number(snapshot.temperatureC),
      precipitationMm: Number(snapshot.precipitationMm),
      humidityPercent: Number(snapshot.humidityPercent),
      windSpeedMs: Number(snapshot.windSpeedMs),
      usedFallback: true,
    };
  }
}
