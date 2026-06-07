import { ApiFieldError } from '../common/api/api-error';
import { MonitoredAreaType } from '../common/domain/enums';
import { ValidationApplicationError } from '../common/errors';
import { CreateMonitoredAreaRequestDto } from './contracts/monitored-areas.contracts';

export interface ValidatedCreateMonitoredAreaInput {
  name: string;
  type: MonitoredAreaType;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export function validateCreateMonitoredAreaInput(
  input: Partial<CreateMonitoredAreaRequestDto>,
): ValidatedCreateMonitoredAreaInput {
  const details: ApiFieldError[] = [];
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const allowedTypes = Object.values(MonitoredAreaType) as string[];

  if (name.length < 3 || name.length > 80) {
    details.push({
      field: 'name',
      message: 'Informe um nome entre 3 e 80 caracteres.',
      code: 'INVALID_NAME',
    });
  }

  if (typeof input.type !== 'string' || !allowedTypes.includes(input.type)) {
    details.push({
      field: 'type',
      message: 'Selecione um tipo de area valido.',
      code: 'INVALID_TYPE',
    });
  }

  if (typeof input.latitude !== 'number' || !Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90) {
    details.push({
      field: 'latitude',
      message: 'Informe uma latitude valida entre -90 e 90.',
      code: 'INVALID_LATITUDE',
    });
  }

  if (
    typeof input.longitude !== 'number' ||
    !Number.isFinite(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  ) {
    details.push({
      field: 'longitude',
      message: 'Informe uma longitude valida entre -180 e 180.',
      code: 'INVALID_LONGITUDE',
    });
  }

  if (typeof input.radiusKm !== 'number' || !Number.isFinite(input.radiusKm) || input.radiusKm < 0.1 || input.radiusKm > 50) {
    details.push({
      field: 'radiusKm',
      message: 'Informe um raio de monitoramento entre 0.1 km e 50 km.',
      code: 'INVALID_RADIUS',
    });
  }

  if (details.length > 0) {
    throw new ValidationApplicationError(
      'Payload de area monitorada invalido.',
      'MONITORED_AREA_VALIDATION_FAILED',
      details,
    );
  }

  return {
    name,
    type: input.type as MonitoredAreaType,
    latitude: input.latitude as number,
    longitude: input.longitude as number,
    radiusKm: input.radiusKm as number,
  };
}
