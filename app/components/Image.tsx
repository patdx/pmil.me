import type { FC } from 'react';
import type { GetImageResult } from '~/shared/utils';

export const Image2: FC<
	GetImageResult & {
		alt: string;
		fit: string;
		className: string;
		sizes?: string;
		style?: any;
	}
> = (props) => {
	return (
		<Suspense>
			<ImageInner {...props} />
		</Suspense>
	);
};

const ImageInner: FC<
	GetImageResult & {
		alt: string;
		fit: string;
		className: string;
		sizes?: string;
	}
> = (props) => {
	if (!props.src) {
		console.warn('ImageInner: No src');
		return null;
	}

	// const [image] = createResource(
	//   async () => {
	//     const result = await getImage(props);
	//     console.log('Got image', result);
	//     return result;
	//   },
	//   {
	//     // deferStream: true,
	//   }
	// );

	return <img {...(props as any)} loading="lazy" decoding="async" />;
};
