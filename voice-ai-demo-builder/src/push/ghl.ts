import "dotenv/config";

// Minimal GoHighLevel v2 client for the Voice AI push. Zero-dependency (Node fetch).
const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

export function ghlConfig(): { token: string; locationId: string } {
  // Follow this project's .env naming, but fall back to GHL_API_TOKEN so it
  // "just works" in the environment that already provides that var.
  const token = process.env.GHL_API_KEY || process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token) throw new Error("GHL_API_KEY (or GHL_API_TOKEN) is not set.");
  if (!locationId) throw new Error("GHL_LOCATION_ID is not set.");
  return { token, locationId };
}

export async function ghlCall<T = any>(
  method: string,
  pathname: string,
  opts: { query?: Record<string, string | undefined>; body?: unknown } = {}
): Promise<T> {
  const { token } = ghlConfig();
  const url = new URL(GHL_API + pathname);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v != null) url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = data.message || data.error || res.statusText;
    throw new Error(`GHL API ${res.status} on ${method} ${pathname}: ${msg}`);
  }
  return data as T;
}
