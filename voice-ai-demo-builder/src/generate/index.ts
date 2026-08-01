import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import type { DemoSpec, RawSite } from "../types";
import { DEMO_SPEC_SCHEMA } from "./schema";
import { buildPrompt } from "./prompt";

// Default to the current Opus; override with LLM_MODEL if desired.
const MODEL = process.env.LLM_MODEL || "claude-opus-5";

/**
 * Turn a scraped site into a DemoSpec via one structured-output Claude call.
 * The strict JSON schema guarantees the shape, so the result parses cleanly.
 */
export async function generate(site: RawSite): Promise<DemoSpec> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    // effort:low keeps this snappy — it's structured generation, not deep reasoning.
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: DEMO_SPEC_SCHEMA },
    },
    messages: [{ role: "user", content: buildPrompt(site) }],
  } as Anthropic.MessageCreateParamsNonStreaming);

  if (res.stop_reason === "refusal") {
    throw new Error(`Generator refused: ${JSON.stringify(res.stop_details)}`);
  }

  const textBlock = res.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) {
    throw new Error(`Generator returned no text (stop_reason: ${res.stop_reason})`);
  }

  return JSON.parse(textBlock.text) as DemoSpec;
}
