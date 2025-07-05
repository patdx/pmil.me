import type { MetaFunction } from 'react-router'
import IoLogoGithub from '~icons/ion/logo-github'
import IoLogoLinkedin from '~icons/ion/logo-linkedin'
import IoMail from '~icons/ion/mail'
import { Container } from '../components/Container'
import { createMeta } from '~/shared/create-meta'
import { ContactCard } from '~/components/ContactCard'

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
				<ContactCard href="mailto:pamiller.pdx@gmail.com" icon={IoMail}>
					pamiller.pdx@gmail.com
				</ContactCard>

				<ContactCard href="https://github.com/patdx" icon={IoLogoGithub}>
					GitHub
				</ContactCard>

				<ContactCard href="https://www.linkedin.com/in/pamiller" icon={IoLogoLinkedin}>
					LinkedIn
				</ContactCard>
			</div>
		</Container>
	)
}
