import { scrape } from "./scrape/index";
import { generate } from "./generate/index";
import { render, type RenderOptions, type RenderResult } from "./render/index";
import type { DemoSpec, RawSite } from "./types";

export interface BuildResult {
  site: RawSite;
  spec: DemoSpec;
  render: RenderResult;
}

/** scrape → generate → render. The full pipeline for one prospect URL. */
export async function buildFromUrl(url: string, opts: RenderOptions = {}): Promise<BuildResult> {
  const site = await scrape(url);
  if (!site.title && !site.bodyText) {
    throw new Error(
      `Nothing scrapable from ${url}. ${site.warnings.join(" ") || "Empty page."}`
    );
  }
  const spec = await generate(site);
  const result = await render(spec, opts);
  return { site, spec, render: result };
}
