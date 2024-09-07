import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { type MetaFunction, json, useLoaderData } from '@remix-run/react';
import { getPosts } from '~/.server/notion';

// https:remix-blog-mdx/blob/main/app/.server/posts.tsx

// Use Astro.glob() to fetch all posts, and then sort them by date.
// const posts = await getCollection('post');

export async function loader(args: LoaderFunctionArgs) {
	const posts = await getPosts(args.context);

	return json({ posts: posts });
	// const db = createDrizzle(args.context.cloudflare.env.DB);
	// const posts = await db.query.post.findMany({
	// 	columns: {
	// 		slug: true,
	// 		title: true,
	// 		date: true,
	// 	},
	// 	orderBy: desc(schema.post.date),
	// });
	// return json({ posts });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return createMeta({ title: 'Blog' });
};

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
							<span className="font-bold tabular-nums">{post.date}</span>{' '}
							{post.title}
						</Link>
					))}
				</div>
			</section>
		</Container>
	);
}
