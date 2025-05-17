import { ImageResponse } from '~/.server/og-image/og'
// import { ImageResponse } from '@vercel/og'
// import { ImageResponse } from 'workers-og'
// import { ImageResponse } from '@cf-wasm/og'

import type { Route } from './+types/og'

export async function loader(args: Route.LoaderArgs) {
	const request = args.request
	const url = new URL(request.url)
	const title = url.searchParams.get('title') || '👋 Hello'

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 40,
					color: 'black',
					background: 'white',
					width: '100%',
					height: '100%',
					padding: '50px 200px',
					textAlign: 'center',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{title}
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	)
}
