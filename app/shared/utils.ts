export function getCollection(name: string) {
	return [] as any;
}

export function getImage(opts: any) {
	return null as any;
}

export function sortBy<T>(
	arr: T[],
	key: (item: T) => any,
	dir: 'asc' | 'desc' = 'asc',
) {
	return arr.sort((a, b) => {
		const res = compare(key(a), key(b));
		return dir === 'asc' ? res : -res;
	});
}

function compare<T>(a: T, b: T): number {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}
