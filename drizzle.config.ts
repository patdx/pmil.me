import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './app/drizzle/schema.ts',
	out: './app/drizzle/migrations',
});
