import type { FC } from 'react';
import { HeaderLink } from './HeaderLink';

export const NavHeader: FC = () => {
	return (
		<div className="grid grid-cols-4 divide-x divide-blue-100 p-4 text-center sm:mx-auto sm:w-[36rem]">
			{LINKS.map((link, index) => (
				<div key={index} className="px-2">
					<HeaderLink href={link.url}>{link.title}</HeaderLink>
				</div>
			))}
		</div>
	);
};

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
];
