import {
  DataOrigin,
  FireEventRelevance,
  FireEventSource,
} from '../../common/domain/enums';

export interface FireEventEntity {
  id: string;
  externalId?: string;
  source: FireEventSource;
  dataOrigin: DataOrigin;
  latitude: number;
  longitude: number;
  detectedAt: Date;
  recordedAt: Date;
  intensity?: number;
  confidence?: number;
  distanceKm?: number;
  relevance?: FireEventRelevance;
  createdAt: Date;
  updatedAt: Date;
}

export interface AreaFireEventEntity {
  id: string;
  monitoredAreaId: string;
  fireEventId: string;
  distanceKm: number;
  relevance: FireEventRelevance;
  consideredAt: Date;
}
