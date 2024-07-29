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

// below types temporarily taken from astro
type ImageInputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg';
export type ImageQualityPreset = 'low' | 'mid' | 'high' | 'max' | (string & {});
export type ImageQuality = ImageQualityPreset | number;

export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: ImageInputFormat;
	orientation?: number;
};
type ImageOutputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg';

export type ImageTransform = {
	src: ImageMetadata | string;
	width?: number | undefined;
	widths?: number[] | undefined;
	densities?: (number | `${number}x`)[] | undefined;
	height?: number | undefined;
	quality?: ImageQuality | undefined;
	format?: ImageOutputFormat | undefined;
	[key: string]: any;
};

export type UnresolvedSrcSetValue = {
	transform: ImageTransform;
	descriptor?: string;
	attributes?: Record<string, any>;
};
export type SrcSetValue = UnresolvedSrcSetValue & {
	url: string;
};

export interface GetImageResult {
	rawOptions: ImageTransform;
	options: ImageTransform;
	src: string;
	srcSet: {
		values: SrcSetValue[];
		attribute: string;
	};
	attributes: Record<string, any>;
}
