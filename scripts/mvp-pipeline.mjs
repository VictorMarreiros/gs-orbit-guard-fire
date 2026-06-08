import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import process from 'node:process';

const DEFAULT_PIPELINE = {
  name: 'mvp-check',
  steps: [
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
  ],
};

export function getMvpPipeline() {
  return DEFAULT_PIPELINE;
}

function runStep(step) {
  const prefix = `[mvp-check] ${step.name}`;
  console.log(`${prefix} -> ${step.command}`);

  const result = spawnSync(step.command, {
    shell: true,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    const exitCode = typeof result.status === 'number' ? result.status : 1;
    throw new Error(`${prefix} failed with exit code ${exitCode}`);
  }
}

export function runMvpPipeline(pipeline = DEFAULT_PIPELINE) {
  console.log(`[mvp-check] running ${pipeline.name}`);
  pipeline.steps.forEach(runStep);
  console.log(`[mvp-check] ${pipeline.name} completed`);
}

const isDirectExecution = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectExecution) {
  try {
    runMvpPipeline();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
