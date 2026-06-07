import { MonitoredAreaType } from '../../common/domain/enums';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface MonitoredAreaEntity {
  id: string;
  userId: string;
  name: string;
  type: MonitoredAreaType;
  center: GeoPoint;
  radiusKm: number;
  operationalBufferKm: number;
  latitudeNormalized: number;
  longitudeNormalized: number;
  createdAt: Date;
  updatedAt: Date;
}
