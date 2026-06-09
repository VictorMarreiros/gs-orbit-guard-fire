import assert from 'node:assert/strict';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { AuthenticationApplicationError, ValidationApplicationError } from '../src/common/errors';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function runRegisterValidationScenario(): void {
  const backend = createOrbitGuardFireBackend();

  assert.throws(
    () =>
      backend.register({
        name: 'Jo',
        email: 'not-an-email',
        password: '123',
      }),
    (error: unknown) => {
      assert.ok(error instanceof ValidationApplicationError);
      assert.equal(error.statusCode, 422);
      assert.equal(error.code, 'AUTH_VALIDATION_FAILED');
      assert.deepEqual(error.details?.map((detail) => detail.field).sort(), [
        'email',
        'name',
        'password',
      ]);
      assert.ok(
        error.details?.every((detail) => detail.message.length > 0 && detail.code.length > 0),
      );
      return true;
    },
  );
}

function runLoginValidationAndErrorScenario(): void {
  const backend = createOrbitGuardFireBackend();

  assert.throws(
    () =>
      backend.login({
        email: 'invalid-email',
        password: '123',
      }),
    (error: unknown) => {
      assert.ok(error instanceof ValidationApplicationError);
      assert.equal(error.statusCode, 422);
      assert.equal(error.code, 'AUTH_VALIDATION_FAILED');
      assert.deepEqual(error.details?.map((detail) => detail.field).sort(), [
        'email',
        'password',
      ]);
      return true;
    },
  );

  assert.throws(
    () =>
      backend.login({
        email: 'maria@example.com',
        password: 'SenhaIncorreta123!',
      }),
    (error: unknown) => {
      assert.ok(error instanceof AuthenticationApplicationError);
      assert.equal(error.statusCode, 401);
      assert.equal(error.code, 'AUTH_INVALID_CREDENTIALS');
      assert.equal(error.message, 'Credenciais invalidas.');
      return true;
    },
  );
}

function runSensitiveDataProtectionScenario(): void {
  const backend = createOrbitGuardFireBackend();
  const email = 'ana.santos@example.com';
  const password = 'SenhaSegura456!';

  const registerResponse = backend.register({
    name: 'Ana Santos',
    email,
    password,
  });

  assertExactKeys(registerResponse, ['id', 'name', 'email', 'role', 'authProvider', 'createdAt']);
  assert.equal(registerResponse.email, email);

  const loginResponse = backend.login({
    email,
    password,
  });

  assertExactKeys(loginResponse, ['accessToken', 'expiresInSeconds', 'tokenType', 'user']);
  assert.equal(loginResponse.tokenType, 'Bearer');
  assert.equal(loginResponse.expiresInSeconds, 24 * 60 * 60);
  assertExactKeys(loginResponse.user, ['id', 'name', 'email', 'role', 'authProvider', 'isDemoUser']);
  assert.equal(loginResponse.user.email, email);
  assert.equal(Object.prototype.hasOwnProperty.call(loginResponse.user, 'passwordHash'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(loginResponse.user, 'sessionContext'), false);

  const sessionContext = backend.me(loginResponse.accessToken);

  assertExactKeys(sessionContext, ['user', 'permissions', 'session']);
  assertExactKeys(sessionContext.user, ['id', 'name', 'email', 'role', 'authProvider', 'isDemoUser']);
  assert.equal(Object.prototype.hasOwnProperty.call(sessionContext.user, 'passwordHash'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(sessionContext.user, 'sessionContext'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(sessionContext.session, 'accessToken'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(sessionContext.session, 'refreshToken'), false);
  assert.equal(sessionContext.session.authProvider, 'DEMO');
  assert.equal(sessionContext.permissions.canManageAreas, true);
}

runRegisterValidationScenario();
runLoginValidationAndErrorScenario();
runSensitiveDataProtectionScenario();

console.log('auth integration checks passed');
