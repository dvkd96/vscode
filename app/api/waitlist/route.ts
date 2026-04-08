import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse, ValidationError } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const source = String(body?.source || 'homepage').trim().slice(0, 100);

    if (!email || !email.includes('@')) {
      throw new ValidationError('Valid email is required.');
    }

    const result = await query(
      `INSERT INTO interest_waitlist (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET source = EXCLUDED.source
       RETURNING id, email, source, created_at`,
      [email, source || 'homepage']
    );

    return successResponse(result.rows[0], 'Added to waitlist.', 201);
  } catch (error: any) {
    console.error('Waitlist signup error:', error);
    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Could not save waitlist entry.', 500);
  }
}
