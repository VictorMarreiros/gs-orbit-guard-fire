import { AuthService } from '../auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { FireEventsService } from '../fire-events/fire-events.service';
import { MonitoredAreasService } from '../monitored-areas/monitored-areas.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { WeatherService } from '../weather/weather.service';
import { OrbitGuardStore } from '../integrations/memory/orbitguard-store';
import { BackendLogger, BackendLoggerLike } from '../common/logging/backend-logger';
import { MonitoredAreaType } from '../common/domain/enums';
import { OperationalMetricsRecorder, OperationalMetricsSnapshot } from '../common/metrics/operational-metrics';
import {
  CreateMonitoredAreaRequestDto,
  MonitoredAreaMapResponseDto,
  MonitoredAreaResponseDto,
} from '../monitored-areas/contracts/monitored-areas.contracts';
import {
  AlertsResponseDto,
  GetAlertsQueryDto,
} from '../alerts/contracts/alerts.contracts';
import {
  CalculateRiskRequestDto,
  RiskCalculationResponseDto,
} from '../risk-engine/contracts/risk.contracts';
import { DashboardSummaryResponseDto } from '../dashboard/contracts/dashboard.contracts';
import { FireEventsResponseDto, GetFireEventsQueryDto } from '../fire-events/contracts/fire-events.contracts';
import { WeatherSnapshotResponseDto } from '../weather/contracts/weather.contracts';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto, SessionContextResponseDto } from '../auth/contracts/auth.contracts';

export interface OrbitGuardFireBackendOptions {
  logger?: BackendLoggerLike;
}

export class OrbitGuardFireBackend {
  readonly store: OrbitGuardStore;
  readonly authService: AuthService;
  readonly monitoredAreasService: MonitoredAreasService;
  readonly fireEventsService: FireEventsService;
  readonly weatherService: WeatherService;
  readonly riskEngineService: RiskEngineService;
  readonly alertsService: AlertsService;
  readonly dashboardService: DashboardService;
  readonly logger: BackendLoggerLike;
  readonly operationalMetricsRecorder: OperationalMetricsRecorder;

  constructor(options: OrbitGuardFireBackendOptions = {}) {
    this.logger = options.logger ?? new BackendLogger();
    this.operationalMetricsRecorder = new OperationalMetricsRecorder();
    this.store = new OrbitGuardStore();
    this.authService = new AuthService(this.store);
    this.monitoredAreasService = new MonitoredAreasService(this.store);
    this.fireEventsService = new FireEventsService(
      this.store,
      this.monitoredAreasService,
      this.logger,
      this.operationalMetricsRecorder,
    );
    this.weatherService = new WeatherService(
      this.store,
      this.monitoredAreasService,
      this.logger,
      this.operationalMetricsRecorder,
    );
    this.riskEngineService = new RiskEngineService(
      this.store,
      this.monitoredAreasService,
      this.fireEventsService,
      this.weatherService,
      this.logger,
      this.operationalMetricsRecorder,
    );
    this.alertsService = new AlertsService(
      this.store,
      this.monitoredAreasService,
      this.logger,
      this.operationalMetricsRecorder,
    );
    this.dashboardService = new DashboardService(this.store);

    this.logger.info('startup', 'startup-start', 'Bootstrapping OrbitGuard Fire demo backend.');
    try {
      this.bootstrapDemoDataset();
      this.logger.info('startup', 'startup-success', 'OrbitGuard Fire demo backend is ready.');
    } catch (error) {
      this.operationalMetricsRecorder.recordIntegrationFailure('startup');
      this.logger.error('startup', 'startup-failure', 'Failed to bootstrap OrbitGuard Fire demo backend.', {
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  register(input: RegisterRequestDto): RegisterResponseDto {
    return this.authService.register(input);
  }

  login(input: LoginRequestDto): LoginResponseDto {
    return this.authService.login(input);
  }

  me(accessToken?: string): SessionContextResponseDto {
    return this.authService.getSessionContext(accessToken);
  }

  createMonitoredArea(input: CreateMonitoredAreaRequestDto, accessToken?: string): MonitoredAreaResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    return this.monitoredAreasService.create(input, user.id);
  }

  getMonitoredArea(areaId: string, accessToken?: string): MonitoredAreaMapResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    return this.monitoredAreasService.getById(areaId, user.id);
  }

  listMonitoredAreas(accessToken?: string): MonitoredAreaResponseDto[] {
    const { user } = this.authService.resolveSession(accessToken);
    return this.monitoredAreasService.listByUser(user.id);
  }

  getFireEvents(areaId: string, query: GetFireEventsQueryDto = {}, accessToken?: string): FireEventsResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    return this.fireEventsService.getByAreaId(areaId, query, user.id);
  }

  getLatestWeather(areaId: string, accessToken?: string): WeatherSnapshotResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    return this.weatherService.getLatestByAreaId(areaId, user.id);
  }

  calculateRisk(areaId: string, query: CalculateRiskRequestDto = {}, accessToken?: string): RiskCalculationResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    const risk = this.riskEngineService.calculate(areaId, user.id, query.periodHours ?? 24, query.forceMock ?? false);
    this.alertsService.upsertFromRiskCalculation(risk, user.id);
    return risk;
  }

  listAlerts(query: GetAlertsQueryDto = {}, accessToken?: string): AlertsResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    return this.alertsService.list(user.id, query);
  }

  getDashboardSummary(accessToken?: string): DashboardSummaryResponseDto {
    const { user } = this.authService.resolveSession(accessToken);
    return this.dashboardService.getSummary(user.id);
  }

  getOperationalMetrics(accessToken?: string): OperationalMetricsSnapshot {
    const { user } = this.authService.resolveSession(accessToken);
    return this.operationalMetricsRecorder.snapshotFromDashboard(this.dashboardService.getSummary(user.id));
  }

  private bootstrapDemoDataset(): void {
    const demoUser = this.authService.bootstrapDemoUser();

    const demoAreas = [
      {
        name: 'Fazenda Santa Luzia',
        type: MonitoredAreaType.RURAL_PROPERTY,
        latitude: -15.7801,
        longitude: -47.9292,
        radiusKm: 10,
      },
      {
        name: 'Cooperativa Esperanca',
        type: MonitoredAreaType.RURAL_COMMUNITY,
        latitude: -15.6854,
        longitude: -47.8123,
        radiusKm: 6,
      },
      {
        name: 'Escola Verde',
        type: MonitoredAreaType.SCHOOL,
        latitude: -15.9123,
        longitude: -47.7444,
        radiusKm: 3,
      },
    ];

    const createdAreas = demoAreas.map((area) =>
      this.monitoredAreasService.create(area, demoUser.id),
    );

    for (const area of createdAreas) {
      this.calculateRisk(area.id, { periodHours: 24, forceMock: true }, demoUser.sessionContext.accessToken);
    }
  }
}

export function createOrbitGuardFireBackend(options: OrbitGuardFireBackendOptions = {}): OrbitGuardFireBackend {
  return new OrbitGuardFireBackend(options);
}
