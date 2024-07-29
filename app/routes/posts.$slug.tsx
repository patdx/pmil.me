import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { getContentForSlug, getContentMeta } from '~/content/content';

export async function loader({ params }: LoaderFunctionArgs) {
	const { slug } = z.object({ slug: z.string() }).parse(params);
	const post = await getContentMeta('post', slug);
	if (!post) throw new Response('Not found', { status: 404 });
	const { frontmatter } = post;
	return json({ slug, frontmatter });
}

export default function PostPage() {
	const { slug, frontmatter } = useLoaderData<typeof loader>();

	const url = `/posts/${slug}`;

	const { title, date } = frontmatter;

	const Content = getContentForSlug('post', slug);

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
				<Content key={slug} />
			</div>
			{/* <!-- </article> --> */}
		</Container>
	);
}
