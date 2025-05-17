import type { MetaDescriptor } from 'react-router'
import { BASE_URL, SITE_DESCRIPTION, SITE_TITLE } from '~/config'

interface CreateMetaOptions {
	title?: string | null
	description?: string | null
	image?: string | null
	url?: string | null
	type?: 'website' | 'article'
	article?: {
		publishedTime?: string
		authors?: string[]
	}
}

export const createMeta = ({
	title,
	description,
	image,
	url,
	type = 'website',
	article,
}: CreateMetaOptions = {}): MetaDescriptor[] => {
	title = title || SITE_TITLE
	description = description || SITE_DESCRIPTION

	const canonicalUrl = url ? new URL(url, BASE_URL).toString() : undefined

	image =
		image ||
		new URL(`/og?title=${encodeURIComponent(title)}`, canonicalUrl).toString()
	// `https://pmil-me-og.vercel.app/api/og?title=${encodeURIComponent(title)}`

	const items: MetaDescriptor[] = [
		{ title: title },
		{ name: 'description', content: description },
		{ name: 'title', content: title },
		{ tagName: 'link', rel: 'canonical', href: canonicalUrl },
		{ property: 'og:type', content: type },
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
	]

	// Add article-specific meta tags
	if (type === 'article' && article) {
		if (article.publishedTime) {
			items.push({
				property: 'article:published_time',
				content: article.publishedTime,
			})
		}
		if (article.authors?.length) {
			article.authors.forEach((author) => {
				items.push({ property: 'article:author', content: author })
			})
		}
	}

	return items.filter(
		(item) => item && Object.values(item).every((value) => value != null)
	)
}
