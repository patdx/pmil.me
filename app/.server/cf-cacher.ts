// https://github.com/helloimalastair/FlareUtils/blob/main/src/BetterKV/index.ts

export type CfCacherProps = {
	cacheKey: string
	// Required for fetch-cache
	getRequest?: () => Promise<Request>
	getResponse?: () => Promise<Response>
	cacheMethod?: 'fetch-cache' | 'cache-api' | 'kv' | 'none'
	cacheTtl?: number // seconds; default is 1 year (31536000)
	executionCtx: ExecutionContext
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
			executionCtx.waitUntil(cache.put(cacheKey, response.clone() as any))
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
