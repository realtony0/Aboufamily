import { neon } from '@neondatabase/serverless';

// Use a dummy URL during build if DATABASE_URL is not set
// This allows the build to complete, but will fail at runtime if not set
const databaseUrl = process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy/dummy';

export const sql = neon(databaseUrl);
