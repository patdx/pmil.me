import type { Route } from './+types/clear-cache'

export async function loader(args: Route.LoaderArgs) {
	console.log('Clear cache loader invoked')
	const keys = await args.context.cloudflare.env.KV.list()

	await Promise.all(
		keys.keys.map(async (key) => {
			console.log('Key: ' + key.name)
			await args.context.cloudflare.env.KV.delete(key.name)
		})
	)

	console.log('Cache cleared successfully')

	return Response.json(
		{
			message: 'Cache cleared successfully',
			deleted: keys.keys.length,
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store',
			},
		}
	)
}
