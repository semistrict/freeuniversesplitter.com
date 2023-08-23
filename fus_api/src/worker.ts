import { Router, IRequest } from 'itty-router';
import { ANUGenerator } from './qrng';

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
`.split("\n").map(s => s.trim()).filter(s => s.length > 0)

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const router = Router()
		const qrng = new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY)
    router.options("*", handleOptions);
		router.get("/updateKV", (request) => handleRandRequest(qrng, request, env))
    router.get("/", (request) => handleGetRequest(request, env));
		router.get("/rndnum", request => handleGetRandNum(request, env));
		return router.handle(request);
  },

	async scheduled(request: Request, env: Env, ctx: ExecutionContext){
    const qrng = new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY);
		ctx.waitUntil(handleRandRequest(qrng, request, env))
  },
};

async function handleGetRandom() {
	const genRand = await env.batchQRandmoness.get("qRandomness")
	if (genRand === null) {
    return new Response("Value not found", { status: 404 });
  }

	const IBMQ_RAND = `3152447550`
	const RANDOMNESS = genRand + ":" + IBMQ_RAND

	const R = cyrb53(RANDOMNESS, Math.random() * 2_147_483_647)
	return R
}



//? fetch and store randomness for kv store
async function handleRandRequest(qrng: ANUGenerator, request: Request, env: Env): Promise<Response> {

	// Generate randomness using qrng module making call to qr API, return string of data array
	const genRand = await qrng.generate();

	//? Write to KV store key "qRandomness"
  await env.batchQRandmoness.put("qRandomness", genRand);
	const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
  responseHeaders.set('Content-Type', 'text/plain')

  return new Response(`${genRand}`, {
      headers: responseHeaders,
      status: 200
  });
}

// adapted from: https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
const cyrb53 = function(str: string, seed = 0): number {
    let h1 = 0x8b33a5130 ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

async function handleGetRandNum(request: Request, env: Env): Promise<Response> {

	const R = await handleGetRandom()

	const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
  responseHeaders.set('Content-Type', 'text/plain')

	return new Response(`${R}`, {
      headers: responseHeaders,
      status: 200,
  });



}


//? source randomness from kv store and pass randomness for 8ball / outcomes response
async function handleGetRequest( request: Request, env: Env): Promise<Response> {
  const {searchParams} = new URL(request.url);
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

	const R = await handleGetRandom()

  const selectedOutcome = outcomes[R % outcomes.length];
  const p = 1.0/outcomes.length;
  const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
  responseHeaders.set('Content-Type', 'text/plain')
  return new Response(`${selectedOutcome}`, {
      headers: responseHeaders,
      status: 200,
      statusText: selectedOutcome
  });
}

function handleOptions(request: IRequest): Response {
    const respHeaders = {
      ...corsHeaders,
    };
    return new Response(null, {
      headers: respHeaders,
    });
}
