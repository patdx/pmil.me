import { type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { type NormalizedPage, getProjects } from '~/.server/notion';

export async function loader(args: LoaderFunctionArgs) {
	const projects = await getProjects(args.context);

	return json({ projects });
}

export default function ProjectsPage() {
	const { projects } = useLoaderData<typeof loader>();
	return <Projects projects={projects} />;
}

const Projects: FC<{
	projects: NormalizedPage[]; // really the coverImage is the GetImageResult
}> = (props) => {
	return (
		<Container className="grid gap-4 py-4">
			<section>
				<div className="container mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
					<PostPreview
						title="GitHub Projects"
						href="https://github.com/patdx?tab=repositories"
						excerpt="Check out my GitHub for more projects and experiments."
					/>
					{props.projects.map((project) => (
						<PostPreview
							key={project.id}
							{...project.properties}
							href={`/projects/${project.id}`}
						/>
					))}
				</div>
			</section>
		</Container>
	);
};
