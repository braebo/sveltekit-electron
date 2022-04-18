/* Sveltekit SSR can be disabled in the handle function */
export async function handle({ request, resolve }) {
	const response = await resolve(request, {
		ssr: false,
	});
    
	return response;
}
