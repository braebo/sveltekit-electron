import * as layout from "/_app/assets/components/layout.svelte";

const components = [
	() => import("/_app/routes/index.svelte")
];

export const pages = [
	{
		// index.svelte
		pattern: /^\/$/,
		parts: [
			[components[0]]
		]
	}
];

export const ignore = [
	
];

export { layout };