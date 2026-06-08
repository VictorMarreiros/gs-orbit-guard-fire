import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { buildStartupLogPayload } from '../src/main';

function runStartupLogSanitizationScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const summary = backend.getDashboardSummary();
  const payload = buildStartupLogPayload(summary);

  assert.deepEqual(Object.keys(payload).sort(), [
    'activeAlertsCount',
    'averageRiskScore',
    'monitoredAreasCount',
    'status',
  ]);
  assert.equal(payload.status, 'OrbitGuard Fire backend ready');
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'summary'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'priorityAreas'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'areasByRiskLevel'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'accessToken'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'passwordHash'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'latitude'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'longitude'), false);
}

runStartupLogSanitizationScenario();

console.log('startup log sanitization checks passed');
