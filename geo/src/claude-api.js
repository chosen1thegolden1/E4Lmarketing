// Claude platform adapter for the GEO audit: API-only.
//
// ChatGPT, Gemini and Perplexity are asked in a logged-out browser. claude.ai
// has no logged-out mode, so there is no consumer page the audit can open.
// Claude is therefore always asked through the Anthropic API, with the web
// search tool on so answers can name real local businesses. Each call is a
// fresh, stateless session (no history, no personalization). Evidence stays
// honest: the screenshot is a labeled evidence card, never a fake claude.ai
// page.

import Anthropic from '@anthropic-ai/sdk';

const CANDIDATE_MODELS = ['claude-sonnet-5', 'claude-sonnet-4-5', 'claude-sonnet-4-5-20250929'];
const WEB_SEARCH_TOOL = { type: 'web_search_20250305', name: 'web_search', max_uses: 5 };

function models() {
  return process.env.GEO_CLAUDE_MODEL
    ? [process.env.GEO_CLAUDE_MODEL, ...CANDIDATE_MODELS]
    : CANDIDATE_MODELS;
}

function client() {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  // Pin the public API endpoint, same as analyze.js: the session may set
  // ANTHROPIC_BASE_URL for its own gateway, which this key is not valid for.
  return new Anthropic({ apiKey, baseURL: 'https://api.anthropic.com', timeout: 180000 });
}

// One question, one fresh conversation. A web-search turn can come back
// paused; hand the partial turn back so Claude finishes it.
async function ask(c, model, question, withSearch) {
  const messages = [{ role: 'user', content: question }];
  const blocks = [];
  for (let turn = 0; turn < 4; turn++) {
    const msg = await c.messages.create({
      model,
      max_tokens: 2000,
      messages,
      ...(withSearch ? { tools: [WEB_SEARCH_TOOL] } : {}),
    });
    blocks.push(...msg.content);
    if (msg.stop_reason !== 'pause_turn') break;
    messages.push({ role: 'assistant', content: msg.content });
  }
  return blocks;
}

// The other platforms show their sources on the page and the audit reads
// them as part of the answer text. Claude returns them as citations on each
// text block, so list them under the answer to keep captures comparable.
function sourcesBlock(blocks) {
  const seen = new Map();
  for (const b of blocks) {
    for (const cite of b.citations || []) {
      if (cite.url && !seen.has(cite.url)) seen.set(cite.url, cite.title || '');
    }
  }
  if (!seen.size) return '';
  const lines = [...seen].map(([url, title], i) => `[${i + 1}] ${title ? `${title} - ` : ''}${url}`);
  return `\n\nSources:\n${lines.join('\n')}`;
}

export async function askClaudeApi(question) {
  const c = client();
  let lastErr;
  for (const model of models()) {
    for (const withSearch of [true, false]) {
      try {
        const blocks = await ask(c, model, question, withSearch);
        const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('');
        if (!text.trim()) throw new Error('empty answer from API');
        return { text: text + sourcesBlock(blocks), model, webSearch: withSearch };
      } catch (err) {
        lastErr = err;
        // Unknown model: next candidate. Search tool rejected: retry bare.
        if (err instanceof Anthropic.NotFoundError) break;
        if (err.status === 401 || err.status === 403 || err.status === 429) throw err; // key/quota: no point iterating
        if (withSearch && err.status === 400 && /web_search|tool/i.test(err.message)) continue;
        break;
      }
    }
  }
  throw lastErr ?? new Error('no usable Claude model');
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Labeled evidence card rendered into the page before the screenshot is
// taken, so nobody mistakes an API capture for a claude.ai page.
export function claudeEvidenceCardHtml({ question, answerText, model, webSearch }) {
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
  <div class="head"><div class="t">Claude</div><div class="s">captured via Anthropic API (${esc(model)}) · web search ${webSearch ? 'on' : 'off'} · fresh stateless session · no history · claude.ai has no logged-out mode, so Claude is always asked through the API</div></div>
  <div class="q">${esc(question)}</div>
  <div class="a">${esc(answerText)}</div>
  <div class="foot">Captured ${new Date().toISOString()} · E4L GEO audit evidence</div>
</div>
</body></html>`;
}
