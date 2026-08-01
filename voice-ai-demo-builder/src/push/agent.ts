import type { DemoSpec } from "../types";

/** The GHL Voice AI agent create/update body. */
export interface VoiceAgentBody {
  locationId: string;
  agentName: string;
  businessName: string;
  welcomeMessage: string;
  agentPrompt: string;
}

/** Compose the agent's "knowledge base" prompt from the DemoSpec. */
export function buildAgentPrompt(spec: DemoSpec): string {
  const services = spec.services.map((s) => `- ${s}`).join("\n");
  const faqs = spec.faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  return [
    "BACKGROUND INFO:",
    `You are ${spec.persona.name}, the AI receptionist for ${spec.businessName}.`,
    `Tone & style: ${spec.persona.voice}`,
    "",
    `SERVICES ${spec.businessName} offers:`,
    services,
    "",
    "FREQUENTLY ASKED QUESTIONS — answer these accurately:",
    faqs,
    "",
    "RULES:",
    "- Only use the information above. Never invent prices, hours, or details that aren't listed.",
    "- If asked something not covered here, say a team member will follow up, then continue helping.",
    "- Keep answers short, warm, and in the tone described above.",
    "- Your goals: answer the caller's questions and capture their name and a callback number.",
  ].join("\n");
}

/** Map a DemoSpec to the GHL Voice AI agent body. */
export function specToAgentBody(spec: DemoSpec, locationId: string): VoiceAgentBody {
  return {
    locationId,
    agentName: spec.persona.name,
    businessName: spec.businessName,
    welcomeMessage: spec.persona.greeting,
    agentPrompt: buildAgentPrompt(spec),
  };
}
