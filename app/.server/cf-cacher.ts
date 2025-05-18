// https://github.com/helloimalastair/FlareUtils/blob/main/src/BetterKV/index.ts

// export function fetchToCache(
// 	request: Request,
// 	response: Response,
// 	cacheTtl: number = 31536000
// ): Response {
// 	// Set Cache-Control header to instruct the cache to store the response for cacheTtl seconds
// 	// For now I'm using CDN-cache-control to avoid overwriting other client side
// 	// caching logic
// 	response.headers.set('CDN-Cache-Control', `public, s-maxage=${cacheTtl}`)
// 	return new Response(response.body, response)
// }

import { seconds } from 'itty-time'

export const createCustomFetch = (createFetchOptions: {
	executionCtx?: ExecutionContext
}): typeof globalThis.fetch => {
	return (resource, options) => {
		const request = new Request(resource, options)

		return cfCacher({
			cacheKey: request.url,
			getRequest: () => request as any,
			cacheTtl: seconds('1 hour'),
			executionCtx: createFetchOptions.executionCtx,
		})
	}
}

export type CfCacherProps = {
	cacheKey: string
	// Required for fetch-cache
	getRequest?: () => Request | Promise<Request>
	getResponse?: () => Promise<Response>
	cacheMethod?: 'fetch-cache' | 'cache-api' | 'kv' | 'none'
	/**
	 * seconds; default is 1 year (31536000)
	 */
	cacheTtl?: number
	executionCtx?: ExecutionContext
	kv?: KVNamespace
}

export async function cfCacher({
	cacheKey,
	getRequest,
	getResponse,
	cacheMethod,
	cacheTtl = 31536000,
	executionCtx,
	kv,
}: CfCacherProps): Promise<Response> {
	const cache = (caches as any).default as Cache

	if (cacheMethod == null) {
		if (getRequest != null) {
			cacheMethod = 'fetch-cache'
		} else {
			cacheMethod = 'cache-api'
		}
	}

	console.log(
		`Executing cfCacher for ${cacheKey} with ${cacheMethod} ttl ${cacheTtl} seconds`
	)

	if (cacheMethod === 'fetch-cache') {
		if (!getRequest) {
			throw new Error('getRequest is required when useCfFetch is true')
		}
		console.log(`Using built-in CF caching for: ${cacheKey}.`)
		const request = await getRequest()
		let response = await fetch(request, {
			cf: { cacheKey, cacheEverything: true, cacheTtl },
		})
		response = new Response(response.body, response)
		response.headers.set('x-cache-method', cacheMethod)
		return response
	} else if (cacheMethod === 'cache-api') {
		let response = (await cache.match(cacheKey)) as unknown as Response

		if (!response) {
			console.log(
				`Response for request url: ${cacheKey} not present in cache. Fetching and caching request.`
			)

			if (getResponse) {
				// Prefer getResponse when available
				response = await getResponse()
			} else if (getRequest) {
				const request = await getRequest()
				response = await fetch(request)
			} else {
				throw new Error('Either getRequest or getResponse is required')
			}

			// Must use Response constructor to inherit all of response's fields
			response = new Response(response.body, response)

			// Set Cache-Control header to instruct the cache to store the response for cacheTtl seconds
			// For now I'm using CDN-cache-control to avoid overwriting other client side
			// caching logic
			response.headers.set('CDN-Cache-Control', `public, s-maxage=${cacheTtl}`)
			const cachePutPromise = cache.put(cacheKey, response.clone() as any)
			if (executionCtx) {
				// Use waitUntil to ensure the cache put is completed before the response is sent
				executionCtx.waitUntil(cachePutPromise)
			} else {
				// If executionCtx is not available, we can't use waitUntil
				// but we can still cache the response
				void cachePutPromise
			}
			response.headers.set('x-cache-method', cacheMethod)
		} else {
			console.log(`Cache hit for: ${cacheKey}.`)
			response = new Response(response.body, response)
			response.headers.set('x-cache-method', cacheMethod)
		}

		return response
	} else if (cacheMethod === 'kv') {
		// not supported yet
		throw new Error('kv cache not supported yet')
	} else {
		throw new Error('unknown cache method ' + cacheMethod)
	}
}
