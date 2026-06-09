import { RiskLevel } from '../../common/domain/enums';

export interface DashboardPriorityArea {
  monitoredAreaId: string;
  areaName: string;
  level: RiskLevel;
  score: number;
  activeAlertCount: number;
  recentFireEvents: number;
}

export interface DashboardSummaryEntity {
  generatedAt: Date;
  monitoredAreasCount: number;
  activeAlertsCount: number;
  averageRiskScore: number;
  recentFireEventsCount: number;
  areasByRiskLevel: Record<RiskLevel, number>;
  priorityAreas: DashboardPriorityArea[];
  hasActiveAlerts: boolean;
}
