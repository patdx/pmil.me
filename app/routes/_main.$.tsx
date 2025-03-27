import type { LoaderFunctionArgs } from 'react-router'

export async function loader({ params }: LoaderFunctionArgs) {
	throw new Response(null, {
		status: 404,
		statusText: 'Not Found',
	})
}

export default function NotFound() {
	return null
}
