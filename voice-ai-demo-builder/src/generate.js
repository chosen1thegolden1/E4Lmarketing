import Anthropic from '@anthropic-ai/sdk';

const MODEL_CANDIDATES = ['claude-sonnet-5', 'claude-sonnet-4-5', 'claude-sonnet-4-5-20250929'];

function apiKey() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
  if (!key) throw new Error('Set ANTHROPIC_API_KEY (or LLM_API_KEY) in the environment.');
  return key;
}

function buildPrompt(site) {
  return `You are building a Voice AI receptionist demo for a local business, to show the owner what an AI phone agent could do for them.

Here is everything scraped from their website (${site.startUrl}):

${JSON.stringify(site, null, 2)}

Return ONLY a JSON object (no markdown fences, no commentary) with exactly this shape:

{
  "business": {
    "name": "full business name",
    "shortName": "short conversational name the agent says on calls",
    "slug": "url-safe-slug-of-business-name",
    "industry": "e.g. Roofing & Exterior Contracting",
    "tagline": "their tagline, or write a fitting one",
    "phone": "phone from site or null",
    "email": "email from site or null",
    "location": "city/region if known, else null",
    "services": ["4-8 concrete services they offer or clearly would offer"],
    "brandColor": "#hex — a primary color fitting the trade/brand",
    "accentColor": "#hex — a complementary accent",
    "timezone": "IANA timezone best guess for the business, e.g. America/New_York"
  },
  "agent": {
    "agentName": "a friendly first name for the AI receptionist",
    "welcomeMessage": "exact greeting spoken when answering, mentioning the business name, under 25 words",
    "prompt": "a complete, production-quality system prompt for the voice agent: role, business background, services, tone rules, how to qualify callers (name, phone, address, service needed, urgency/leak?), how to offer to book a free estimate, what NOT to do (no prices, no guarantees), and how to close the call. 250-450 words, plain text.",
    "capabilities": ["5-6 short bullet phrases of what the agent handles"],
    "sampleConversation": [
      {"role": "agent", "text": "..."},
      {"role": "caller", "text": "..."}
      // 8-12 alternating turns total: a realistic inbound call where a homeowner reports a problem, the agent qualifies them and books an estimate. Start with the agent's greeting (same as welcomeMessage).
    ],
    "faqs": [{"q": "...", "a": "..."}]  // 4 FAQs the business owner would ask about the Voice AI service itself
  },
  "page": {
    "heroHeadline": "punchy headline for the demo page addressed to the business owner",
    "heroSub": "1-2 sentence subheadline: what this AI receptionist does for THEIR business specifically",
    "stats": [{"value": "e.g. 24/7", "label": "short label"}],  // exactly 3
    "valueProps": [{"title": "...", "desc": "1-2 sentences", "icon": "one emoji"}],  // exactly 4, specific to this trade
    "howItWorks": [{"step": 1, "title": "...", "desc": "..."}],  // exactly 3
    "closingCta": "one-sentence call to action to go live with this agent"
  }
}

Ground everything in the scraped content (25+ years of experience, their actual services, etc.). Where the site is thin, make trade-appropriate assumptions a roofing marketer would make. Keep all copy tight and professional.`;
}

function parseJson(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object in model response');
  return JSON.parse(t.slice(start, end + 1));
}

export async function generateDemo(site) {
  const client = new Anthropic({ apiKey: apiKey() });
  let lastErr;
  for (const model of MODEL_CANDIDATES) {
    try {
      const msg = await client.messages.create({
        model,
        max_tokens: 8000,
        messages: [{ role: 'user', content: buildPrompt(site) }],
      });
      const text = msg.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');
      const data = parseJson(text);
      for (const key of ['business', 'agent', 'page']) {
        if (!data[key]) throw new Error(`Model response missing "${key}"`);
      }
      data._model = model;
      return data;
    } catch (err) {
      if (err instanceof Anthropic.NotFoundError) {
        lastErr = err;
        console.warn(`  ! model ${model} unavailable, trying next`);
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error('No usable Claude model found');
}
