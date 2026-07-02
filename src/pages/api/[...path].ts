import type { APIRoute } from 'astro';

export const ALL: APIRoute = async (context) => {
  const { request, params } = context;
  const path = params.path || '';
  const url = new URL(request.url);
  
  // Get environment variables (Cloudflare Pages Secrets)
  const env = (context.locals as any).runtime?.env || {};
  const HF_TOKEN = env.HF_TOKEN || import.meta.env.HF_TOKEN;
  
  // Base URL of the Private Gateway (Load Balancer on Hugging Face)
  const GATEWAY_URL = env.GATEWAY_URL || import.meta.env.GATEWAY_URL;
  
  if (!GATEWAY_URL) {
    return new Response(JSON.stringify({ error: "GATEWAY_URL environment variable is missing. Please configure it in your Cloudflare settings." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Target URL to proxy to
  const targetUrl = GATEWAY_URL.endsWith('/') ? GATEWAY_URL + path + url.search : GATEWAY_URL + '/' + path + url.search;

  try {
    const headers = new Headers(request.headers);
    // Remove host header to allow fetch to set the correct destination host
    headers.delete('host');
    headers.delete('referer');
    headers.delete('origin');

    // Securely inject the Hugging Face token for the private space
    if (HF_TOKEN) {
      headers.set('Authorization', `Bearer ${HF_TOKEN}`);
    }

    // Forward the request to the Private Gateway
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      // @ts-ignore - Duplex is required for streaming request bodies in some environments
      duplex: 'half',
      redirect: 'manual'
    });

    // Create a new response to return to the client
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to Gateway" }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
