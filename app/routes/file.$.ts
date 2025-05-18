import {
	getNotion,
	POSTS_DATABASE_ID,
	PROJECTS_DATABASE_ID,
} from '~/.server/notion'
import type { Route } from './+types/file.$'
import { z } from 'zod'
import * as Notion from '~/.server/my-notion-client'
import { cfCacher } from '~/.server/cf-cacher'
import { isFullBlock, isFullPage } from '~/.server/my-notion-client'

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
		getRequest: async () => {
			// TODO: handle security hole of being able to access any file/block
			const { params } = args
			const segments = params['*'].split('/')
			const notion = getNotion(args.context)

			const objectType = segments[0]

			if (objectType === 'page') {
				const [_page, page_id, _properties, field] = z
					.tuple([
						z.literal('page'),
						z.string(),
						z.literal('properties'),
						z.string(),
					])
					.parse(segments)

				const page = await notion.pages.retrieve({
					page_id: page_id,
				})

				if (!Notion.isFullPage(page)) {
					throw new Response('Not a full page', { status: 404 })
				}

				console.log('parent', page.parent)
				const properties = page.properties
				const property = properties[field]

				if (page.parent.type !== 'database_id') {
					// This might need adjustment if pages can be nested under blocks/pages
					throw new Response('Not a database page', { status: 404 })
				}

				const allowed = await isParentAllowed(notion, page.parent)
				if (!allowed) {
					throw new Response(
						'Block does not belong to an allowed page/database',
						{
							status: 403,
						}
					)
				}

				if (!property) {
					throw new Response('Property not found', { status: 404 })
				}

				if (property.type !== 'files') {
					throw new Response('Property is not a file', { status: 400 })
				}

				const file = property.files[0]

				if (!file) {
					throw new Response('File not found', { status: 404 })
				}

				if (file.type !== 'file') {
					throw new Response('External file not supported', { status: 400 })
				}

				const fileUrl = file.file.url
				return new Request(fileUrl)
			} else if (objectType === 'block') {
				const [_block, block_id, field] = z
					.tuple([z.literal('block'), z.string(), z.literal('image')])
					.parse(segments)

				const block = await notion.blocks.retrieve({
					block_id: block_id,
				})

				if (!isFullBlock(block)) {
					throw new Response('Not a full block', { status: 404 })
				}

				// --- Security Check ---
				const allowed = await isParentAllowed(notion, block.parent)
				if (!allowed) {
					throw new Response(
						'Block does not belong to an allowed page/database',
						{
							status: 403,
						}
					)
				}
				// --- End Security Check ---

				console.log('block parent', block.parent) // Keep for debugging if needed

				if (block.type !== 'image') {
					throw new Response('Block is not an image', { status: 400 })
				}

				const image = block.image
				if (image.type !== 'file') {
					throw new Response('External image not supported', { status: 400 })
				}

				const imageUrl = image.file.url
				return new Request(imageUrl)
			} else {
				throw new Response('Invalid object type', { status: 400 })
			}
		},
		cacheMethod: 'fetch-cache', // Keep false as we are proxying the final fetch
		cacheTtl: 31536000,
	})
}

const ALLOWED_DATABASE_IDS = [PROJECTS_DATABASE_ID, POSTS_DATABASE_ID]
const MAX_PARENT_DEPTH = 10 // Safeguard against infinite loops

type ParentInfo =
	| { type: 'database_id'; database_id: string }
	| { type: 'page_id'; page_id: string }
	| { type: 'block_id'; block_id: string }
	| { type: 'workspace'; workspace: true } // Added workspace type

async function isParentAllowed(
	notion: Notion.MyNotionClient,
	initialParent: ParentInfo,
	depth = 0
): Promise<boolean> {
	console.log(
		`[isParentAllowed] Starting check with parent type: ${initialParent.type}, depth: ${depth}`
	)

	if (depth > MAX_PARENT_DEPTH) {
		console.error('Reached max parent depth, assuming disallowed.')
		return false
	}

	let currentParent = initialParent

	while (depth <= MAX_PARENT_DEPTH) {
		console.log(
			`[isParentAllowed] Checking parent: ${JSON.stringify(currentParent)}`
		)

		switch (currentParent.type) {
			case 'database_id':
				const isAllowed = ALLOWED_DATABASE_IDS.includes(
					currentParent.database_id
				)
				console.log(
					`[isParentAllowed] Database check: ${currentParent.database_id}, allowed: ${isAllowed}`
				)
				return isAllowed

			case 'page_id': {
				console.log(
					`[isParentAllowed] Retrieving page: ${currentParent.page_id}`
				)
				const page = await notion.pages.retrieve({
					page_id: currentParent.page_id,
				})
				if (!isFullPage(page)) {
					console.warn(
						`[isParentAllowed] Could not retrieve full page ${currentParent.page_id}`
					)
					return false // Or throw an error
				}
				console.log(`[isParentAllowed] Page parent type: ${page.parent.type}`)
				currentParent = page.parent
				break
			}
			case 'block_id': {
				console.log(
					`[isParentAllowed] Retrieving block: ${currentParent.block_id}`
				)
				const block = await notion.blocks.retrieve({
					block_id: currentParent.block_id,
				})
				if (!isFullBlock(block)) {
					console.warn(
						`[isParentAllowed] Could not retrieve full block ${currentParent.block_id}`
					)
					return false // Or throw an error
				}
				console.log(`[isParentAllowed] Block parent type: ${block.parent.type}`)
				currentParent = block.parent
				break
			}
			case 'workspace':
				console.log(
					'[isParentAllowed] Reached workspace level, not in allowed database'
				)
				// If we reach the workspace level, it's not in an allowed database
				return false
			default:
				console.error(`[isParentAllowed] Unknown parent type:`, currentParent)
				return false
		}
		depth++
		console.log(
			`[isParentAllowed] Moving to next parent level, depth: ${depth}`
		)
	}

	console.error(
		'[isParentAllowed] Reached max parent depth during loop, assuming disallowed.'
	)
	return false // Exceeded depth limit
}
