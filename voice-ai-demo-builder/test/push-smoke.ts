import "dotenv/config";
// Live test for Step 5 (GHL push). Creates a Voice AI agent from the fixture,
// reads it back to confirm the knowledge base landed, then deletes it (cleanup).
//   npx tsx test/push-smoke.ts
import { pushToGhl, getVoiceAgent, deleteVoiceAgent } from "../src/push/index";
import { FALLBACK_SPEC } from "./fixtures";

async function main() {
  if (!(process.env.GHL_API_KEY || process.env.GHL_API_TOKEN) || !process.env.GHL_LOCATION_ID) {
    console.log("No GHL creds in env → skipping live push test.");
    return;
  }

  console.log(`Pushing "${FALLBACK_SPEC.businessName}" → GHL Voice AI…`);
  const result = await pushToGhl(FALLBACK_SPEC);
  console.log(`  ${result.created ? "Created" : "Replaced"} agent ${result.agentId} (${result.agentName})`);

  try {
    const agent = await getVoiceAgent(result.agentId);
    console.log("  Verified in GHL:");
    console.log("    agentName     :", agent.agentName);
    console.log("    welcomeMessage:", agent.welcomeMessage);
    console.log("    agentPrompt   :", (agent.agentPrompt || "").slice(0, 180).replace(/\n/g, " ") + "…");
  } finally {
    // It's a fixture — clean it up so the account stays tidy.
    await deleteVoiceAgent(result.agentId);
    console.log(`  Cleaned up (deleted ${result.agentId}).`);
  }
}

main().catch((err) => {
  console.error("Push smoke failed:", err?.message || err);
  process.exitCode = 1;
});
