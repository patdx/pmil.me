import {
	EraserIcon as BeakerIcon,
	CodeIcon,
	ExternalLinkIcon,
	GitHubLogoIcon,
	RocketIcon,
} from '@radix-ui/react-icons'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'

type ProjectCardProps = {
	title: string
	coverImage?: string
	excerpt?: string | null
	href: string
	icon?: 'code' | 'beaker' | 'rocket'
}

export function ProjectCard({
	title,
	coverImage,
	excerpt,
	href,
	icon,
}: ProjectCardProps) {
	return (
		<Card className="flex flex-col h-full">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{excerpt && <CardDescription>{excerpt}</CardDescription>}
			</CardHeader>
			<CardContent className="grow">
				{coverImage ? (
					<Image3
						src={coverImage}
						alt={title}
						width={400}
						height={200}
						className="w-full h-48 object-cover rounded-md mb-4"
					/>
				) : (
					<div className="w-full h-48 bg-linear-to-br from-primary to-secondary rounded-md mb-4 flex items-center justify-center text-primary-foreground">
						{icon ? (
							<IconComponent icon={icon} />
						) : (
							<span className="text-4xl font-bold">{getInitials(title)}</span>
						)}
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Button variant="outline" size="sm" asChild className="w-full">
					<Link to={href}>
						<ExternalLinkIcon className="mr-2 h-4 w-4" />
						View Project
					</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}

type Project = {
	title: string
	description: string
	image?: string
	tags: string[]
	githubUrl?: string
	liveUrl?: string
	icon?: 'code' | 'beaker' | 'rocket'
}

const projects: Project[] = [
	{
		title: 'GitHub Projects',
		description: 'Check out my GitHub for more projects and experiments.',
		tags: ['GitHub', 'Open Source'],
		githubUrl: 'https://github.com/yourusername',
		icon: 'code',
	},
	{
		title: 'Mobx Spreadsheet',
		description: 'A spreadsheet application built with MobX and React.',
		tags: ['React', 'MobX', 'TypeScript'],
		image: '/placeholder.svg?height=200&width=400',
		githubUrl: 'https://github.com/yourusername/mobx-spreadsheet',
		liveUrl: 'https://mobx-spreadsheet.example.com',
	},
	{
		title: 'Subtitle App',
		description: 'An application for creating and editing subtitles.',
		tags: ['Electron', 'React', 'FFmpeg'],
		githubUrl: 'https://github.com/yourusername/subtitle-app',
		icon: 'rocket',
	},
	{
		title: 'Baby Smash JS',
		description: 'A JavaScript version of the classic Baby Smash game.',
		tags: ['JavaScript', 'Canvas', 'Web Audio'],
		image: '/placeholder.svg?height=200&width=400',
		githubUrl: 'https://github.com/yourusername/baby-smash-js',
		liveUrl: 'https://baby-smash-js.example.com',
	},
	{
		title: 'Gomitrack',
		description: 'A waste management and recycling tracking application.',
		tags: ['React Native', 'Firebase', 'Mobile'],
		image: '/placeholder.svg?height=200&width=400',
		githubUrl: 'https://github.com/yourusername/gomitrack',
		liveUrl: 'https://gomitrack.example.com',
	},
	{
		title: 'Motor Controller',
		description: 'An Arduino-based motor controller for robotics projects.',
		tags: ['Arduino', 'C++', 'Electronics'],
		githubUrl: 'https://github.com/yourusername/motor-controller',
		icon: 'beaker',
	},
]

const IconComponent = ({ icon }: { icon: Project['icon'] }) => {
	switch (icon) {
		case 'code':
			return <CodeIcon className="w-12 h-12" />
		case 'beaker':
			return <BeakerIcon className="w-12 h-12" />
		case 'rocket':
			return <RocketIcon className="w-12 h-12" />
		default:
			return null
	}
}

const getInitials = (title: string) => {
	return title
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

export function ProjectsPage() {
	return (
		<div className="container mx-auto py-12">
			<h1 className="text-4xl font-bold mb-8 text-center">My Projects</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{projects.map((project, index) => (
					<Card key={index} className="flex flex-col">
						<CardHeader>
							<CardTitle>{project.title}</CardTitle>
							<CardDescription>{project.description}</CardDescription>
						</CardHeader>
						<CardContent className="grow">
							{project.image ? (
								<Image3
									src={project.image}
									alt={project.title}
									width={400}
									height={200}
									className="w-full h-48 object-cover rounded-md mb-4"
								/>
							) : (
								<div className="w-full h-48 bg-linear-to-br from-primary to-secondary rounded-md mb-4 flex items-center justify-center text-primary-foreground">
									{project.icon ? (
										<IconComponent icon={project.icon} />
									) : (
										<span className="text-4xl font-bold">
											{getInitials(project.title)}
										</span>
									)}
								</div>
							)}
							<div className="flex flex-wrap gap-2">
								{project.tags.map((tag, tagIndex) => (
									<Badge key={tagIndex} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							{project.githubUrl && (
								<Button variant="outline" size="sm" asChild>
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<GitHubLogoIcon className="mr-2 h-4 w-4" />
										GitHub
									</a>
								</Button>
							)}
							{project.liveUrl && (
								<Button variant="outline" size="sm" asChild>
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLinkIcon className="mr-2 h-4 w-4" />
										Live Demo
									</a>
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
