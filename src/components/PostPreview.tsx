import clsx from 'clsx';
import type { Component } from 'solid-js';

import { ProjectImage } from './Image';

export const PostPreview: Component<{
  title: string;
  coverImage?: string | undefined;
  excerpt: string;
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
        <ProjectImage
          src={props.coverImage}
          alt={`Cover Image for ${props.title}`}
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
          class="rounded-md transition group-hover:blur-sm"
        />
      ) : undefined}
      <div class="flex items-end">
        <div class="flex-1 rounded-b-md border border-gray-200 bg-white px-2 py-4 text-3xl text-black opacity-90 shadow backdrop-blur transition group-hover:scale-105 group-hover:border-gray-300 group-hover:opacity-100 sm:text-lg">
          <h3 class="font-bold">{props.title}</h3>
          <p>{props.excerpt}</p>
        </div>
      </div>
    </a>
  );
};
