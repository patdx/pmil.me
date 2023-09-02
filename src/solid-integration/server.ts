import {
  createComponent,
  generateHydrationScript,
  NoHydration,
  renderToString,
  renderToStringAsync,
  ssr,
  Suspense,
} from 'solid-js/web';
import { getContext, incrementId } from './context.js';
import type { RendererContext } from './types';

console.log('Hello server');

const slotName = (str: string) =>
  str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());

type RenderStrategy = 'sync' | 'async';

async function check(
  this: RendererContext,
  Component: any,
  props: Record<string, any>,
  children: any
) {
  if (typeof Component !== 'function') return false;
  const { html } = await renderToStaticMarkup.call(
    this,
    Component,
    props,
    children,
    {
      // The check() function appears to just be checking if it is
      // a valid Solid component. This should be lightweight so prefer
      // sync render strategy, which should simplify render Suspense fallbacks
      // not try to load any resources.
      renderStrategy: 'sync' as RenderStrategy,
    }
  );
  return typeof html === 'string';
}

// AsyncRendererComponentFn
async function renderToStaticMarkup(
  this: RendererContext,
  Component: any,
  props: Record<string, any>,
  { default: children, ...slotted }: any,
  metadata?: undefined | Record<string, any>
) {
  const renderId = metadata?.hydrate
    ? incrementId(getContext(this.result))
    : '';
  const needsHydrate = metadata?.astroStaticSlot ? !!metadata.hydrate : true;
  const tagName = needsHydrate ? 'astro-slot' : 'astro-static-slot';

  const ctx = getContext(this.result);

  const renderStrategy = (metadata?.renderStrategy ??
    'async') as RenderStrategy;

  const renderFn = () => {
    const slots: Record<string, any> = {};
    for (const [key, value] of Object.entries(slotted)) {
      const name = slotName(key);
      slots[name] = ssr(`<${tagName} name="${name}">${value}</${tagName}>`);
    }
    // Note: create newProps to avoid mutating `props` before they are serialized
    const newProps = {
      ...props,
      ...slots,
      // In Solid SSR mode, `ssr` creates the expected structure for `children`.
      children:
        children != null
          ? ssr(`<${tagName}>${children}</${tagName}>`)
          : children,
    };

    if (renderStrategy === 'sync') {
      // Sync Render:
      // <Component />
      // This render mode is not exposed directly to the consumer, only
      // used in the check() function.
      return createComponent(Component, newProps);
    } else {
      if (needsHydrate) {
        // Hydrate + Async Render:
        // <Suspense>
        //   <Component />
        // </Suspense>
        return createComponent(Suspense, {
          get children() {
            return createComponent(Component, newProps);
          },
        });
      } else {
        // Static + Async Render
        // <NoHydration>
        //   <Suspense>
        //     <Component />
        // 	 </Suspense>
        // </NoHydration>
        return createComponent(NoHydration, {
          get children() {
            return createComponent(Suspense, {
              get children() {
                return createComponent(Component, newProps);
              },
            });
          },
        });
      }
    }
  };

  let html = '';

  if (needsHydrate && renderStrategy === 'async') {
    if (!ctx.hasHydrationScript) {
      // The hydration script needs to come before to the first hydrating component of the page.
      // One way to this would be to prepend the rendered output, eg:
      //
      // html += generateHydrationScript();
      //
      // However, in certain situations, nested components may be rendered depth-first, causing SolidJS
      // to put the hydration script in the wrong spot.
      //
      // Therefore we render the hydration script to the extraHead so it can work anytime.

      // NOTE: It seems that components on a page may be rendered in parallel.
      // To avoid a race condition, this code block is intentionally written
      // *before* the first `await` in the function, so the hydration script will
      // be prefixed to the first hydratable component on the page, regardless of
      // the order in which the components finish rendering.

      this.result._metadata.extraHead.push(generateHydrationScript());
      ctx.hasHydrationScript = true;
    }
  }

  html +=
    renderStrategy === 'async'
      ? await renderToStringAsync(renderFn, { renderId })
      : renderToString(renderFn, { renderId });

  return {
    attrs: {
      'data-solid-render-id': renderId,
    },
    html,
  };
}

export default {
  check,
  renderToStaticMarkup,
  supportsAstroStaticSlot: true,
};
