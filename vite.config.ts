import { reactRouter } from '@react-router/dev/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { imagetools } from 'vite-imagetools';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vitePluginViteNodeMiniflare } from '@hiogawa/vite-node-miniflare';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import commonjs from 'vite-plugin-commonjs';
import { builtinModules } from 'node:module';

function makeWasmLoader(wasmPath: string) {
	const code = /* js */ `import fs from "fs";

const wasmModule = new WebAssembly.Module(fs.readFileSync(${
		JSON.stringify(wasmPath)
	}));
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

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [
		commonjs({
			filter(id) {
				if (id.includes('@notionhq/client')) {
					console.log('commonjs interop for ' + id);
					return true;
				}
				// console.log(id);
				return false;
			},
		}),
		// cjsInterop({
		// 	dependencies: [
		// 		'**/node_modules/@notionhq/client/**',
		// 		'@notionhq/client',
		// 	],
		// }),
		vitePluginViteNodeMiniflare({
			entry: './workers/app.ts',
		}),

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
					'react-router': ['Link', 'NavLink'],
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
		// remixCloudflareDevProxy(),
		reactRouter(),
		tsconfigPaths(),
	],
	build: {
		target: 'esnext', // support top level await
		rollupOptions: isSsrBuild
			? {
				input: './workers/app.ts',
			}
			: undefined,
	},
	optimizeDeps: {
		exclude: [
			// '@vercel/og', '@resvg/resvg-wasm/index_bg.wasm'
		],
	},
	ssr: {
		// target: 'webworker',
		// noExternal: true,
		external: [
			'node:async_hooks', //  '@notionhq/client'
			...builtinModules,
			'stream',
			'node:stream',
		],
		resolve: {
			conditions: ['workerd', 'browser'],
		},
		optimizeDeps: {
			include: [
				'react',
				'react/jsx-runtime',
				'react/jsx-dev-runtime',
				'react-dom',
				'react-dom/server',
				'react-router',
			],
		},
	},
}));
