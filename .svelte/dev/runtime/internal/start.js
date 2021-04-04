import Root from '../../generated/root.svelte';
import { routes, layout } from '../../generated/manifest.js';
import { g as get_base_uri } from '../chunks/utils.js';
import { writable } from 'svelte/store';
import { init } from './singletons.js';
import { set_paths } from '../paths.js';

function scroll_state() {
	return {
		x: pageXOffset,
		y: pageYOffset
	};
}

/**
 * @param {Node} node
 * @returns {HTMLAnchorElement | SVGAElement}
 */
function find_anchor(node) {
	while (node && node.nodeName.toUpperCase() !== 'A') node = node.parentNode; // SVG <a> elements have a lowercase name
	return /** @type {HTMLAnchorElement | SVGAElement} */ (node);
}

class Router {
	/** @param {{
	 *    base: string;
	 *    routes: import('types.internal').CSRRoute[];
	 * }} opts */
	constructor({ base, routes }) {
		this.base = base;
		this.routes = routes;
	}

	/** @param {import('./renderer').Renderer} renderer */
	init(renderer) {
		/** @type {import('./renderer').Renderer} */
		this.renderer = renderer;
		renderer.router = this;

		this.enabled = true;

		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}

		// Adopted from Nuxt.js
		// Reset scrollRestoration to auto when leaving page, allowing page reload
		// and back-navigation from other pages to use the browser to restore the
		// scrolling position.
		addEventListener('beforeunload', () => {
			history.scrollRestoration = 'auto';
		});

		// Setting scrollRestoration to manual again when returning to this page.
		addEventListener('load', () => {
			history.scrollRestoration = 'manual';
		});

		// There's no API to capture the scroll location right before the user
		// hits the back/forward button, so we listen for scroll events

		/** @type {NodeJS.Timeout} */
		let scroll_timer;
		addEventListener('scroll', () => {
			clearTimeout(scroll_timer);
			scroll_timer = setTimeout(() => {
				// Store the scroll location in the history
				// This will persist even if we navigate away from the site and come back
				const new_state = {
					...(history.state || {}),
					'sveltekit:scroll': scroll_state()
				};
				history.replaceState(new_state, document.title, window.location.href);
			}, 50);
		});

		/** @param {MouseEvent} event */
		const trigger_prefetch = (event) => {
			const a = find_anchor(/** @type {Node} */ (event.target));
			if (a && a.hasAttribute('sveltekit:prefetch')) {
				this.prefetch(new URL(/** @type {string} */ (a.href)));
			}
		};

		/** @type {NodeJS.Timeout} */
		let mousemove_timeout;

		/** @param {MouseEvent} event */
		const handle_mousemove = (event) => {
			clearTimeout(mousemove_timeout);
			mousemove_timeout = setTimeout(() => {
				trigger_prefetch(event);
			}, 20);
		};

		addEventListener('touchstart', trigger_prefetch);
		addEventListener('mousemove', handle_mousemove);

		/** @param {MouseEvent} event */
		addEventListener('click', (event) => {
			if (!this.enabled) return;

			// Adapted from https://github.com/visionmedia/page.js
			// MIT license https://github.com/visionmedia/page.js#license
			if (event.button || event.which !== 1) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			if (event.defaultPrevented) return;

			const a = find_anchor(/** @type {Node} */ (event.target));
			if (!a) return;

			if (!a.href) return;

			// check if link is inside an svg
			// in this case, both href and target are always inside an object
			const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
			const href = String(svg ? /** @type {SVGAElement} */ (a).href.baseVal : a.href);

			if (href === location.href) {
				if (!location.hash) event.preventDefault();
				return;
			}

			// Ignore if tag has
			// 1. 'download' attribute
			// 2. rel='external' attribute
			if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;

			// Ignore if <a> has a target
			if (svg ? /** @type {SVGAElement} */ (a).target.baseVal : a.target) return;

			const url = new URL(href);

			// Don't handle hash changes
			if (url.pathname === location.pathname && url.search === location.search) return;

			const info = this.parse(url);
			if (info) {
				const noscroll = a.hasAttribute('sveltekit:noscroll');
				history.pushState({}, '', url.href);
				this._navigate(info, noscroll ? scroll_state() : null, [], url.hash);
				event.preventDefault();
			}
		});

		addEventListener('popstate', (event) => {
			if (event.state && this.enabled) {
				const url = new URL(location.href);
				const info = this.parse(url);
				if (info) {
					this._navigate(info, event.state['sveltekit:scroll'], []);
				} else {
					// eslint-disable-next-line
					location.href = location.href; // nosonar
				}
			}
		});

		// make it possible to reset focus
		document.body.setAttribute('tabindex', '-1');

		// create initial history entry, so we can return here
		history.replaceState(history.state || {}, '', location.href);
	}

	/**
	 * @param {URL} url
	 * @returns {import('./types').NavigationInfo}
	 */
	parse(url) {
		if (url.origin !== location.origin) return null;
		if (!url.pathname.startsWith(this.base)) return null;

		const path = url.pathname.slice(this.base.length) || '/';

		const routes = this.routes.filter(([pattern]) => pattern.test(path));

		if (routes.length > 0) {
			const query = new URLSearchParams(url.search);
			const id = `${path}?${query}`;

			return { id, routes, path, query };
		}
	}

	/**
	 * @param {string} href
	 * @param {{ noscroll?: boolean, replaceState?: boolean }} opts
	 * @param {string[]} chain
	 */
	async goto(href, { noscroll = false, replaceState = false } = {}, chain) {
		if (this.enabled) {
			const url = new URL(href, get_base_uri(document));
			const info = this.parse(url);

			if (info) {
				// TODO shouldn't need to pass the hash here
				history[replaceState ? 'replaceState' : 'pushState']({}, '', href);
				return this._navigate(info, noscroll ? scroll_state() : null, chain, url.hash);
			}
		}

		location.href = href;
		return new Promise(() => {
			/* never resolves */
		});
	}

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	/**
	 * @param {URL} url
	 * @returns {Promise<import('./types').NavigationResult>}
	 */
	async prefetch(url) {
		const info = this.parse(url);

		if (info) {
			return this.renderer.load(info);
		} else {
			throw new Error(`Could not prefetch ${url.href}`);
		}
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @param {{ x: number, y: number }} scroll
	 * @param {string[]} chain
	 * @param {string} [hash]
	 */
	async _navigate(info, scroll, chain, hash) {
		this.renderer.notify({
			path: info.path,
			query: info.query
		});

		// remove trailing slashes
		if (location.pathname.endsWith('/') && location.pathname !== '/') {
			history.replaceState({}, '', `${location.pathname.slice(0, -1)}${location.search}`);
		}

		await this.renderer.update(info, chain);

		document.body.focus();

		const deep_linked = hash && document.getElementById(hash.slice(1));
		if (scroll) {
			scrollTo(scroll.x, scroll.y);
		} else if (deep_linked) {
			// scroll is an element id (from a hash), we need to compute y
			scrollTo(0, deep_linked.getBoundingClientRect().top + scrollY);
		} else {
			scrollTo(0, 0);
		}
	}
}

/**
 * @param {import('../../types.internal').LoadOutput} loaded
 * @returns {import('../../types.internal').LoadOutput}
 */
function normalize(loaded) {
	// TODO should this behaviour be dev-only?

	if (loaded.error) {
		const error = typeof loaded.error === 'string' ? new Error(loaded.error) : loaded.error;
		const status = loaded.status;

		if (!(error instanceof Error)) {
			return {
				status: 500,
				error: new Error(
					`"error" property returned from load() must be a string or instance of Error, received type "${typeof error}"`
				)
			};
		}

		if (!status || status < 400 || status > 599) {
			console.warn('"error" returned from load() without a valid status code — defaulting to 500');
			return { status: 500, error };
		}

		return { status, error };
	}

	if (loaded.redirect) {
		if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
			return {
				status: 500,
				error: new Error(
					'"redirect" property returned from load() must be accompanied by a 3xx status code'
				)
			};
		}

		if (typeof loaded.redirect !== 'string') {
			return {
				status: 500,
				error: new Error('"redirect" property returned from load() must be a string')
			};
		}
	}

	return loaded;
}

/** @param {any} value */
function page_store(value) {
	const store = writable(value);
	let ready = true;

	function notify() {
		ready = true;
		store.update((val) => val);
	}

	/** @param {any} new_value */
	function set(new_value) {
		ready = false;
		store.set(new_value);
	}

	/** @param {(value: any) => void} run */
	function subscribe(run) {
		/** @type {any} */
		let old_value;
		return store.subscribe((new_value) => {
			if (old_value === undefined || (ready && new_value !== old_value)) {
				run((old_value = new_value));
			}
		});
	}

	return { notify, set, subscribe };
}

/**
 * @param {RequestInfo} resource
 * @param {RequestInit} opts
 */
function initial_fetch(resource, opts) {
	const url = typeof resource === 'string' ? resource : resource.url;
	const script = document.querySelector(`script[type="svelte-data"][url="${url}"]`);
	if (script) {
		const { body, ...init } = JSON.parse(script.textContent);
		return Promise.resolve(new Response(body, init));
	}

	return fetch(resource, opts);
}

class Renderer {
	/** @param {{
	 *   Root: import('types.internal').CSRComponent;
	 *   layout: import('types.internal').CSRComponent;
	 *   target: Node;
	 *   session: any;
	 *   host: string;
	 * }} opts */
	constructor({ Root, layout, target, session, host }) {
		this.Root = Root;
		this.layout = layout;
		this.host = host;

		/** @type {import('./router').Router} */
		this.router = null;

		this.target = target;

		this.started = false;

		/** @type {import('./types').NavigationState} */
		this.current = {
			page: null,
			query: null,
			session_changed: false,
			nodes: [],
			contexts: []
		};

		this.caches = new Map();

		this.loading = {
			id: null,
			promise: null
		};

		this.stores = {
			page: page_store({}),
			navigating: writable(null),
			session: writable(session)
		};

		this.$session = null;

		this.root = null;

		let ready = false;
		this.stores.session.subscribe(async (value) => {
			this.$session = value;

			if (!ready) return;
			this.current.session_changed = true;

			const info = this.router.parse(new URL(location.href));
			this.update(info, []);
		});
		ready = true;
	}

	/**
	 * @param {import('./types').NavigationCandidate} selected
	 */
	async start(selected) {
		const result = await this._load(selected);

		if (result.redirect) {
			// this is a real edge case — `load` would need to return
			// a redirect but only in the browser
			location.href = new URL(result.redirect, location.href).href;
			return;
		}

		this._init(result);
	}

	/** @param {{ path: string, query: URLSearchParams }} destination */
	notify({ path, query }) {
		dispatchEvent(new CustomEvent('sveltekit:navigation-start'));

		if (this.started) {
			this.stores.navigating.set({
				from: {
					path: this.current.page.path,
					query: this.current.page.query
				},
				to: {
					path,
					query
				}
			});
		}
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @param {string[]} chain
	 */
	async update(info, chain) {
		const token = (this.token = {});
		const navigation_result = await this._get_navigation_result(info);

		// abort if user navigated during update
		if (token !== this.token) return;

		if (navigation_result.reload) {
			location.reload();
		} else if (navigation_result.redirect) {
			if (chain.length > 10 || chain.includes(info.path)) {
				this.root.$set({
					status: 500,
					error: new Error('Redirect loop')
				});
			} else {
				if (this.router) {
					this.router.goto(navigation_result.redirect, { replaceState: true }, [
						...chain,
						info.path
					]);
				} else {
					location.href = new URL(navigation_result.redirect, location.href).href;
				}

				return;
			}
		} else if (this.started) {
			this.current = navigation_result.state;

			this.root.$set(navigation_result.props);
			this.stores.navigating.set(null);

			await 0;
		} else {
			this._init(navigation_result);
		}

		dispatchEvent(new CustomEvent('sveltekit:navigation-end'));
		this.loading.promise = null;
		this.loading.id = null;

		const leaf_node = navigation_result.state.nodes[navigation_result.state.nodes.length - 1];
		if (leaf_node.module.router === false) {
			this.router.disable();
		} else {
			this.router.enable();
		}
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @returns {Promise<import('./types').NavigationResult>}
	 */
	load(info) {
		this.loading.promise = this._get_navigation_result(info);
		this.loading.id = info.id;

		return this.loading.promise;
	}

	/**
	 * @param {import('./types').NavigationInfo} info
	 * @returns {Promise<import('./types').NavigationResult>}
	 */
	async _get_navigation_result(info) {
		if (this.loading.id === info.id) {
			return this.loading.promise;
		}

		for (let i = 0; i < info.routes.length; i += 1) {
			const route = info.routes[i];
			const [pattern, parts, params] = route;

			if (route.length === 1) {
				return { reload: true };
			}

			// load code for subsequent routes immediately, if they are as
			// likely to match the current path/query as the current one
			let j = i + 1;
			while (j < info.routes.length) {
				const next = info.routes[j];
				if (next[0].toString() === pattern.toString()) {
					if (next.length !== 1) next[1].forEach((loader) => loader());
					j += 1;
				} else {
					break;
				}
			}

			const nodes = parts.map((loader) => loader());
			const page = {
				host: this.host,
				path: info.path,
				params: params ? params(route[0].exec(info.path)) : {},
				query: info.query
			};

			const result = await this._load({ status: 200, error: null, nodes, page });
			if (result) return result;
		}

		return await this._load({
			status: 404,
			error: new Error(`Not found: ${info.path}`),
			nodes: [],
			page: {
				host: this.host,
				path: info.path,
				query: info.query,
				params: {}
			}
		});
	}

	/** @param {import('./types').NavigationResult} result */
	_init(result) {
		this.current = result.state;

		const style = document.querySelector('style[data-svelte]');
		if (style) style.remove();

		this.root = new this.Root({
			target: this.target,
			props: {
				stores: this.stores,
				...result.props
			},
			hydrate: true
		});

		this.started = true;
	}

	/**
	 * @param {import('./types').NavigationCandidate} selected
	 * @returns {Promise<import('./types').NavigationResult>}
	 */
	async _load({ status, error, nodes, page }) {
		const query = page.query.toString();

		/** @type {import('./types').NavigationResult} */
		const result = {
			state: {
				page,
				query,
				session_changed: false,
				nodes: [],
				contexts: []
			},
			props: {
				status,
				error,

				/** @type {import('types.internal').CSRComponent[]} */
				components: []
			}
		};

		const changed = {
			path: !this.current.page || page.path !== this.current.page.path,
			params: Object.keys(page.params).filter((key) => {
				return !this.current.page || this.current.page.params[key] !== page.params[key];
			}),
			query: query !== this.current.query,
			session: this.current.session_changed,
			context: false
		};

		try {
			const component_promises = [this.layout, ...nodes];
			const props_promises = [];

			/** @type {Record<string, any>} */
			let context;

			for (let i = 0; i < component_promises.length; i += 1) {
				const previous = this.current.nodes[i];
				const previous_context = this.current.contexts[i];

				const module = await component_promises[i];
				result.props.components[i] = module.default;

				if (module.preload) {
					throw new Error(
						'preload has been deprecated in favour of load. Please consult the documentation: https://kit.svelte.dev/docs#loading'
					);
				}

				const changed_since_last_render =
					!previous ||
					module !== previous.module ||
					(changed.path && previous.uses.path) ||
					changed.params.some((param) => previous.uses.params.has(param)) ||
					(changed.query && previous.uses.query) ||
					(changed.session && previous.uses.session) ||
					(changed.context && previous.uses.context);

				if (changed_since_last_render) {
					const hash = page.path + query;

					// see if we have some cached data
					const cache = this.caches.get(module);
					const cached = cache && cache.get(hash);

					/** @type {import('./types').PageNode} */
					let node;

					/** @type {import('types.internal').LoadOutput} */
					let loaded;

					if (cached && (!changed.context || !cached.node.uses.context)) {
						({ node, loaded } = cached);
					} else {
						node = {
							module,
							uses: {
								params: new Set(),
								path: false,
								query: false,
								session: false,
								context: false
							}
						};

						const params = {};
						for (const key in page.params) {
							Object.defineProperty(params, key, {
								get() {
									node.uses.params.add(key);
									return page.params[key];
								},
								enumerable: true
							});
						}

						const session = this.$session;

						if (module.load) {
							loaded = await module.load.call(null, {
								page: {
									host: page.host,
									params,
									get path() {
										node.uses.path = true;
										return page.path;
									},
									get query() {
										node.uses.query = true;
										return page.query;
									}
								},
								get session() {
									node.uses.session = true;
									return session;
								},
								get context() {
									node.uses.context = true;
									return { ...context };
								},
								fetch: this.started ? fetch : initial_fetch
							});

							// if the page component returns nothing from load, fall through
							const is_leaf = i === component_promises.length - 1 && !error;
							if (!loaded && is_leaf) return;
						}
					}

					if (loaded) {
						loaded = normalize(loaded);

						if (loaded.error) {
							if (error) {
								// error while rendering error page, oops
								throw error;
							}

							return await this._load({
								status: loaded.status || 500,
								error: loaded.error,
								nodes: [],
								page: {
									host: page.host,
									path: page.path,
									query: page.query,
									params: {}
								}
							});
						}

						if (loaded.redirect) {
							return {
								redirect: loaded.redirect
							};
						}

						if (loaded.context) {
							changed.context = true;

							context = {
								...context,
								...loaded.context
							};
						}

						if (loaded.maxage) {
							if (!this.caches.has(module)) {
								this.caches.set(module, new Map());
							}

							const cache = this.caches.get(module);
							const cached = { node, loaded };

							cache.set(hash, cached);

							let ready = false;

							const timeout = setTimeout(() => {
								clear();
							}, loaded.maxage * 1000);

							const clear = () => {
								if (cache.get(hash) === cached) {
									cache.delete(hash);
								}

								unsubscribe();
								clearTimeout(timeout);
							};

							const unsubscribe = this.stores.session.subscribe(() => {
								if (ready) clear();
							});

							ready = true;
						}

						props_promises[i] = loaded.props;
					}

					result.state.nodes[i] = node;
					result.state.contexts[i] = context;
				} else {
					result.state.nodes[i] = previous;
					result.state.contexts[i] = context = previous_context;
				}
			}

			// we allow returned `props` to be a Promise so that
			// layout/page loads can happen in parallel
			(await Promise.all(props_promises)).forEach((p, i) => {
				if (p) {
					result.props[`props_${i}`] = p;
				}
			});

			if (!this.current.page || page.path !== this.current.page.path || changed.query) {
				result.props.page = page;
			}

			return result;
		} catch (e) {
			if (error) {
				throw error;
			}

			return await this._load({
				status: 500,
				error: e,
				nodes: [],
				page: {
					host: page.host,
					path: page.path,
					query: page.query,
					params: {}
				}
			});
		}
	}
}

// @ts-ignore

/** @param {{
 *   paths: {
 *     assets: string;
 *     base: string;
 *   },
 *   target: Node;
 *   session: any;
 *   error: Error;
 *   status: number;
 *   host: string;
 *   route: boolean;
 *   hydrate: import('./types').NavigationCandidate;
 * }} opts */
async function start({ paths, target, session, host, route, hydrate }) {
	const router =
		route &&
		new Router({
			base: paths.base,
			routes
		});

	const renderer = new Renderer({
		Root,
		layout,
		target,
		session,
		host
	});

	init(router);
	set_paths(paths);

	if (hydrate) await renderer.start(hydrate);
	if (route) router.init(renderer);

	dispatchEvent(new CustomEvent('sveltekit:start'));
}

if (import.meta.env.VITE_SVELTEKIT_SERVICE_WORKER) {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register(import.meta.env.VITE_SVELTEKIT_SERVICE_WORKER);
	}
}

export { start };
