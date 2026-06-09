import assert from 'node:assert/strict';
import { OrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { RiskLevel } from '../src/common/domain/enums';
import { buildAlertContent } from '../src/alerts/alert-message';

function runCriticalScenario(): void {
  const backend = new OrbitGuardFireBackend();
  const area = backend.createMonitoredArea(
    {
      name: 'Fazenda Santa Luzia Norte',
      type: 'RURAL_PROPERTY' as never,
      latitude: -15.88,
      longitude: -47.92,
      radiusKm: 10,
    },
  );

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true });
  const alert = backend.store.resolveExistingActiveAlert(area.id);

  assert.ok(alert);
  assert.equal(risk.level, RiskLevel.CRITICAL);
  assert.equal(alert.title, 'Risco critico de queimada');
  assert.equal(alert.recommendedActions[0], 'Reforce a vigilancia local agora.');
  assert.match(alert.message, /Fazenda Santa Luzia Norte em risco critico/i);
  assert.match(alert.message, /foco criticamente proximo/i);
  assert.match(alert.message, /cenario exige atencao imediata/i);
}

function runModerateScenario(): void {
  const backend = new OrbitGuardFireBackend();
  const area = backend.createMonitoredArea(
    {
      name: 'Cooperativa Esperanca Oeste',
      type: 'RURAL_COMMUNITY' as never,
      latitude: -15.68,
      longitude: -47.81,
      radiusKm: 6,
    },
  );

  const risk = backend.calculateRisk(area.id, { periodHours: 24, forceMock: true });
  const alert = backend.store.resolveExistingActiveAlert(area.id);

  assert.equal(risk.level, RiskLevel.MODERATE);
  assert.equal(alert, undefined);

  const content = buildAlertContent(area.name, risk.level, risk.summary, risk.factors);
  assert.equal(content.title, 'Risco moderado de queimada');
  assert.equal(content.recommendedActions[0], 'Acompanhe a area com mais frequencia ao longo do dia.');
  assert.match(content.message, /Cooperativa Esperanca Oeste em risco moderado/i);
  assert.match(content.message, /foco proximo/i);
  assert.match(content.message, /temperatura elevada/i);
  assert.match(content.message, /ausencia de chuva relevante/i);
}

runCriticalScenario();
runModerateScenario();

console.log('alert message checks passed');
