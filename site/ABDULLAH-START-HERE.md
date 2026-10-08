# Abdullah: start here

This is the one-page version. The full steps, with every URL and setting,
are in `DEPLOY-GHL.md` in this folder. Read this first, then follow that.

## What you are putting live

The Eat 4 Life Marketing agency site: eight pages that paste into a
GoHighLevel funnel, plus Malik, a text chatbot that sits bottom-right on every
page and hands leads to GHL. All of it goes in the **E4L Services**
sub-account. Never the school. Every GHL asset you create starts with `CS-`.

## What is already done

- All copy, design, and the eight page files in `dist/ghl/`.
- The Game Plan Call calendar link is wired.
- Prices are approved as shown on the site.
- Malik's chat agent is built, trained, and text-only. He works today; he
  just cannot save a lead until you give him a webhook.

## What you need before you start

- Nothing from anyone. The domain is `e4lagency.com`.
- About an hour.

## The job, in order

1. **Images (10 min).** Upload everything in `assets/malik/` and
   `assets/brand/` to a `CS-site` folder in Media Storage. Note the base URL.
   Do not use the GitHub Pages option; it is not live.
2. **Webhooks (10 min).** Three workflows, each with an *Inbound Webhook*
   trigger: `CS-Site-Lead-Intake`, `CS-AI-Audit-Intake`, `CS-Malik-Intake`.
   Copy each URL.
3. **Calendar (2 min).** Copy the Game Plan Call embed link and set its
   confirmation redirect to `/thanks`.
4. **Config and rebuild (5 min).** Put the image base URL and the first two
   webhook URLs into the `CONFIG` block in `build.py`. Leave `SCHOOL_URL`
   blank. Run `python3 site/build.py`. No Python? The guide shows the
   find-and-replace alternative.
5. **Funnel (20 min).** `CS-Website`, eight steps, one Custom Code element per
   step, paste the matching file from `dist/ghl/`. Attach `e4lagency.com`
   and `www.e4lagency.com`. Publish.
6. **Malik (5 min).** In ElevenLabs, paste the `CS-Malik-Intake` URL into the
   `capture_lead` tool and set the widget avatar to the Media Library URL of
   `malik-thumbs.png`. The domain allowlist is already set. If you test on a
   GHL preview link first, add that hostname to the allowlist temporarily.
7. **Test (10 min).** Run the checklist in `DEPLOY-GHL.md` section 5. The two
   that matter most: the audit form creates a tagged contact, and telling
   Malik "I want the free audit" with a test email does the same.

## If something looks wrong

- Text crammed into a narrow column on a phone: you pasted a partial file.
  Re-paste the whole thing.
- Malik's bubble shows no avatar: step 6, the avatar URL.
- Malik chats but no contact appears: the tool URL in step 6, then check the
  workflow is published.
- Images missing: the base URL in step 4 must end with a slash.

Questions go to chosen1@gsgagency.com.
