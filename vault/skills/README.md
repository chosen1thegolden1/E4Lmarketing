# E4L Vault: Skills

Six skills that turn the Vault's 100 prompts into helpers you can just talk to. Each one runs a 60-second setup the first time, remembers your business for the rest of the chat, and does the job in your voice.

| Skill | What it does for your business | Folder | Download |
|---|---|---|---|
| Ad Writer | Facebook, Instagram and Google ads, hooks, video scripts, fixes and a $10 a day test plan | [e4l-ad-writer](e4l-ad-writer/) | [zip](dist/e4l-ad-writer.zip) |
| Email Writer | Welcome, launch, win-back and follow-up emails, plus missed-call and reminder texts | [e4l-email-writer](e4l-email-writer/) | [zip](dist/e4l-email-writer.zip) |
| Content Planner | 30-day calendars, video scripts, carousels and captions that sound like you | [e4l-content-planner](e4l-content-planner/) | [zip](dist/e4l-content-planner.zip) |
| Offer Builder | Offers, pricing tiers, landing pages, objection scripts and proposals | [e4l-offer-builder](e4l-offer-builder/) | [zip](dist/e4l-offer-builder.zip) |
| Clip Finder | Finds the best short clips in a long video from its transcript, with times and captions | [e4l-clip-finder](e4l-clip-finder/) | [zip](dist/e4l-clip-finder.zip) |
| Results Reader | Reads your ad, email and funnel numbers in plain English and says what to change | [e4l-results-reader](e4l-results-reader/) | [zip](dist/e4l-results-reader.zip) |

Each folder has:
- `SKILL.md`: the skill itself.
- `references/prompts.md`: the Vault prompts it runs on (Clip Finder doesn't need one).
- `PROJECT.md`: the copy-paste version for apps or plans without Skills.
- `EXAMPLE.md`: a short example run.

## Install in Claude

1. Download the skill's zip from the table above. Don't unzip it.
2. In Claude, open Settings and find Skills (under Capabilities). Turn Skills on if it's off.
3. Upload the zip.
4. Start a new chat and ask for what you need, like "write me 3 ads for my fall special". Claude picks up the skill on its own.

Menu names in Claude move around. If you can't find Skills, or your plan doesn't have it, use the Project version below.

## Install in ChatGPT

If your ChatGPT plan has Skills, upload the same zip there. If it doesn't have Skills yet, use the Project version below. It does the same job.

## Project version (any plan, ChatGPT or Claude)

1. Create a new Project. In ChatGPT, a custom GPT works too.
2. Upload the skill's `references/prompts.md` as a file (or to the GPT's Knowledge).
3. Open the skill's `PROJECT.md`, copy everything below the line, and paste it into the Project's instructions.
4. Chat inside that Project.

## Tip: your Business Card

The first time you use any skill, it asks six quick questions and gives you a Business Card. Save it. Paste it into any new chat (or add it to your Project files) and every skill skips the setup.

## License

Members can use these skills on their own business and in work for their own clients. Don't resell the Vault or share these files outside your membership.
