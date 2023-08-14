/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	QUANTUM_NUMBERS_API_KEY: string;
	QUANTUM_NUMBERS_URL: string;
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}


const allowedOrigin = '*'

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
		if (request.method === 'OPTIONS') {
				return handleOptions(request);
		} else if (request.method === 'POST') {
				return handleRequest(env, request);
		} else if (request.method === 'GET') {
			return handleGetRequest(env, request);
		}
		return new Response(
			'not found', {status: 404}
		)
		},
};

async function handleGetRequest(env: Env, request: Request): Promise<Response> {
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
  const qrngResult = await fetch(env.QUANTUM_NUMBERS_URL + "?length=1&type=uint16", {
    headers: {
      'x-api-key': env.QUANTUM_NUMBERS_API_KEY
    }
  });
  if (qrngResult.status != 200) {
    const responseHeaders = new Headers(qrngResult.headers);
    responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
    return new Response(qrngResult.body, {
        headers: responseHeaders,
        status: qrngResult.status,
        statusText: qrngResult.statusText
    });
  } else {
		//TODO: Properly type json
    const json: any = await qrngResult.json();
    const randNum = json.data[0];
    const selectedOutcome = outcomes[randNum % outcomes.length];
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
}

async function handleRequest(env: Env, request: Request): Promise<Response> {
  const qrngResult = await fetch(env.QUANTUM_NUMBERS_URL + "?length=1&type=uint16", {
    headers: {
      'x-api-key': env.QUANTUM_NUMBERS_API_KEY
    }
  });
  const responseHeaders = new Headers(qrngResult.headers)
    responseHeaders.set('Access-Control-Allow-Origin', allowedOrigin)
    return new Response(qrngResult.body, {
        headers: responseHeaders,
        status: qrngResult.status,
        statusText: qrngResult.statusText
    })
}

function handleOptions(request: Request): Response {
    const respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
			//TODO: Removed for debug
    //   'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    };
    return new Response(null, {
      headers: respHeaders,
    });
}
