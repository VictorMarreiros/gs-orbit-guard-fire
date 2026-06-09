import {
  AlertChannel,
  AlertStatus,
  AuthProvider,
  DataOrigin,
  FireEventRelevance,
  FireEventSource,
  MonitoredAreaType,
  RiskLevel,
  RiskSeverity,
  UserRole,
} from '../../common/domain/enums';
import { randomUUID } from 'crypto';
import { AlertEntity } from '../../alerts/entities/alert.entity';
import { AreaFireEventEntity, FireEventEntity } from '../../fire-events/entities/fire-event.entity';
import { DashboardSummaryEntity } from '../../dashboard/entities/dashboard-summary.entity';
import { MonitoredAreaEntity } from '../../monitored-areas/entities/monitored-area.entity';
import { RiskFactorEntity, RiskScoreEntity } from '../../risk-engine/entities/risk-score.entity';
import { WeatherSnapshotEntity } from '../../weather/entities/weather-snapshot.entity';
import { UserEntity } from '../../auth/entities/user.entity';

export interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: Date;
  isDemoSession: boolean;
}

export interface StoreSeedUserInput {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  authProvider?: AuthProvider;
  isActive?: boolean;
  sessionToken?: string;
  sessionExpiresAt?: Date;
  isDemoSession?: boolean;
}

export interface StoreCreateAreaInput {
  userId: string;
  name: string;
  type: MonitoredAreaType;
  latitude: number;
  longitude: number;
  radiusKm: number;
  operationalBufferKm?: number;
}

export class OrbitGuardStore {
  private readonly users = new Map<string, UserEntity>();
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly monitoredAreas = new Map<string, MonitoredAreaEntity>();
  private readonly fireEvents = new Map<string, FireEventEntity>();
  private readonly areaFireEvents = new Map<string, AreaFireEventEntity>();
  private readonly weatherSnapshots = new Map<string, WeatherSnapshotEntity>();
  private readonly riskScores = new Map<string, RiskScoreEntity>();
  private readonly riskFactors = new Map<string, RiskFactorEntity>();
  private readonly alerts = new Map<string, AlertEntity>();
  private readonly latestRiskScoreByArea = new Map<string, string>();
  private readonly activeAlertByArea = new Map<string, string>();
  private readonly scenarioByArea = new Map<string, string>();

  seedUser(input: StoreSeedUserInput): UserEntity {
    const id = input.id ?? randomUUID();
    const now = new Date();
    const user: UserEntity = {
      id,
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? UserRole.DEMO_USER,
      authProvider: input.authProvider ?? AuthProvider.DEMO,
      isActive: input.isActive ?? true,
      lastLoginAt: undefined,
      sessionContext: {
        accessToken: undefined,
        refreshToken: undefined,
        expiresAt: undefined,
        isDemoSession: input.isDemoSession ?? true,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);

    if (input.sessionToken && input.sessionExpiresAt) {
      this.sessions.set(input.sessionToken, {
        token: input.sessionToken,
        userId: user.id,
        expiresAt: input.sessionExpiresAt,
        isDemoSession: input.isDemoSession ?? true,
      });
      user.sessionContext = {
        accessToken: input.sessionToken,
        refreshToken: undefined,
        expiresAt: input.sessionExpiresAt,
        isDemoSession: input.isDemoSession ?? true,
      };
    }

    return user;
  }

  updateUser(user: UserEntity): UserEntity {
    this.users.set(user.id, user);
    return user;
  }

  findUserById(id: string): UserEntity | undefined {
    return this.users.get(id);
  }

  findUserByEmail(email: string): UserEntity | undefined {
    return [...this.users.values()].find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  createSession(userId: string, expiresAt: Date, isDemoSession: boolean): SessionRecord {
    const token = `orbitguard_${randomUUID()}`;
    const session: SessionRecord = {
      token,
      userId,
      expiresAt,
      isDemoSession,
    };

    this.sessions.set(token, session);
    const user = this.users.get(userId);
    if (user) {
      user.sessionContext = {
        accessToken: token,
        refreshToken: undefined,
        expiresAt,
        isDemoSession,
      };
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
    }

    return session;
  }

  findSession(token: string): SessionRecord | undefined {
    return this.sessions.get(token);
  }

  seedArea(input: StoreCreateAreaInput): MonitoredAreaEntity {
    const id = randomUUID();
    const now = new Date();
    const area: MonitoredAreaEntity = {
      id,
      userId: input.userId,
      name: input.name,
      type: input.type,
      center: {
        latitude: input.latitude,
        longitude: input.longitude,
      },
      radiusKm: input.radiusKm,
      operationalBufferKm: input.operationalBufferKm ?? 5,
      latitudeNormalized: input.latitude,
      longitudeNormalized: input.longitude,
      createdAt: now,
      updatedAt: now,
    };

    this.monitoredAreas.set(area.id, area);
    return area;
  }

  updateArea(area: MonitoredAreaEntity): MonitoredAreaEntity {
    this.monitoredAreas.set(area.id, area);
    return area;
  }

  findAreaById(id: string): MonitoredAreaEntity | undefined {
    return this.monitoredAreas.get(id);
  }

  listAreasByUser(userId: string): MonitoredAreaEntity[] {
    return [...this.monitoredAreas.values()].filter((area) => area.userId === userId);
  }

  setScenario(areaId: string, scenarioKey: string): void {
    this.scenarioByArea.set(areaId, scenarioKey);
  }

  getScenario(areaId: string): string | undefined {
    return this.scenarioByArea.get(areaId);
  }

  upsertFireEvent(event: FireEventEntity): FireEventEntity {
    this.fireEvents.set(event.id, event);
    return event;
  }

  upsertAreaFireEvent(link: AreaFireEventEntity): AreaFireEventEntity {
    this.areaFireEvents.set(link.id, link);
    return link;
  }

  listFireEventsByArea(areaId: string): Array<{
    fireEvent: FireEventEntity;
    link: AreaFireEventEntity;
  }> {
    return [...this.areaFireEvents.values()]
      .filter((link) => link.monitoredAreaId === areaId)
      .sort((left, right) => right.consideredAt.getTime() - left.consideredAt.getTime())
      .map((link) => ({
        fireEvent: this.fireEvents.get(link.fireEventId),
        link,
      }))
      .filter((entry): entry is { fireEvent: FireEventEntity; link: AreaFireEventEntity } =>
        Boolean(entry.fireEvent),
      );
  }

  upsertWeatherSnapshot(snapshot: WeatherSnapshotEntity): WeatherSnapshotEntity {
    this.weatherSnapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  getLatestWeatherSnapshot(areaId: string): WeatherSnapshotEntity | undefined {
    return [...this.weatherSnapshots.values()]
      .filter((snapshot) => snapshot.monitoredAreaId === areaId)
      .sort((left, right) => right.observedAt.getTime() - left.observedAt.getTime())[0];
  }

  upsertRiskScore(score: RiskScoreEntity): RiskScoreEntity {
    this.riskScores.set(score.id, score);
    this.latestRiskScoreByArea.set(score.monitoredAreaId, score.id);
    return score;
  }

  upsertRiskFactors(factors: RiskFactorEntity[]): RiskFactorEntity[] {
    for (const factor of factors) {
      this.riskFactors.set(factor.id, factor);
    }
    return factors;
  }

  getLatestRiskScore(areaId: string): RiskScoreEntity | undefined {
    const scoreId = this.latestRiskScoreByArea.get(areaId);
    if (scoreId) {
      return this.riskScores.get(scoreId);
    }

    return [...this.riskScores.values()]
      .filter((score) => score.monitoredAreaId === areaId)
      .sort((left, right) => right.evaluatedAt.getTime() - left.evaluatedAt.getTime())[0];
  }

  listRiskScoresByUser(userId: string): RiskScoreEntity[] {
    const areaIds = new Set(this.listAreasByUser(userId).map((area) => area.id));
    return [...this.riskScores.values()].filter((score) => areaIds.has(score.monitoredAreaId));
  }

  upsertAlert(alert: AlertEntity): AlertEntity {
    this.alerts.set(alert.id, alert);
    if (alert.status === AlertStatus.ACTIVE) {
      this.activeAlertByArea.set(alert.monitoredAreaId, alert.id);
    }
    return alert;
  }

  resolveExistingActiveAlert(areaId: string): AlertEntity | undefined {
    const alertId = this.activeAlertByArea.get(areaId);
    if (alertId) {
      return this.alerts.get(alertId);
    }

    return [...this.alerts.values()].find(
      (alert) => alert.monitoredAreaId === areaId && alert.status === AlertStatus.ACTIVE,
    );
  }

  listAlertsByUser(userId: string): AlertEntity[] {
    const areaIds = new Set(this.listAreasByUser(userId).map((area) => area.id));
    return [...this.alerts.values()].filter((alert) => areaIds.has(alert.monitoredAreaId));
  }

  listActiveAlertsByUser(userId: string): AlertEntity[] {
    return this.listAlertsByUser(userId).filter((alert) => alert.status === AlertStatus.ACTIVE);
  }

  deactivateAlertsForArea(areaId: string): void {
    for (const alert of this.alerts.values()) {
      if (alert.monitoredAreaId === areaId && alert.status === AlertStatus.ACTIVE) {
        alert.status = AlertStatus.RESOLVED;
        alert.resolvedAt = new Date();
        alert.updatedAt = new Date();
      }
    }

    this.activeAlertByArea.delete(areaId);
  }

  listDashboardAreasByUser(userId: string): MonitoredAreaEntity[] {
    return this.listAreasByUser(userId);
  }

  buildDashboardSnapshot(userId: string): DashboardSummaryEntity {
    const areas = this.listDashboardAreasByUser(userId);
    const areaIds = new Set(areas.map((area) => area.id));
    const activeAlerts = [...this.alerts.values()].filter(
      (alert) => areaIds.has(alert.monitoredAreaId) && alert.status === AlertStatus.ACTIVE,
    );
    const riskScores = [...this.riskScores.values()].filter((score) => areaIds.has(score.monitoredAreaId));
    const averageRiskScore =
      riskScores.length > 0
        ? Math.round(
            riskScores.reduce((accumulator, score) => accumulator + score.score, 0) /
              riskScores.length,
          )
        : 0;

    const recentFireEventsCount = [...this.areaFireEvents.values()].filter((link) =>
      areaIds.has(link.monitoredAreaId),
    ).length;

    const areasByRiskLevel: Record<RiskLevel, number> = {
      LOW: 0,
      MODERATE: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    const priorityAreas = areas
      .map((area) => {
        const latestScore = this.getLatestRiskScore(area.id);
        const activeAlertCount = this.listAlertsByUser(userId).filter(
          (alert) => alert.monitoredAreaId === area.id && alert.status === AlertStatus.ACTIVE,
        ).length;

        const riskLevel = latestScore?.level ?? RiskLevel.LOW;
        areasByRiskLevel[riskLevel] += 1;

        return {
          monitoredAreaId: area.id,
          areaName: area.name,
          level: riskLevel,
          score: latestScore?.score ?? 0,
          activeAlertCount,
          recentFireEvents: this.listFireEventsByArea(area.id).length,
        };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 5);

    return {
      generatedAt: new Date(),
      monitoredAreasCount: areas.length,
      activeAlertsCount: activeAlerts.length,
      averageRiskScore,
      recentFireEventsCount,
      areasByRiskLevel,
      priorityAreas,
      hasActiveAlerts: activeAlerts.length > 0,
    };
  }
}
