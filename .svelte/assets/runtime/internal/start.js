import Root from '../../generated/root.svelte';
import { layout, pages, ignore } from '../../generated/manifest.js';
import { writable } from 'svelte/store';
import { init } from './singletons.js';

function find_anchor(node) {
	while (node && node.nodeName.toUpperCase() !== 'A') node = node.parentNode; // SVG <a> elements have a lowercase name
	return node;
}

function which(event) {
	return event.which === null ? event.button : event.which;
}

function scroll_state() {
	return {
		x: pageXOffset,
		y: pageYOffset
	};
}

class Router {
	constructor({ base, pages, ignore }) {
		this.base = base;
		this.pages = pages;
		this.ignore = ignore;

		this.uid = 1;
		this.cid = null;
		this.scroll_history = {};

		this.history = window.history || {
			pushState: () => {},
			replaceState: () => {},
			scrollRestoration: 'auto'
		};
	}

	init({ renderer }) {
		this.renderer = renderer;
		renderer.router = this;

		if ('scrollRestoration' in this.history) {
			this.history.scrollRestoration = 'manual';
		}

		// Adopted from Nuxt.js
		// Reset scrollRestoration to auto when leaving page, allowing page reload
		// and back-navigation from other pages to use the browser to restore the
		// scrolling position.
		addEventListener('beforeunload', () => {
			this.history.scrollRestoration = 'auto';
		});

		// Setting scrollRestoration to manual again when returning to this page.
		addEventListener('load', () => {
			this.history.scrollRestoration = 'manual';
		});

		addEventListener('click', event => {
			// Adapted from https://github.com/visionmedia/page.js
			// MIT license https://github.com/visionmedia/page.js#license
			if (which(event) !== 1) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			if (event.defaultPrevented) return;

			const a = find_anchor(event.target);
			if (!a) return;

			if (!a.href) return;

			// check if link is inside an svg
			// in this case, both href and target are always inside an object
			const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
			const href = String(svg ? a.href.baseVal : a.href);

			if (href === location.href) {
				if (!location.hash) event.preventDefault();
				return;
			}

			// Ignore if tag has
			// 1. 'download' attribute
			// 2. rel='external' attribute
			if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;

			// Ignore if <a> has a target
			if (svg ? (a).target.baseVal : a.target) return;

			const url = new URL(href);

			// Don't handle hash changes
			if (url.pathname === location.pathname && url.search === location.search) return;

			const page = this.select(url);
			if (page) {
				const noscroll = a.hasAttribute('sapper:noscroll');
				this.navigate(page, null, noscroll, url.hash);
				event.preventDefault();
				this.history.pushState({ id: this.cid }, '', url.href);
			}
		});

		addEventListener('popstate', event => {
			this.scroll_history[this.cid] = scroll_state();

			if (event.state) {
				const url = new URL(location.href);
				const page = this.select(url);
				if (page) {
					this.navigate(page, event.state.id);
				} else {
					// eslint-disable-next-line
					location.href = location.href; // nosonar
				}
			} else {
				// hashchange
				this.uid += 1;
				this.cid = this.uid;
				this.history.replaceState({ id: this.cid }, '', location.href);
			}
		});

		// load current page
		this.history.replaceState({ id: this.uid }, '', location.href);
		this.scroll_history[this.uid] = scroll_state();

		const page = this.select(new URL(location.href));
		// if (page) return this.navigate(page, this.uid, true, hash);
		if (page) return this.renderer.start(page);
	}

	select(url) {
		if (url.origin !== location.origin) return null;
		if (!url.pathname.startsWith(this.base)) return null;

		let path = url.pathname.slice(this.base.length);

		if (path === '') {
			path = '/';
		}

		// avoid accidental clashes between server routes and page routes
		if (this.ignore.some(pattern => pattern.test(path))) return;

		for (const route of this.pages) {
			const match = route.pattern.exec(path);

			if (match) {
				const query = new URLSearchParams(url.search);
				const part = route.parts[route.parts.length - 1];
				const params = part.params ? part.params(match) : {};

				const page = { host: location.host, path, query, params };

				return { href: url.href, route, match, page };
			}
		}
	}

	async navigate(
		page,
		id,
		noscroll,
		hash
	) {
		const popstate = !!id;
		if (popstate) {
			this.cid = id;
		} else {
			const current_scroll = scroll_state();

			// clicked on a link. preserve scroll state
			this.scroll_history[this.cid] = current_scroll;

			this.cid = id = ++this.uid;
			this.scroll_history[this.cid] = noscroll ? current_scroll : { x: 0, y: 0 };
		}

		await this.renderer.render(page);

		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}

		if (!noscroll) {
			let scroll = this.scroll_history[id];

			let deep_linked;
			if (hash) {
				// scroll is an element id (from a hash), we need to compute y.
				deep_linked = document.getElementById(hash.slice(1));

				if (deep_linked) {
					scroll = {
						x: 0,
						y: deep_linked.getBoundingClientRect().top + scrollY
					};
				}
			}

			this.scroll_history[this.cid] = scroll;
			if (popstate || deep_linked) {
				scrollTo(scroll.x, scroll.y);
			} else {
				scrollTo(0, 0);
			}
		}
	}
}

function page_store(value) {
	const store = writable(value);
	let ready = true;

	function notify() {
		ready = true;
		store.update((val) => val);
	}

	function set(new_value) {
		ready = false;
		store.set(new_value);
	}

	function subscribe(run) {
		let old_value;
		return store.subscribe((new_value) => {
			if (old_value === undefined || (ready && new_value !== old_value)) {
				run((old_value = new_value));
			}
		});
	}

	return { notify, set, subscribe };
}

class Renderer {
	constructor({
		Root,
		layout,
		target,
		error,
		status,
		preloaded,
		session
	}) {
		this.Root = Root;
		this.layout = layout;
		this.layout_loader = () => layout;

		// TODO ideally we wouldn't need to store these...
		this.target = target;

		this.initial = {
			preloaded,
			error,
			status
		};

		this.current_branch = [];

		this.prefetching = {
			href: null,
			promise: null
		};

		this.stores = {
			page: page_store({}),
			navigating: writable(false),
			session: writable(session)
		};

		this.$session = null;
		this.session_dirty = false;

		this.root = null;

		const trigger_prefetch = (event) => {
			const a = find_anchor(event.target);

			if (a && a.rel === 'prefetch') { // TODO make this svelte-prefetch or something
				this.prefetch(new URL(a.href));
			}
		};

		let mousemove_timeout;
		const handle_mousemove = (event) => {
			clearTimeout(mousemove_timeout);
			mousemove_timeout = setTimeout(() => {
				trigger_prefetch(event);
			}, 20);
		};

		addEventListener('touchstart', trigger_prefetch);
		addEventListener('mousemove', handle_mousemove);

		let ready = false;
		this.stores.session.subscribe(async (value) => {
			this.$session = value;

			if (!ready) return;
			this.session_dirty = true;

			const page = this.router.select(new URL(location.href));
			this.render(page);
		});
		ready = true;
	}

	async start(page) {
		const props = {
			stores: this.stores,
			error: this.initial.error,
			status: this.initial.status,
			page: {
				...page.page,
				params: {}
			}
		};

		if (this.initial.error) {
			props.components = [this.layout.default];
		} else {
			const hydrated = await this.hydrate(page);

			if (hydrated.redirect) {
				throw new Error('TODO client-side redirects');
			}

			Object.assign(props, hydrated.props);
			this.current_branch = hydrated.branch;
			this.current_query = hydrated.query;
			this.current_path = hydrated.path;
		}

		this.root = new this.Root({
			target: this.target,
			props,
			hydrate: true
		});

		this.initial = null;
	}

	async render(page) {
		const token = this.token = {};

		this.stores.navigating.set(true);

		const hydrated = await this.hydrate(page);

		if (this.token === token) { // check render wasn't aborted
			this.current_branch = hydrated.branch;
			this.current_query = hydrated.query;
			this.current_path = hydrated.path;

			this.root.$set(hydrated.props);

			this.stores.navigating.set(false);
		}
	}

	async hydrate({ route, page }) {
		let redirect = null;

		const props = {
			error: null,
			status: 200,
			components: []
		};

		const preload_context = {
			fetch: (url, opts) => fetch(url, opts),
			redirect: (status, location) => {
				if (redirect && (redirect.status !== status || redirect.location !== location)) {
					throw new Error('Conflicting redirects');
				}
				redirect = { status, location };
			},
			error: (status, error) => {
				props.error = typeof error === 'string' ? new Error(error) : error;
				props.status = status;
			}
		};

		const query = page.query.toString();
		const query_dirty = query !== this.current_query;

		let branch;

		try {
			const match = route.pattern.exec(page.path);

			branch = await Promise.all(
				[[this.layout_loader], ...route.parts].map(async ([loader, get_params], i) => {
					const params = get_params ? get_params(match) : {};
					const stringified_params = JSON.stringify(params);

					const previous = this.current_branch[i];
					if (previous) {
						const changed = (
							(previous.loader !== loader) ||
							(previous.uses_session && this.session_dirty) ||
							(previous.uses_query && query_dirty) ||
							(previous.stringified_params !== stringified_params)
						);

						if (!changed) {
							props.components[i] = previous.component;
							return previous;
						}
					}

					const { default: component, preload } = await loader();

					const uses_session = preload && preload.length > 1;
					let uses_query = false;

					const preloaded = this.initial?.preloaded[i] || (
						preload
							? await preload.call(
								preload_context,
								{
									get query() {
										uses_query = true;
										return page.query;
									},
									host: page.host,
									path: page.path,
									params
								},
								this.$session
							)
							: {}
					);

					// TODO weird to have side-effects inside a map, but
					// if they're not here, then setting props_n objects
					// only for changed parts becomes trickier
					props.components[i] = component;
					props[`props_${i}`] = preloaded;

					return {
						component,
						params,
						stringified_params,
						props: preloaded,
						match,
						loader,
						uses_session,
						uses_query
					};
				})
			);

			if (page.path !== this.current_path) {
				props.page = {
					...page,
					params: branch[branch.length - 1].params
				};
			}
		} catch (error) {
			props.error = error;
			props.status = 500;
			branch = [];
		}

		return { redirect, props, branch, query, path: page.path };
	}

	async prefetch(url) {
		const page = this.router.select(url);

		if (page) {
			if (url.href !== this.prefetching.href) {
				this.prefetching = { href: url.href, promise: this.hydrate(page) };
			}

			return this.prefetching.promise;
		} else {
			throw new Error(`Could not prefetch ${url.href}`);
		}
	}
}

async function start({
	base,
	target,
	session,
	preloaded,
	error,
	status
}) {
	const router = new Router({
		base,
		pages,
		ignore
	});

	const renderer = new Renderer({
		Root,
		layout,
		target,
		preloaded,
		error,
		status,
		session
	});

	init({ router, renderer });

	await router.init({ renderer });
}

export { start };
//# sourceMappingURL=start.js.map
