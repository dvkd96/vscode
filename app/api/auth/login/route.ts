import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { successResponse, errorResponse, ValidationError } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw new ValidationError('Email and password required');
    }

    // Find user
    const result = await query(
      'SELECT id, email, name, college, password_hash, role, verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new ValidationError('Invalid email or password');
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    return successResponse(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          college: user.college,
          role: user.role,
          verified: user.verified,
        },
      },
      'Login successful'
    );
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Authentication failed', 500);
  }
}
