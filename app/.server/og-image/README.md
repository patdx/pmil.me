# og-image

I spent a very long time trying to figure out how to get this to work on Cloudflare Pages with Remix/Vite. I finally got it to compile but it says the server size is larger than 1mb.

I think I will need to split the OG image generation into a separate worker.

## Inspired by

- vercel/og
- m5r/og
- cloudflare/pages-plugin-vercel-og
- https://github.com/fabian-hiller/og-img/blob/main/src/ImageResponse.ts
- https://github.com/ascorbic/og-edge/blob/main/mod.ts
- https://github.com/kvnang/workers-og/blob/main/packages/workers-og/src/font.ts
- https://github.com/superhighfives/vite-plugin-wasm-module-workers
- unwasm
