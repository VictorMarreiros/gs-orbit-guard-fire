export type BackendLogLevel = 'INFO' | 'WARN' | 'ERROR';

export type BackendLogScope = 'startup' | 'fire-events' | 'weather' | 'risk-engine' | 'alerts';

export type BackendLogEvent =
  | 'startup-start'
  | 'startup-success'
  | 'startup-failure'
  | 'mock-collection-start'
  | 'mock-collection-success'
  | 'mock-collection-failure'
  | 'risk-calculation-start'
  | 'risk-calculation-success'
  | 'risk-calculation-failure'
  | 'alert-generation-start'
  | 'alert-generation-success'
  | 'alert-generation-failure';

export interface BackendLogEntry {
  timestamp: string;
  level: BackendLogLevel;
  scope: BackendLogScope;
  event: BackendLogEvent;
  message: string;
  details: Record<string, unknown>;
}

export interface BackendLogSink {
  write(entry: BackendLogEntry): void;
}

export interface BackendLoggerLike {
  info(scope: BackendLogScope, event: BackendLogEvent, message: string, details?: Record<string, unknown>): void;
  warn(scope: BackendLogScope, event: BackendLogEvent, message: string, details?: Record<string, unknown>): void;
  error(scope: BackendLogScope, event: BackendLogEvent, message: string, details?: Record<string, unknown>): void;
}

const REDACTED_FIELDS = new Set([
  'accessToken',
  'apiKey',
  'authorization',
  'coordinate',
  'coordinates',
  'lat',
  'latitude',
  'lng',
  'lon',
  'longitude',
  'password',
  'passwordConfirmation',
  'passwordHash',
  'secret',
  'refreshToken',
  'sessionToken',
  'token',
]);

class ConsoleBackendLogSink implements BackendLogSink {
  write(entry: BackendLogEntry): void {
    console.log(JSON.stringify(entry));
  }
}

export function sanitizeBackendLogDetails(details: Record<string, unknown> = {}): Record<string, unknown> {
  return sanitizeValue(details) as Record<string, unknown>;
}

export class BackendLogger implements BackendLoggerLike {
  constructor(private readonly sink: BackendLogSink = new ConsoleBackendLogSink()) {}

  info(
    scope: BackendLogScope,
    event: BackendLogEvent,
    message: string,
    details: Record<string, unknown> = {},
  ): void {
    this.emit('INFO', scope, event, message, details);
  }

  warn(
    scope: BackendLogScope,
    event: BackendLogEvent,
    message: string,
    details: Record<string, unknown> = {},
  ): void {
    this.emit('WARN', scope, event, message, details);
  }

  error(
    scope: BackendLogScope,
    event: BackendLogEvent,
    message: string,
    details: Record<string, unknown> = {},
  ): void {
    this.emit('ERROR', scope, event, message, details);
  }

  private emit(
    level: BackendLogLevel,
    scope: BackendLogScope,
    event: BackendLogEvent,
    message: string,
    details: Record<string, unknown>,
  ): void {
    this.sink.write({
      timestamp: new Date().toISOString(),
      level,
      scope,
      event,
      message,
      details: sanitizeBackendLogDetails(details),
    });
  }
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((accumulator, [key, item]) => {
      if (REDACTED_FIELDS.has(key)) {
        return accumulator;
      }

      const sanitized = sanitizeValue(item);
      if (sanitized !== undefined) {
        accumulator[key] = sanitized;
      }
      return accumulator;
    }, {});
  }

  return value;
}
