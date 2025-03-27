import { type LoaderFunctionArgs, useRouteError } from 'react-router'
import { type MetaFunction, useLoaderData } from 'react-router'
import { z } from 'zod'
import { getPost } from '~/.server/notion'
import { formatDate } from '~/utils/dates'

export async function loader({ params, context }: LoaderFunctionArgs) {
	const { slug } = z.object({ slug: z.string() }).parse(params)

	const post = await getPost(context, slug)

	if (!post) throw new Response('Not found', { status: 404 })

	return { post: post }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data?.post) return [{ title: 'Post Not Found' }]

	return createMeta({
		title: data.post.title,
		url: `/posts/${data.post.slug}`,
		description: data.post.excerpt || data.post.title,
		type: 'article',
		article: {
			publishedTime: data.post.date ?? undefined,
			authors: ['Patrick Miller'],
		},
	})
}

export function ErrorBoundary() {
	const error = useRouteError()

	console.error(error)

	return (
		<Container>
			<h1 className="text-2xl font-bold">Error</h1>
			<p>Sorry, this post could not be found.</p>
		</Container>
	)
}

export default function PostPage() {
	const { post } = useLoaderData<typeof loader>()
	const { slug, title, date } = post
	const formattedDate = date ? formatDate(date) : null

	return (
		<article className="max-w-2xl mx-auto px-4">
			<header className="mb-12">
				<h1 className="mb-6 text-4xl md:text-5xl font-bold leading-snug tracking-tight md:leading-tight">
					{title}
				</h1>
				{date && (
					<time dateTime={date} className="text-gray-600 text-lg">
						{formattedDate}
					</time>
				)}
			</header>

			<div className="prose overflow-x-hidden">
				<Blocks blocks={post.content} />
			</div>

			<footer className="mt-8 border-t pt-8">
				<ShareButtons url={`/posts/${slug}`} title={title} />
			</footer>
		</article>
	)
}
