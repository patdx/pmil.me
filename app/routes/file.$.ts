import { getNotion } from '~/.server/notion'
import type { Route } from './+types/file.$'
import { z } from 'zod'
import * as Notion from '~/.server/my-notion-client'
import { cfCacher } from '~/.server/cf-cacher'

// https://github.com/justjake/monorepo/blob/main/packages/notion-api/src/lib/assets.ts#L43

// export type AssetRequest =
//   | { object: 'page'; id: string; field: 'icon' }
//   | { object: 'page'; id: string; field: 'cover' }
//   | {
//       object: 'page';
//       id: string;
//       field: 'properties';
//       property: PropertyPointer<any>;
//       propertyIndex?: number; // assumed to be 0
//     }
//   | { object: 'block'; id: string; field: 'image' }
//   | { object: 'block'; id: string; field: 'file' }
//   | { object: 'block'; id: string; field: 'icon' } // eg, for callout block
//   | { object: 'user'; id: string; field: 'avatar_url' };

export async function loader(args: Route.LoaderArgs) {
	const cacheKey = args.request.url

	return await cfCacher({
		cacheKey,
		executionCtx: args.context.cloudflare.ctx as any,
		getFreshValue: async () => {
			// TODO: handle security hole of being able to access any file
			const { params } = args
			const segments = params['*'].split('/')

			const [_page, page_id, _properties, field] = z
				.tuple([
					z.literal('page'),
					z.string(),
					z.literal('properties'),
					z.string(),
				])
				.parse(segments)

			const notion = getNotion(args.context)
			const page = await notion.pages.retrieve({
				page_id: page_id,
			})

			if (!Notion.isFullPage(page)) {
				throw new Response('Not a full page', { status: 404 })
			}

			const properties = page.properties
			const property = properties[field]

			if (!property) {
				throw new Response('Property not found', { status: 404 })
			}

			if (property.type !== 'files') {
				throw new Response('Property is not a file', { status: 404 })
			}

			const file = property.files[0]

			if (!file) {
				throw new Response('File not found', { status: 404 })
			}

			if (file.type !== 'file') {
				throw new Response('external file not supported', { status: 404 })
			}

			const fileUrl = file.file.url
			return new Request(fileUrl)
		},
		useCfFetch: false, // or true depending on your needs
		cacheTtl: 31536000,
	})
}
