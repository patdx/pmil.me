import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
} from '@remix-run/react';
import './tailwind.css';
import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
	return createMeta();
};

export function Layout({ children }: { children: React.ReactNode }) {
	const { pathname } = useLocation();
	const href = `https://pmil.me${pathname}`;

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* TODO: update this when slug url support is added */}
				<link href={href} rel="canonical" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
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
