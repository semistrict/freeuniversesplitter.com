import { Env } from "./env";
import { Router, IRequest, json } from 'itty-router';

export class SharedSplit {

    static KEY = 'split';
    
    constructor(private state: DurableObjectState, private env: Env) {}

  async fetch(request: Request): Promise<Response> {
    //return current state of split - thing 1
    //perform the split

    const stateSplit = await this.state.storage.get(SharedSplit.KEY) as Split;

    const router = Router();
    router.post("/new-share", (request) => this.initializeShare(request));
    router.get("/", (request) => this.initializeShare(request));
		return router.handle(request).then(json);

  }

  async initializeShare(request: IRequest): Promise<any> {
    const split = await request.json() as Split;
    this.state.storage.put(SharedSplit.KEY, split);
    return {id: this.state.id};
  }
}

interface Branch {
    titles: string;
    weight: number;
}

interface Split { 
    branches: Array<Branch>;
 }