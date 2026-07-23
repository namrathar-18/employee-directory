export interface FieldError {
  field: string;
  message: string;
}

/** A predictable error the API layer knows how to turn into a JSON response. */
export class ApiError extends Error {
  statusCode: number;
  details?: FieldError[];

  constructor(statusCode: number, message: string, details?: FieldError[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}
