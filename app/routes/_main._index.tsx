import type { MetaFunction } from 'react-router'
import { Image3 } from '~/components/Image'
import patrickJpg from '../assets/patrick.jpg?w=400&h=400&rotate=90&as=metadata'
import { Container } from '~/components/Container'
import { createMeta } from '~/shared/create-meta'
import { Button } from '~/components/ui/button'
import { Link } from 'react-router'
import { Card, CardContent } from '~/components/ui/card'

export const meta: MetaFunction = ({ data }) => {
	return createMeta({ title: 'Patrick Miller', url: '/' })
}

export default function Index() {
	return (
		<Container className="grid gap-8 py-16">
			<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
				<div className="flex flex-col gap-6">
					<div className="space-y-4">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							Hi, I'm Patrick Miller
						</h1>
						<h2 className="text-lg font-medium text-muted-foreground">
							Full-stack Software Engineer based in Osaka, Japan
						</h2>
					</div>
					<div className="space-y-4 text-muted-foreground">
						<p>
							I specialize in web and hybrid mobile applications using Node,
							Angular, Ionic, Electron, and React. I'm passionate about
							developing internal tools and systems that enhance team
							productivity.
						</p>
						<p>
							With a background in QA, IT, and mechanical engineering, I bring a
							unique perspective to software development.
						</p>
					</div>
					<div className="flex gap-4">
						<Button asChild>
							<Link to="/projects">View Projects</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link to="/contact">Get in Touch</Link>
						</Button>
					</div>
				</div>
				<div className="flex justify-center lg:justify-end">
					<Card className="overflow-hidden w-full max-w-[400px] aspect-square">
						<CardContent className="p-2 h-full">
							<Image3
								className="aspect-square rounded-lg object-cover h-full w-full"
								src={patrickJpg}
								alt="Picture of Patrick Miller"
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</Container>
	)
}
