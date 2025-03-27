import type { ReactNode } from 'react'

export function For<T>({
	of,
	as,
}: {
	of: T[]
	as: (item: T) => ReactNode
}): ReactNode {
	const out: any[] = []

	for (const item of of) {
		out.push(as(item))
	}

	return out
}
