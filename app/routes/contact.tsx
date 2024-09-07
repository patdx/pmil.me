import type { MetaFunction } from '@remix-run/react';
import IoLogoGithub from '~icons/ion/logo-github';
import IoLogoLinkedin from '~icons/ion/logo-linkedin';
import IoMail from '~icons/ion/mail';
import { Container } from '../components/Container';

// size="1.5em"

export const meta: MetaFunction = ({ data }) => {
	return createMeta({ title: 'Contact' });
};

export default function Contact() {
	return (
		<Container className="grid gap-4 py-4">
			<div className="mx-auto flex w-full max-w-lg flex-col gap-4">
				<a
					href="mailto:pamiller.pdx@gmail.com"
					target="_blank"
					rel="noreferrer"
					className="flex h-16 items-center justify-center gap-2 rounded-md border shadow-none transition hover:scale-105 hover:bg-white hover:shadow-lg"
				>
					<IoMail />
					<span>pamiller.pdx@gmail.com</span>
				</a>
				<a
					href="https://github.com/patdx"
					target="_blank"
					rel="noreferrer"
					className="flex h-16 items-center justify-center gap-2 rounded-md border shadow-none transition hover:scale-105 hover:bg-white hover:shadow-lg"
				>
					<IoLogoGithub />
					<span>Github</span>
				</a>

				<a
					href="https://www.linkedin.com/in/pamiller"
					target="_blank"
					rel="noreferrer"
					className="flex h-16 items-center justify-center gap-2 rounded-md border shadow-none transition hover:scale-105 hover:bg-white hover:shadow-lg"
				>
					<IoLogoLinkedin />
					<span>LinkedIn</span>
				</a>
			</div>
		</Container>
	);
}
