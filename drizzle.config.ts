import { defineConfig } from 'drizzle-kit';

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables.');
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN is not set in environment variables.');
}

export default defineConfig({
  out: './db/drizzle',
  schema: './db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
