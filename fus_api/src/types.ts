// Additional type declarations for the worker environment

declare global {
	namespace Cloudflare {
		interface Env {
			ASSETS: {
				fetch(request: Request): Promise<Response>;
			};
		}
	}
}

export {};