import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import("@sveltejs/kit").Config} */
const config = {
	kit: {
		adapter: adapter({}),
	},
	preprocess: sveltePreprocess(),
};
export default config;

/* Sveltekit SSR can be disabled in the handle function */
export async function handle({ request, resolve }) {
	const response = await resolve(request, {
		ssr: false,
	});
	return response;
}
