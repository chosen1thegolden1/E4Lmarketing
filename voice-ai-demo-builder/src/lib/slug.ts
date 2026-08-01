/** "https://www.joesplumbing.com/about" -> "joesplumbing-com" */
export function slugFromUrl(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return host.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
}
