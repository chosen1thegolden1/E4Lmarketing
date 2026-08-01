import "dotenv/config";
// Smoke test for generate() + render() using a fixture (no live scrape needed).
//   npx tsx test/pipeline-smoke.ts
// If ANTHROPIC_API_KEY is set, it runs the real generator on MEDSPA_SITE.
// Otherwise it renders the hand-authored FALLBACK_SPEC so the template is still exercised.
import { render } from "../src/render/index";
import { MEDSPA_SITE, FALLBACK_SPEC } from "./fixtures";
import type { DemoSpec } from "../src/types";

async function main() {
  let spec: DemoSpec;

  if (process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY) {
    console.log("LLM_API_KEY found → running the real generator on the med-spa fixture…");
    const { generate } = await import("../src/generate/index");
    spec = await generate(MEDSPA_SITE);
    console.log("Generated DemoSpec:\n", JSON.stringify(spec, null, 2));
  } else {
    console.log("No ANTHROPIC_API_KEY → rendering the hand-authored FALLBACK_SPEC (renderer only).");
    spec = FALLBACK_SPEC;
  }

  const result = await render(spec, {
    widgetEmbed: '<!-- GHL Voice AI Chat Widget embed goes here -->',
  });
  console.log(`\n✓ Rendered demo → ${result.outPath}`);
  console.log(`  slug: ${result.slug} · ${result.html.length} bytes`);
}

main().catch((err) => {
  console.error("Smoke failed:", err?.message || err);
  process.exitCode = 1;
});
