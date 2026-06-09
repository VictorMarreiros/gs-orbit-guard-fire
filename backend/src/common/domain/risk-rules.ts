import { RiskLevel, RiskSeverity } from './enums';

export const RISK_SCORE_MAX = 100;

export const RISK_RULES = {
  nearFireCritical: 25,
  nearFireWarning: 15,
  fireCluster: 20,
  highTemp: 15,
  lowHumidity: 20,
  lowRain: 15,
  strongWind: 10,
} as const;

export function classifyRisk(score: number): {
  level: RiskLevel;
  severity: RiskSeverity;
} {
  if (score <= 30) {
    return { level: RiskLevel.LOW, severity: RiskSeverity.INFO };
  }

  if (score <= 60) {
    return { level: RiskLevel.MODERATE, severity: RiskSeverity.ATTENTION };
  }

  if (score <= 85) {
    return { level: RiskLevel.HIGH, severity: RiskSeverity.WARNING };
  }

  return { level: RiskLevel.CRITICAL, severity: RiskSeverity.DANGER };
}
