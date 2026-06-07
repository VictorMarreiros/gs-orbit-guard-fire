import { ApiErrorResponse, ApiFieldError } from './api/api-error';

export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiFieldError[];

  constructor(message: string, statusCode: number, code: string, details?: ApiFieldError[]) {
    super(message);
    this.name = 'ApplicationError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toApiError(path: string): ApiErrorResponse {
    return {
      statusCode: this.statusCode,
      error: this.statusText(),
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  private statusText(): string {
    switch (this.statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      default:
        return 'Internal Server Error';
    }
  }
}

export class ValidationApplicationError extends ApplicationError {
  constructor(message: string, code: string, details: ApiFieldError[]) {
    super(message, 422, code, details);
    this.name = 'ValidationApplicationError';
  }
}

export class AuthenticationApplicationError extends ApplicationError {
  constructor(message = 'Credenciais invalidas.', code = 'AUTHENTICATION_FAILED') {
    super(message, 401, code);
    this.name = 'AuthenticationApplicationError';
  }
}

export class AuthorizationApplicationError extends ApplicationError {
  constructor(message = 'Acesso negado.', code = 'FORBIDDEN') {
    super(message, 403, code);
    this.name = 'AuthorizationApplicationError';
  }
}

export class NotFoundApplicationError extends ApplicationError {
  constructor(message = 'Recurso nao encontrado.', code = 'NOT_FOUND') {
    super(message, 404, code);
    this.name = 'NotFoundApplicationError';
  }
}

export class ConflictApplicationError extends ApplicationError {
  constructor(message = 'Conflito de cadastro.', code = 'CONFLICT') {
    super(message, 409, code);
    this.name = 'ConflictApplicationError';
  }
}
