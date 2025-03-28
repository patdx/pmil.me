import { ofetch, type $Fetch } from 'ofetch'

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
