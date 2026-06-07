import {
  DataOrigin,
  FireEventRelevance,
  RiskFactorCode,
  RiskLevel,
} from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { classifyRisk, RISK_RULES, RISK_SCORE_MAX } from '../common/domain/risk-rules';
import { RiskCalculationResponseDto, RiskFactorResponseDto } from './contracts/risk.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { FireEventsService } from '../fire-events/fire-events.service';
import { WeatherService } from '../weather/weather.service';

export class RiskEngineService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
    private readonly fireEventsService: FireEventsService,
    private readonly weatherService: WeatherService,
  ) {}

  calculate(areaId: string, userId: string, periodHours = 24, forceMock = false): RiskCalculationResponseDto {
    const area = this.monitoredAreasService.getEntityById(areaId, userId);
    const fireEvents = this.fireEventsService.getByAreaId(areaId, { periodHours }, userId);
    const weather = this.weatherService.getLatestByAreaId(areaId, userId);
    const evaluatedAt = new Date();

    const factors: RiskFactorResponseDto[] = [];
    let score = 0;

    const relevantItems = fireEvents.items.filter(
      (item) =>
        item.relevance === FireEventRelevance.INSIDE || item.relevance === FireEventRelevance.NEARBY,
    );
    const nearestDistance = relevantItems.length
      ? Math.min(...relevantItems.map((item) => item.distanceKm))
      : Number.POSITIVE_INFINITY;

    if (nearestDistance <= 5) {
      score += RISK_RULES.nearFireCritical;
      factors.push({
        code: RiskFactorCode.NEAR_FIRE_CRITICAL,
        label: 'Foco criticamente proximo',
        points: RISK_RULES.nearFireCritical,
        reason: 'Ao menos um foco foi detectado a ate 5 km da area monitorada.',
      });
    } else if (nearestDistance <= 10) {
      score += RISK_RULES.nearFireWarning;
      factors.push({
        code: RiskFactorCode.NEAR_FIRE_WARNING,
        label: 'Foco proximo',
        points: RISK_RULES.nearFireWarning,
        reason: 'Foi detectado foco relevante entre 5 km e 10 km da area monitorada.',
      });
    }

    if (relevantItems.length >= 3) {
      score += RISK_RULES.fireCluster;
      factors.push({
        code: RiskFactorCode.FIRE_CLUSTER,
        label: 'Concentracao recente de focos',
        points: RISK_RULES.fireCluster,
        reason: 'Tres ou mais focos relevantes foram detectados na janela analisada.',
      });
    }

    if (weather.temperatureC > 32) {
      score += RISK_RULES.highTemp;
      factors.push({
        code: RiskFactorCode.HIGH_TEMP,
        label: 'Temperatura elevada',
        points: RISK_RULES.highTemp,
        reason: 'A temperatura observada ultrapassou 32 C.',
      });
    }

    if (weather.humidityPercent < 30) {
      score += RISK_RULES.lowHumidity;
      factors.push({
        code: RiskFactorCode.LOW_HUMIDITY,
        label: 'Baixa umidade',
        points: RISK_RULES.lowHumidity,
        reason: 'A umidade relativa ficou abaixo de 30%.',
      });
    }

    if (weather.precipitationMm < 1) {
      score += RISK_RULES.lowRain;
      factors.push({
        code: RiskFactorCode.LOW_RAIN,
        label: 'Ausencia de chuva relevante',
        points: RISK_RULES.lowRain,
        reason: 'A precipitacao observada foi menor que 1 mm.',
      });
    }

    if (weather.windSpeedMs > 8) {
      score += RISK_RULES.strongWind;
      factors.push({
        code: RiskFactorCode.STRONG_WIND,
        label: 'Vento forte',
        points: RISK_RULES.strongWind,
        reason: 'A velocidade do vento ficou acima de 8 m/s.',
      });
    }

    score = Math.min(score, RISK_SCORE_MAX);
    const { level, severity } = classifyRisk(score);
    const summary = this.buildSummary(area.name, factors, level);
    const riskScoreId = randomUUID();
    const weatherSnapshot = this.store.getLatestWeatherSnapshot(areaId);

    const riskScore = this.store.upsertRiskScore({
      id: riskScoreId,
      monitoredAreaId: areaId,
      weatherSnapshotId: weatherSnapshot?.id,
      dataOrigin: forceMock ? DataOrigin.FALLBACK : DataOrigin.FALLBACK,
      score,
      level,
      severity,
      summary,
      evaluatedAt,
      periodHours,
      fireEventsConsidered: fireEvents.summary.total,
      insideFireEvents: fireEvents.summary.insideCount,
      nearbyFireEvents: fireEvents.summary.nearbyCount,
      createdAt: evaluatedAt,
      updatedAt: evaluatedAt,
      factors: [],
    });

    const persistedFactors = factors.map((factor, index) => ({
      id: randomUUID(),
      riskScoreId: riskScore.id,
      code: factor.code,
      label: factor.label,
      points: factor.points,
      reason: factor.reason,
      sortOrder: index,
      createdAt: evaluatedAt,
    }));

    this.store.upsertRiskFactors(persistedFactors);
    riskScore.factors = persistedFactors;

    return {
      id: riskScore.id,
      monitoredAreaId: areaId,
      score,
      level,
      severity,
      summary,
      evaluatedAt: evaluatedAt.toISOString(),
      periodHours,
      factors,
      contributingSignals: {
        fireEventsConsidered: fireEvents.summary.total,
        insideFireEvents: fireEvents.summary.insideCount,
        nearbyFireEvents: fireEvents.summary.nearbyCount,
      },
      dataSources: {
        fireEvents: DataOrigin.FALLBACK,
        weather: DataOrigin.FALLBACK,
      },
      alertTriggered: level === RiskLevel.HIGH || level === RiskLevel.CRITICAL,
    };
  }

  private buildSummary(areaName: string, factors: RiskFactorResponseDto[], level: RiskLevel): string {
    const factorLabels = factors.slice(0, 2).map((factor) => factor.label.toLowerCase());
    const detail = factorLabels.length > 0 ? ` (${factorLabels.join(', ')})` : '';
    return `${areaName} apresenta risco ${level.toLowerCase()} nas ultimas 24 horas${detail}.`;
  }
}
