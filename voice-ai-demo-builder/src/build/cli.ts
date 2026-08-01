import "dotenv/config";
import { readFileSync } from "node:fs";
import { buildFromUrl } from "../pipeline";
import type { DemoSpec } from "../types";

const args = process.argv.slice(2);
const push = args.includes("--push");
const url = args.find((a) => !a.startsWith("--"));
const specArg = args.find((a) => a.startsWith("--spec="))?.slice("--spec=".length);

if (!url && !specArg) {
  console.error("Usage: npm run demo -- <prospect-url> [--push] [--spec=<demospec.json>]");
  process.exit(1);
}

const spec = specArg
  ? (JSON.parse(readFileSync(specArg, "utf8")) as DemoSpec)
  : undefined;

buildFromUrl(url ?? "", { push, spec })
  .then(({ spec, render, push: pushResult }) => {
    console.log(`✓ Demo built for "${spec.businessName}"`);
    console.log(`  Receptionist: ${spec.persona.name} — ${spec.persona.role}`);
    console.log(`  Services: ${spec.services.length}  ·  FAQs: ${spec.faqs.length}`);
    console.log(`  → ${render.outPath}`);
    if (pushResult) {
      console.log(`  GHL Voice AI: ${pushResult.created ? "created" : "updated"} agent ${pushResult.agentId}`);
    }
  })
  .catch((err) => {
    console.error("Build failed:", err?.message || err);
    process.exit(1);
  });
