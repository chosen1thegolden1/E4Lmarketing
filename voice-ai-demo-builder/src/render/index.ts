import type { DemoPageInput } from "../types.js";

/**
 * KnowledgeBase -> demos/<slug>/index.html
 * Fills the E4L demo-page template (templates/demo-page.html) with the prospect's
 * generated copy and the GHL Voice AI Chat Widget embed.
 *
 * NOT BUILT YET — blocked on the existing demo-page HTML being added to templates/.
 */
export async function render(_input: DemoPageInput): Promise<string> {
  throw new Error("render() not implemented yet");
}
