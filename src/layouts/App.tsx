import type { ParentComponent } from 'solid-js';
import { BaseHead } from '../components/BaseHead';
import { NavHeader } from '../components/NavHeader';

// <!DOCTYPE html>

export const App: ParentComponent = (props) => (
  <html lang="en">
    <head>
      <title>Patrick Miller</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <BaseHead />
    </head>
    <body>
      <div class="min-h-screen">
        <NavHeader />
        {props.children}
      </div>
    </body>
  </html>
);

//      {/* <AstroProvider value={Astro}> */}
// {
//   /* </AstroProvider> */
// }
// {
//   /* <slot /> */
// }
