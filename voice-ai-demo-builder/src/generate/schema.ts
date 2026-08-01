// Strict JSON Schema for the generator's structured output.
// Every object sets additionalProperties:false and lists required — the shape
// Claude is constrained to. Mirrors the DemoSpec interface in ../types.
export const DEMO_SPEC_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    businessName: { type: "string", description: "The business's real name." },
    services: {
      type: "array",
      description: "Concrete services the business offers.",
      items: { type: "string" },
    },
    persona: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", description: "Receptionist first name, e.g. Ava." },
        role: { type: "string", description: "Role line, e.g. 'AI receptionist for <business>'." },
        voice: {
          type: "string",
          description:
            "Tone/personality for the receptionist — matched to THIS business's brand (warm, professional), not E4L's voice.",
        },
        greeting: {
          type: "string",
          description: "The exact opening line the receptionist speaks when the caller taps to talk.",
        },
      },
      required: ["name", "role", "voice", "greeting"],
    },
    faqs: {
      type: "array",
      description: "Common caller questions the receptionist should answer, with answers.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "answer"],
      },
    },
    demoCopy: {
      type: "object",
      additionalProperties: false,
      description: "Copy for the E4L-branded demo page — confident, direct, benefit-led.",
      properties: {
        headline: { type: "string" },
        subhead: { type: "string" },
        roi: {
          type: "array",
          description: "Short ROI-strip bullets (4-6 words each).",
          items: { type: "string" },
        },
        ctaLabel: { type: "string", description: "Tap-to-talk button label, e.g. 'Tap to talk to Ava'." },
      },
      required: ["headline", "subhead", "roi", "ctaLabel"],
    },
  },
  required: ["businessName", "services", "persona", "faqs", "demoCopy"],
} as const;
