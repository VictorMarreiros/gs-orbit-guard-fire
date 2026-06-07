import {
  DataOrigin,
  RiskFactorCode,
  RiskLevel,
  RiskSeverity,
} from '../../common/domain/enums';

export interface CalculateRiskRequestDto {
  periodHours?: number;
  forceMock?: boolean;
}

export interface RiskFactorResponseDto {
  code: RiskFactorCode;
  label: string;
  points: number;
  reason: string;
}

export interface RiskCalculationResponseDto {
  id: string;
  monitoredAreaId: string;
  score: number;
  level: RiskLevel;
  severity: RiskSeverity;
  summary: string;
  evaluatedAt: string;
  periodHours: number;
  factors: RiskFactorResponseDto[];
  contributingSignals: {
    fireEventsConsidered: number;
    insideFireEvents: number;
    nearbyFireEvents: number;
  };
  dataSources: {
    fireEvents: DataOrigin;
    weather: DataOrigin;
  };
  alertTriggered: boolean;
}
