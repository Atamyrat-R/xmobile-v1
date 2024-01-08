import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connection = postgres({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5440'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 1,
});

async function runMigrations() {
  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: 'drizzle' });

  await connection.end();
}

runMigrations();
