import {
  DataOrigin,
  FireEventRelevance,
  FireEventSource,
} from '../../common/domain/enums';
import { destinationPoint, GeoPoint, roundTo } from '../../common/domain/math';
import { MonitoredAreaEntity } from '../../monitored-areas/entities/monitored-area.entity';

export type MockScenarioKey = 'CRITICAL' | 'MODERATE' | 'LOW';

export interface GeneratedMockFireEvent {
  externalId: string;
  latitude: number;
  longitude: number;
  detectedAt: Date;
  distanceKm: number;
  relevance: FireEventRelevance;
  intensity: number;
  confidence: number;
}

export interface GeneratedMockWeatherSnapshot {
  observedAt: Date;
  temperatureC: number;
  precipitationMm: number;
  humidityPercent: number;
  windSpeedMs: number;
  sourceLabel: string;
}

export interface GeneratedMockScenario {
  key: MockScenarioKey;
  fireEvents: GeneratedMockFireEvent[];
  weather: GeneratedMockWeatherSnapshot;
}

export function resolveMockScenario(area: MonitoredAreaEntity): MockScenarioKey {
  if (area.radiusKm >= 9) {
    return 'CRITICAL';
  }

  if (area.radiusKm >= 5) {
    return 'MODERATE';
  }

  return 'LOW';
}

export function buildMockScenario(area: MonitoredAreaEntity): GeneratedMockScenario {
  const key = resolveMockScenario(area);
  const center: GeoPoint = {
    latitude: area.center.latitude,
    longitude: area.center.longitude,
  };
  const now = new Date();

  if (key === 'CRITICAL') {
    return {
      key,
      fireEvents: [
        buildFireEvent(center, area.radiusKm, 2.1, 35, now, 1, 92.4, 88.1),
        buildFireEvent(center, area.radiusKm, 4.2, 110, now, 2, 95.2, 91.6),
        buildFireEvent(center, area.radiusKm, 11.3, 205, now, 6, 84.7, 79.4),
        buildFireEvent(center, area.radiusKm, 13.7, 280, now, 15, 76.2, 73.8),
      ],
      weather: {
        observedAt: now,
        temperatureC: 33.2,
        precipitationMm: 0,
        humidityPercent: 28,
        windSpeedMs: 4.1,
        sourceLabel: 'mock-scenario-critical',
      },
    };
  }

  if (key === 'MODERATE') {
    return {
      key,
      fireEvents: [
        buildFireEvent(center, area.radiusKm, 6.1, 15, now, 3, 71.2, 69.4),
        buildFireEvent(center, area.radiusKm, 8.9, 200, now, 11, 64.5, 62.3),
      ],
      weather: {
        observedAt: now,
        temperatureC: 32.6,
        precipitationMm: 0.4,
        humidityPercent: 38,
        windSpeedMs: 5.3,
        sourceLabel: 'mock-scenario-moderate',
      },
    };
  }

  return {
    key,
    fireEvents: [],
    weather: {
      observedAt: now,
      temperatureC: 27.6,
      precipitationMm: 4.8,
      humidityPercent: 61,
      windSpeedMs: 2.7,
      sourceLabel: 'mock-scenario-low',
    },
  };
}

function buildFireEvent(
  center: GeoPoint,
  areaRadiusKm: number,
  distanceKm: number,
  bearingDegrees: number,
  now: Date,
  hoursAgo: number,
  intensity: number,
  confidence: number,
): GeneratedMockFireEvent {
  const location = destinationPoint(center, distanceKm, bearingDegrees);
  return {
    externalId: `mock-fire-${areaRadiusKm.toFixed(0)}-${distanceKm.toFixed(1)}`,
    latitude: location.latitude,
    longitude: location.longitude,
    detectedAt: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
    distanceKm: roundTo(distanceKm, 2),
    relevance: distanceKm <= areaRadiusKm ? FireEventRelevance.INSIDE : FireEventRelevance.NEARBY,
    intensity,
    confidence,
  };
}

export function fallbackOrigin(): DataOrigin {
  return DataOrigin.FALLBACK;
}

export function fallbackSource(): FireEventSource {
  return FireEventSource.MOCK;
}
