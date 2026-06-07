import { RiskFactorResponseDto } from '../risk-engine/contracts/risk.contracts';
import { RiskLevel } from '../common/domain/enums';

export interface AlertContent {
  title: string;
  summary: string;
  message: string;
  recommendedActions: string[];
}

function formatFactorLabels(factors: RiskFactorResponseDto[]): string {
  if (factors.length === 0) {
    return 'nenhum fator adicional foi identificado';
  }

  const labels = factors.slice(0, 3).map((factor) => factor.label.toLowerCase());
  if (labels.length === 1) {
    return `o fator principal foi ${labels[0]}`;
  }

  if (labels.length === 2) {
    return `os fatores principais foram ${labels[0]} e ${labels[1]}`;
  }

  return `os fatores principais foram ${labels[0]}, ${labels[1]} e ${labels[2]}`;
}

function buildPrimaryAction(level: RiskLevel): string {
  if (level === RiskLevel.CRITICAL) {
    return 'Reforce a vigilancia local agora.';
  }

  if (level === RiskLevel.HIGH) {
    return 'Intensifique o monitoramento da area nas proximas horas.';
  }

  return 'Acompanhe a area com mais frequencia ao longo do dia.';
}

function buildFactorActions(factors: RiskFactorResponseDto[]): string[] {
  const actions = new Set<string>();

  for (const factor of factors) {
    if (factor.code === 'NEAR_FIRE_CRITICAL' || factor.code === 'NEAR_FIRE_WARNING') {
      actions.add('Afaste pessoas e equipamentos das bordas da area monitorada.');
    }

    if (factor.code === 'FIRE_CLUSTER') {
      actions.add('Monitore a evolucao dos focos nas proximas horas.');
    }

    if (
      factor.code === 'HIGH_TEMP' ||
      factor.code === 'LOW_HUMIDITY' ||
      factor.code === 'LOW_RAIN' ||
      factor.code === 'STRONG_WIND'
    ) {
      actions.add('Evite qualquer atividade que possa gerar faisca, fogo ou dispersao de chamas.');
    }
  }

  return [...actions];
}

export function buildAlertContent(
  areaName: string,
  level: RiskLevel,
  summary: string,
  factors: RiskFactorResponseDto[],
): AlertContent {
  const title =
    level === RiskLevel.CRITICAL
      ? 'Risco critico de queimada'
      : level === RiskLevel.HIGH
        ? 'Risco alto de queimada'
        : 'Risco moderado de queimada';

  const factorSentence = formatFactorLabels(factors);
  const primaryAction = buildPrimaryAction(level);
  const factorActions = buildFactorActions(factors);

  return {
    title,
    summary,
    message: `${areaName} em risco ${level.toLowerCase()}. ${factorSentence} e o cenario exige atencao imediata. ${primaryAction}`,
    recommendedActions: [primaryAction, ...factorActions].slice(0, 3),
  };
}
