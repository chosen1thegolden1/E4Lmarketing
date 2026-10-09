// Perplexity API fallback for the GEO audit.
//
// The consumer perplexity.ai site sometimes walls the logged-out browser:
// a Cloudflare "verify you are human" page (seen 2026-10-08, served after
// the question was submitted) or a sign-in wall. When that happens and
// PERPLEXITY_API_KEY is set, the audit asks the question through the
// Perplexity API instead. Each call is a fresh, stateless session (no
// history, no personalization) and Sonar models search the web on every
// call, so answers cite real local businesses like the consumer product
// does. Evidence stays honest: the screenshot for an API capture is a
// labeled evidence card, never a fake perplexity.ai page.

const CANDIDATE_MODELS = ['sonar', 'sonar-pro'];

function models() {
  return process.env.GEO_PERPLEXITY_MODEL
    ? [process.env.GEO_PERPLEXITY_MODEL, ...CANDIDATE_MODELS]
    : CANDIDATE_MODELS;
}

async function call(body) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json.error?.message || json.detail || `HTTP ${res.status}`;
    const err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    err.status = res.status;
    throw err;
  }
  return json;
}

// The consumer UI shows its sources next to the answer, and the audit reads
// them as part of the page text. The API returns them as a separate list, so
// append them to keep the two capture paths comparable.
function sourcesBlock(data) {
  const urls = (data.search_results || []).map((r) => (r.title ? `${r.title} - ${r.url}` : r.url));
  const list = urls.length ? urls : data.citations || [];
  if (!list.length) return '';
  return `\n\nSources:\n${list.map((u, i) => `[${i + 1}] ${u}`).join('\n')}`;
}

export async function askPerplexityApi(question) {
  if (!process.env.PERPLEXITY_API_KEY) throw new Error('PERPLEXITY_API_KEY not set');
  let lastErr;
  for (const model of models()) {
    try {
      const data = await call({ model, messages: [{ role: 'user', content: question }] });
      const answer = data.choices?.[0]?.message?.content;
      if (typeof answer !== 'string' || !answer.trim()) throw new Error('empty answer from API');
      return { text: answer + sourcesBlock(data), model: data.model || model };
    } catch (err) {
      lastErr = err;
      // Bad key or out of quota: no point trying another model.
      if (err.status === 401 || err.status === 429) throw err;
    }
  }
  throw lastErr ?? new Error('no usable Perplexity model');
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Labeled evidence card rendered into the page before the screenshot is
// taken, so API captures are visually unmistakable from UI captures.
export function perplexityEvidenceCardHtml({ question, answerText, model }) {
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
  <div class="head"><div class="t">Perplexity</div><div class="s">captured via Perplexity API (${esc(model)}) · fresh stateless session · no history · consumer perplexity.ai blocked the logged-out browser at capture time</div></div>
  <div class="q">${esc(question)}</div>
  <div class="a">${esc(answerText)}</div>
  <div class="foot">Captured ${new Date().toISOString()} · E4L GEO audit evidence</div>
</div>
</body></html>`;
}
