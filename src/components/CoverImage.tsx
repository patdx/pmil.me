import clsx from 'clsx';
import { type Component, Suspense } from 'solid-js';
import { Image } from './Image';
import type { GetImageResult } from 'astro';

export const CoverImage: Component<
  {
    title: string;
    href?: string;
  } & GetImageResult
> = (props) => {
  return (
    <Suspense>
      {props.href ? (
        <a class="block sm:mx-0" href={props.href} aria-label={props.title}>
          <CoverImageInner {...props} />
        </a>
      ) : (
        <div class="sm:mx-0">
          <CoverImageInner {...props} />
        </div>
      )}
    </Suspense>
  );
};

const CoverImageInner: Component<
  {
    title: string;
    href?: string;
  } & GetImageResult
> = (props) => {
  return (
    <Image
      {...props}
      alt={`Cover Image for ${props.title}`}
      fit="fill"
      class={clsx(
        'shadow-small',
        props.href && 'hover:shadow-medium transition-shadow duration-200'
      )}
    />
  );
};
