import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateAgentNumbers } from './ghl.js';
import { renderDemo } from './render.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const POOL_PATH = path.join(ROOT, 'pool.json');
const DEMOS_DIR = path.join(ROOT, 'demos');
const REGISTRY_PATH = path.join(DEMOS_DIR, 'registry.json');

async function readJson(p, fallback) {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return fallback;
  }
}

export async function loadPool() {
  return readJson(POOL_PATH, { numbers: [], maxAgeDays: 14 });
}

export async function loadRegistry() {
  return readJson(REGISTRY_PATH, {});
}

async function saveRegistry(registry) {
  await fs.writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
}

const active = (registry) => Object.entries(registry).filter(([, e]) => e.number);

/** Detach a demo's number from its agent and re-render its page without the call buttons. */
export async function releaseSlug(slug) {
  const registry = await loadRegistry();
  const entry = registry[slug];
  if (!entry?.number) return null;
  await updateAgentNumbers(entry.agentId, []);
  const number = entry.number;
  entry.number = null;
  entry.releasedAt = new Date().toISOString();
  await saveRegistry(registry);
  const data = await readJson(path.join(DEMOS_DIR, slug, 'data.json'), null);
  if (data) {
    delete data._demoPhone;
    data._slug = slug;
    await renderDemo(data, DEMOS_DIR);
  }
  return number;
}

/**
 * Assign a free pool number to a newly created agent. If the pool is exhausted,
 * recycles the number from the oldest active demo first.
 */
export async function assignNumber({ slug, agentId, agentName, business, leadEmail, rep }) {
  const pool = await loadPool();
  if (!pool.numbers?.length) {
    throw new Error('pool.json has no numbers — buy demo numbers in GHL and add them to pool.json.');
  }
  let registry = await loadRegistry();
  const inUse = new Set(active(registry).map(([, e]) => e.number));
  let number = pool.numbers.find((n) => !inUse.has(n));
  if (!number) {
    const oldest = active(registry).sort(
      (a, b) => new Date(a[1].assignedAt) - new Date(b[1].assignedAt)
    )[0];
    console.log(`  ↻ pool exhausted — recycling ${oldest[1].number} from "${oldest[0]}"`);
    number = await releaseSlug(oldest[0]);
    registry = await loadRegistry();
  }
  await updateAgentNumbers(agentId, [number]);
  registry[slug] = {
    agentId,
    agentName,
    business,
    number,
    leadEmail: leadEmail || null,
    rep: rep || null,
    assignedAt: new Date().toISOString(),
  };
  await saveRegistry(registry);
  return number;
}

/** Release numbers from demos older than maxAgeDays so fresh leads never wait. */
export async function recycleStale(maxAgeDays) {
  const pool = await loadPool();
  const cutoff = Date.now() - (maxAgeDays ?? pool.maxAgeDays ?? 14) * 86400_000;
  const registry = await loadRegistry();
  const released = [];
  for (const [slug, entry] of active(registry)) {
    if (new Date(entry.assignedAt).getTime() < cutoff) {
      await releaseSlug(slug);
      released.push({ slug, number: entry.number });
    }
  }
  return released;
}

export async function poolStatus() {
  const pool = await loadPool();
  const registry = await loadRegistry();
  const inUse = new Map(active(registry).map(([slug, e]) => [e.number, { slug, ...e }]));
  console.log(`\nNumber pool (${pool.numbers.length} number(s), recycle after ${pool.maxAgeDays}d):\n`);
  for (const n of pool.numbers) {
    const a = inUse.get(n);
    if (a) {
      const days = Math.floor((Date.now() - new Date(a.assignedAt)) / 86400_000);
      console.log(`  ${n}  → ${a.slug} (${a.business || a.agentName}), assigned ${days}d ago${a.rep ? `, rep: ${a.rep}` : ''}`);
    } else {
      console.log(`  ${n}  → FREE`);
    }
  }
  const idle = Object.entries(registry).filter(([, e]) => !e.number);
  if (idle.length) console.log(`\nReleased demos (page live, call line off): ${idle.map(([s]) => s).join(', ')}`);
  console.log();
}
