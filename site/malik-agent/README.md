# Malik as a chat agent

Malik runs as a text-only chatbot (an ElevenLabs agent with *Text only* on,
no voice, no mic) embedded on every page of the site. This folder holds what the agent is made of so it can be rebuilt or
edited without digging through the ElevenLabs dashboard.

Agent id: `agent_3601m4czfzgrf8b9cnynhjzjqj8g` (set in `site/build.py` as
`ELEVENLABS_AGENT_ID`). Test him without the site at
`https://elevenlabs.io/app/talk-to?agent_id=agent_3601m4czfzgrf8b9cnynhjzjqj8g`.
The embed is `src/partials/malik-chat.html`; the widget is styled in the
ElevenLabs dashboard (white, black text, gold accent, Malik thumbs-up avatar, text chat only).

- `system-prompt.md` – the persona, tone rules, hard rules, and routing. Paste
  into the agent's System prompt in ElevenLabs when you change it.
- Knowledge base – two text documents in the ElevenLabs knowledge base:
  "E4L Marketing - Services, pricing, and how it works" and
  "E4L Marketing - FAQ and plain-English AI glossary". Their sources are the
  services price sheet, the site copy, and `site/src/data/faqs.json`. When the
  FAQ file changes, update the FAQ document too.
- Tool `capture_lead` – a webhook tool that POSTs captured leads to a GHL
  inbound webhook. The URL is a placeholder until Abdullah wires it (see
  `../DEPLOY-GHL.md`, section "Malik chat agent").

Guardrails baked into the prompt: discloses he is an AI, never promises results,
quotes only published floors, never says "credits", keeps Systems and Creative
separate, never says "Everybody Eats".
