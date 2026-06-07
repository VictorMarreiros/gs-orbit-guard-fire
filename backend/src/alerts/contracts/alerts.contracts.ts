import {
  AlertChannel,
  AlertStatus,
  RiskLevel,
  RiskSeverity,
} from '../../common/domain/enums';

export interface GetAlertsQueryDto {
  status?: AlertStatus;
  level?: RiskLevel;
  monitoredAreaId?: string;
}

export interface AlertListItemDto {
  id: string;
  monitoredAreaId: string;
  areaName: string;
  status: AlertStatus;
  channel: AlertChannel;
  level: RiskLevel;
  severity: RiskSeverity;
  title: string;
  summary: string;
  triggeredAt: string;
}

export interface AlertsResponseDto {
  items: AlertListItemDto[];
  total: number;
  filters: GetAlertsQueryDto;
  emptyStateMessage?: string;
}
