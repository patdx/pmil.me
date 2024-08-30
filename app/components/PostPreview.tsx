import clsx from 'clsx';
import type { FC } from 'react';
// import { loadProjectImage } from '~/content/project/project-images';

export const PostPreview: FC<{
	title: string;
	coverImage?: string;
	excerpt?: string | null;
	href: string;
}> = (props) => {
	// const coverImage = null;
	// const coverImage = props.coverImage
	// 	? loadProjectImage(props.coverImage)
	// 	: null;
	const { coverImage } = props;

	return (
		<Link
			to={props.href}
			className={clsx(
				'aspect-w-1 aspect-h-1 rounded-md',
				'group shadow-lg hover:shadow-xl',
				'bg-gray-100 transition'
			)}
		>
			{coverImage ? (
				<Image3
					src={coverImage}
					alt={`Cover Image for ${props.title}`}
					sizes="100vw"
					className="rounded-md object-cover transition group-hover:blur-sm"
				/>
			) : null}
			<div
				className={clsx(
					'flex',
					props.coverImage ? 'items-end' : 'items-stretch'
				)}
			>
				<div className="flex-1 rounded-b-md border border-gray-200 bg-white px-2 py-4 text-3xl text-black opacity-90 shadow backdrop-blur transition group-hover:scale-105 group-hover:border-gray-300 group-hover:opacity-100 sm:text-lg">
					<h3 className="font-bold">{props.title}</h3>
					<Show when={props.excerpt}>
						<p>{props.excerpt}</p>
					</Show>
				</div>
			</div>
		</Link>
	);
};
