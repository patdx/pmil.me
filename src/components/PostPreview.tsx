import clsx from 'clsx';
import { type Component, Show } from 'solid-js';
import { Image } from './Image';
import type { GetImageResult } from 'astro';

export const PostPreview: Component<{
  title: string;
  coverImage?: GetImageResult;
  excerpt?: string | null;
  href: string;
}> = (props) => {
  return (
    <a
      href={props.href}
      class={clsx(
        'aspect-w-1 aspect-h-1 rounded-md',
        'group shadow-lg hover:shadow-xl',
        'bg-gray-100 transition'
      )}
    >
      {props.coverImage ? (
        <Image
          {...props.coverImage}
          alt={`Cover Image for ${props.title}`}
          sizes="100vw"
          class="rounded-md object-cover transition group-hover:blur-sm"
        />
      ) : null}
      <div
        class={clsx('flex', props.coverImage ? 'items-end' : 'items-stretch')}
      >
        <div class="flex-1 rounded-b-md border border-gray-200 bg-white px-2 py-4 text-3xl text-black opacity-90 shadow backdrop-blur transition group-hover:scale-105 group-hover:border-gray-300 group-hover:opacity-100 sm:text-lg">
          <h3 class="font-bold">{props.title}</h3>
          <Show when={props.excerpt}>
            <p>{props.excerpt}</p>
          </Show>
        </div>
      </div>
    </a>
  );
};
