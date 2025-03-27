import humanizeUrl from 'humanize-url'
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	useLoaderData,
} from 'react-router'
import { z } from 'zod'
import { getProject } from '~/.server/notion'

export async function loader({ params, context }: LoaderFunctionArgs) {
	const { slug } = z.object({ slug: z.string() }).parse(params)

	// const project = await getContentMeta<ProjectSchema>('project', slug);
	const project = await getProject(context, slug)

	if (!project) {
		throw new Response('Not found', { status: 404 })
	}

	return { project }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return createMeta({
		title: data?.project.properties?.title as string,
		url: `/projects/${data?.project.properties?.slug ?? data?.project.id}`,
	})
}

export default function ProjectPage() {
	const { project } = useLoaderData<typeof loader>()

	const { title, externalUrl, technologies, coverImage, slug } =
		project.properties

	const url = `/projects/${slug}`

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
							<Blocks blocks={project.content} />
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
						{Boolean(technologies) && <p>{technologies?.join(', ')}</p>}
					</div>
				</div>
			</article>
		</Container>
	)
}
