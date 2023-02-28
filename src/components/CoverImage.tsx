import clsx from 'clsx';
import { Component, Suspense } from 'solid-js';
import { ProjectImage } from './Image';

export const CoverImage: Component<{
  title: string;
  src?: string;
  href?: string;
}> = (props) => {
  return (
    <Suspense>
      {props.href ? (
        <a class="block sm:mx-0" href={props.href} aria-label={props.title}>
          <CoverImageInner
            title={props.title}
            src={props.src}
            href={props.href}
          />
        </a>
      ) : (
        <div class="sm:mx-0">
          <CoverImageInner
            title={props.title}
            src={props.src}
            href={props.href}
          />
        </div>
      )}
    </Suspense>
  );
};

const CoverImageInner: Component<{
  title: string;
  src: string;
  href?: string;
}> = (props) => {
  return (
    <ProjectImage
      src={props.src}
      alt={`Cover Image for ${props.title}`}
      fit="fill"
      class={clsx(
        'shadow-small',
        props.href && 'hover:shadow-medium transition-shadow duration-200'
      )}
    />
  );
};
