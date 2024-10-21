import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./database/schema.ts",
  out: './database/migrations',
  dialect: 'sqlite',
  driver: 'expo',
}) satisfies Config;