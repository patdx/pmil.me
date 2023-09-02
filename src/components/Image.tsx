import {
  getImage,
  type LocalImageProps,
  type RemoteImageProps,
} from 'astro:assets';
import { type Component, createResource, Suspense } from 'solid-js';
import { NoHydration } from 'solid-js/web';

const images = import.meta.glob('../content/project/_images/**/*');

export const ProjectImage: Component<LocalImageProps> = (props) => {
  const src = `../content/project/_images/${props.src}`;

  const srcPromise = images[src]?.();
  console.log('importing...', src, srcPromise);

  if (!srcPromise) return 'No picture';

  return <Image {...props} src={srcPromise} />;
};

export const Image: Component<LocalImageProps | RemoteImageProps> = (props) => {
  // Adding NoHydration keeps the resource from serializing itself into the HTML.
  return (
    <NoHydration>
      <Suspense>
        <ImageInner {...props} />
      </Suspense>
    </NoHydration>
  );
};

const ImageInner: Component<LocalImageProps | RemoteImageProps> = (props) => {
  if (!props.src) {
    console.warn(`ImageInner: No src`);
    return null;
  }

  const [image] = createResource(
    async () => {
      const result = await getImage(props);
      console.log('Got image', result);
      return result;
    },
    {
      // deferStream: true,
    }
  );

  return <img {...(image() as any)} loading="lazy" decoding="async" />;
};
