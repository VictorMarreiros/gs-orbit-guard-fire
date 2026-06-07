import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { AuthProvider, UserRole } from '../common/domain/enums';
import { AuthenticationApplicationError, ConflictApplicationError, ValidationApplicationError } from '../common/errors';
import { AuthenticatedUserDto, LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto, SessionContextResponseDto } from './contracts/auth.contracts';
import { UserEntity } from './entities/user.entity';
import { OrbitGuardStore, SessionRecord } from '../integrations/memory/orbitguard-store';

export interface AuthServiceOptions {
  demoEmail?: string;
  demoPassword?: string;
  demoName?: string;
}

export class AuthService {
  private readonly demoPassword: string;
  private readonly demoName: string;
  private readonly demoEmail: string;

  constructor(private readonly store: OrbitGuardStore, options: AuthServiceOptions = {}) {
    this.demoPassword = options.demoPassword ?? 'SenhaSegura123!';
    this.demoName = options.demoName ?? 'Maria Oliveira';
    this.demoEmail = options.demoEmail ?? 'maria@example.com';
  }

  bootstrapDemoUser(): UserEntity {
    const existing = this.store.findUserByEmail(this.demoEmail);
    if (existing) {
      return existing;
    }

    return this.store.seedUser({
      name: this.demoName,
      email: this.demoEmail,
      passwordHash: this.hashPassword(this.demoPassword),
      role: UserRole.DEMO_USER,
      authProvider: AuthProvider.DEMO,
      isDemoSession: true,
      sessionToken: `demo_${randomBytes(12).toString('hex')}`,
      sessionExpiresAt: this.hoursFromNow(24),
    });
  }

  register(input: RegisterRequestDto): RegisterResponseDto {
    this.validateRegisterInput(input);

    if (this.store.findUserByEmail(input.email.trim())) {
      throw new ConflictApplicationError('Ja existe um usuario com este e-mail.', 'AUTH_EMAIL_ALREADY_REGISTERED');
    }

    const now = new Date();
    const user = this.store.seedUser({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash: this.hashPassword(input.password),
      role: UserRole.DEMO_USER,
      authProvider: AuthProvider.DEMO,
      isDemoSession: true,
    });

    user.createdAt = now;
    user.updatedAt = now;
    this.store.updateUser(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      createdAt: user.createdAt.toISOString(),
    };
  }

  login(input: LoginRequestDto): LoginResponseDto {
    this.validateLoginInput(input);

    const user = this.store.findUserByEmail(input.email.trim().toLowerCase());
    if (!user) {
      throw new AuthenticationApplicationError('Credenciais invalidas.', 'AUTH_INVALID_CREDENTIALS');
    }
    if (!this.verifyPassword(input.password, user.passwordHash)) {
      throw new AuthenticationApplicationError('Credenciais invalidas.', 'AUTH_INVALID_CREDENTIALS');
    }

    const session = this.store.createSession(user.id, this.hoursFromNow(24), user.authProvider === AuthProvider.DEMO);

    return {
      accessToken: session.token,
      expiresInSeconds: 24 * 60 * 60,
      tokenType: 'Bearer',
      user: this.toAuthenticatedUser(user, session),
    };
  }

  getSessionContext(accessToken?: string): SessionContextResponseDto {
    const { user, session } = this.resolveSession(accessToken);
    return {
      user: this.toAuthenticatedUser(user, session),
      permissions: {
        canManageAreas: true,
        canViewPrivateAreas: user.authProvider !== AuthProvider.DEMO ? true : false,
        canAcknowledgeAlerts: true,
      },
      session: {
        isDemoSession: session.isDemoSession,
        authProvider: user.authProvider,
        expiresAt: session.expiresAt.toISOString(),
      },
    };
  }

  resolveSession(accessToken?: string): { user: UserEntity; session: SessionRecord } {
    const demoUser = this.bootstrapDemoUser();

    if (!accessToken) {
      const session = this.store.findSession(demoUser.sessionContext.accessToken ?? '');
      if (session) {
        return {
          user: demoUser,
          session,
        };
      }

      const fallbackSession = this.store.createSession(demoUser.id, this.hoursFromNow(24), true);
      return { user: demoUser, session: fallbackSession };
    }

    const session = this.store.findSession(accessToken);
    if (!session) {
      throw new AuthenticationApplicationError('Token de acesso invalido.', 'AUTH_INVALID_TOKEN');
    }

    if (session.expiresAt.getTime() < Date.now()) {
      throw new AuthenticationApplicationError('Sessao expirada.', 'AUTH_SESSION_EXPIRED');
    }

    const user = this.store.findUserById(session.userId);
    if (!user || !user.isActive) {
      throw new AuthenticationApplicationError('Usuario inativo ou inexistente.', 'AUTH_USER_INVALID');
    }

    return { user, session };
  }

  private validateRegisterInput(input: RegisterRequestDto): void {
    const errors = [];
    const name = input.name?.trim() ?? '';
    const email = input.email?.trim() ?? '';
    const password = input.password ?? '';

    if (name.length < 3 || name.length > 80) {
      errors.push({ field: 'name', message: 'Informe um nome entre 3 e 80 caracteres.', code: 'INVALID_NAME' });
    }

    if (!this.isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Informe um e-mail valido.', code: 'INVALID_EMAIL' });
    }

    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Informe uma senha com pelo menos 8 caracteres.', code: 'INVALID_PASSWORD' });
    }

    if (errors.length > 0) {
      throw new ValidationApplicationError('Payload de autenticao invalido.', 'AUTH_VALIDATION_FAILED', errors);
    }
  }

  private validateLoginInput(input: LoginRequestDto): void {
    const errors = [];
    const email = input.email?.trim() ?? '';
    const password = input.password ?? '';

    if (!this.isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Informe um e-mail valido.', code: 'INVALID_EMAIL' });
    }

    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Informe uma senha com pelo menos 8 caracteres.', code: 'INVALID_PASSWORD' });
    }

    if (errors.length > 0) {
      throw new ValidationApplicationError('Payload de autenticao invalido.', 'AUTH_VALIDATION_FAILED', errors);
    }
  }

  private toAuthenticatedUser(user: UserEntity, session: SessionRecord): AuthenticatedUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      isDemoUser: session.isDemoSession,
    };
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derived = pbkdf2Sync(password, salt, 120_000, 64, 'sha256').toString('hex');
    return `${salt}:${derived}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, derived] = storedHash.split(':');
    if (!salt || !derived) {
      return false;
    }

    const candidate = pbkdf2Sync(password, salt, 120_000, 64, 'sha256');
    const expected = Buffer.from(derived, 'hex');
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private hoursFromNow(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }
}
