// ChatGPT API fallback for the GEO audit.
//
// The consumer chatgpt.com UI allows only a handful of logged-out chats per
// IP before demanding sign-in. When that wall is up and OPENAI_API_KEY is
// set, the audit asks the question through the OpenAI API instead — each
// call is a fresh, stateless session (no history, no personalization), with
// web search enabled so answers can cite real local businesses like the
// consumer product does. Evidence stays honest: the screenshot for an API
// capture is a labeled evidence card, never a fake chatgpt.com page.

const CANDIDATE_MODELS = ['gpt-5.2', 'gpt-5.1', 'gpt-5', 'gpt-4.1', 'gpt-4o'];

function models() {
  return process.env.GEO_OPENAI_MODEL
    ? [process.env.GEO_OPENAI_MODEL, ...CANDIDATE_MODELS]
    : CANDIDATE_MODELS;
}

async function call(body) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.code = json.error?.code;
    throw err;
  }
  return json;
}

function extractText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text;
  const parts = [];
  for (const item of data.output || []) {
    for (const c of item.content || []) {
      if (typeof c.text === 'string') parts.push(c.text);
    }
  }
  return parts.join('\n');
}

export async function askChatGptApi(question) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  let lastErr;
  for (const model of models()) {
    for (const withSearch of [true, false]) {
      try {
        const body = { model, input: question };
        if (withSearch) body.tools = [{ type: 'web_search' }];
        const data = await call(body);
        const text = extractText(data);
        if (!text.trim()) throw new Error('empty answer from API');
        return { text, model, webSearch: withSearch };
      } catch (err) {
        lastErr = err;
        // Unknown model → next candidate. Tool not supported → retry bare.
        if (err.code === 'model_not_found' || err.status === 404) break;
        if (withSearch && /web_search|tool/i.test(err.message)) continue;
        if (err.status === 401 || err.status === 429) throw err; // key/quota: no point iterating
        break;
      }
    }
  }
  throw lastErr ?? new Error('no usable OpenAI model');
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Labeled evidence card rendered into the page before the screenshot is
// taken, so API captures are visually unmistakable from UI captures.
export function evidenceCardHtml({ question, answerText, model }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body { margin: 0; font-family: 'Segoe UI', system-ui, sans-serif; background: #f4f4f4; color: #111; }
  .card { max-width: 900px; margin: 28px auto; background: #fff; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; }
  .head { background: #000; color: #fff; padding: 14px 22px; border-bottom: 4px solid #FFC200; }
  .head .t { font-weight: 700; font-size: 17px; }
  .head .s { color: #FFC200; font-family: monospace; font-size: 12px; margin-top: 2px; }
  .q { padding: 16px 22px; border-bottom: 1px solid #eee; font-weight: 700; font-size: 16px; }
  .a { padding: 18px 22px; white-space: pre-wrap; font-size: 14.5px; line-height: 1.6; }
  .foot { padding: 12px 22px; background: #fafafa; border-top: 1px solid #eee; color: #666; font-size: 12px; }
</style></head><body>
  <div class="card">
    <div class="head"><div class="t">ChatGPT</div><div class="s">captured via OpenAI API (${esc(model)}) · fresh stateless session · no history · consumer chatgpt.com was rate-limited at capture time</div></div>
    <div class="q">${esc(question)}</div>
    <div class="a">${esc(answerText)}</div>
    <div class="foot">Captured ${new Date().toISOString()} · E4L GEO audit evidence</div>
  </div>
</body></html>`;
}
