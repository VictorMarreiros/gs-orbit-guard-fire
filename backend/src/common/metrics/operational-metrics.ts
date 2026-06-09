import { DashboardSummaryResponseDto } from '../../dashboard/contracts/dashboard.contracts';

export type IntegrationFailureScope = 'startup' | 'fire-events' | 'weather' | 'risk-engine' | 'alerts';

export interface OperationalIntegrationFailureCounts {
  startup: number;
  fireEvents: number;
  weather: number;
  risk: number;
  alerts: number;
  total: number;
}

export interface OperationalMetricsSnapshot {
  generatedAt: string;
  dashboard: {
    monitoredAreasCount: number;
    activeAlertsCount: number;
    averageRiskScore: number;
  };
  integrationFailures: OperationalIntegrationFailureCounts;
}

export class OperationalMetricsRecorder {
  private readonly integrationFailureCounts: OperationalIntegrationFailureCounts = {
    startup: 0,
    fireEvents: 0,
    weather: 0,
    risk: 0,
    alerts: 0,
    total: 0,
  };

  recordIntegrationFailure(scope: IntegrationFailureScope): void {
    if (scope === 'startup') {
      this.integrationFailureCounts.startup += 1;
    } else if (scope === 'fire-events') {
      this.integrationFailureCounts.fireEvents += 1;
    } else if (scope === 'weather') {
      this.integrationFailureCounts.weather += 1;
    } else if (scope === 'risk-engine') {
      this.integrationFailureCounts.risk += 1;
    } else if (scope === 'alerts') {
      this.integrationFailureCounts.alerts += 1;
    }

    this.integrationFailureCounts.total += 1;
  }

  snapshotFromDashboard(summary: DashboardSummaryResponseDto): OperationalMetricsSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      dashboard: {
        monitoredAreasCount: summary.monitoredAreasCount,
        activeAlertsCount: summary.activeAlertsCount,
        averageRiskScore: summary.averageRiskScore,
      },
      integrationFailures: { ...this.integrationFailureCounts },
    };
  }
}
