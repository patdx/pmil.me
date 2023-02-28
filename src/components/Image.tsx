import { getImage } from '@astrojs/image';
import type {
  ImageComponentLocalImageProps,
  ImageComponentRemoteImageProps,
} from '@astrojs/image/components';
import { Component, createResource, Suspense } from 'solid-js';

const images = import.meta.glob('../content/project/images/**/*');

export const ProjectImage: Component<
  ImageComponentLocalImageProps | ImageComponentRemoteImageProps
> = (props) => {
  const src = `../content/project/images/${props.src}`;

  const srcPromise = images[src]?.();
  console.log('importing...', src, srcPromise);

  if (!srcPromise) return 'No picture';

  return <Image {...props} src={srcPromise} />;
};

export const Image: Component<
  ImageComponentLocalImageProps | ImageComponentRemoteImageProps
> = (props) => {
  return (
    <Suspense>
      <ImageInner {...props} />
    </Suspense>
  );
};

const ImageInner: Component<
  ImageComponentLocalImageProps | ImageComponentRemoteImageProps
> = (props) => {
  if (!props.src) {
    console.warn(`ImageInner: No src`);
    return null;
  }

  const [image] = createResource(() =>
    getImage({ src: props.src, alt: 'Cover' })
  );

  return <img {...(image() as any)} loading="lazy" decoding="async" />;
};
