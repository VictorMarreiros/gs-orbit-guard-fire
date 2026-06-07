import { AuthProvider, UserRole } from '../../common/domain/enums';

export interface UserSessionContext {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isDemoSession: boolean;
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  authProvider: AuthProvider;
  isActive: boolean;
  lastLoginAt?: Date;
  sessionContext: UserSessionContext;
  createdAt: Date;
  updatedAt: Date;
}
