import type { FC } from 'react'
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	useLoaderData,
} from 'react-router'
import { getProjects, type NormalizedPage } from '~/.server/notion'
import { Container } from '~/components/Container'
import { ProjectCard } from '~/components/project-card'
import { createMeta } from '~/shared/create-meta'

export async function loader(args: LoaderFunctionArgs) {
	const projects = await getProjects(args.context)
	console.log('projects ' + JSON.stringify(projects).length)
	return { projects }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return createMeta({ title: 'Projects | Patrick Miller', url: '/projects' })
}

export default function ProjectsPage() {
	const { projects } = useLoaderData<typeof loader>()
	return <Projects projects={projects} />
}

const Projects: FC<{
	projects: NormalizedPage[]
}> = (props) => {
	return (
		<Container className="grid gap-8 py-16">
			<div className="text-center">
				<h1 className="text-4xl font-bold tracking-tight">Projects</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					A collection of my work and experiments
				</p>
			</div>
			<section className="grid gap-6">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<ProjectCard
						title="GitHub Projects"
						href="https://github.com/patdx?tab=repositories"
						excerpt="Check out my GitHub for more projects and experiments."
						icon="code"
					/>
					{props.projects.map((project) => (
						<ProjectCard
							key={project.id}
							title={
								Array.isArray(project.properties.title)
									? project.properties.title[0]
									: (project.properties.title ?? '')
							}
							excerpt={
								Array.isArray(project.properties.excerpt)
									? project.properties.excerpt[0]
									: (project.properties.excerpt ?? null)
							}
							coverImage={
								Array.isArray(project.properties.coverImage)
									? project.properties.coverImage[0]
									: (project.properties.coverImage ?? undefined)
							}
							href={`/projects/${project.properties.slug ?? project.id}`}
						/>
					))}
				</div>
			</section>
		</Container>
	)
}
