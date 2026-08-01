import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { DemoSpec } from "../types";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = join(HERE, "../../templates/demo.html");
const DEMOS_DIR = join(HERE, "../../demos");

export interface RenderResult {
  slug: string;
  outPath: string;
  html: string;
}

export interface RenderOptions {
  /** GHL Voice AI Chat Widget embed snippet. Injected into the tap-to-talk mount. */
  widgetEmbed?: string;
  /** Override the output directory (defaults to the project's demos/). */
  outDir?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "demo"
  );
}

/** Render a DemoSpec into a static branded demo page and write it to disk. */
export async function render(spec: DemoSpec, opts: RenderOptions = {}): Promise<RenderResult> {
  const template = await readFile(TEMPLATE_PATH, "utf8");

  const roiItems = spec.demoCopy.roi
    .map((r) => `<span class="roi-item">${escapeHtml(r)}</span>`)
    .join("");

  const services = spec.services
    .map((s) => `<span class="chip">${escapeHtml(s)}</span>`)
    .join("");

  const faqs = spec.faqs
    .map(
      (f) =>
        `<details><summary>${escapeHtml(f.question)}</summary><p>${escapeHtml(f.answer)}</p></details>`
    )
    .join("\n");

  const widget =
    opts.widgetEmbed ??
    "<!-- Paste the GoHighLevel Voice AI Chat Widget embed here -->";

  const replacements: Record<string, string> = {
    BUSINESS_NAME: escapeHtml(spec.businessName),
    HEADLINE: escapeHtml(spec.demoCopy.headline),
    SUBHEAD: escapeHtml(spec.demoCopy.subhead),
    CTA_LABEL: escapeHtml(spec.demoCopy.ctaLabel),
    PERSONA_NAME: escapeHtml(spec.persona.name),
    ROI_ITEMS: roiItems,
    SERVICES: services,
    FAQS: faqs,
    VOICE_WIDGET: widget,
    YEAR: String(2026),
  };

  const html = template.replace(/\{\{(\w+)\}\}/g, (_m, key: string) =>
    key in replacements ? replacements[key] : ""
  );

  const slug = slugify(spec.businessName);
  const outDir = opts.outDir ?? DEMOS_DIR;
  const dir = join(outDir, slug);
  await mkdir(dir, { recursive: true });
  const outPath = join(dir, "index.html");
  await writeFile(outPath, html, "utf8");

  return { slug, outPath, html };
}
