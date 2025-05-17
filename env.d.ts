/// <reference path="./worker-configuration.d.ts" />

declare module '*as=metadata' {
	const src: import('~/shared/utils').OutputMetadata
	export default src
}

// declare module '*.wasm?module' {
// 	const src: WebAssembly.Module
// 	export default src
// }

declare module '*.wasm' {
	const value: WebAssembly.Module
	export default value
}
