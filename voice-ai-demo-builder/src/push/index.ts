import type { DemoSpec } from "../types";
import { ghlCall, ghlConfig } from "./ghl";
import { specToAgentBody, type VoiceAgentBody } from "./agent";

export interface VoiceAgent {
  id: string;
  agentName?: string;
  businessName?: string;
  welcomeMessage?: string;
  agentPrompt?: string;
}

export interface PushResult {
  agentId: string;
  agentName: string;
  businessName: string;
  created: boolean; // true if newly created, false if it replaced an existing one
}

export async function listVoiceAgents(): Promise<VoiceAgent[]> {
  const { locationId } = ghlConfig();
  const data = await ghlCall<{ agents?: VoiceAgent[] }>("GET", "/voice-ai/agents", {
    query: { locationId },
  });
  return data.agents ?? [];
}

export async function getVoiceAgent(id: string): Promise<VoiceAgent> {
  const { locationId } = ghlConfig();
  return ghlCall<VoiceAgent>("GET", `/voice-ai/agents/${id}`, { query: { locationId } });
}

export async function createVoiceAgent(body: VoiceAgentBody): Promise<VoiceAgent> {
  const data = await ghlCall<any>("POST", "/voice-ai/agents", { body });
  return (data.agent ?? data) as VoiceAgent;
}

export async function deleteVoiceAgent(id: string): Promise<void> {
  const { locationId } = ghlConfig();
  await ghlCall("DELETE", `/voice-ai/agents/${id}`, { query: { locationId } });
}

/**
 * Push a DemoSpec into GHL as a Voice AI agent.
 * Idempotent: if an agent for the same business + persona already exists and
 * `replace` is true (default), it's deleted and recreated from the fresh spec.
 */
export async function pushToGhl(
  spec: DemoSpec,
  opts: { replace?: boolean } = {}
): Promise<PushResult> {
  const { replace = true } = opts;
  const { locationId } = ghlConfig();
  const body = specToAgentBody(spec, locationId);

  const existing = (await listVoiceAgents()).find(
    (a) => a.businessName === spec.businessName && a.agentName === spec.persona.name
  );

  if (existing && replace) {
    // Only create + delete are relied on (both verified), so "replace" is
    // delete-then-recreate rather than a PUT whose verb we'd have to guess.
    await deleteVoiceAgent(existing.id);
  } else if (existing) {
    return {
      agentId: existing.id,
      agentName: body.agentName,
      businessName: body.businessName,
      created: false,
    };
  }

  const agent = await createVoiceAgent(body);
  return {
    agentId: agent.id,
    agentName: body.agentName,
    businessName: body.businessName,
    created: true,
  };
}
