import {
  AlertChannel,
  AlertStatus,
  RiskLevel,
  RiskSeverity,
} from '../../common/domain/enums';

export interface AlertEntity {
  id: string;
  monitoredAreaId: string;
  riskScoreId: string;
  status: AlertStatus;
  channel: AlertChannel;
  level: RiskLevel;
  severity: RiskSeverity;
  title: string;
  message: string;
  summary: string;
  recommendedActions: string[];
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
