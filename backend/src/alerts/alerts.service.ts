import {
  AlertChannel,
  AlertStatus,
  DataOrigin,
  RiskLevel,
  RiskSeverity,
} from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { AlertsResponseDto, AlertListItemDto, GetAlertsQueryDto } from './contracts/alerts.contracts';
import { RiskCalculationResponseDto } from '../risk-engine/contracts/risk.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { AlertEntity } from './entities/alert.entity';

export class AlertsService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
  ) {}

  upsertFromRiskCalculation(risk: RiskCalculationResponseDto, userId: string): AlertEntity | undefined {
    if (!risk.alertTriggered) {
      this.store.deactivateAlertsForArea(risk.monitoredAreaId);
      return undefined;
    }

    const area = this.monitoredAreasService.getEntityById(risk.monitoredAreaId, userId);
    const title =
      risk.level === RiskLevel.CRITICAL ? 'Risco critico de queimada' : 'Risco alto de queimada';
    const summary = risk.summary;
    const recommendedActions = [
      'Reforce a vigilancia local agora.',
      'Verifique aceiros, acessos e pontos de apoio.',
      'Mantenha equipes de resposta em prontidao.',
    ];

    const existing = this.store.resolveExistingActiveAlert(area.id);
    if (existing) {
      existing.status = AlertStatus.ACTIVE;
      existing.channel = AlertChannel.IN_APP;
      existing.level = risk.level;
      existing.severity = risk.severity;
      existing.title = title;
      existing.message = summary;
      existing.summary = summary;
      existing.recommendedActions = recommendedActions;
      existing.triggeredAt = new Date(risk.evaluatedAt);
      existing.updatedAt = new Date();
      this.store.upsertAlert(existing);
      return existing;
    }

    const alert: AlertEntity = {
      id: randomUUID(),
      monitoredAreaId: area.id,
      riskScoreId: risk.id,
      status: AlertStatus.ACTIVE,
      channel: AlertChannel.IN_APP,
      level: risk.level,
      severity: risk.severity,
      title,
      message: summary,
      summary,
      recommendedActions,
      triggeredAt: new Date(risk.evaluatedAt),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.store.upsertAlert(alert);
    return alert;
  }

  list(userId: string, query: GetAlertsQueryDto): AlertsResponseDto {
    const alerts = this.store.listAlertsByUser(userId).filter((alert) => {
      if (query.status && alert.status !== query.status) {
        return false;
      }

      if (query.level && alert.level !== query.level) {
        return false;
      }

      if (query.monitoredAreaId && alert.monitoredAreaId !== query.monitoredAreaId) {
        return false;
      }

      return true;
    });

    const items: AlertListItemDto[] = alerts.map((alert) => ({
      id: alert.id,
      monitoredAreaId: alert.monitoredAreaId,
      areaName: this.monitoredAreasService.getEntityById(alert.monitoredAreaId, userId).name,
      status: alert.status,
      channel: alert.channel,
      level: alert.level,
      severity: alert.severity,
      title: alert.title,
      summary: alert.summary,
      triggeredAt: alert.triggeredAt.toISOString(),
    }));

    const response: AlertsResponseDto = {
      items,
      total: items.length,
      filters: this.compactFilters(query),
    };

    if (items.length === 0) {
      response.emptyStateMessage = 'Nenhum alerta ativo para as areas monitoradas no momento.';
    }

    return response;
  }

  private compactFilters(filters: GetAlertsQueryDto): GetAlertsQueryDto {
    const compacted: GetAlertsQueryDto = {};
    if (filters.status) {
      compacted.status = filters.status;
    }
    if (filters.level) {
      compacted.level = filters.level;
    }
    if (filters.monitoredAreaId) {
      compacted.monitoredAreaId = filters.monitoredAreaId;
    }
    return compacted;
  }
}
