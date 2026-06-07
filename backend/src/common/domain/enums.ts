export enum UserRole {
  DEMO_USER = 'DEMO_USER',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  DEMO = 'DEMO',
  JWT = 'JWT',
}

export enum MonitoredAreaType {
  RURAL_PROPERTY = 'RURAL_PROPERTY',
  RURAL_COMMUNITY = 'RURAL_COMMUNITY',
  SCHOOL = 'SCHOOL',
  CONSERVATION_AREA = 'CONSERVATION_AREA',
  INDIGENOUS_TERRITORY = 'INDIGENOUS_TERRITORY',
}

export enum FireEventSource {
  MOCK = 'MOCK',
  NASA_FIRMS = 'NASA_FIRMS',
  INPE_BDQUEIMADAS = 'INPE_BDQUEIMADAS',
}

export enum FireEventRelevance {
  INSIDE = 'INSIDE',
  NEARBY = 'NEARBY',
  OUTSIDE = 'OUTSIDE',
}

export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RiskSeverity {
  INFO = 'INFO',
  ATTENTION = 'ATTENTION',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
}

export enum RiskFactorCode {
  NEAR_FIRE_CRITICAL = 'NEAR_FIRE_CRITICAL',
  NEAR_FIRE_WARNING = 'NEAR_FIRE_WARNING',
  FIRE_CLUSTER = 'FIRE_CLUSTER',
  HIGH_TEMP = 'HIGH_TEMP',
  LOW_HUMIDITY = 'LOW_HUMIDITY',
  LOW_RAIN = 'LOW_RAIN',
  STRONG_WIND = 'STRONG_WIND',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export enum AlertChannel {
  IN_APP = 'IN_APP',
  MOBILE_PREVIEW = 'MOBILE_PREVIEW',
}

export enum DataOrigin {
  MOCK = 'MOCK',
  LIVE = 'LIVE',
  FALLBACK = 'FALLBACK',
}
