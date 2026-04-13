import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, paginatedResponse, errorResponse } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (category) {
      whereClause = 'WHERE category = $1';
      params.push(category);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM subscriptions ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get subscriptions
    const result = await query(
      `SELECT id, name, description, icon, category, type, features, created_at, updated_at
       FROM subscriptions
       ${whereClause}
       ORDER BY name ASC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return paginatedResponse(result.rows, total, page, limit);
  } catch (error: any) {
    console.error('Get subscriptions error:', error);
    return errorResponse('Failed to fetch subscriptions', 500);
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
