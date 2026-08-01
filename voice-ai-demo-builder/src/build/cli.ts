import "dotenv/config";
import { buildFromUrl } from "../pipeline";

const url = process.argv[2];
if (!url) {
  console.error("Usage: npm run demo -- <prospect-url>");
  process.exit(1);
}

buildFromUrl(url)
  .then(({ spec, render }) => {
    console.log(`✓ Demo built for "${spec.businessName}"`);
    console.log(`  Receptionist: ${spec.persona.name} — ${spec.persona.role}`);
    console.log(`  Services: ${spec.services.length}  ·  FAQs: ${spec.faqs.length}`);
    console.log(`  → ${render.outPath}`);
  })
  .catch((err) => {
    console.error("Build failed:", err?.message || err);
    process.exit(1);
  });
