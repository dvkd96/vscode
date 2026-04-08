import { query } from '@/lib/db';
import { withAuth } from '@/lib/middleware';
import { successResponse, errorResponse } from '@/lib/api';

async function handleGET() {
  try {
    const [usersCount, requestsCount, offersCount, waitlistCount, topDemand] = await Promise.all([
      query('SELECT COUNT(*)::int AS count FROM users'),
      query('SELECT COUNT(*)::int AS count FROM subscription_requests'),
      query('SELECT COUNT(*)::int AS count FROM subscription_offers'),
      query('SELECT COUNT(*)::int AS count FROM interest_waitlist'),
      query(
        `SELECT subscription_name, COUNT(*)::int AS demand_count
         FROM (
           SELECT subscription_name FROM subscription_requests
           UNION ALL
           SELECT subscription_name FROM subscription_offers
         ) t
         GROUP BY subscription_name
         ORDER BY demand_count DESC
         LIMIT 10`
      ),
    ]);

    return successResponse({
      totals: {
        users: usersCount.rows[0]?.count || 0,
        requests: requestsCount.rows[0]?.count || 0,
        offers: offersCount.rows[0]?.count || 0,
        waitlist: waitlistCount.rows[0]?.count || 0,
      },
      topDemand: topDemand.rows,
    });
  } catch (error) {
    console.error('Insights error:', error);
    return errorResponse('Failed to fetch insights.', 500);
  }
}

export const GET = withAuth(async () => handleGET());
