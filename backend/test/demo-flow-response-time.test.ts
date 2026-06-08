import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';

function measureDemoFlow(): number {
  const startedAt = performance.now();
  const backend = createOrbitGuardFireBackend();

  const area = backend.listMonitoredAreas()[0];
  assert.ok(area, 'Expected the demo backend to bootstrap at least one monitored area.');

  backend.me();
  backend.getDashboardSummary();
  backend.getMonitoredArea(area.id);
  backend.getFireEvents(area.id, { periodHours: 24 });
  backend.getLatestWeather(area.id);
  backend.calculateRisk(area.id, { periodHours: 24, forceMock: true });
  backend.listAlerts({});

  return performance.now() - startedAt;
}

function run(): void {
  measureDemoFlow();

  const measurements = Array.from({ length: 3 }, () => measureDemoFlow());
  const averageMs = measurements.reduce((sum, value) => sum + value, 0) / measurements.length;
  const maxMs = Math.max(...measurements);

  assert.ok(
    averageMs < 200,
    `Expected the demo flow to average under 200ms, but it averaged ${averageMs.toFixed(2)}ms (max ${maxMs.toFixed(2)}ms).`,
  );

  console.log(
    JSON.stringify(
      {
        warmMeasurementsMs: measurements.map((value) => Number(value.toFixed(2))),
        averageMs: Number(averageMs.toFixed(2)),
        maxMs: Number(maxMs.toFixed(2)),
      },
      null,
      2,
    ),
  );
}

run();

console.log('demo flow response time checks passed');
