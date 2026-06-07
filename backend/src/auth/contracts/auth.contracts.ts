import { AuthProvider, UserRole } from '../../common/domain/enums';

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  createdAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthenticatedUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  isDemoUser: boolean;
}

export interface LoginResponseDto {
  accessToken: string;
  expiresInSeconds: number;
  tokenType: 'Bearer';
  user: AuthenticatedUserDto;
}

export interface SessionContextResponseDto {
  user: AuthenticatedUserDto;
  permissions: {
    canManageAreas: boolean;
    canViewPrivateAreas: boolean;
    canAcknowledgeAlerts: boolean;
  };
  session: {
    isDemoSession: boolean;
    authProvider: AuthProvider;
    expiresAt?: string;
  };
}
