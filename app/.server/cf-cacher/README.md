# cf-cacher

This function helps simplify switching between different caching strategies in Cloudflare Workers.

## Cache Mode

### `fetch-cache`

The `fetch-cache` option uses `fetch(event.request, { cf: { cacheKey: '<cacheKey>' } })`.

**Note:** `cacheKey` is only supported for Cloudflare Enterprise accounts. It may not be fully testable without such an account.

For non-Enterprise accounts, I believe the `cacheKey` option is ignored and the cacheKey will essentially be the default `request.url`. So, if your request to cache has stable URLs it may still be a good option.

I believe this mode also supports tiered caching and will deduplicate parallel requests using Cloudflare's standard logic for cached requests.

#### Only works in your own zone or on non-Cloudflare sites

> Workers operating on behalf of different zones cannot affect each other's cache. You can only override cache keys when making requests within your own zone (in the above example event.request.url was the key stored), or requests to hosts that are not on Cloudflare. When making a request to another Cloudflare zone (for example, belonging to a different Cloudflare customer), that zone fully controls how its own content is cached within Cloudflare; you cannot override it. [Source](https://developers.cloudflare.com/workers/examples/cache-using-fetch/#custom-cache-keys)

### `cache-api`

This mode uses the `cache.match` and `cache.put` APIs.

These APIs only update the cache in the data center where the worker is running.

#### On cache name

It is advised to not use `caches.default` because it may overlap with other cache data from `fetch()`

> This might be related to your use of caches.default, instead of opening a private cache with caches.open("whatever"). When you use caches.default, you are sharing the same cache that fetch() itself uses. So when your worker runs, your worker checks the cache, then fetch() checks the cache, then fetch() later writes the cache, and then your worker also writes the same cache entry. Since the write operations in particular happen asynchronously (as the response streams through), it's quite possible that they are overlapping and the cache is getting confused and tossing them all out.
>
> To avoid this, you should open a private cache namespace. So, replace this line:
>
> let cache = caches.default; with:
>
> let cache = await caches.open("whatever");(This await always completes immediately; it's only needed because the Cache API standard insists that this method is asynchronous.)
>
> This way, you are reading and writing a completely separate cache entry from the one that fetch() itself reads/writes.
>
> The use case for caches.default is when you intentionally want to operate on exactly the cache entry that fetch() would also use, but I don't think you need to do that here.

https://stackoverflow.com/a/62354325

### `kv`

This mode stores the result in KV storage instead.

KV can be propogated around the world. So it may be good for low traffic sites (where any single region is not expected to get many requests).

It will also work for workers.dev projects.

However, it is not free and easy to reach the write limit on free plans.

Even on the paid workers plan, only the 1st GB of storage is included.

Also, it is not possible/easy to purge the KV from the CF Dashboard.

## CF Pricing Comparison

R2 has 10GB and additional storage is $0.015/GB.

D1 has 5GB and additional storage is $0.75/gb.

KV has 1GB and additional storage is $0.50/gb.

Therefore, if you want to create your own "tiered caching", I think that R2 may be the most reasonable solution. But I am not entirely sure.
