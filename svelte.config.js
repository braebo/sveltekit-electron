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

/* Disabling Sveltekit SSR has to be done in the handle function now */
export async function handle({ request, resolve }) {
    const response = await resolve(request, {
        ssr: false
    });
    return response;
}
