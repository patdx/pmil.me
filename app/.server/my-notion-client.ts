import type {
	PageObjectResponse,
	PartialPageObjectResponse,
	DatabaseObjectResponse,
	PartialDatabaseObjectResponse,
	BlockObjectResponse,
	PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { ofetch, type $Fetch } from 'ofetch'

export class APIResponseError extends Error {
	code: string

	constructor(code: string, message?: string) {
		super(message)
		this.code = code
	}
}

export const APIErrorCode: Record<string, string> = {}

// Define the options for database.query
export type SortOption = {
	property: string
	direction: 'ascending' | 'descending'
}

export type DatabaseQueryOptions = {
	database_id: string
	sorts?: SortOption[]
	filter?: any
	page_size?: number
}

export function isFullPage(
	response:
		| PageObjectResponse
		| PartialPageObjectResponse
		| DatabaseObjectResponse
		| PartialDatabaseObjectResponse
		| BlockObjectResponse
		| PartialBlockObjectResponse
): response is PageObjectResponse {
	return response.object === 'page' && 'url' in response
}

/**
 * @returns `true` if `response` is a full `BlockObjectResponse`.
 */
export function isFullBlock(
	response:
		| PageObjectResponse
		| PartialPageObjectResponse
		| DatabaseObjectResponse
		| PartialDatabaseObjectResponse
		| BlockObjectResponse
		| PartialBlockObjectResponse
): response is BlockObjectResponse {
	return response.object === 'block' && 'type' in response
}

export class MyNotionClient {
	auth: string
	constructor(options: { auth: string }) {
		this.auth = options.auth
		this.fetcher = ofetch.create({
			baseURL: 'https://api.notion.com/v1',
			headers: {
				Authorization: `Bearer ${this.auth}`,
				'Notion-Version': '2022-06-28',
				'Content-Type': 'application/json', // Added Content-Type for POST requests
			},
		})
	}

	fetcher: $Fetch

	databases = {
		query: async (
			options: DatabaseQueryOptions
		): Promise<{ results: any[] }> => {
			console.log('databases.query called with:', options)
			const { database_id, ...body } = options
			const response = await this.fetcher<{ results: any[] }>(
				`/databases/${database_id}/query`,
				{
					method: 'POST',
					body,
				}
			)
			return response
		},
	}

	pages = {
		retrieve: async (options: { page_id: string }): Promise<any> => {
			console.log('pages.retrieve called with:', options)

			const response = await this.fetcher(`/pages/${options.page_id}`)
			return response
		},
	}

	blocks = {
		children: {
			list: async (options: {
				block_id: string
				page_size?: number
			}): Promise<{ results: any[] }> => {
				console.log('blocks.children.list called with:', options)
				const { block_id, page_size } = options
				const queryParams: Record<string, string | number> = {}
				if (page_size) {
					queryParams.page_size = page_size
				}
				const response = await this.fetcher<{ results: any[] }>(
					`/blocks/${block_id}/children`,
					{
						query: queryParams,
					}
				)
				return response
			},
		},
	}
}
