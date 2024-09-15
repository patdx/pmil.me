import type { MetaDescriptor } from '@remix-run/react';
import { BASE_URL, SITE_DESCRIPTION, SITE_TITLE } from '~/config';

export const createMeta = ({
	title,
	description,
	image,
	url,
}: {
	title?: string | null;
	description?: string | null;
	image?: string | null;
	url?: string | null;
} = {}): MetaDescriptor[] => {
	title = title || SITE_TITLE;
	description = description || SITE_DESCRIPTION;

	const canonicalUrl = url ? new URL(url, BASE_URL).toString() : undefined;

	// I can't get Vercel OG or similar to run in Cloudflare Pages so hosting it
	// seperately at pmil-me-og.vercel.app
	image =
		image ||
		`https://pmil-me-og.vercel.app/api/og?title=${encodeURIComponent(title)}`;

	const items: MetaDescriptor[] = [
		{ title: title },
		{ name: 'description', content: description },
		{ name: 'title', content: title },
		{ tagName: 'link', rel: 'canonical', href: canonicalUrl },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: canonicalUrl },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{
			property: 'og:image',
			content: image ? new URL(image, BASE_URL).toString() : undefined,
		},
		{ property: 'twitter:card', content: 'summary_large_image' },
		{ property: 'twitter:url', content: canonicalUrl },
		{ property: 'twitter:title', content: title },
		{ property: 'twitter:description', content: description },
		{
			property: 'twitter:image',
			content: image ? new URL(image, BASE_URL).toString() : undefined,
		},
	];

	return items.filter(
		(item) => item && Object.values(item).every((value) => value != null),
	);
};
