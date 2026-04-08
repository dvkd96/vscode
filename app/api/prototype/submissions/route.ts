import { query } from '@/lib/db';
import { withAuth } from '@/lib/middleware';
import { errorResponse, successResponse } from '@/lib/api';

async function handleGET() {
  try {
    const [requestsResult, offersResult] = await Promise.all([
      query(
        `SELECT id, name, email, college, subscription_name, budget_per_month, details, created_at
         FROM subscription_requests
         ORDER BY created_at DESC
         LIMIT 200`
      ),
      query(
        `SELECT id, name, email, college, subscription_name, total_slots, available_slots, price_per_user, details, created_at
         FROM subscription_offers
         ORDER BY created_at DESC
         LIMIT 200`
      ),
    ]);

    return successResponse({
      requests: requestsResult.rows,
      offers: offersResult.rows,
    });
  } catch (error) {
    console.error('Get prototype submissions error:', error);
    return errorResponse('Failed to fetch submissions.', 500);
  }
}

export const GET = withAuth(async () => handleGET());
