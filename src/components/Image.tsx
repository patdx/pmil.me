import type { GetImageResult } from 'astro';
import { Suspense, type Component } from 'solid-js';
import { NoHydration } from 'solid-js/web';

export const Image: Component<GetImageResult & {alt: string; fit: string; class: string; sizes?: string}> = (props) => {
  // Adding NoHydration keeps the resource from serializing itself into the HTML.
  return (
    <NoHydration>
      <Suspense>
        <ImageInner {...props} />
      </Suspense>
    </NoHydration>
  );
};

const ImageInner: Component<GetImageResult & {alt: string; fit: string; class: string; sizes?: string}> = (props) => {
  if (!props.src) {
    console.warn(`ImageInner: No src`);
    return null;
  }

  // const [image] = createResource(
  //   async () => {
  //     const result = await getImage(props);
  //     console.log('Got image', result);
  //     return result;
  //   },
  //   {
  //     // deferStream: true,
  //   }
  // );

  return <img {...(props as any)} loading="lazy" decoding="async" />;
};
