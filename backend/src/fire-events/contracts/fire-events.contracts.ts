import {
  DataOrigin,
  FireEventRelevance,
  FireEventSource,
} from '../../common/domain/enums';

export interface GetFireEventsQueryDto {
  periodHours?: number;
}

export interface FireEventItemDto {
  id: string;
  externalId?: string;
  source: FireEventSource;
  dataOrigin: DataOrigin;
  latitude: number;
  longitude: number;
  detectedAt: string;
  distanceKm: number;
  relevance: FireEventRelevance;
  intensity?: number;
  confidence?: number;
}

export interface FireEventsResponseDto {
  areaId: string;
  periodHours: number;
  source: {
    mode: DataOrigin;
    provider: FireEventSource;
    usedFallback: boolean;
  };
  summary: {
    total: number;
    insideCount: number;
    nearbyCount: number;
  };
  items: FireEventItemDto[];
}
