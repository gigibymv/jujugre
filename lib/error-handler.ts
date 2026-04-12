// Error handling utilities for consistent error responses

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages = {
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  INVALID_REQUEST: 'Invalid request parameters',
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_ERROR: 'An unexpected error occurred',
  NETWORK_ERROR: 'Network connection failed',
};

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    console.error('[jujugre] Unhandled error:', error);
    return {
      message: errorMessages.INTERNAL_ERROR,
      statusCode: 500,
      code: 'INTERNAL_ERROR',
    };
  }

  return {
    message: errorMessages.INTERNAL_ERROR,
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
  };
};
