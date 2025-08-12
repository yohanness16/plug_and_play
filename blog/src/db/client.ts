import { Pool } from 'pg'; 
import { drizzle } from 'drizzle-orm/node-postgres'; 
import { createClient } from '@supabase/supabase-js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

export const db = drizzle(pool);
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);