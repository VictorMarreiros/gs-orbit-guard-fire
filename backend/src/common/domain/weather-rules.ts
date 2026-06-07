import { clamp, roundTo } from './math';

export interface WeatherSnapshotLike {
  temperatureC: number;
  precipitationMm: number;
  humidityPercent: number;
  windSpeedMs: number;
}

export interface WeatherInterpretationIssue {
  field: keyof WeatherSnapshotLike;
  code: 'MISSING_VALUE' | 'INVALID_NUMBER' | 'OUT_OF_RANGE';
  message: string;
}

export interface WeatherInterpretationResult extends WeatherSnapshotLike {
  issues: WeatherInterpretationIssue[];
  usedFallback: boolean;
  isHot: boolean;
  isDryAir: boolean;
  isDryWeather: boolean;
  isWindy: boolean;
  climateSummary: string;
}

const WEATHER_LIMITS = {
  temperatureC: {
    min: -50,
    max: 60,
    hotThreshold: 32,
  },
  precipitationMm: {
    min: 0,
    max: 500,
    dryThreshold: 1,
  },
  humidityPercent: {
    min: 0,
    max: 100,
    dryThreshold: 30,
  },
  windSpeedMs: {
    min: 0,
    max: 60,
    windyThreshold: 8,
  },
} as const;

export function interpretWeatherForRisk(
  weather: Partial<WeatherSnapshotLike> | undefined,
  fallback: WeatherSnapshotLike,
): WeatherInterpretationResult {
  const issues: WeatherInterpretationIssue[] = [];
  const normalized = {
    temperatureC: resolveWeatherValue(
      weather?.temperatureC,
      fallback.temperatureC,
      'temperatureC',
      WEATHER_LIMITS.temperatureC.min,
      WEATHER_LIMITS.temperatureC.max,
      issues,
      'Informe uma temperatura valida para manter o calculo deterministico.',
    ),
    precipitationMm: resolveWeatherValue(
      weather?.precipitationMm,
      fallback.precipitationMm,
      'precipitationMm',
      WEATHER_LIMITS.precipitationMm.min,
      WEATHER_LIMITS.precipitationMm.max,
      issues,
      'Informe uma precipitacao valida para manter o calculo deterministico.',
    ),
    humidityPercent: resolveWeatherValue(
      weather?.humidityPercent,
      fallback.humidityPercent,
      'humidityPercent',
      WEATHER_LIMITS.humidityPercent.min,
      WEATHER_LIMITS.humidityPercent.max,
      issues,
      'Informe uma umidade valida para manter o calculo deterministico.',
    ),
    windSpeedMs: resolveWeatherValue(
      weather?.windSpeedMs,
      fallback.windSpeedMs,
      'windSpeedMs',
      WEATHER_LIMITS.windSpeedMs.min,
      WEATHER_LIMITS.windSpeedMs.max,
      issues,
      'Informe uma velocidade do vento valida para manter o calculo deterministico.',
    ),
  };

  const isHot = normalized.temperatureC > WEATHER_LIMITS.temperatureC.hotThreshold;
  const isDryAir = normalized.humidityPercent < WEATHER_LIMITS.humidityPercent.dryThreshold;
  const isDryWeather = normalized.precipitationMm < WEATHER_LIMITS.precipitationMm.dryThreshold;
  const isWindy = normalized.windSpeedMs > WEATHER_LIMITS.windSpeedMs.windyThreshold;

  return {
    ...normalized,
    issues,
    usedFallback: issues.length > 0,
    isHot,
    isDryAir,
    isDryWeather,
    isWindy,
    climateSummary: buildClimateSummary(isHot, isDryAir, isDryWeather, isWindy, issues.length > 0),
  };
}

function resolveWeatherValue(
  value: number | undefined,
  fallback: number,
  field: WeatherInterpretationIssue['field'],
  min: number,
  max: number,
  issues: WeatherInterpretationIssue[],
  missingMessage: string,
): number {
  if (value === undefined || value === null) {
    issues.push({
      field,
      code: 'MISSING_VALUE',
      message: missingMessage,
    });
    return roundTo(clamp(fallback, min, max), 2);
  }

  if (!Number.isFinite(value)) {
    issues.push({
      field,
      code: 'INVALID_NUMBER',
      message: missingMessage,
    });
    return roundTo(clamp(fallback, min, max), 2);
  }

  if (value < min || value > max) {
    issues.push({
      field,
      code: 'OUT_OF_RANGE',
      message: missingMessage,
    });
    return roundTo(clamp(fallback, min, max), 2);
  }

  return roundTo(clamp(value, min, max), 2);
}

function buildClimateSummary(
  isHot: boolean,
  isDryAir: boolean,
  isDryWeather: boolean,
  isWindy: boolean,
  hasFallback: boolean,
): string {
  const descriptors: string[] = [];

  if (isHot) {
    descriptors.push('quente');
  }
  if (isDryAir || isDryWeather) {
    descriptors.push('seco');
  }
  if (isWindy) {
    descriptors.push('ventoso');
  }

  if (descriptors.length === 0) {
    return hasFallback
      ? 'clima normalizado com fallback deterministico.'
      : 'clima sem extremos relevantes.';
  }

  return `clima ${descriptors.join(' e ')}.`;
}
