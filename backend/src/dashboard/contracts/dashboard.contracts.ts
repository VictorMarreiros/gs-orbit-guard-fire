import { RiskLevel } from '../../common/domain/enums';

export interface DashboardSummaryResponseDto {
  generatedAt: string;
  monitoredAreasCount: number;
  activeAlertsCount: number;
  averageRiskScore: number;
  recentFireEventsCount: number;
  areasByRiskLevel: Record<RiskLevel, number>;
  priorityAreas: Array<{
    monitoredAreaId: string;
    areaName: string;
    level: RiskLevel;
    score: number;
    activeAlertCount: number;
    recentFireEvents: number;
  }>;
  hasActiveAlerts: boolean;
}
