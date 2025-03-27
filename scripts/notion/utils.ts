import fs from 'node:fs'

export function writeJson(path: string | URL, data: any) {
	// biome-ignore lint/style/useTemplate: <explanation>
	fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}

export function readJson<T>(path: string | URL): T {
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

export async function cache<T>(key: string, fn: () => T): Promise<Awaited<T>> {
	let data: any
	const cachePath = new URL(`./${key}.json`, import.meta.url)
	try {
		data = await readJson(cachePath)
	} catch (e) {
		data = await fn()
		writeJson(cachePath, data)
	}
	return data
}
