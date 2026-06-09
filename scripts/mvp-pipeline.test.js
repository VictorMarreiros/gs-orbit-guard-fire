const assert = require('node:assert/strict');

async function main() {
  const { getMvpPipeline } = await import('./mvp-pipeline.mjs');

  const pipeline = getMvpPipeline();

  assert.equal(pipeline.name, 'mvp-check');
  assert.deepEqual(pipeline.steps, [
    {
      name: 'backend-check',
      command: 'npm --prefix backend run check',
    },
    {
      name: 'prototype-syntax',
      command: 'node --check prototypes/orbitguard-fire-prototipo-v2.e2e.test.js',
    },
    {
      name: 'prototype-e2e',
      command: 'node prototypes/orbitguard-fire-prototipo-v2.e2e.test.js',
    },
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
