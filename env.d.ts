/// <reference types="@cloudflare/workers-types/experimental" />

declare module '*as=metadata' {
	const src: import('~/shared/utils').OutputMetadata;
	export default src;
}

declare module '*.wasm?module' {
	const src: WebAssembly.Module;
	export default src;
}
