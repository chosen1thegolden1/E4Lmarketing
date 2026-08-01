import { scrape } from "./scrape/index";
import { generate } from "./generate/index";
import { render, type RenderOptions, type RenderResult } from "./render/index";
import { pushToGhl, type PushResult } from "./push/index";
import type { DemoSpec, RawSite } from "./types";

export interface BuildResult {
  /** Absent when the build ran from a pre-generated spec (no scrape). */
  site?: RawSite;
  spec: DemoSpec;
  render: RenderResult;
  push?: PushResult;
}

export type BuildOptions = RenderOptions & {
  /** Also create/refresh the GHL Voice AI agent from the spec. */
  push?: boolean;
  /** Skip scrape + generate and build from this pre-generated spec instead. */
  spec?: DemoSpec;
};

/** scrape → generate → render (→ optionally push to GHL). Full pipeline for one URL. */
export async function buildFromUrl(url: string, opts: BuildOptions = {}): Promise<BuildResult> {
  const { push, spec: providedSpec, ...renderOpts } = opts;
  let site: RawSite | undefined;
  let spec = providedSpec;
  if (!spec) {
    site = await scrape(url);
    if (!site.title && !site.bodyText) {
      throw new Error(
        `Nothing scrapable from ${url}. ${site.warnings.join(" ") || "Empty page."}`
      );
    }
    spec = await generate(site);
  }
  const result = await render(spec, renderOpts);
  const pushResult = push ? await pushToGhl(spec) : undefined;
  return { site, spec, render: result, push: pushResult };
}
