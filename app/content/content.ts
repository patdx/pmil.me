import { memoize } from 'lodash-es';
import type { ReactNode } from 'react';
import { z } from 'zod';

export const PostSchema = z.object({
	title: z.string(),
	date: z.string(),
	tags: z.array(z.string()).optional(),
	draft: z.boolean().optional(),
});
export type PostSchema = z.infer<typeof PostSchema>;

// TODO
const image = () => z.any();

export const ProjectSchema = z.object({
	slug: z.string(),
	data: z.object({
		title: z.string(),
		coverImage: image().optional(),
		// date: z.string().optional(),
		excerpt: z.string().nullish(),
		// author: z.string().optional(),
		externalUrl: z.string().optional(),
		technologies: z.string().optional(),
	}),
});
export type ProjectSchema = z.infer<typeof ProjectSchema>;

export type MDXContent = (props: any) => ReactNode;

export type PostModule = {
	frontmatter: PostSchema;
	default: MDXContent;
};

export type ContentMeta = {
	id: string;
	type: string;
	slug: string;
	frontmatter: PostSchema | ProjectSchema;
};

const allFrontmatters = import.meta.glob<PostSchema | ProjectSchema>(
	'./*/*.{md,mdx}',
	{
		eager: true,
		import: 'frontmatter',
	},
);

const slugToFrontmatter: Record<string, ContentMeta> = {};

for (const [file, frontmatter] of Object.entries(allFrontmatters)) {
	const { id, type, slug } = fileToSlug(file);
	slugToFrontmatter[id] = {
		id,
		type,
		slug,
		frontmatter,
	};
}

export const getAllContentMeta = async (type: 'post' | 'project') => {
	const out: ContentMeta[] = [];
	for (const item of Object.values(slugToFrontmatter)) {
		if (item.type === type) {
			out.push(item);
		}
	}

	return out;

	// const build = await import('virtual:remix/server-build');
	// const posts = Object.entries(allFrontmatters).map(([file, post]) => {
	// 	const slug = path.parse(file).name;

	// 	return {
	// 		slug,
	// 		frontmatter: PostSchema.parse(post),
	// 	};
	// });

	// return sortBy(posts, (post) => post.frontmatter.date, 'desc');
};

export async function getContentMeta(type: 'post' | 'project', slug: string) {
	const post =
		Object.values(slugToFrontmatter).find(
			(post) => post.type === type && post.slug === slug,
		) ?? null;
	return post ?? null;
}

const allPosts = import.meta.glob<PostModule>('./*/*.{md,mdx}');

const slugToPost: Record<string, () => Promise<PostModule>> = {};

for (const [file, post] of Object.entries(allPosts)) {
	const { id } = fileToSlug(file);

	console.log(id);

	// const slug = file.split('/').pop();
	// if (!slug) throw new Error(`No slug for ${file}`);

	slugToPost[id] = post;
}

export const getContentForSlug = memoize(
	(type: 'post' | 'project', slug: string) => {
		const loader = slugToPost[`${type}/${slug}`];
		if (!loader) throw new Error(`No loader for ${slug}`);
		return lazy(loader);
	},
	(type, slug) => `${type}/${slug}`,
);

function fileToSlug(file: string) {
	const id = file
		.replace(/^\.\//, '')
		.replace(/\.md$/, '')
		.replace(/\.mdx$/, '');

	const [type, slug] = id.split('/');

	if (!slug || !type) throw new Error(`No slug for ${file}`);

	return {
		id,
		type,
		slug,
	};
}
