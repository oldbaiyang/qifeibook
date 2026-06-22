import { handleWorkerRoute } from "./routes";
import { renderNotFoundPage } from "./templates";
import type { Env } from "./types";

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const routedResponse = await handleWorkerRoute(request, env);
    if (routedResponse) {
      return routedResponse;
    }

    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      const acceptsHtml = request.headers.get("accept")?.includes("text/html") ?? false;

      if (assetResponse.status === 404 && acceptsHtml) {
        return new Response(renderNotFoundPage("未找到该页面", "当前页面不存在或暂时不可用。"), {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return assetResponse;
    }

    return new Response("Static asset binding is not configured.", { status: 500 });
  },
};

export default worker;
