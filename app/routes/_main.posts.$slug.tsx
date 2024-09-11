import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { getPost } from '~/.server/notion';

export async function loader({ params, context }: LoaderFunctionArgs) {
	const { slug } = z.object({ slug: z.string() }).parse(params);

	// if (z.string().uuid(slug).safeParse(slug).success === false) {
	// 	// invalid uuid should be not found
	// 	// if passed on to the Notion API it would trigger an error
	// 	throw new Response('Not found', { status: 404 });
	// }

	const post = await getPost(context, slug);

	// const db = createDrizzle(context.cloudflare.env.DB);

	// const post = await db.query.post.findFirst({
	// 	where: eq(schema.post.slug, slug),
	// 	columns: {
	// 		slug: true,
	// 		title: true,
	// 		date: true,
	// 		text: true,
	// 	},
	// });

	if (!post) throw new Response('Not found', { status: 404 });

	const html = '';
	// const html = await markdownToHtml(post.text);

	return json({ post: post, html });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return createMeta({
		title: data?.post.title,
		url: `/posts/${data?.post.slug}`,
	});
};

export default function PostPage() {
	const { post, html } = useLoaderData<typeof loader>();
	const { slug, title, date } = post;

	const url = `/posts/${slug}`;

	return (
		<Container className="grid gap-4 py-4 overflow-x-hidden w-screen">
			{/* <!-- <article className="mb-32"> --> */}
			{/* <NextSeo
			title={`${post.title} | Patrick Miller`}
			openGraph={{
				images: post.ogImage ? [{ url: post.ogImage.url }] : [],
			}}
		/> */}
			<h1 className="mb-4 text-center text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-7xl md:leading-none lg:text-8xl">
				<Link to={url}>{title}</Link>
			</h1>

			<div className="mb-8 font-bold">{date}</div>
			{/* <!-- w-[calc(100vw-2.5rem)] --> */}
			<div className="prose max-w-full overflow-x-hidden">
				<Blocks blocks={post.content} />
			</div>
		</Container>
	);
}
