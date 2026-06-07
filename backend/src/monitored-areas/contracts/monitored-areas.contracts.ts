import { MonitoredAreaType } from '../../common/domain/enums';

export interface CreateMonitoredAreaRequestDto {
  name: string;
  type: MonitoredAreaType;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface MonitoredAreaResponseDto {
  id: string;
  userId: string;
  name: string;
  type: MonitoredAreaType;
  latitude: number;
  longitude: number;
  radiusKm: number;
  operationalBufferKm: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoredAreaMapResponseDto {
  area: MonitoredAreaResponseDto;
  mapContext: {
    center: {
      latitude: number;
      longitude: number;
    };
    monitoredRadiusKm: number;
    operationalRadiusKm: number;
    legend: Array<{
      key: 'area-center' | 'monitored-radius' | 'operational-radius' | 'fire-inside' | 'fire-nearby';
      label: string;
    }>;
  };
}
