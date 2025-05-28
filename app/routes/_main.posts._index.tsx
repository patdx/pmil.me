import type { LoaderFunctionArgs } from 'react-router'
import { type MetaFunction, useLoaderData } from 'react-router'
import { getPosts } from '~/.server/notion'
import { Container } from '~/components/Container'
import { createMeta } from '~/shared/create-meta'
import { Link } from 'react-router'
import { Card } from '~/components/ui/card'
import { CalendarIcon } from '@radix-ui/react-icons'

export async function loader(args: LoaderFunctionArgs) {
	const posts = await getPosts(args.context)

	return { posts: posts }
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
	return createMeta({ title: 'Blog | Patrick Miller', url: '/posts' })
}

export default function PostsPage() {
	const { posts } = useLoaderData<typeof loader>()

	return (
		<Container className="grid gap-8 py-16">
			<div className="text-center">
				<h1 className="text-4xl font-bold tracking-tight">Blog Posts</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					Thoughts, ideas, and technical writeups
				</p>
			</div>
			<section>
				<div className="mx-auto grid max-w-4xl gap-4">
					{posts.map((post) => (
						<Card
							key={post.slug}
							className="group overflow-hidden transition-all hover:shadow-md"
						>
							<Link
								to={`/posts/${post.slug}`}
								className="flex items-center gap-6 p-6"
							>
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
									<CalendarIcon className="h-6 w-6 text-muted-foreground" />
								</div>
								<div className="flex flex-col gap-2">
									<h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
										{post.title}
									</h2>
									<time
										className="text-sm text-muted-foreground"
										dateTime={post.date ?? undefined}
									>
										{post.date}
									</time>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</section>
		</Container>
	)
}
