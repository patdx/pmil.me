// https://github.com/helloimalastair/FlareUtils/blob/main/src/BetterKV/index.ts

export type CfCacherProps = {
	cacheKey: string
	// getFreshValue returns a Request
	getFreshValue: () => Promise<Request>
	useCfFetch?: boolean
	cacheTtl?: number // seconds; default is 1 year (31536000)
	executionCtx: ExecutionContext
}

export async function cfCacher({
	cacheKey,
	getFreshValue,
	useCfFetch = false,
	cacheTtl = 31536000,
	executionCtx,
}: CfCacherProps): Promise<Response> {
	const cache = (caches as any).default as Cache

	if (useCfFetch) {
		console.log(`Using built-in CF caching for: ${cacheKey}.`)
		const request = await getFreshValue()
		return fetch(request, { cf: { cacheKey, cacheEverything: true, cacheTtl } })
	} else {
		let response = (await cache.match(cacheKey)) as unknown as Response

		if (!response) {
			console.log(
				`Response for request url: ${cacheKey} not present in cache. Fetching and caching request.`
			)
			const request = await getFreshValue()
			response = await fetch(request)
			// Must use Response constructor to inherit all of response's fields
			response = new Response(response.body, response)

			// Set Cache-Control header to instruct the cache to store the response for cacheTtl seconds
			response.headers.set('Cache-Control', `s-maxage=${cacheTtl}`)

			executionCtx.waitUntil(cache.put(cacheKey, response.clone() as any))
		} else {
			console.log(`Cache hit for: ${cacheKey}.`)
		}

		return response
	}
}
