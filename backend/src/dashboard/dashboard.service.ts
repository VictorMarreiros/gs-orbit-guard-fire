import { DashboardSummaryResponseDto } from './contracts/dashboard.contracts';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';

export class DashboardService {
  constructor(private readonly store: OrbitGuardStore) {}

  getSummary(userId: string): DashboardSummaryResponseDto {
    const snapshot = this.store.buildDashboardSnapshot(userId);
    return {
      generatedAt: snapshot.generatedAt.toISOString(),
      monitoredAreasCount: snapshot.monitoredAreasCount,
      activeAlertsCount: snapshot.activeAlertsCount,
      averageRiskScore: snapshot.averageRiskScore,
      recentFireEventsCount: snapshot.recentFireEventsCount,
      areasByRiskLevel: snapshot.areasByRiskLevel,
      priorityAreas: snapshot.priorityAreas,
      hasActiveAlerts: snapshot.hasActiveAlerts,
    };
  }
}
