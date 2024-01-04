import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: [
    'app/server/schema/user.schema.ts',
    'app/server/schema/revenue.schema.ts',
    'app/server/schema/invoice.schema.ts',
    'app/server/schema/customer.schema.ts',
  ],
  out: './drizzle',
  verbose: true,
  strict: true,
  introspect: {
    casing: 'camel',
  },
  //@ts-ignore
  driver: 'pg',
  dbCredentials: {
    //@ts-ignore
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5440'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
  },
});
