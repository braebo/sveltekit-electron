export { prerendering } from '../env.js';

const browser = !import.meta.env.SSR;
const dev = !!import.meta.env.DEV;
const amp = !!import.meta.env.VITE_SVELTEKIT_AMP;

export { amp, browser, dev };
