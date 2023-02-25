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
  ...files  // everything in `static`
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
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }
 
  event.waitUntil(deleteOldCaches());
});
 
self.addEventListener('fetch', (event) => {
  // ignore POST requests etc
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!ASSETS.includes(url.pathname)) {
    return;
  }
 
  async function respond(): Promise<Response> {
    const cache = await caches.open(CACHE);
    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      return (await cache.match(event.request))!;
    }
    return await fetch(event.request);
  }
 
  event.respondWith(respond());
});
