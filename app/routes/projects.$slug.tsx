import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import humanizeUrl from 'humanize-url';
import { z } from 'zod';
import {
	type ProjectSchema,
	getContentForSlug,
	getContentMeta,
} from '~/content/content';

export async function loader({ params }: LoaderFunctionArgs) {
	const { slug } = z.object({ slug: z.string() }).parse(params);
	const project = await getContentMeta<ProjectSchema>('project', slug);
	if (!project) throw new Response('Not found', { status: 404 });
	const { frontmatter } = project;
	return json({ slug, frontmatter });
}

export default function ProjectPage() {
	const { slug, frontmatter } = useLoaderData<typeof loader>();

	const url = `/projects/${slug}`;

	const { title, externalUrl, technologies, coverImage } = frontmatter;

	const Content = getContentForSlug('project', slug);

	return (
		<Container className="grid gap-4 py-4">
			<article className="mb-32">
				{/* <NextSeo
			title={`${post.title} | Patrick Miller`}
			openGraph={{
				images: post.ogImage ? [{ url: post.ogImage.url }] : [],
			}}
		/> */}
				<h1 className="mb-12 text-center text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-7xl md:leading-none lg:text-8xl">
					{title}
				</h1>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="col-span-2 grid content-start gap-4">
						<div className="prose">
							<Content key={slug} />
						</div>
						{!externalUrl ? undefined : (
							<p>
								<a
									href={externalUrl}
									className="inline-block rounded-lg bg-green-600 py-2 px-6 font-bold text-white hover:bg-green-700"
									target="_blank"
									rel="noreferrer"
								>
									View Project ({humanizeUrl(externalUrl)})
								</a>
							</p>
						)}
					</div>
					<div className="col-span-1 grid grid-cols-1 content-start gap-4">
						{coverImage ? (
							<CoverImage title={title} href={url} src={coverImage} />
						) : undefined}
						{Boolean(technologies) && <p>{technologies}</p>}
					</div>
				</div>
			</article>
		</Container>
	);
}
