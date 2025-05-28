import type { FC } from 'react'
import { HeaderLink } from './HeaderLink'
import { Container } from './Container'

export const NavHeader: FC = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<Container>
				<nav className="flex h-16 items-center">
					<div className="flex w-full justify-center gap-6">
						{LINKS.map((link, index) => (
							<HeaderLink key={index} href={link.url}>
								{link.title}
							</HeaderLink>
						))}
					</div>
				</nav>
			</Container>
		</header>
	)
}

const LINKS = [
	{
		title: 'About',
		url: '/',
	},
	{
		title: 'Blog',
		url: '/posts',
	},
	{
		title: 'Projects',
		url: '/projects',
	},
	{
		title: 'Contact',
		url: '/contact',
	},
]
