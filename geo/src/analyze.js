// Answer analysis for the GEO audit: given the raw text captured from an AI
// platform's answer, extract which businesses were named (in order), whether
// the audit subject was named, and which competitors appeared.
//
// Uses Claude because the captured text is messy page text (maps widgets,
// source lists, UI chrome) and business-name matching must be fuzzy
// ("Eat 4 Life" vs "Eat 4 Life Marketing").

import Anthropic from '@anthropic-ai/sdk';

const MODEL_CANDIDATES = ['claude-sonnet-5', 'claude-sonnet-4-5', 'claude-sonnet-4-5-20250929'];

function client() {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) throw new Error('Set ANTHROPIC_API_KEY (or LLM_API_KEY) in the environment.');
  // Pin the public API endpoint — the session may set ANTHROPIC_BASE_URL for
  // its own internal gateway, which this key is not valid for.
  return new Anthropic({ apiKey, baseURL: 'https://api.anthropic.com' });
}

function buildPrompt({ subject, platform, question, answerText }) {
  return `You are analyzing an AI assistant's answer for a local-business visibility audit.

The audit subject is the business: "${subject}"
Platform: ${platform}
Question asked: "${question}"

Below is the raw page text captured after the answer finished (it may include UI chrome, map widgets, source lists, and other noise — ignore those and focus on the answer's actual recommendations):

<answer>
${answerText.slice(0, 12000)}
</answer>

Return ONLY a JSON object (no markdown fences) shaped exactly like this:
{
  "answered": true,
  "businesses": ["specific business names recommended or cited as options, in order of first appearance"],
  "subjectNamed": false,
  "competitors": ["businesses from the list above that are NOT the audit subject"],
  "note": "one short sentence: what the answer did (e.g. recommended 5 local med spas; or gave generic advice, named nobody)"
}

Rules:
- "businesses" = real, specific business/practice/firm names the answer recommends or presents as options. Exclude platforms (Google, Yelp), generic categories, and the question itself.
- "subjectNamed" is true only if one of the named businesses is the audit subject — match loosely on name (abbreviations, missing suffixes like "Marketing"/"LLC" still count) but do not stretch to different businesses with similar words.
- "competitors" = every named business that is not the subject.
- "answered" is false if no real answer was captured (error page, empty, refused).`;
}

function parseJson(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON in analysis response');
  return JSON.parse(t.slice(start, end + 1));
}

export async function analyzeAnswer({ subject, platform, question, answerText }) {
  const c = client();
  let lastErr;
  for (const model of MODEL_CANDIDATES) {
    try {
      const msg = await c.messages.create({
        model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: buildPrompt({ subject, platform, question, answerText }) }],
      });
      const out = parseJson(msg.content.filter((b) => b.type === 'text').map((b) => b.text).join(''));
      return {
        answered: !!out.answered,
        businesses: Array.isArray(out.businesses) ? out.businesses : [],
        subjectNamed: !!out.subjectNamed,
        competitors: Array.isArray(out.competitors) ? out.competitors : [],
        note: typeof out.note === 'string' ? out.note : '',
      };
    } catch (err) {
      if (err instanceof Anthropic.NotFoundError) {
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error('no usable Claude model for analysis');
}
