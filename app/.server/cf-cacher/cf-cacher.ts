// https://github.com/helloimalastair/FlareUtils/blob/main/src/BetterKV/index.ts

import { seconds } from 'itty-time'

export const createCustomFetch = (createFetchOptions: {
	executionCtx?: ExecutionContext
}): typeof globalThis.fetch => {
	return (resource, options) => {
		const request = new Request(resource, options)

		return cfCacher({
			cacheMode: 'cache-api',
			cacheKey: request.url,
			getRequest: () => request as any,
			cacheTtl: seconds('1 hour'),
			executionCtx: createFetchOptions.executionCtx,
		})
	}
}

export type CfCacherProps = {
	cacheKey: string
	/** [cache-api] name of the cache key. If not specified, will use `caches.open('custom:cache')` */
	cacheName?: string
	/** [fetch-cache] Other modes will prefer getResponse if available. Make sure this function returns quickly as long delays will delay caching in fetch-cache mode. */
	getRequest?: () => Request | Promise<Request>
	getResponse?: () => Promise<Response>
	cacheMode: 'fetch-cache' | 'cache-api' | 'kv' | 'none'
	/**
	 * seconds; default is 1 year (31536000)
	 */
	cacheTtl?: number
	executionCtx?: {
		waitUntil(promise: Promise<any>): void
	}
	/** [kv] */
	kv?: KVNamespace
}

/**
 * This is a function to help make it easier to switch between different kinds of caching in Cloudflare Workers
 *
 * `fetch-cache` uses the `fetch(event.request, { cf: { cacheKey: '<cacheKey>' } })` mode
 *   Note that cacheKey is ONLY supported for CF Enterprise account at the moment, so I am not able to test it completely.
 *   For non-enterprise accounts, I believe the cacheKey will be ignored and the request.url will be used exactly instead.
 */
export async function cfCacher({
	cacheKey,
	cacheName,
	getRequest,
	getResponse,
	cacheMode,
	cacheTtl = 31536000,
	executionCtx,
	kv,
}: CfCacherProps): Promise<Response> {
	// if (cacheMode == null) {
	// 	if (getRequest != null) {
	// 		cacheMode = 'fetch-cache'
	// 	} else {
	// 		cacheMode = 'cache-api'
	// 	}
	// }

	console.log(
		`Executing cfCacher for ${cacheKey} with ${cacheMode} ttl ${cacheTtl} seconds`
	)

	if (cacheMode === 'fetch-cache') {
		if (!getRequest) {
			throw new Error('getRequest is required when useCfFetch is true')
		}
		console.log(`Using built-in CF caching for: ${cacheKey}.`)
		const request = await getRequest()
		let response = await fetch(request, {
			cf: { cacheKey, cacheEverything: true, cacheTtl },
		})
		response = new Response(response.body, response)
		response.headers.set('x-cache-method', cacheMode)
		return response
	} else if (cacheMode === 'cache-api') {
		const cache = await caches.open(cacheName ?? 'custom:cache')
		let response = (await cache.match(cacheKey)) as unknown as
			| Response
			| undefined

		if (response) {
			console.log(`Cache hit for: ${cacheKey}.`)
			response = new Response(response.body, response)
			response.headers.set('x-cache-method', cacheMode)
			response.headers.set('x-cache-key', cacheKey)
		} else {
			console.log(
				`Response for request url: ${cacheKey} not present in cache. Fetching and caching request.`
			)

			response = await getFreshResponse()

			response = new Response(response.body, response) // make the response mutable

			// Set Cache-Control header to instruct the cache to store the response for cacheTtl seconds
			// For now I'm using CDN-cache-control to avoid overwriting other client side
			// caching logic
			response.headers.set('CDN-Cache-Control', `public, s-maxage=${cacheTtl}`)

			tryWaitUntil(cache.put(cacheKey, response.clone() as any))

			response.headers.set('x-cache-method', cacheMode)
			response.headers.set('x-cache-key', cacheKey)
		}

		return response
	} else if (cacheMode === 'kv') {
		if (!kv) {
			throw new Error('kv is required when cacheMode is kv')
		}

		const kvResponse = await kv.getWithMetadata<KvMetadata>(cacheKey, 'stream')

		let response: Response | null = null

		if (kvResponse.value != null) {
			response = new Response(kvResponse.value, {
				headers: kvResponse.metadata?.headers,
			})
			response.headers.set('x-cache-method', cacheMode)
			response.headers.set('x-cache-key', cacheKey)
			response.headers.set('x-cache-status', 'HIT')
		} else {
			console.log(
				`Response for request url: ${cacheKey} not present in cache. Fetching and caching request.`
			)

			response = await getFreshResponse()
			response = new Response(response.body, response) // make the response mutable
			response.headers.set('x-cache-method', cacheMode)
			response.headers.set('x-cache-key', cacheKey)
			response.headers.set('x-cache-status', 'MISS')

			tryWaitUntil(
				kv.put(cacheKey, response.clone().body as any, {
					expirationTtl: cacheTtl,
					metadata: {
						headers: Object.fromEntries(response.headers.entries()),
					} satisfies KvMetadata,
				})
			)
		}

		return response
	} else if (cacheMode === 'none') {
		console.log(`No caching for: ${cacheKey}.`)
		return getFreshResponse()
	} else {
		throw new Error('unknown cache method ' + cacheMode)
	}

	async function getFreshResponse() {
		if (getResponse) {
			return await getResponse()
		} else if (getRequest) {
			const request = await getRequest()
			return await fetch(request)
		} else {
			throw new Error('Either getRequest or getResponse is required')
		}
	}

	function tryWaitUntil(promise: Promise<any>) {
		if (executionCtx) {
			executionCtx.waitUntil(promise)
		} else {
			console.warn(`Execution context not available. Cannot wait until...`)
			void promise
		}
	}
}

type KvMetadata = {
	headers?: Record<string, string>
}
