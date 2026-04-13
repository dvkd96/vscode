import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, paginatedResponse, errorResponse, ValidationError } from '@/lib/api';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

async function handleGET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (status) {
      whereClause = 'WHERE status = $1';
      params.push(status);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM groups ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get groups with subscription details
    const result = await query(
      `SELECT g.id, g.subscription_id, g.name, g.type, g.total_slots, g.filled_slots,
              g.price_per_user, g.status, g.start_date, g.end_date, g.created_at,
              s.name as subscription_name, s.icon
       FROM groups g
       LEFT JOIN subscriptions s ON g.subscription_id = s.id
       ${whereClause}
       ORDER BY g.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return paginatedResponse(result.rows, total, page, limit);
  } catch (error: any) {
    console.error('Get groups error:', error);
    return errorResponse('Failed to fetch groups', 500);
  }
}

async function handlePOST(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { subscription_id, name, total_slots, price_per_user } = body;

    if (!subscription_id || !total_slots || !price_per_user) {
      throw new ValidationError('Missing required fields');
    }

    // Verify subscription exists
    const subResult = await query('SELECT id FROM subscriptions WHERE id = $1', [subscription_id]);
    if (subResult.rows.length === 0) {
      throw new ValidationError('Subscription not found');
    }

    // Create group
    const result = await query(
      `INSERT INTO groups (subscription_id, name, type, owner_id, total_slots, price_per_user, filled_slots, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, subscription_id, name, type, total_slots, filled_slots, price_per_user, status, created_at`,
      [subscription_id, name || 'New Group', 'managed', request.user?.id, total_slots, price_per_user, 0, 'recruiting']
    );

    return successResponse(result.rows[0], 'Group created successfully', 201);
  } catch (error: any) {
    console.error('Create group error:', error);

    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to create group', 500);
  }
}

export const GET = handleGET;
export const POST = withAuth(handlePOST);
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
