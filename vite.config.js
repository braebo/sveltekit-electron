import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	resolve: {
		preserveSymlinks: true
	}
};

export default config;
