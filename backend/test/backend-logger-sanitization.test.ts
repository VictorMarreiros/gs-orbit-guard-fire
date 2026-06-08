import assert from 'node:assert/strict';
import { sanitizeBackendLogDetails } from '../src/common/logging/backend-logger';

function runBackendLoggerSanitizationScenario(): void {
  const details = sanitizeBackendLogDetails({
    areaId: 'area-123',
    coordinates: {
      lat: -15.7801,
      lng: -47.9292,
    },
    auth: {
      accessToken: 'token-value',
      authorization: 'Bearer secret-value',
      apiKey: 'api-key-value',
      nested: {
        password: 'plain-password',
        passwordConfirmation: 'plain-password',
        refreshToken: 'refresh-token-value',
        secret: 'shared-secret',
        token: 'one-time-token',
      },
    },
    route: [
      {
        coordinate: {
          latitude: -15.9001,
          longitude: -47.8001,
        },
      },
    ],
  });

  assert.deepEqual(details, {
    areaId: 'area-123',
    auth: {
      nested: {},
    },
    route: [{}],
  });
  assert.equal(Object.prototype.hasOwnProperty.call(details, 'coordinates'), false);
}

runBackendLoggerSanitizationScenario();

console.log('backend logger sanitization checks passed');
