import { query } from '@/lib/db';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware';
import { errorResponse, successResponse, ValidationError } from '@/lib/api';

async function handlePOST(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { name, email, college, subscriptionName, totalSlots, availableSlots, pricePerUser, details } = body;

    if (!name || !email || !subscriptionName || !totalSlots || !availableSlots) {
      throw new ValidationError('Name, email, subscription, total slots, and available slots are required.');
    }

    const total = Number(totalSlots);
    const available = Number(availableSlots);

    if (Number.isNaN(total) || Number.isNaN(available) || total <= 0 || available < 0 || available > total) {
      throw new ValidationError('Please provide valid slot counts.');
    }

    const result = await query(
      `INSERT INTO subscription_offers
       (user_id, name, email, college, subscription_name, total_slots, available_slots, price_per_user, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, email, college, subscription_name, total_slots, available_slots, price_per_user, details, created_at`,
      [
        request.user?.id || null,
        name,
        email,
        college || null,
        subscriptionName,
        total,
        available,
        pricePerUser || null,
        details || null,
      ]
    );

    return successResponse(result.rows[0], 'Offer submitted successfully.', 201);
  } catch (error: any) {
    console.error('Create subscription offer error:', error);
    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Failed to submit offer.', 500);
  }
}

async function handleGET() {
  try {
    const result = await query(
      `SELECT id, name, email, college, subscription_name, total_slots, available_slots, price_per_user, details, created_at
       FROM subscription_offers
       ORDER BY created_at DESC
       LIMIT 200`
    );

    return successResponse(result.rows);
  } catch (error) {
    console.error('Get subscription offers error:', error);
    return errorResponse('Failed to fetch offers.', 500);
  }
}

export const POST = withAuth(handlePOST);
export const GET = withAuth(async (_request: AuthenticatedRequest) => handleGET());
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
