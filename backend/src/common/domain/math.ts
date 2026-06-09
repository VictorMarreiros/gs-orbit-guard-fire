export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundTo(value: number, decimals = 6): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function haversineDistanceKm(origin: GeoPoint, destination: GeoPoint): number {
  const earthRadiusKm = 6371;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = toRad(destination.latitude - origin.latitude);
  const deltaLng = toRad(destination.longitude - origin.longitude);

  const lat1 = toRad(origin.latitude);
  const lat2 = toRad(destination.latitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function destinationPoint(
  origin: GeoPoint,
  distanceKm: number,
  bearingDegrees: number,
): GeoPoint {
  const earthRadiusKm = 6371;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const toDeg = (radians: number) => (radians * 180) / Math.PI;

  const bearing = toRad(bearingDegrees);
  const angularDistance = distanceKm / earthRadiusKm;
  const lat1 = toRad(origin.latitude);
  const lon1 = toRad(origin.longitude);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
    );

  return {
    latitude: roundTo(toDeg(lat2), 6),
    longitude: roundTo(toDeg(lon2), 6),
  };
}
