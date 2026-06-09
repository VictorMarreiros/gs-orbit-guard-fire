import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { MonitoredAreaType } from '../src/common/domain/enums';
import { ValidationApplicationError } from '../src/common/errors';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
  userId: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'mariana.ribeiro@example.com';

  const registerResponse = backend.register({
    name: 'Mariana Ribeiro',
    email,
    password: 'SenhaSegura789!',
  });

  assert.equal(registerResponse.email, email);

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura789!',
  });

  return {
    backend,
    accessToken: loginResponse.accessToken,
    userId: loginResponse.user.id,
  };
}

function runCreateAndListScenario(): void {
  const { backend, accessToken, userId } = createAuthenticatedBackend();

  assert.deepEqual(backend.listMonitoredAreas(accessToken), []);

  const createdArea = backend.createMonitoredArea(
    {
      name: '  Fazenda Santa Luzia  ',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801234,
      longitude: -47.9292345,
      radiusKm: 10.123,
    },
    accessToken,
  );

  assertExactKeys(createdArea, [
    'id',
    'userId',
    'name',
    'type',
    'latitude',
    'longitude',
    'radiusKm',
    'operationalBufferKm',
    'createdAt',
    'updatedAt',
  ]);
  assert.equal(createdArea.userId, userId);
  assert.equal(createdArea.name, 'Fazenda Santa Luzia');
  assert.equal(createdArea.type, MonitoredAreaType.RURAL_PROPERTY);
  assert.equal(createdArea.latitude, -15.780123);
  assert.equal(createdArea.longitude, -47.929234);
  assert.equal(createdArea.radiusKm, 10.12);
  assert.equal(createdArea.operationalBufferKm, 5);
  assert.equal(new Date(createdArea.createdAt).toISOString(), createdArea.createdAt);
  assert.equal(new Date(createdArea.updatedAt).toISOString(), createdArea.updatedAt);

  const monitoredAreas = backend.listMonitoredAreas(accessToken);

  assert.equal(monitoredAreas.length, 1);
  assert.deepEqual(monitoredAreas[0], createdArea);
}

function runValidationErrorScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  assert.throws(
    () =>
      backend.createMonitoredArea(
        {
          name: '  ',
          type: 'INVALID_TYPE' as never,
          latitude: 91,
          longitude: -181,
          radiusKm: 0,
        } as never,
        accessToken,
      ),
    (error: unknown) => {
      assert.ok(error instanceof ValidationApplicationError);
      assert.equal(error.statusCode, 422);
      assert.equal(error.code, 'MONITORED_AREA_VALIDATION_FAILED');
      assert.equal(error.message, 'Payload de area monitorada invalido.');
      assert.deepEqual(error.details?.map((detail) => detail.field).sort(), [
        'latitude',
        'longitude',
        'name',
        'radiusKm',
        'type',
      ]);
      return true;
    },
  );

  assert.deepEqual(backend.listMonitoredAreas(accessToken), []);
}

runCreateAndListScenario();
runValidationErrorScenario();

console.log('monitored areas integration checks passed');
