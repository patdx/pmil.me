import type { MetaFunction } from 'react-router'
import IoLogoGithub from '~icons/ion/logo-github'
import IoLogoLinkedin from '~icons/ion/logo-linkedin'
import IoMail from '~icons/ion/mail'
import { Container } from '../components/Container'
import { createMeta } from '~/shared/create-meta'
import { Card, CardContent } from '~/components/ui/card'

export const meta: MetaFunction = () => {
	return createMeta({ title: 'Contact | Patrick Miller', url: '/contact' })
}

export default function Contact() {
	return (
		<Container className="grid gap-8 py-16">
			<h1 className="text-center text-4xl font-bold tracking-tight">
				Get in Touch
			</h1>
			<div className="mx-auto grid w-full max-w-lg gap-6">
				<Card className="overflow-hidden transition-all hover:shadow-lg">
					<CardContent className="p-0">
						<a
							href="mailto:pamiller.pdx@gmail.com"
							target="_blank"
							rel="noreferrer"
							className="flex h-16 items-center gap-4 px-6 transition hover:bg-muted"
						>
							<IoMail className="h-5 w-5 text-primary" />
							<span className="font-medium">pamiller.pdx@gmail.com</span>
						</a>
					</CardContent>
				</Card>

				<Card className="overflow-hidden transition-all hover:shadow-lg">
					<CardContent className="p-0">
						<a
							href="https://github.com/patdx"
							target="_blank"
							rel="noreferrer"
							className="flex h-16 items-center gap-4 px-6 transition hover:bg-muted"
						>
							<IoLogoGithub className="h-5 w-5 text-primary" />
							<span className="font-medium">GitHub</span>
						</a>
					</CardContent>
				</Card>

				<Card className="overflow-hidden transition-all hover:shadow-lg">
					<CardContent className="p-0">
						<a
							href="https://www.linkedin.com/in/pamiller"
							target="_blank"
							rel="noreferrer"
							className="flex h-16 items-center gap-4 px-6 transition hover:bg-muted"
						>
							<IoLogoLinkedin className="h-5 w-5 text-primary" />
							<span className="font-medium">LinkedIn</span>
						</a>
					</CardContent>
				</Card>
			</div>
		</Container>
	)
}
