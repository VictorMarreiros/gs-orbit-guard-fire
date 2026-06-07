import assert from 'node:assert/strict';
import { MonitoredAreaType } from '../src/common/domain/enums';
import { ValidationApplicationError } from '../src/common/errors';
import { OrbitGuardStore } from '../src/integrations/memory/orbitguard-store';
import { MonitoredAreasService } from '../src/monitored-areas/monitored-areas.service';

const userId = 'user-123';

function expectValidationError(
  operation: () => void,
  expectedDetails: Array<{ field: string; message: string; code: string }>,
): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof ValidationApplicationError);
    assert.equal(error.message, 'Payload de area monitorada invalido.');
    assert.deepEqual(error.details, expectedDetails);
    return true;
  });
}

function run(): void {
  {
    const store = new OrbitGuardStore();
    const service = new MonitoredAreasService(store);

    expectValidationError(
      () => service.create({} as never, userId),
      [
        { field: 'name', message: 'Informe um nome entre 3 e 80 caracteres.', code: 'INVALID_NAME' },
        { field: 'type', message: 'Selecione um tipo de area valido.', code: 'INVALID_TYPE' },
        { field: 'latitude', message: 'Informe uma latitude valida entre -90 e 90.', code: 'INVALID_LATITUDE' },
        { field: 'longitude', message: 'Informe uma longitude valida entre -180 e 180.', code: 'INVALID_LONGITUDE' },
        { field: 'radiusKm', message: 'Informe um raio de monitoramento entre 0.1 km e 50 km.', code: 'INVALID_RADIUS' },
      ],
    );

    assert.equal(store.listAreasByUser(userId).length, 0);
  }

  {
    const store = new OrbitGuardStore();
    const service = new MonitoredAreasService(store);

    expectValidationError(
      () =>
        service.create(
          {
            name: '  ',
            type: 'INVALID_TYPE' as MonitoredAreaType,
            latitude: 91,
            longitude: -181,
            radiusKm: 0,
          } as never,
          userId,
        ),
      [
        { field: 'name', message: 'Informe um nome entre 3 e 80 caracteres.', code: 'INVALID_NAME' },
        { field: 'type', message: 'Selecione um tipo de area valido.', code: 'INVALID_TYPE' },
        { field: 'latitude', message: 'Informe uma latitude valida entre -90 e 90.', code: 'INVALID_LATITUDE' },
        { field: 'longitude', message: 'Informe uma longitude valida entre -180 e 180.', code: 'INVALID_LONGITUDE' },
        { field: 'radiusKm', message: 'Informe um raio de monitoramento entre 0.1 km e 50 km.', code: 'INVALID_RADIUS' },
      ],
    );

    assert.equal(store.listAreasByUser(userId).length, 0);
  }

  {
    const store = new OrbitGuardStore();
    const service = new MonitoredAreasService(store);

    const area = service.create(
      {
        name: 'Fazenda Santa Luzia',
        type: MonitoredAreaType.RURAL_PROPERTY,
        latitude: -15.7801234,
        longitude: -47.9292345,
        radiusKm: 10.123,
      },
      userId,
    );

    assert.equal(area.name, 'Fazenda Santa Luzia');
    assert.equal(area.latitude, -15.780123);
    assert.equal(area.longitude, -47.929234);
    assert.equal(area.radiusKm, 10.12);
    assert.equal(area.operationalBufferKm, 5);
    assert.equal(store.listAreasByUser(userId).length, 1);
  }
}

run();

console.log('monitored-areas validation checks passed');
