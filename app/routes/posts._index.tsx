import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { type PostSchema, getAllContentMeta } from '~/content/content';
import { Container } from '../components/Container';

// https://github.com/pcattori/remix-blog-mdx/blob/main/app/.server/posts.tsx

// Use Astro.glob() to fetch all posts, and then sort them by date.
// const posts = await getCollection('post');

export async function loader(args: LoaderFunctionArgs) {
	let posts = await getAllContentMeta<PostSchema>('post');

	posts = sortBy(posts, (post) => post.frontmatter.date, 'desc');

	return json({ posts });
}

export default function PostsPage() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<Container className="grid gap-4 py-4">
			<section>
				<div className="container mx-auto max-w-4xl">
					{posts.map((post) => (
						<Link
							key={post.slug}
							to={`/posts/${post.slug}`}
							className="block p-1 transition hover:bg-gray-200 active:bg-gray-300"
						>
							<span className="font-bold tabular-nums">
								{post.frontmatter.date}
							</span>{' '}
							{post.frontmatter.title}
						</Link>
					))}
				</div>
			</section>
		</Container>
	);
}
