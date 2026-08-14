// Claude email drafter for cold outreach to a specific business.
// Returns { subject, body } for a Revenue Leak Scorecard pitch.
import Anthropic from '@anthropic-ai/sdk';

const MODELS = ['claude-sonnet-5', 'claude-sonnet-4-5', 'claude-sonnet-4-5-20250929'];

function client() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
  if (!key) throw new Error('Set ANTHROPIC_API_KEY');
  return new Anthropic({ apiKey: key });
}

const SYSTEM = `You write short, high-converting cold emails for a marketing agency called Eat 4 Life Marketing.
Voice: direct, warm, specific, human — never corporate. Never promise results. Never use "I hope this email finds you well," "just checking in," "circling back," or any cliché opener.
Every email points recipients to the Revenue Leak Scorecard — a free 2-minute quiz that estimates the money leaking out of their business (missed calls, no-shows, dead follow-up).
The agency's tagline is "AI Marketing Made Easy." Signature is "— Chosen · Eat 4 Life Marketing".`;

const USER = ({ industry, scorecardUrl, business, city, scrape }) => `Write a cold email to this business:

BUSINESS: ${business.name}
INDUSTRY: ${industry}
LOCATION: ${city || business.address || 'their city'}
WEBSITE: ${business.website}
${business.rating ? `RATING: ${business.rating}★ (${business.reviewCount} reviews)` : ''}
${scrape.tagline ? `TAGLINE FROM SITE: ${scrape.tagline}` : ''}
${scrape.blurb ? `BLURB FROM SITE: ${scrape.blurb.slice(0, 400)}` : ''}

Rules:
- Subject: 5–9 words, curious/specific, name their business or a specific problem. No emojis. No "quick question about" clichés.
- Body: 55–90 words. Plain paragraphs, no bullets, no bold, no formatting.
- Opening sentence must reference something concrete from the scrape (a service, tagline, review count, neighborhood, etc.) so it clearly isn't a template.
- One industry-specific leak framing (no-shows, missed calls, dead DMs, unbooked estimates — whichever fits the industry).
- One CTA: a link to the Revenue Leak Scorecard. Use exactly this URL: ${scorecardUrl}
- Sign off "— Chosen · Eat 4 Life Marketing"
- No P.S. line unless it adds something specific — usually skip it.

Return ONLY a JSON object with this exact shape, nothing else:
{"subject": "...", "body": "..."}`;

function parse(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON in draft response');
  const obj = JSON.parse(t.slice(start, end + 1));
  if (!obj.subject || !obj.body) throw new Error('draft missing subject or body');
  return obj;
}

export async function draftEmail({ industry, scorecardUrl, business, city, scrape }) {
  const c = client();
  let lastErr;
  for (const model of MODELS) {
    try {
      const msg = await c.messages.create({
        model,
        max_tokens: 800,
        system: SYSTEM,
        messages: [{ role: 'user', content: USER({ industry, scorecardUrl, business, city, scrape }) }],
      });
      const text = msg.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');
      return parse(text);
    } catch (err) {
      if (err instanceof Anthropic.NotFoundError) {
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error('no usable Claude model');
}
