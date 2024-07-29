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

export const ProjectSchema = z.object({
	title: z.string(),
	coverImage: z.string().optional(),
	// date: z.string().optional(),
	excerpt: z.string().nullish(),
	// author: z.string().optional(),
	externalUrl: z.string().optional(),
	technologies: z.string().optional(),
});
export type ProjectSchema = z.infer<typeof ProjectSchema>;

export type MDXContent = (props: any) => ReactNode;

export type PostModule = {
	frontmatter: PostSchema;
	default: MDXContent;
};

export type ContentMeta<T = PostSchema | ProjectSchema> = {
	id: string;
	type: string;
	slug: string;
	frontmatter: T;
};

const allFrontmatters = import.meta.glob<PostSchema | ProjectSchema>(
	'./*/*.{md,mdx}',
	{
		eager: true,
		import: 'frontmatter',
	},
);

const slugToFrontmatter: Record<string, ContentMeta<unknown>> = {};

for (const [file, frontmatter] of Object.entries(allFrontmatters)) {
	const { id, type, slug } = fileToSlug(file);
	slugToFrontmatter[id] = {
		id,
		type,
		slug,
		frontmatter,
	};
}

export async function getAllContentMeta<T>(
	type: 'post' | 'project',
): Promise<ContentMeta<T>[]> {
	const out: ContentMeta<T>[] = [];
	for (const item of Object.values(slugToFrontmatter)) {
		if (item.type === type) {
			out.push(item as any);
		}
	}

	return out;
}

export async function getContentMeta<T>(
	type: 'post' | 'project',
	slug: string,
): Promise<ContentMeta<T> | null> {
	const post =
		Object.values(slugToFrontmatter).find(
			(post) => post.type === type && post.slug === slug,
		) ?? null;

	return (post as any) ?? null;
}

const allPosts = import.meta.glob<PostModule>('./*/*.{md,mdx}');

const slugToPost: Record<string, () => Promise<PostModule>> = {};

for (const [file, post] of Object.entries(allPosts)) {
	const { id } = fileToSlug(file);

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

import { projectImages } from './project/project-images';

export const getProjectImages = async () => {
	return projectImages;
};
