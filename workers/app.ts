import type { PlatformProxy } from 'wrangler';
import { createRequestHandler } from 'react-router';

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Need this empty interface so that typechecking passes
// even if no `wrangler.toml` exists.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Env {
	KV: KVNamespace;
	NOTION_TOKEN: string;
	DB: D1Database;
}

type Cloudflare = Pick<PlatformProxy<Env>, 'env' | 'cf' | 'ctx'>;

declare module 'react-router' {
	interface AppLoadContext {
		cloudflare: Cloudflare;
	}
}

const requestHandler = createRequestHandler(
	// @ts-expect-error - virtual module provided by React Router at build time
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE,
);

export default {
	fetch(request, env, ctx) {
		const cloudflare: Cloudflare = {
			env,
			cf: request.cf as any,
			ctx,
		};

		return requestHandler(request, {
			cloudflare,
		});
	},
} satisfies ExportedHandler<Env>;
