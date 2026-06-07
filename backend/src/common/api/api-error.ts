export interface ApiFieldError {
  field: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  code: string;
  details?: ApiFieldError[];
  timestamp: string;
  path: string;
}
