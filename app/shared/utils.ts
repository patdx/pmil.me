/** from vite-imagetools */
export interface OutputMetadata {
	src: string; // URL of the generated image
	width: number; // Width of the image
	height: number; // Height of the image
	format: string; // Format of the generated image

	// The following options are the same as sharps input options
	space: string; // Name of colour space interpretation
	channels: number; // Number of bands e.g. 3 for sRGB, 4 for CMYK
	density: number; //  Number of pixels per inch
	depth: string; // Name of pixel depth format
	hasAlpha: boolean; // presence of an alpha transparency channel
	hasProfile: boolean; // presence of an embedded ICC profile
	isProgressive: boolean; // indicating whether the image is interlaced using a progressive scan
}

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
