import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const applicationApiOrigin = (
  process.env.API_TARGET ?? process.env.VITE_API_TARGET ?? "https://apitest.lnfederation.com"
).replace(/\/+$/, "");

// Hop-by-hop / connection-level headers that must never be forwarded manually.
// Node's undici fetch throws InvalidArgumentError if these are present.
const UNSAFE_PROXY_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

function buildUpstreamHeaders(sourceHeaders: Headers): Headers {
  const headers = new Headers();
  for (const [key, value] of sourceHeaders.entries()) {
    if (UNSAFE_PROXY_HEADERS.has(key.toLowerCase())) continue;
    headers.set(key, value);
  }
  return headers;
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const requestUrl = new URL(request.url);
      if (requestUrl.pathname === "/api/transport-logistics") {
        const upstreamUrl = `${applicationApiOrigin}${requestUrl.pathname}${requestUrl.search}`;
        try {
          const upstreamRequest = request.clone();
          const upstreamHeaders = buildUpstreamHeaders(upstreamRequest.headers);
          const hasBody = upstreamRequest.method !== "GET" && upstreamRequest.method !== "HEAD";

          return await fetch(
            new Request(upstreamUrl, {
              method: upstreamRequest.method,
              headers: upstreamHeaders,
              body: hasBody ? upstreamRequest.body : undefined,
              duplex: hasBody ? "half" : undefined,
              redirect: "follow",
            }),
          );
        } catch (error) {
          console.error("Application API proxy failed", error);
          return Response.json(
            { error: "The application service is temporarily unavailable." },
            { status: 502 },
          );
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};