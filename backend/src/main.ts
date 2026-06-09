import { createOrbitGuardFireBackend } from './app/orbitguard-fire-backend';
import { DashboardSummaryResponseDto } from './dashboard/contracts/dashboard.contracts';

export interface BackendStartupLogPayload {
  status: string;
  monitoredAreasCount: number;
  activeAlertsCount: number;
  averageRiskScore: number;
}

export function buildStartupLogPayload(summary: DashboardSummaryResponseDto): BackendStartupLogPayload {
  return {
    status: 'OrbitGuard Fire backend ready',
    monitoredAreasCount: summary.monitoredAreasCount,
    activeAlertsCount: summary.activeAlertsCount,
    averageRiskScore: summary.averageRiskScore,
  };
}

function bootstrap(): void {
  const backend = createOrbitGuardFireBackend();
  const summary = backend.getDashboardSummary();

  // Entry point de demo para validar o backend sem HTTP.
  console.log(JSON.stringify(buildStartupLogPayload(summary), null, 2));
}

if (require.main === module) {
  bootstrap();
}
