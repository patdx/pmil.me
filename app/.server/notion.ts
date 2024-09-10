import {
	APIErrorCode,
	APIResponseError,
	Client,
	isFullPage,
} from '@notionhq/client';
import type {
	BlockObjectResponse,
	PageObjectResponse,
	RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { first } from 'lodash-es';

const POSTS_DATABASE_ID = 'c733986f2b6344909f8d81c12332892c';
const PROJECTS_DATABASE_ID = '2fcde11879144b4cb75362e72893e6d8';

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
		const post = await notion.pages.retrieve({ page_id: slugOrId });

		if (!isFullPage(post)) {
			console.log(`Not a full page: ${slugOrId}`);
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
	context: AppLoadContext
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
		const project = await notion.pages.retrieve({ page_id: slugOrId });

		if (!isFullPage(project)) {
			console.log(`Not a full page: ${slugOrId}`);
			return null;
		}

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
	blockId: string
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
	post: PageObjectResponse
): PostPropertiesOutput {
	const properties = post.properties as PostPropertiesInput;

	const tags = properties.tags.multi_select.map((tag) => tag.name);
	const date = properties.date.date?.start ?? null;
	const slug = post.id; // TODO: support custom slug
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
