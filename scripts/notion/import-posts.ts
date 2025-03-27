import { Client } from '@notionhq/client'
import { markdownToBlocks } from '@tryfabric/martian'
import { cache, readJson } from './utils'

console.log('process.env.NOTION_TOKEN', process.env.NOTION_TOKEN)

const DATABASE_ID = 'c733986f2b6344909f8d81c12332892c'

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
})

console.log(
	await cache('notion-posts', () =>
		notion.databases.retrieve({
			database_id: DATABASE_ID,
		})
	)
)

type Post = {
	id: string
	date: string
	published: boolean
	title: string
	text: string
	slug: string
	tags: string[]
}

const posts = readJson<Post[]>(
	new URL('../import/import.json', import.meta.url)
)

console.log(posts)

for (const post of posts) {
	console.log(`Beginning import of ${post.title}`)

	const blocks = markdownToBlocks(post.text)

	console.log(JSON.stringify(blocks, null, 2))

	await notion.pages.create({
		parent: {
			type: 'database_id',
			database_id: DATABASE_ID,
		},
		properties: {
			title: {
				type: 'title',
				title: [{ type: 'text', text: { content: post.title } }],
			},
			date: {
				type: 'date',
				date: {
					start: post.date,
				},
			},
			slug: {
				type: 'rich_text',
				rich_text: [
					{
						type: 'text',
						text: {
							content: post.slug,
						},
					},
				],
			},
		},
		children: blocks as any,
		// children: [
		// 	{
		// 		object: 'block',
		// 		type: 'paragraph',
		// 		paragraph: {
		// 			rich_text: [
		// 				{
		// 					type: 'text',
		// 					text: {
		// 						content:
		// 							'You made this page using the Notion API. Pretty cool, huh? We hope you enjoy building with us.',
		// 					},
		// 				},
		// 			],
		// 		},
		// 	},
		// ],
		// content: [{
		// 	type: "paragraph", paragraph: [{
		// 		rich_text
		// 	}]
		// }]
	})

	console.log(`added ${post.title}`)
}
