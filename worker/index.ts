import { handleWorkerRoute } from "./routes";
import type { Env } from "./types";

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const routedResponse = await handleWorkerRoute(request, env);
    if (routedResponse) {
      return routedResponse;
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Static asset binding is not configured.", { status: 500 });
  },
};

export default worker;
