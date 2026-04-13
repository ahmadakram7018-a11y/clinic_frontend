import { NextRequest } from "next/server";

// Next.js 15 API proxy route — forwards all requests to the backend
// params is a Promise in Next.js 15+, so we await it before use
const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function proxy(request: NextRequest, path: string[]) {
  const targetUrl = new URL(`${BACKEND_API_URL}/${path.join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("host");
  requestHeaders.delete("connection");
  requestHeaders.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers: requestHeaders,
    redirect: "manual",
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
  };

  const upstreamResponse = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  upstreamResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-encoding") {
      return;
    }
    responseHeaders.append(key, value);
  });

  return new Response(await upstreamResponse.arrayBuffer(), {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolved = await params;
  return proxy(request, resolved.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolved = await params;
  return proxy(request, resolved.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolved = await params;
  return proxy(request, resolved.path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolved = await params;
  return proxy(request, resolved.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolved = await params;
  return proxy(request, resolved.path);
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolved = await params;
  return proxy(request, resolved.path);
}
