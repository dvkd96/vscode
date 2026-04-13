import { query } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { errorResponse, successResponse, ValidationError } from '@/lib/api';

async function handlePOST(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { name, email, college, subscriptionName, budgetPerMonth, details } = body;

    if (!name || !email || !subscriptionName) {
      throw new ValidationError('Name, email, and subscription name are required.');
    }

    const result = await query(
      `INSERT INTO subscription_requests
       (user_id, name, email, college, subscription_name, budget_per_month, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, college, subscription_name, budget_per_month, details, created_at`,
      [request.user?.id || null, name, email, college || null, subscriptionName, budgetPerMonth || null, details || null]
    );

    return successResponse(result.rows[0], 'Request submitted successfully.', 201);
  } catch (error: any) {
    console.error('Create subscription request error:', error);
    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Failed to submit request.', 500);
  }
}

async function handleGET() {
  try {
    const result = await query(
      `SELECT id, name, email, college, subscription_name, budget_per_month, details, created_at
       FROM subscription_requests
       ORDER BY created_at DESC
       LIMIT 200`
    );

    return successResponse(result.rows);
  } catch (error) {
    console.error('Get subscription requests error:', error);
    return errorResponse('Failed to fetch requests.', 500);
  }
}

export const POST = withAuth(handlePOST);
export const GET = withAuth(async (_request: AuthenticatedRequest) => handleGET());
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
