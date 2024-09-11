import {
	type MetaFunction,
	Outlet,
	isRouteErrorResponse,
	useRouteError,
} from '@remix-run/react';

export const meta: MetaFunction = ({ error }) => {
	return error ? [{ title: 'Error | Patrick Miller' }] : [];
};

export default function Main() {
	return <Outlet />;
}

export function ErrorBoundary() {
	return (
		<>
			{/* <title>Not found | Patrick Miller</title> */}
			<Container className="text-center pt-20">
				<ErrorBoundaryInner />
			</Container>
		</>
	);
}

function ErrorBoundaryInner() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return <h1>This page could not be found.</h1>;
		}

		return (
			<>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</>
		);
	}

	return (
		<>
			<h1>Error!</h1>
			<p>{error?.message ?? 'Unknown error'}</p>
		</>
	);
}
