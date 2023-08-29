import { Router, IRequest, json } from 'itty-router';
import { ANUGenerator } from './qrng';
import { SharedSplit } from './shared_split';
import { Env } from "./env";

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

  SharedSplit,

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const qrng = new ANUGenerator(env.QUANTUM_NUMBERS_API_KEY);
    const router = Router()
    router.options("*", handleOptions);
    router.get("*", (request) => handleGetRequest(qrng, request));
    router.post("/new-share", (request) => handleNewShare(env.SHARED_SPLIT, request));
    router.get("/s/:id", ({ id }) => )
		return router.handle(request);
  },
};

async function handleGetSplit(id: string, sharedSplitDO: DurableObjectNamespace): Promise<Response> {
  const idFromStr = sharedSplitDO.idFromString(id);
  const stub = sharedSplitDO.get(idFromStr);
  return await stub.fetch(new Request("/share"));
}

async function handleNewShare(sharedSplitDO: DurableObjectNamespace, request: IRequest): Promise<Response> {
  const newID = sharedSplitDO.newUniqueId().toString();
  let url = request.url.replace(request.route, "/s") + "/" + newID
  return json({url})
}

async function handleGetRequest(qrng: ANUGenerator, request: Request): Promise<Response> {
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
  const randNum = await qrng.generate();
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

function handleOptions(request: IRequest): Response {
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
