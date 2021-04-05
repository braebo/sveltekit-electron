const svelte = require('@sveltejs/vite-plugin-svelte');
const sveltePreprocess = require('svelte-preprocess');
const exclude = require('./svelte.exclude.config.js');
const static = require('@sveltejs/adapter-static');
const json = require('@rollup/plugin-json');

const dev = process.env.NODE_ENV == 'development'

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	compilerOptions: {
		dev,
		css: false,
		preserveWhitespace: true,
	},
	extensions: ['.svelte'],
	kit: {
		adapter: {adapt: static},
		prerender: {
			enabled: false,
		},
		files: {
			assets: 'public',
			lib: 'src/lib',
			routes: 'src/routes',
			template: 'src/app.html',
		},
		vite: {
			base: './',
			compilerOptions: { dev },
			server: {
				open: false,
				port: process.env.PORT || 3333,
			},
			optimizeDeps: { exclude },
			plugins: [svelte, json],
		},
	},
	// @ts-expect-error
	preprocess: sveltePreprocess({ typescript: true }),
};
