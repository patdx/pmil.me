import mdx from '@mdx-js/rollup';
import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import rehypeShiki from '@shikijs/rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		mdx({
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
			rehypePlugins: [
				[
					// syntax highlighting
					rehypeShiki,
					{
						theme: 'github-light',
					},
				],
			],
		}),
		Icons({
			compiler: 'jsx',
			jsx: 'react',
			scale: 1.5,
		}),
		AutoImport({
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
		remixCloudflareDevProxy(),
		remix({
			ignoredRouteFiles: ['**/*.astro'],
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
		tsconfigPaths(),
	],
	build: {
		target: 'esnext', // support top level await
	},
});
