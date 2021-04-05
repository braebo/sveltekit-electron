const sveltePreprocess = require('svelte-preprocess');
const static = require('@sveltejs/adapter-static');
const pkg = require('./package.json');

const dev = process.env.NODE_ENV == 'dev';

/** @type {import("@sveltejs/kit").Config} */
module.exports = {
	kit: {
		adapter: static(),
		target: '#svelte',

		vite: {
			compilerOptions: { dev },
			ssr: { noExternal: Object.keys(pkg.dependencies || {}) },
		},
	},
	// @ts-expect-error
	preprocess: sveltePreprocess(),
};
