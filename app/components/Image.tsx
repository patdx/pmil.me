import { type FC, use } from 'react';
import type { OutputMetadata } from '~/shared/utils';

type SrcProp = string | OutputMetadata | { default: string | OutputMetadata };

function useSrc(src: SrcProp | Promise<SrcProp>): Partial<OutputMetadata> {
	let unwrapped: SrcProp;

	// first unwrap promise
	if (src instanceof Promise) {
		unwrapped = use(src);
	} else {
		unwrapped = src;
	}

	if (typeof unwrapped === 'string') {
		return { src: unwrapped };
	}

	const undefaulted = 'default' in unwrapped ? unwrapped.default : unwrapped;

	return typeof undefaulted === 'string' ? { src: undefaulted } : undefaulted;
}

export const Image3: FC<{
	className?: string;
	src: SrcProp | Promise<SrcProp>;
	style?: any;
	alt?: string;
	/** @deprecated not currently used */
	sizes?: string;
	/** @deprecated not currently used */
	fit?: string;
}> = ({ className, style, src: imageMaybePromise, alt }) => {
	if (imageMaybePromise instanceof Promise) {
		const unwrapped = use(imageMaybePromise);
	}

	const image = useSrc(imageMaybePromise);

	const { src, width, height, format } = image;

	return (
		<img
			width={width}
			height={height}
			src={src}
			className={className}
			style={style}
			alt={alt}
		/>
	);
};
