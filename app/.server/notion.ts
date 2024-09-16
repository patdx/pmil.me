import {
	APIErrorCode,
	APIResponseError,
	Client,
	isFullBlock,
	isFullPage,
} from '@notionhq/client';
import type {
	BlockObjectResponse,
	PageObjectResponse,
	RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { first } from 'lodash-es';
import { z } from 'zod';

// A nice referencing for using Notion API:
// https://www.coryetzkorn.com/blog/how-the-notion-api-powers-my-blog

const POSTS_DATABASE_ID = 'c733986f-2b63-4490-9f8d-81c12332892c';
const PROJECTS_DATABASE_ID = '2fcde118-7914-4b4c-b753-62e72893e6d8';

function getNotion(context: AppLoadContext): Client {
	return new Client({
		auth: context.cloudflare.env.NOTION_TOKEN,
	});
}

export async function getPosts(context: AppLoadContext) {
	const notion = getNotion(context);
	const posts = await notion.databases.query({
		database_id: POSTS_DATABASE_ID,
		sorts: [
			{
				property: 'date',
				direction: 'descending',
			},
		],
		filter: {
			property: 'date',
			date: {
				is_not_empty: true,
			},
		},
	});

	const normalized: PostPropertiesOutput[] = [];

	for (const post of posts.results) {
		if (isFullPage(post)) {
			normalized.push(normalizePostResponse(post));
		}
	}

	return normalized;
}

export async function getPost(context: AppLoadContext, slugOrId: string) {
	const notion = getNotion(context);

	try {
		let post: PageObjectResponse | null = null;

		if (z.string().uuid(slugOrId).safeParse(slugOrId).success === true) {
			const maybePost = await notion.pages.retrieve({ page_id: slugOrId });

			if (isFullPage(maybePost)) {
				post = maybePost;
			}
		}

		if (!post) {
			const postBySlug = await notion.databases.query({
				database_id: POSTS_DATABASE_ID,
				filter: {
					property: 'slug',
					rich_text: {
						equals: slugOrId,
					},
				},
				page_size: 1,
			});

			const maybePost = postBySlug.results[0];

			if (isFullPage(maybePost)) {
				post = maybePost;
			}
		}

		if (!post) {
			console.log(`Not a full page: ${slugOrId}`);
			return null;
		}

		const isPost =
			post.parent.type === 'database_id' &&
			post.parent.database_id === POSTS_DATABASE_ID;
		if (!isPost) {
			console.log(`Not a post: ${slugOrId}`);
			return null;
		}

		const blocks = await getBlocks(context, post.id);

		return {
			...normalizePostResponse(post),
			content: blocks,
		};
	} catch (err) {
		if (
			err instanceof APIResponseError &&
			err.code === APIErrorCode.ObjectNotFound
		) {
			return null;
		}
		throw err;
	}
}

export async function getProjects(
	context: AppLoadContext,
): Promise<NormalizedPage[]> {
	const notion = getNotion(context);
	const projects = await notion.databases.query({
		database_id: PROJECTS_DATABASE_ID,
		sorts: [
			{
				property: 'slug',
				direction: 'ascending',
			},
		],
	});

	const normalized: NormalizedPage[] = [];

	for (const project of projects.results) {
		if (isFullPage(project)) {
			normalized.push(normalizePage(project));
		}
	}

	return normalized;
}

export async function getProject(context: AppLoadContext, slugOrId: string) {
	const notion = getNotion(context);

	try {
		let project: PageObjectResponse | null = null;

		if (z.string().uuid(slugOrId).safeParse(slugOrId).success === true) {
			const maybeProject = await notion.pages.retrieve({
				page_id: slugOrId,
			});

			if (isFullPage(maybeProject)) {
				project = maybeProject;
			}
		}

		if (!project) {
			console.log('searching by slug');
			const projectBySlug = await notion.databases.query({
				database_id: PROJECTS_DATABASE_ID,
				filter: {
					property: 'slug',
					rich_text: {
						equals: slugOrId,
					},
				},
				page_size: 1,
			});

			console.log(projectBySlug);

			const maybeProject = projectBySlug.results[0];

			if (isFullPage(maybeProject)) {
				project = maybeProject;
			}
		}

		if (!project) {
			console.log(`Not a full page: ${slugOrId}`);
			return null;
		}

		const isProject =
			project.parent.type === 'database_id' &&
			project.parent.database_id === PROJECTS_DATABASE_ID;

		if (!isProject) {
			console.log(`Not a project: ${slugOrId}`);
			return null;
		}

		console.log(project.parent);

		const blocks = await getBlocks(context, project.id);

		return {
			...normalizePage(project),
			content: blocks,
		};
	} catch (err) {
		if (
			err instanceof APIResponseError &&
			err.code === APIErrorCode.ObjectNotFound
		) {
			return null;
		}
		throw err;
	}
}

export async function getBlocks(
	context: AppLoadContext,
	blockId: string,
): Promise<BlockObjectResponse[]> {
	console.log(`getBlocks(${blockId})`);
	const notion = getNotion(context);

	const { results } = await notion.blocks.children.list({
		block_id: blockId,
		page_size: 100,
	});

	for (const block of results) {
		if (block.has_children) {
			block.children = await getBlocks(context, block.id);
		}

		if (isFullBlock(block)) {
			// console.log(block.type);

			if (block.type === 'paragraph') {
				for (const item of block.paragraph.rich_text) {
					if (item.type === 'text') {
						if (item.href?.startsWith('/')) {
							console.log(`checking ${item.href}`);
							const notionPage = await notion.pages.retrieve({
								page_id: item.href.slice(1),
							});

							console.log(`found: `, notionPage);

							const normalized = normalizePage(notionPage);

							// TODO: support projects and other lists too
							item.href = `/posts/${normalized.properties.slug}`;
							item.text.link = {
								url: item.href,
							};

							console.log(item);
							// 1 + 1;
						}
					}
				}
			}
			// block.children = await getBlocks(context, block.id);
		}

		// if (block.object === 'block') {
	}

	return results as any;
}

type MultiSelectProperty = Extract<
	PageObjectResponse['properties'][string],
	{
		type: 'multi_select';
	}
>;
type DateProperty = Extract<
	PageObjectResponse['properties'][string],
	{
		type: 'date';
	}
>;
type RichTextProperty = Extract<
	PageObjectResponse['properties'][string],
	{
		type: 'rich_text';
	}
>;

type TitleProperty = Extract<
	PageObjectResponse['properties'][string],
	{
		type: 'title';
	}
>;

type PostPropertiesInput = {
	tags: MultiSelectProperty;
	date: DateProperty;
	slug: RichTextProperty;
	title: TitleProperty;
};

type PostPropertiesOutput = {
	tags: string[];
	date: string | null;
	slug: string;
	title: string;
};

export type NormalizedPage = {
	id: string;
	properties: Record<string, string | string[] | null>;
};

function normalizePage(page: PageObjectResponse): NormalizedPage {
	const properties: Record<string, string | string[] | null> = {};

	for (const [key, value] of Object.entries(page.properties)) {
		if (value.type === 'multi_select') {
			properties[key] = value.multi_select.map((item) => item.name);
		} else if (value.type === 'date') {
			properties[key] = value.date?.start ?? null;
		} else if (value.type === 'rich_text') {
			properties[key] = richTextToPlain(value.rich_text);
		} else if (value.type === 'title') {
			properties[key] = richTextToPlain(value.title);
		} else if (value.type === 'url') {
			properties[key] = value.url;
		} else if (value.type === 'files') {
			const file = first(value.files);
			if (file?.type === 'external') {
				properties[key] = file.external.url;
			} else if (file?.type === 'file') {
				properties[key] = file.file.url;
			}
		} else {
			console.warn('unknown property type', value.type);
			console.log(value);
		}
	}

	return {
		id: page.id,
		properties,
	};
}

function richTextToPlain(richText: RichTextItemResponse[]): string | null {
	if (richText.length === 0) return null;
	return richText.map((text) => text.plain_text).join('');
}

export function normalizePostResponse(
	post: PageObjectResponse,
): PostPropertiesOutput {
	const properties = post.properties as PostPropertiesInput;

	const tags = properties.tags.multi_select.map((tag) => tag.name);
	const date = properties.date.date?.start ?? null;
	const slug = properties.slug.rich_text?.[0]?.plain_text ?? post.id; // TODO: support custom slug
	const title = richTextToPlain(properties.title.title)!;

	return {
		tags,
		date,
		slug,
		title,
	};
}

//     "rich_text": [
//       {
//         "type": "text",
//         "text": {
//           "content": "cordova-capacitor-file-conversion",
//           "link": null
//         },
//         "annotations": {
//           "bold": false,
//           "italic": false,
//           "strikethrough": false,
//           "underline": false,
//           "code": false,
//           "color": "default"
//         },
//         "plain_text": "cordova-capacitor-file-conversion",
//         "href": null
//       }
//     ]
//   },
//   "title": {
//     "id": "title",
//     "type": "title",
//     "title": [
//       {
//         "type": "text",
//         "text": {
//           "content": "Cordova to Capacitor File Conversion",
//           "link": null
//         },
//         "annotations": {
//           "bold": false,
//           "italic": false,
//           "strikethrough": false,
//           "underline": false,
//           "code": false,
//           "color": "default"
//         },
//         "plain_text": "Cordova to Capacitor File Conversion",
//         "href": null
//       }
//     ]
//   }
// }
