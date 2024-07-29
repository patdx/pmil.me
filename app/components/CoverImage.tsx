import type { GetImageResult } from 'astro';
import clsx from 'clsx';
import type { FC } from 'react';

export const CoverImage: FC<
	{
		title: string;
		href?: string;
	} & GetImageResult
> = (props) => {
	return (
		<Suspense>
			{props.href ? (
				<a className="block sm:mx-0" href={props.href} aria-label={props.title}>
					<CoverImageInner {...props} />
				</a>
			) : (
				<div className="sm:mx-0">
					<CoverImageInner {...props} />
				</div>
			)}
		</Suspense>
	);
};

const CoverImageInner: FC<
	{
		title: string;
		href?: string;
	} & GetImageResult
> = (props) => {
	return (
		<Image2
			{...props}
			alt={`Cover Image for ${props.title}`}
			fit="fill"
			className={clsx(
				'shadow-small',
				props.href && 'hover:shadow-medium transition-shadow duration-200',
			)}
		/>
	);
};
