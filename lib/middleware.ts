import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from './auth';
import { query } from './db';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const token = extractToken(req.headers.get('authorization') || undefined);

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'No authorization token' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        );
      }

      // Fetch user from database
      const result = await query(
        'SELECT id, email, name, college, role, verified FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 401 }
        );
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = {
        id: result.rows[0].id,
        role: result.rows[0].role,
      };

      return handler(req as AuthenticatedRequest);
    } catch (error: any) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function withAdminAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside window
    const recentRequests = requests.filter((time) => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }
}

export const apiLimiter = new RateLimiter(60000, 100);
