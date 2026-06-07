import { FireEventRelevance } from './enums';

export function getOperationalRadiusKm(areaRadiusKm: number, operationalBufferKm = 5): number {
  return areaRadiusKm + operationalBufferKm;
}

export function classifyFireEventRelevance(
  distanceKm: number,
  areaRadiusKm: number,
  operationalBufferKm = 5,
): FireEventRelevance {
  if (distanceKm <= areaRadiusKm) {
    return FireEventRelevance.INSIDE;
  }

  if (distanceKm <= getOperationalRadiusKm(areaRadiusKm, operationalBufferKm)) {
    return FireEventRelevance.NEARBY;
  }

  return FireEventRelevance.OUTSIDE;
}

export function isRelevantFireEvent(
  distanceKm: number,
  areaRadiusKm: number,
  operationalBufferKm = 5,
): boolean {
  return classifyFireEventRelevance(distanceKm, areaRadiusKm, operationalBufferKm) !== FireEventRelevance.OUTSIDE;
}
