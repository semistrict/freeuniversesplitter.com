/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Locals {}

	interface Platform {
		env: {
			COUNTER: DurableObjectNamespace;
		};
		context: {
			waitUntil(promise: Promise<unknown>): void;
		};
		caches: CacheStorage & { default: Cache };
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Session {}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Stuff {}
}
