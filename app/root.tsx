import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';
import type { MetaFunction } from '@remix-run/cloudflare';
import { SITE_DESCRIPTION, SITE_TITLE } from './config';

export const meta: MetaFunction = () => {
	return [
		{ title: SITE_TITLE },
		{
			name: 'description',
			content: SITE_DESCRIPTION,
		},
	];
};

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<BaseHead />
				<Meta />
				<Links />
			</head>
			<body className="min-h-screen">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<>
			<NavHeader />
			<Outlet />
		</>
	);
}
