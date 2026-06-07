import { createOrbitGuardFireBackend } from './app/orbitguard-fire-backend';

function bootstrap(): void {
  const backend = createOrbitGuardFireBackend();
  const summary = backend.getDashboardSummary();

  // Entry point de demo para validar o backend sem HTTP.
  console.log(
    JSON.stringify(
      {
        status: 'OrbitGuard Fire backend ready',
        monitoredAreasCount: summary.monitoredAreasCount,
        activeAlertsCount: summary.activeAlertsCount,
        averageRiskScore: summary.averageRiskScore,
      },
      null,
      2,
    ),
  );
}

bootstrap();
