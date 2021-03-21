const sveltePreprocess = require('svelte-preprocess');
const svelte = require('@sveltejs/vite-plugin-svelte');
const node = require('@sveltejs/adapter-node');
const exclude = require('./svelte.exclude.config.js');

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
		adapter: node(),
		prerender: {
			enabled: false
		},
		files: {
			assets: 'public',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			setup: 'src/setup',
			template: 'src/app.html',
		},
		vite: {
			compilerOptions: { dev },
			server: {
				open: false,
				port: process.env.PORT || 3333,
			},
			optimizeDeps: { exclude },
			plugins: [svelte],
		},
	},
	// @ts-expect-error
	preprocess: sveltePreprocess({ typescript: true }),
};
