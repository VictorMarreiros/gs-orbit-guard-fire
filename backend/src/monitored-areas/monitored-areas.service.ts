import { AuthorizationApplicationError, NotFoundApplicationError } from '../common/errors';
import { roundTo } from '../common/domain/math';
import {
  CreateMonitoredAreaRequestDto,
  MonitoredAreaMapResponseDto,
  MonitoredAreaResponseDto,
} from './contracts/monitored-areas.contracts';
import { MonitoredAreaEntity } from './entities/monitored-area.entity';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { validateCreateMonitoredAreaInput } from './monitored-area-validation';

export class MonitoredAreasService {
  constructor(private readonly store: OrbitGuardStore) {}

  create(input: Partial<CreateMonitoredAreaRequestDto>, userId: string): MonitoredAreaResponseDto {
    const validatedInput = validateCreateMonitoredAreaInput(input);
    const area = this.store.seedArea({
      userId,
      name: validatedInput.name,
      type: validatedInput.type,
      latitude: roundTo(validatedInput.latitude, 6),
      longitude: roundTo(validatedInput.longitude, 6),
      radiusKm: roundTo(validatedInput.radiusKm, 2),
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
