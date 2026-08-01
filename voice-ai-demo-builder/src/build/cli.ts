import "dotenv/config";
import { buildFromUrl } from "../pipeline";

const args = process.argv.slice(2);
const push = args.includes("--push");
const url = args.find((a) => !a.startsWith("--"));

if (!url) {
  console.error("Usage: npm run demo -- <prospect-url> [--push]");
  process.exit(1);
}

buildFromUrl(url, { push })
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
