import { Router } from 'itty-router';
import { ANUGenerator } from './qrng';
import { CURByGenerator } from './curby';
import { INMETROGenerator } from './inmetro';
import { LfDGenerator } from './lfd';
import { NISTGenerator } from './nist';
import { RandomOrgGenerator } from './randomorg';
import { CloudflareGenerator } from './cloudflare';

export interface Env {
	QUANTUM_NUMBERS_API_KEY: string;
	UPDATE_KV_SECRET: string;
	batchQRandmoness: KVNamespace;
}

interface GeneratorStatus {
	name: string;
	success: boolean;
	timestamp: string;
	duration: string;
	dataLength?: number;
	error?: string;
}

const QUANTUM_GENERATORS = [
	{ name: 'ANU', generator: (env: Env) => new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY) },
	{ name: 'CURBy', generator: (_env: Env) => new CURByGenerator() },
	{ name: 'INMETRO', generator: (_env: Env) => new INMETROGenerator() },
	{ name: 'LfD', generator: (_env: Env) => new LfDGenerator() },
	{ name: 'NIST', generator: (_env: Env) => new NISTGenerator() },
	{ name: 'Random.org', generator: (_env: Env) => new RandomOrgGenerator() },
	{ name: 'Cloudflare', generator: (_env: Env) => new CloudflareGenerator() }
];

const allowedOrigin = '*';

const corsHeaders = {
	'Access-Control-Allow-Origin': allowedOrigin,
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
};

const defaultOutcomes = `
It is certain.
It is decidedly so.
Without a doubt.
Yes definitely.
You may rely on it.

As I see it, yes.
Most likely.
Outlook good.
Yes.
Signs point to yes.

Reply hazy, try again.
Ask again later.
Better not tell you now.
Cannot predict now.
Concentrate and ask again.
Don't count on it.

My reply is no.
My sources say no.
Outlook not so good.
Very doubtful.
`
	.split('\n')
	.map((s) => s.trim())
	.filter((s) => s.length > 0);

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const router = Router();
		router.options('*', handleOptions);
		router.get('/updateKV', (request) => handleUpdateKV(request, env));
		router.get('/test', (request) => handleTestGenerators(request, env));
		router.get('/status', () => handleGetStatus(env));
		router.get('/', (request) => handleGetRequest(request, env));
		router.get('/rndnum', () => handleGetRandNum(env));
		return router.handle(request);
	},

	async scheduled(request: Request, env: Env, ctx: ExecutionContext) {
		ctx.waitUntil(handleCombinedRandRequest(request, env));
	},
};

async function handleGetRandom(env: Env): Promise<number> {
	const genRand = await env.batchQRandmoness.get('qRandomness');
	if (genRand === null) {
		throw new Error('No randomness available - call /updateKV first');
	}

	const IBMQ_RAND = `3152447550`;
	const RANDOMNESS = genRand + ':' + IBMQ_RAND;

	const R = cyrb53(RANDOMNESS, Math.random() * 2_147_483_647);
	return R;
}

async function handleUpdateKV(request: Request, env: Env): Promise<Response> {
	// Check for secret parameter
	const url = new URL(request.url);
	const providedSecret = url.searchParams.get('secret');

	if (!providedSecret || providedSecret !== env.UPDATE_KV_SECRET) {
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'Access-Control-Allow-Origin': allowedOrigin,
				'Content-Type': 'text/plain'
			}
		});
	}

	return handleCombinedRandRequest(request, env);
}

async function handleCombinedRandRequest(request: Request, env: Env): Promise<Response> {
	const generators = QUANTUM_GENERATORS;
	const timestamp = new Date().toISOString();

	const results: string[] = [];
	const errors: string[] = [];
	const statusReport: GeneratorStatus[] = [];

	// Try all generators in parallel
	const promises = generators.map(async ({ name, generator }) => {
		const startTime = Date.now();
		try {
			const randomness = await generator(env).generate();
			const duration = Date.now() - startTime;
			const status = {
				name,
				success: true,
				timestamp,
				duration: `${duration}ms`,
				dataLength: randomness.length
			};
			statusReport.push(status);
			return { success: true as const, name, data: randomness };
		} catch (error) {
			const duration = Date.now() - startTime;
			const status = {
				name,
				success: false,
				timestamp,
				duration: `${duration}ms`,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
			statusReport.push(status);
			return { success: false as const, name, error: error instanceof Error ? error.message : 'Unknown error' };
		}
	});

	const outcomes = await Promise.all(promises);

	// Collect results and errors
	for (const outcome of outcomes) {
		if (outcome.success) {
			results.push(outcome.data);
		} else {
			errors.push(`${outcome.name}: ${outcome.error}`);
		}
	}

	// Save status report to KV
	await env.batchQRandmoness.put('generatorStatus', JSON.stringify(statusReport));

	// Must have at least one successful source
	if (results.length === 0) {
		return new Response(`All sources failed: ${errors.join(', ')}`, {
			status: 500,
		});
	}

	// Combine all successful sources
	const combined = await combineRandomnessSources(results);

	// Write combined randomness to KV store
	await env.batchQRandmoness.put('qRandomness', combined);
	const responseHeaders = new Headers();
	responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
	responseHeaders.set('Content-Type', 'text/plain');

	return new Response(`${combined}`, {
		headers: responseHeaders,
		status: 200,
	});
}

async function handleTestGenerators(request: Request, env: Env): Promise<Response> {
	const generators = QUANTUM_GENERATORS;

	// Try all generators in parallel
	const promises = generators.map(async ({ name, generator }) => {
		const startTime = Date.now();
		try {
			const randomness = await generator(env).generate();
			const duration = Date.now() - startTime;
			return {
				name,
				success: true,
				data: randomness.substring(0, 32) + '...', // Show first 32 chars
				length: randomness.length,
				duration: `${duration}ms`
			};
		} catch (error) {
			const duration = Date.now() - startTime;
			return {
				name,
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				duration: `${duration}ms`
			};
		}
	});

	const outcomes = await Promise.all(promises);

	const responseHeaders = new Headers();
	responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
	responseHeaders.set('Content-Type', 'application/json');

	return new Response(JSON.stringify(outcomes, null, 2), {
		headers: responseHeaders,
		status: 200,
	});
}

async function handleGetStatus(env: Env): Promise<Response> {
	try {
		const status = await env.batchQRandmoness.get('generatorStatus');

		const responseHeaders = new Headers();
		responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
		responseHeaders.set('Content-Type', 'application/json');

		if (!status) {
			return new Response(JSON.stringify({ error: 'No status data available - run /updateKV first' }, null, 2), {
				headers: responseHeaders,
				status: 404,
			});
		}

		const statusData = JSON.parse(status);
		return new Response(JSON.stringify(statusData, null, 2), {
			headers: responseHeaders,
			status: 200,
		});
	} catch (error) {
		const responseHeaders = new Headers();
		responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
		responseHeaders.set('Content-Type', 'application/json');

		return new Response(JSON.stringify({ error: `Status error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2), {
			headers: responseHeaders,
			status: 500,
		});
	}
}

async function combineRandomnessSources(sources: string[]): Promise<string> {
	if (sources.length === 0) {
		throw new Error('No sources to combine');
	}

	if (sources.length === 1) {
		return sources[0];
	}

	// Validate all sources are valid hex strings
	for (const source of sources) {
		if (!/^[0-9a-fA-F]*$/.test(source) || source.length % 2 !== 0) {
			throw new Error(`Invalid hex string: ${source.substring(0, 20)}...`);
		}
	}

	// Concatenate all sources with separators for domain separation
	const combinedInput = sources.join('|');

	// Add timestamp and source count for additional entropy
	const timestamp = Date.now().toString(16);
	const finalInput = `${combinedInput}|${timestamp}|${sources.length}`;

	// Convert to Uint8Array for Web Crypto API
	const encoder = new TextEncoder();
	const data = encoder.encode(finalInput);

	// Use SHA-256 to combine securely
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = new Uint8Array(hashBuffer);

	// Convert to hex string
	return Array.from(hashArray)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}

// adapted from: https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
const cyrb53 = function (str: string, seed = 0): number {
	let h1 = 0x8b33a5130 ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

async function handleGetRandNum(env: Env): Promise<Response> {
	try {
		const R = await handleGetRandom(env);

		const responseHeaders = new Headers();
		responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
		responseHeaders.set('Content-Type', 'text/plain');

		return new Response(`${R}`, {
			headers: responseHeaders,
			status: 200,
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 404,
		});
	}
}

async function handleGetRequest(request: Request, env: Env): Promise<Response> {
	const { searchParams } = new URL(request.url);
	let outcomes = searchParams.getAll('outcome');
	const max = Number(searchParams.get('max'));
	if (max > 0) {
		for (let i = 1; i <= max; i++) {
			outcomes.push(i.toString());
		}
	}
	if (outcomes.length === 0) {
		outcomes = defaultOutcomes;
	}

	try {
		const R = await handleGetRandom(env);

		const selectedOutcome = outcomes[R % outcomes.length];
		const responseHeaders = new Headers();
		responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
		responseHeaders.set('Content-Type', 'text/plain');
		return new Response(`${selectedOutcome}`, {
			headers: responseHeaders,
			status: 200,
			statusText: selectedOutcome,
		});
	} catch (error) {
		return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
			status: 404,
		});
	}
}

function handleOptions(): Response {
	const respHeaders = {
		...corsHeaders,
	};
	return new Response(null, {
		headers: respHeaders,
	});
}
