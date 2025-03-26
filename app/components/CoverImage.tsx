import clsx from 'clsx';
import type { FC } from 'react';

export const CoverImage: FC<{
	src: string;
	title: string;
	href?: string;
}> = (props) => {
	return props.href ? (
		<Link className="block sm:mx-0" to={props.href} aria-label={props.title}>
			<CoverImageInner {...props} />
		</Link>
	) : (
		<div className="sm:mx-0">
			<CoverImageInner {...props} />
		</div>
	);
};

const CoverImageInner: FC<{
	src: string;
	title: string;
	href?: string;
}> = (props) => {
	// const src = loadProjectImage(props.src);
	return null;

	return (
		<Image3
			src={src}
			alt={`Cover Image for ${props.title}`}
			fit="fill"
			className={clsx(
				'shadow-small',
				props.href && 'hover:shadow-medium transition-shadow duration-200',
			)}
		/>
	);
};
