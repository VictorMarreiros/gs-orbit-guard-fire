import {
  DataOrigin,
  RiskFactorCode,
  RiskLevel,
  RiskSeverity,
} from '../../common/domain/enums';

export interface RiskFactorEntity {
  id: string;
  riskScoreId: string;
  code: RiskFactorCode;
  label: string;
  points: number;
  reason: string;
  sortOrder: number;
  createdAt: Date;
}

export interface RiskScoreEntity {
  id: string;
  monitoredAreaId: string;
  weatherSnapshotId?: string;
  dataOrigin: DataOrigin;
  score: number;
  level: RiskLevel;
  severity: RiskSeverity;
  summary: string;
  evaluatedAt: Date;
  periodHours: number;
  fireEventsConsidered: number;
  insideFireEvents: number;
  nearbyFireEvents: number;
  createdAt: Date;
  updatedAt: Date;
  factors: RiskFactorEntity[];
}
