import { Router } from 'itty-router';
import { ANUGenerator } from './qrng';
import { CURByGenerator } from './curby';

export interface Env {
	QUANTUM_NUMBERS_API_KEY: string;
	batchQRandmoness: KVNamespace;
}

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
		const qrng = new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY);
		const curby = new CURByGenerator();
		router.options('*', handleOptions);
		router.get('/updateKV', (request) => handleCombinedRandRequest(request, env));
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

//? fetch and store randomness for kv store
async function handleRandRequest(generator: ANUGenerator | CURByGenerator, request: Request, env: Env): Promise<Response> {
	// Generate randomness using generator module making call to API, return string of data array
	const genRand = await generator.generate();

	//? Write to KV store key "qRandomness"
	await env.batchQRandmoness.put('qRandomness', genRand);
	const responseHeaders = new Headers();
	responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
	responseHeaders.set('Content-Type', 'text/plain');

	return new Response(`${genRand}`, {
		headers: responseHeaders,
		status: 200,
	});
}

async function handleCombinedRandRequest(request: Request, env: Env): Promise<Response> {
	const generators = [
		{ name: 'ANU', generator: new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY) },
		{ name: 'CURBy', generator: new CURByGenerator() }
	];

	const results: string[] = [];
	const errors: string[] = [];

	// Try all generators in parallel
	const promises = generators.map(async ({ name, generator }) => {
		try {
			const randomness = await generator.generate();
			return { success: true as const, name, data: randomness };
		} catch (error) {
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

	// Must have at least one successful source
	if (results.length === 0) {
		return new Response(`All sources failed: ${errors.join(', ')}`, {
			status: 500,
		});
	}

	// Combine all successful sources
	const combined = combineRandomnessSources(results);

	// Write to KV store
	await env.batchQRandmoness.put('qRandomness', combined);
	const responseHeaders = new Headers();
	responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
	responseHeaders.set('Content-Type', 'text/plain');

	return new Response(`${combined}`, {
		headers: responseHeaders,
		status: 200,
	});
}

function combineRandomnessSources(sources: string[]): string {
	if (sources.length === 1) {
		return sources[0];
	}

	// XOR all sources together byte by byte
	const maxLength = Math.max(...sources.map(s => s.length));
	let combined = '';
	
	for (let i = 0; i < maxLength; i += 2) {
		let xorByte = 0;
		
		for (const source of sources) {
			const byte = parseInt(source.substring(i, i + 2) || '00', 16);
			xorByte ^= byte;
		}
		
		combined += xorByte.toString(16).padStart(2, '0');
	}
	
	return combined;
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
