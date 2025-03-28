import type { PlatformProxy } from 'wrangler'
import { createRequestHandler } from 'react-router'

type CloudflareCtx = Pick<PlatformProxy<Cloudflare.Env>, 'env' | 'cf' | 'ctx'>

declare module 'react-router' {
	interface AppLoadContext {
		cloudflare: CloudflareCtx
	}
}

const requestHandler = createRequestHandler(
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE
)

export default {
	fetch(request, env, ctx) {
		const cloudflare: CloudflareCtx = {
			env,
			cf: request.cf as any,
			ctx,
		}

		return requestHandler(request, {
			cloudflare,
		})
	},
} satisfies ExportedHandler<Env>
