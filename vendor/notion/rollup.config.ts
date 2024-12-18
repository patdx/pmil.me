// Based on: https://github.com/unjs/unpdf/blob/main/pdfjs.rollup.config.ts
// The notion API comes in a Node.js flavor, which does not
// work with the current dev mode. This is a custom Rollup
// config to build the Notion API for the browser.

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'rollup';
import * as unenv from 'unenv';

const env = unenv.env(unenv.nodeless);

export default defineConfig({
	input: 'vendor/notion/notion.src.js',
	output: {
		file: 'vendor/notion/notion.js',
		format: 'esm',
		exports: 'auto',
		inlineDynamicImports: true,
		generatedCode: {
			constBindings: true,
		},
		sourcemap: false,
	},
	external: env.external,
	plugins: [
		json(),
		replace({
			delimiters: ['', ''],
			preventAssignment: true,
			values: {
				// // Disable the `window` check (for requestAnimationFrame).
				// 'typeof window': '"undefined"',
				// // Imitate the Node.js environment for all serverless environments, unenv will
				// // take care of the remaining Node.js polyfills. Keep support for browsers.
				// 'const isNodeJS = typeof':
				// 	'const isNodeJS = typeof document === "undefined" // typeof',
				// // Force inlining the PDF.js worker.
				// 'await import(/* webpackIgnore: true */ this.workerSrc)':
				// 	'__pdfjsWorker__',
				// // Tree-shake client worker initialization logic.
				// '!PDFWorkerUtil.isWorkerDisabled && !PDFWorker.#mainThreadWorkerMessageHandler':
				// 	'false',
			},
		}),
		alias({
			entries: resolveAliases({
				// 'canvas': join(mockDir, 'canvas.mjs'),
				// 'path2d-polyfill': join(mockDir, 'path2d-polyfill.mjs'),
				...env.alias,
			}),
		}),
		nodeResolve(),
		commonjs({
			esmExternals: (id) => !id.startsWith('unenv/'),
			requireReturnsDefault: 'auto',
		}),
		inject(env.inject),
	],
});

export function resolveAliases(_aliases: Record<string, string>) {
	// Sort aliases from specific to general (ie. fs/promises before fs)
	const aliases = Object.fromEntries(
		Object.entries(_aliases).sort(
			([a], [b]) =>
				b.split('/').length - a.split('/').length || b.length - a.length,
		),
	);

	// Resolve alias values in relation to each other
	for (const key in aliases) {
		for (const alias in aliases) {
			if (aliases[key]!.startsWith(alias)) {
				aliases[key] = aliases[alias] + aliases[key]!.slice(alias.length);
			}
		}
	}

	return aliases;
}
