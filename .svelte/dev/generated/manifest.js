import * as layout from "../../../src/routes/$layout.svelte";

const components = [
	() => import("../../../src/routes/index.svelte")
];

const d = decodeURIComponent;
const empty = () => ({});

export const pages = [
	{
		// src/routes/index.svelte
		pattern: /^\/$/,
		params: empty,
		parts: [components[0]]
	}
];

export const ignore = [
	
];

export { layout };