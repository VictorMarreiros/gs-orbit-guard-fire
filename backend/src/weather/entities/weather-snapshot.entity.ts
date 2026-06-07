import { DataOrigin } from '../../common/domain/enums';

export interface WeatherSnapshotEntity {
  id: string;
  monitoredAreaId: string;
  dataOrigin: DataOrigin;
  observedAt: Date;
  temperatureC: number;
  precipitationMm: number;
  humidityPercent: number;
  windSpeedMs: number;
  sourceLabel: string;
  createdAt: Date;
  updatedAt: Date;
}
