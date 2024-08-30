import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from '@notionhq/client';
import { markdownToBlocks } from '@tryfabric/martian';
import matter from 'gray-matter';
import { cache } from './utils';

console.log('process.env.NOTION_TOKEN', process.env.NOTION_TOKEN);

// https://www.notion.so/2fcde11879144b4cb75362e72893e6d8?v=8ce588db69964d318b9e460f24fd22e9&pvs=4
const DATABASE_ID = '2fcde11879144b4cb75362e72893e6d8'; // replace with your actual projects database ID

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});

console.log(
	await cache('notion-projects', () =>
		notion.databases.retrieve({
			database_id: DATABASE_ID,
		})
	)
);

await notion.databases.update({
	database_id: DATABASE_ID,
	properties: {
		tags: {
			name: 'tags',
			type: 'multi_select',
			multi_select: {},
		},
		date: {
			name: 'date',
			type: 'date',
			date: {},
		},
		slug: {
			name: 'slug',
			type: 'rich_text',
			rich_text: {},
		},
		title: {
			name: 'title',
			type: 'title',
			title: {},
		},
		technologies: {
			name: 'technologies',
			type: 'multi_select',
			multi_select: {},
		},
		externalUrl: {
			name: 'externalUrl',
			type: 'url',
			url: {},
		},
		coverImage: {
			name: 'coverImage',
			type: 'files',
			files: {},
		},
	},
});

type Project = {
	title: string;
	date?: string;
	slug?: string;
	excerpt?: string;
	externalUrl?: string;
	technologies?: string;
	coverImage?: string;
};

async function extractMarkdownContent(dir: string) {
	const results: Project[] = [];

	// Read all files in the directory
	const files = await fs.readdir(dir);

	for (const file of files) {
		const extname = path.extname(file);
		if (extname === '.md' || extname === '.mdx') {
			const filePath = path.join(dir, file);
			const fileContent = await fs.readFile(filePath, 'utf8');

			// Parse the file content using gray-matter
			const { data, content } = matter(fileContent);

			results.push({
				date: data.date,
				title: data.title,
				excerpt: content.trim(),
				slug: path.parse(file).name,
				technologies: data.technologies,
				externalUrl: data.externalUrl,
				coverImage: data.coverImage,
			});
		}
	}

	return results;
}

const projects = await extractMarkdownContent('./app/content/project');

console.log(projects);

for (const project of projects) {
	console.log(`Beginning import of ${project.title}`);

	const blocks = markdownToBlocks(project.excerpt || '');

	console.log(JSON.stringify(blocks, null, 2));

	await notion.pages.create({
		parent: {
			type: 'database_id',
			database_id: DATABASE_ID,
		},
		properties: {
			title: {
				type: 'title',
				title: [{ type: 'text', text: { content: project.title } }],
			},
			date: project.date
				? {
						type: 'date',
						date: {
							start: project.date,
						},
				  }
				: undefined,
			slug: project.slug
				? {
						type: 'rich_text',
						rich_text: [{ type: 'text', text: { content: project.slug } }],
				  }
				: undefined,
			externalUrl: project.externalUrl
				? {
						type: 'url',
						url: project.externalUrl,
				  }
				: undefined,
			technologies: project.technologies
				? {
						type: 'multi_select',
						multi_select: project.technologies
							.split(',')
							.map((item) => ({ name: item.trim() })),
				  }
				: undefined,
			coverImage: project.coverImage
				? {
						type: 'files',
						files: [
							{
								type: 'external',
								name: 'coverImage',
								external: {
									url: project.coverImage,
								},
							},
						],
				  }
				: undefined,
		},
		children: blocks as any,
	});

	console.log(`added ${project.title}`);
}
