import { memoize } from 'lodash-es';
import type { OutputMetadata } from '~/shared/utils';

export const projectImages = import.meta.glob<OutputMetadata>('./_images/*', {
	import: 'default',
});

export const loadProjectImage = memoize((src: string) => {
	const loader = projectImages[src];
	if (!loader) throw new Error(`No loader for ${src}`);
	return loader();
});
