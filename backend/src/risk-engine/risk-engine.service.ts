import {
  DataOrigin,
  RiskFactorCode,
  RiskLevel,
} from '../common/domain/enums';
import { randomUUID } from 'crypto';
import { isRelevantFireEvent } from '../common/domain/fire-event-proximity';
import { classifyRisk, RISK_RULES, RISK_SCORE_MAX } from '../common/domain/risk-rules';
import { RiskCalculationResponseDto, RiskFactorResponseDto } from './contracts/risk.contracts';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { FireEventsService } from '../fire-events/fire-events.service';
import { WeatherService } from '../weather/weather.service';
import { interpretWeatherForRisk } from '../common/domain/weather-rules';
import { BackendLogger, BackendLoggerLike } from '../common/logging/backend-logger';
import { OperationalMetricsRecorder } from '../common/metrics/operational-metrics';

function formatRiskLevelLabel(level: RiskLevel): string {
  if (level === RiskLevel.CRITICAL) {
    return 'critico';
  }

  if (level === RiskLevel.HIGH) {
    return 'alto';
  }

  if (level === RiskLevel.MODERATE) {
    return 'moderado';
  }

  return 'baixo';
}

export class RiskEngineService {
  constructor(
    private readonly store: OrbitGuardStore,
    private readonly monitoredAreasService: MonitoredAreasService,
    private readonly fireEventsService: FireEventsService,
    private readonly weatherService: WeatherService,
    private readonly logger: BackendLoggerLike = new BackendLogger(),
    private readonly operationalMetricsRecorder: OperationalMetricsRecorder = new OperationalMetricsRecorder(),
  ) {}

  calculate(areaId: string, userId: string, periodHours = 24, forceMock = false): RiskCalculationResponseDto {
    this.logger.info('risk-engine', 'risk-calculation-start', 'Starting risk calculation.', {
      areaId,
      periodHours,
      forceMock,
    });

    try {
      const area = this.monitoredAreasService.getEntityById(areaId, userId);
      const fireEvents = this.fireEventsService.getByAreaId(areaId, { periodHours }, userId);
      const weather = this.weatherService.getLatestByAreaId(areaId, userId);
      const weatherAssessment = interpretWeatherForRisk(weather, weather);
      const evaluatedAt = new Date();

      const factors: RiskFactorResponseDto[] = [];
      let score = 0;

      const relevantItems = fireEvents.items.filter((item) =>
        isRelevantFireEvent(item.distanceKm, area.radiusKm, area.operationalBufferKm),
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

      if (weatherAssessment.isHot) {
        score += RISK_RULES.highTemp;
        factors.push({
          code: RiskFactorCode.HIGH_TEMP,
          label: 'Temperatura elevada',
          points: RISK_RULES.highTemp,
          reason: `A temperatura observada ultrapassou 32 C (${weatherAssessment.temperatureC.toFixed(1)} C).`,
        });
      }

      if (weatherAssessment.isDryAir) {
        score += RISK_RULES.lowHumidity;
        factors.push({
          code: RiskFactorCode.LOW_HUMIDITY,
          label: 'Baixa umidade',
          points: RISK_RULES.lowHumidity,
          reason: `A umidade relativa ficou abaixo de 30% (${weatherAssessment.humidityPercent.toFixed(0)}%).`,
        });
      }

      if (weatherAssessment.isDryWeather) {
        score += RISK_RULES.lowRain;
        factors.push({
          code: RiskFactorCode.LOW_RAIN,
          label: 'Ausencia de chuva relevante',
          points: RISK_RULES.lowRain,
          reason: `A precipitacao observada foi menor que 1 mm (${weatherAssessment.precipitationMm.toFixed(1)} mm).`,
        });
      }

      if (weatherAssessment.isWindy) {
        score += RISK_RULES.strongWind;
        factors.push({
          code: RiskFactorCode.STRONG_WIND,
          label: 'Vento forte',
          points: RISK_RULES.strongWind,
          reason: `A velocidade do vento ficou acima de 8 m/s (${weatherAssessment.windSpeedMs.toFixed(1)} m/s).`,
        });
      }

      score = Math.min(score, RISK_SCORE_MAX);
      const { level, severity } = classifyRisk(score);
      const summary = this.buildSummary(
        area.name,
        factors,
        level,
        weatherAssessment.climateSummary,
        periodHours,
      );
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

      const response = {
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

      this.logger.info('risk-engine', 'risk-calculation-success', 'Risk calculation completed.', {
        areaId,
        periodHours,
        score: response.score,
        level: response.level,
        severity: response.severity,
        factorCodes: response.factors.map((factor) => factor.code),
        alertTriggered: response.alertTriggered,
        dataSources: response.dataSources,
        contributingSignals: response.contributingSignals,
      });

      return response;
    } catch (error) {
      this.operationalMetricsRecorder.recordIntegrationFailure('risk-engine');
      this.logger.error('risk-engine', 'risk-calculation-failure', 'Risk calculation failed.', {
        areaId,
        periodHours,
        forceMock,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private buildSummary(
    areaName: string,
    factors: RiskFactorResponseDto[],
    level: RiskLevel,
    climateSummary: string,
    periodHours: number,
  ): string {
    const factorLabels = factors.slice(0, 2).map((factor) => factor.label.toLowerCase());
    const detail = factorLabels.length > 0 ? ` (${factorLabels.join(', ')})` : '';
    const climateDetail = climateSummary ? ` ${climateSummary}` : '';
    return `${areaName} apresenta risco ${formatRiskLevelLabel(level)} nas ultimas ${periodHours} horas${detail}.${climateDetail}`;
  }
}
