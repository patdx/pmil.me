import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	NavLink,
} from 'react-router'
import type { Route } from './+types/root'
import './tailwind.css'
import { NavHeader } from './components/NavHeader'

export const meta: Route.MetaFunction = () => {
	return createMeta()
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="antialiased">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
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
			<body className="min-h-screen bg-gradient-to-b from-background to-muted">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<div className="relative flex min-h-screen flex-col">
			<NavHeader />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	)
}
