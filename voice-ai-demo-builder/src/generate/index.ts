import type { KnowledgeBase, RawSite } from "../types.js";

/**
 * RawSite -> KnowledgeBase
 * One LLM call with a strict JSON schema:
 *   { businessName, services[], persona, faqs[], demoCopy{} }
 * Uses LLM_API_KEY from .env.
 *
 * NOT BUILT YET — next step after the scraper is validated on a real prospect URL.
 */
export async function generate(_site: RawSite): Promise<KnowledgeBase> {
  throw new Error("generate() not implemented yet");
}
