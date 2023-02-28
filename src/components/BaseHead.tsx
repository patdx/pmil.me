import { Component, Show } from 'solid-js';

export const BaseHead: Component<{
  title?: string;
  description?: string;
  image?: string;
  /** props.url */
  url?: string;
}> = (props) => {
  return (
    <>
      {/* <!-- Global Metadata --> */}
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      {/* <meta name="generator" content={Astro.generator} /> */}

      {/* <!-- Primary Meta Tags --> */}
      <title>{props.title}</title>
      <meta name="title" content={props.title} />
      <meta name="description" content={props.description} />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <Show when={props.url}>
        <meta property="og:url" content={props.url} />
      </Show>
      <Show when={props.title}>
        <meta property="og:title" content={props.title} />
      </Show>
      <Show when={props.description}>
        <meta property="og:description" content={props.description} />
      </Show>

      {props.image && (
        <meta
          property="og:image"
          content={new URL(props.image, props.url).toString()}
        />
      )}

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={props.url} />
      <meta property="twitter:title" content={props.title} />
      <meta property="twitter:description" content={props.description} />
      {props.image && (
        <meta
          property="twitter:image"
          content={new URL(props.image, props.url).toString()}
        />
      )}
    </>
  );
};
