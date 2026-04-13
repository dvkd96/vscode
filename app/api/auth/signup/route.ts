import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, isValidEmail, validatePasswordStrength, generateToken } from '@/lib/auth';
import { successResponse, errorResponse, ValidationError } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, college, password, confirmPassword } = body;

    // Validation
    if (!email || !name || !college || !password) {
      throw new ValidationError('Missing required fields');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (password !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      throw new ValidationError(passwordCheck.errors.join(', '));
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query(
      `INSERT INTO users (email, name, college, password_hash, verified, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, college, role, created_at`,
      [email, name, college, passwordHash, false, 'user']
    );

    const user = result.rows[0];
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
          verified: false,
          created_at: user.created_at,
        },
      },
      'User created successfully',
      201
    );
  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to create account', 500);
  }
}

export const dynamic = 'force-dynamic';
