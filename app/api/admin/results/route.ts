import { query } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/api';

async function handleGET() {
  try {
    const [usersResult, waitlistResult, requestsResult, offersResult, topDemandResult] = await Promise.all([
      query(
        `SELECT id, name, email, college, role, verified, created_at
         FROM users
         ORDER BY created_at DESC
         LIMIT 200`
      ),
      query(
        `SELECT id, email, source, created_at
         FROM interest_waitlist
         ORDER BY created_at DESC
         LIMIT 200`
      ),
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
      query(
        `SELECT subscription_name, COUNT(*)::int AS total
         FROM (
           SELECT subscription_name FROM subscription_requests
           UNION ALL
           SELECT subscription_name FROM subscription_offers
         ) t
         GROUP BY subscription_name
         ORDER BY total DESC
         LIMIT 20`
      ),
    ]);

    const summary = {
      users: usersResult.rows.length,
      waitlist: waitlistResult.rows.length,
      requests: requestsResult.rows.length,
      offers: offersResult.rows.length,
    };

    return successResponse({
      summary,
      users: usersResult.rows,
      waitlist: waitlistResult.rows,
      requests: requestsResult.rows,
      offers: offersResult.rows,
      topDemand: topDemandResult.rows,
    });
  } catch (error) {
    console.error('Admin results error:', error);
    return errorResponse('Failed to fetch owner results.', 500);
  }
}

export const GET = async (_request: Request) => handleGET();
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
