import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

// Force IPv4 resolution globally
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const useSSL =
  process.env.PGSSLMODE === 'require' ||
  process.env.PGSSLMODE === 'prefer' ||
  process.env.DB_SSL === 'true';

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

export const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000,
});

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export async function runMigrations() {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
}

export async function healthCheck() {
  await pool.query('SELECT 1');
}
