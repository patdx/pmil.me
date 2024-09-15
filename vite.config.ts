import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { imagetools } from 'vite-imagetools';
import tsconfigPaths from 'vite-tsconfig-paths';

function makeWasmLoader(wasmPath: string) {
	const code = /* js */ `import fs from "fs";

const wasmModule = new WebAssembly.Module(fs.readFileSync(${JSON.stringify(wasmPath)}));
export default wasmModule;
`;
	return code;
}

const cloudflareStyleWasmLoader = () => {
	let isDev = false;

	return {
		name: 'cloudflare-style-wasm-loader',
		enforce: 'pre',
		config(config, env) {
			return {
				build: { rollupOptions: { external: [/.+\.wasm$/i] } },
			};
		},
		configResolved(config) {
			isDev = config.command === 'serve';
		},
		resolveId(id) {
			if (isDev) return;
			// prod only

			if (id.endsWith('.wasm?module')) {
				console.log('Resolving WASM file:', id);
				return {
					id: id.slice(0, -1 * '?module'.length),
					external: true,
				};
			}
		},
		load(id) {
			if (!isDev) return;
			// dev only

			if (id.endsWith('.wasm?module')) {
				const actualId = id.slice(0, -1 * '?module'.length);
				console.log('Loading WASM file:', id);
				return makeWasmLoader(actualId);
			}
		},
	} satisfies Plugin;
};

export default defineConfig({
	plugins: [
		cloudflareStyleWasmLoader(),
		AutoImport({
			include: [
				/\.[jt]sx?$/,
				/\.astro$/,
				/\.vue$/,
				/\.vue\?vue/,
				/\.svelte$/,
				/\.mdx$/,
			],
			imports: [
				'react',
				{
					react: ['Suspense'],
					'@remix-run/react': ['Link', 'NavLink'],
				},
			],
			biomelintrc: {
				enabled: true,
			},
			dirs: ['app/components', 'app/shared'],
		}),
		imagetools({
			defaultDirectives: new URLSearchParams({
				as: 'metadata',
			}),
			namedExports: false, // we will just use the default export
		}),
		Icons({
			compiler: 'jsx',
			jsx: 'react',
			scale: 1.5,
		}),
		remixCloudflareDevProxy(),
		remix({
			ignoredRouteFiles: ['**/*.astro'],
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				unstable_singleFetch: true,
				unstable_lazyRouteDiscovery: true,
			},
		}),
		tsconfigPaths(),
	],
	build: {
		target: 'esnext', // support top level await
	},
	optimizeDeps: {
		exclude: [
			// '@vercel/og', '@resvg/resvg-wasm/index_bg.wasm'
		],
	},
	ssr: {
		external: [
			// '@resvg/resvg-wasm/index_bg.wasm',
			// 'yoga-wasm-web/dist/yoga.wasm',
		],
	},
});
