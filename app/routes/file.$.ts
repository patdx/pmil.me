import { getNotion } from '~/.server/notion'
import type { Route } from './+types/file.$'
import { z } from 'zod'
import * as Notion from '@notionhq/client'

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
	const { params } = args
	const fileId = params.id

	const segments = params['*'].split('/')

	const [_page, page_id, _properties, field] = z
		.tuple([z.literal('page'), z.string(), z.literal('properties'), z.string()])
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

	const request = new Request(fileUrl)

	const response = await fetch(request, {
		cf: {
			cacheTtlByStatus: { '200-299': 31536000, 404: 1, '500-599': 0 },
			cacheKey: args.request.url,
		},
	})

	if (!response.ok) {
		return response
	}

	const newResponse = new Response(response.body, response)

	newResponse.headers.set(
		'cache-control',
		'public, max-age=31536000, immutable'
	)

	return response
}
