import { getPool } from './db';
import { DATABASE_SCHEMA } from './schema';

export async function initializeDatabase() {
  try {
    console.log('Initializing database schema...');
    const pool = getPool();
    
    // Execute the schema
    await pool.query(DATABASE_SCHEMA);
    
    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Run if this is the main module
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database ready');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database initialization failed:', err);
      process.exit(1);
    });
}
