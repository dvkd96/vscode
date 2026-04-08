import { NextRequest, NextResponse } from 'next/server';
import { DATABASE_SCHEMA } from '@/lib/schema';
import { getPool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const pool = getPool();
    
    // Execute all SQL statements
    const statements = DATABASE_SCHEMA.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Executed:', statement.substring(0, 50));
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
