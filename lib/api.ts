import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

// API response helpers
export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  );
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
    } as ApiResponse,
    { status }
  );
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    },
    { status }
  );
}

// Error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Error handler middleware
export async function handleApiError(
  error: any,
  defaultStatus: number = 500
): Promise<NextResponse> {
  console.error('API Error:', error);

  if (error instanceof ValidationError) {
    return errorResponse(error.message, 400);
  }

  if (error instanceof AuthenticationError) {
    return errorResponse(error.message, 401);
  }

  if (error instanceof AuthorizationError) {
    return errorResponse(error.message, 403);
  }

  if (error instanceof NotFoundError) {
    return errorResponse(error.message, 404);
  }

  return errorResponse(error.message || 'Internal server error', defaultStatus);
}

// Validate request method
export function validateMethod(request: NextRequest, allowedMethods: string[]): void {
  if (!allowedMethods.includes(request.method)) {
    throw new ValidationError(`Method ${request.method} not allowed`);
  }
}

// Parse JSON with error handling
export async function parseJSON<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new ValidationError('Invalid JSON');
  }
}
