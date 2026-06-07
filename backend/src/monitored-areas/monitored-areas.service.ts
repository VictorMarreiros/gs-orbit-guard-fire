import { MonitoredAreaType } from '../common/domain/enums';
import { AuthorizationApplicationError, NotFoundApplicationError, ValidationApplicationError } from '../common/errors';
import { roundTo } from '../common/domain/math';
import {
  CreateMonitoredAreaRequestDto,
  MonitoredAreaMapResponseDto,
  MonitoredAreaResponseDto,
} from './contracts/monitored-areas.contracts';
import { MonitoredAreaEntity } from './entities/monitored-area.entity';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';

export class MonitoredAreasService {
  constructor(private readonly store: OrbitGuardStore) {}

  create(input: CreateMonitoredAreaRequestDto, userId: string): MonitoredAreaResponseDto {
    this.validate(input);
    const area = this.store.seedArea({
      userId,
      name: input.name.trim(),
      type: input.type,
      latitude: roundTo(input.latitude, 6),
      longitude: roundTo(input.longitude, 6),
      radiusKm: roundTo(input.radiusKm, 2),
      operationalBufferKm: 5,
    });

    return this.toResponse(area);
  }

  getById(areaId: string, userId: string): MonitoredAreaMapResponseDto {
    const area = this.assertAreaAccess(areaId, userId);
    return {
      area: this.toResponse(area),
      mapContext: {
        center: {
          latitude: area.latitudeNormalized,
          longitude: area.longitudeNormalized,
        },
        monitoredRadiusKm: area.radiusKm,
        operationalRadiusKm: area.radiusKm + area.operationalBufferKm,
        legend: [
          { key: 'area-center', label: 'Centro da area' },
          { key: 'monitored-radius', label: 'Raio monitorado' },
          { key: 'operational-radius', label: 'Vizinhanca operacional' },
          { key: 'fire-inside', label: 'Foco dentro do raio' },
          { key: 'fire-nearby', label: 'Foco proximo ao raio' },
        ],
      },
    };
  }

  getEntityById(areaId: string, userId: string): MonitoredAreaEntity {
    return this.assertAreaAccess(areaId, userId);
  }

  listByUser(userId: string): MonitoredAreaResponseDto[] {
    return this.store.listAreasByUser(userId).map((area) => this.toResponse(area));
  }

  private assertAreaAccess(areaId: string, userId: string): MonitoredAreaEntity {
    const area = this.store.findAreaById(areaId);
    if (!area) {
      throw new NotFoundApplicationError('Area monitorada nao encontrada.', 'MONITORED_AREA_NOT_FOUND');
    }

    if (area.userId !== userId) {
      throw new AuthorizationApplicationError('Voce nao tem acesso a esta area.', 'MONITORED_AREA_FORBIDDEN');
    }

    return area;
  }

  private validate(input: CreateMonitoredAreaRequestDto): void {
    const details = [];
    const name = input.name?.trim() ?? '';

    if (name.length < 3 || name.length > 80) {
      details.push({ field: 'name', message: 'Informe um nome entre 3 e 80 caracteres.', code: 'INVALID_NAME' });
    }

    const allowedTypes = Object.values(MonitoredAreaType) as string[];
    if (!allowedTypes.includes(input.type)) {
      details.push({
        field: 'type',
        message: 'Selecione um tipo de area valido.',
        code: 'INVALID_TYPE',
      });
    }

    if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90) {
      details.push({
        field: 'latitude',
        message: 'Informe uma latitude valida entre -90 e 90.',
        code: 'INVALID_LATITUDE',
      });
    }

    if (!Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) {
      details.push({
        field: 'longitude',
        message: 'Informe uma longitude valida entre -180 e 180.',
        code: 'INVALID_LONGITUDE',
      });
    }

    if (!Number.isFinite(input.radiusKm) || input.radiusKm < 0.1 || input.radiusKm > 50) {
      details.push({
        field: 'radiusKm',
        message: 'Informe um raio de monitoramento entre 0.1 km e 50 km.',
        code: 'INVALID_RADIUS',
      });
    }

    if (details.length > 0) {
      throw new ValidationApplicationError('Payload de area monitorada invalido.', 'MONITORED_AREA_VALIDATION_FAILED', details);
    }
  }

  private toResponse(area: MonitoredAreaEntity): MonitoredAreaResponseDto {
    return {
      id: area.id,
      userId: area.userId,
      name: area.name,
      type: area.type,
      latitude: area.latitudeNormalized,
      longitude: area.longitudeNormalized,
      radiusKm: area.radiusKm,
      operationalBufferKm: area.operationalBufferKm,
      createdAt: area.createdAt.toISOString(),
      updatedAt: area.updatedAt.toISOString(),
    };
  }
}
