import { DataOrigin } from '../../common/domain/enums';

export interface WeatherSnapshotResponseDto {
  id: string;
  monitoredAreaId: string;
  dataOrigin: DataOrigin;
  sourceLabel: string;
  observedAt: string;
  temperatureC: number;
  precipitationMm: number;
  humidityPercent: number;
  windSpeedMs: number;
  usedFallback: boolean;
}
