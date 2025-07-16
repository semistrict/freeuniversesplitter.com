/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		const deletes = [];
		for (const key of await caches.keys()) {
			if (key !== CACHE) {
				deletes.unshift(caches.delete(key));
			}
		}
		await Promise.all(deletes);
	}
	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	async function respond(): Promise<Response> {
		const cache = await caches.open(CACHE);
		if (ASSETS.includes(url.pathname)) {
			const cachedResponse = await cache.match(event.request);
			return cachedResponse || new Response('Not Found', { status: 404 });
		}

		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			const cachedResponse = await cache.match(event.request);
			return cachedResponse || new Response('Service Unavailable', { status: 503 });
		}
	}

	event.respondWith(respond());
});
