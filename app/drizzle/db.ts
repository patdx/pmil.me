import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export { schema };

export function createDrizzle(d1: D1Database) {
	return drizzle(d1, {
		schema,
	});
}
