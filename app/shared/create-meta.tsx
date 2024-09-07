import type { MetaDescriptor } from '@remix-run/react';
import { SITE_DESCRIPTION, SITE_TITLE } from '~/config';

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

	return [
		{ title: title },
		{ name: 'description', content: description },
		{ name: 'title', content: title },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: url },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{
			property: 'og:image',
			content: image && url ? new URL(image, url).toString() : undefined,
		},
		{ property: 'twitter:card', content: 'summary_large_image' },
		{ property: 'twitter:url', content: url },
		{ property: 'twitter:title', content: title },
		{ property: 'twitter:description', content: description },
		{
			property: 'twitter:image',
			content: image && url ? new URL(image, url).toString() : undefined,
		},
	].filter(
		(item) => item && Object.values(item).every((value) => value != null)
	);
};
