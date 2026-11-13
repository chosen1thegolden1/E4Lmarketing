# Analytics & Strategy

These prompts turn your numbers into clear decisions: what to fix, what to cut and where to spend next. Paste in your real results and the AI will do the math, explain it in plain English and tell you when there isn't enough data to decide yet.

### AN-01 Read my Facebook ad results and tell me what to change

**Use it when:** your Meta ads have run for a while and you're not sure if they're working.
**You'll get:** a plain-English read of your results and a short list of changes, ranked by impact.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a paid social specialist who has managed Facebook and Instagram ads for small local and online businesses for 8 years.

My business: [BUSINESS / e.g. mobile dog grooming in Tampa]
My goal for these ads: [GOAL / e.g. booked appointments, leads, online sales]
What one result is worth to me: [VALUE / e.g. average first booking is $85]
Date range: [DATE RANGE]

Here are my results (pasted from Ads Manager, one row per campaign, ad set or ad):
[PASTE TABLE: name, spend, impressions, reach, frequency, clicks, CTR, CPC, results, cost per result]

Give me:
1. A 3-sentence summary of what is happening.
2. What's working, with the numbers that prove it.
3. What's not working, with the numbers that prove it.
4. Up to 5 changes to make, ranked by likely impact, each with the reason.
5. What to watch over the next 7 days to see if the changes helped.

Rules:
- Work only from the numbers I pasted. Show your math for anything you calculate.
- If an ad or ad set has too little spend or too few results to judge, say so instead of guessing.
- Don't make up industry benchmarks. If you mention a typical range, call it a rough rule of thumb.
- Plain English. Short sentences. No em dashes.
```

**Pro tip:** Export at the ad level, not just the campaign level, so the AI can compare individual ads.

### AN-02 Explain my ad metrics in plain English using my numbers

**Use it when:** your ad dashboard is full of letters like CPM and ROAS and you want to know what they mean for you.
**You'll get:** each metric explained with your own numbers and what it tells you to do.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a marketing coach who teaches small business owners to read their own ad reports without an agency.

My business: [BUSINESS]
Platform: [PLATFORM / e.g. Facebook, Google]
Here are my numbers for [DATE RANGE]:
- Spend: [SPEND]
- Impressions: [IMPRESSIONS]
- Clicks: [CLICKS]
- Leads: [LEADS]
- Sales from these ads: [SALES, if known]
- Revenue from these ads: [REVENUE, if known]

Explain these 5 metrics: CPM, CTR, CPC, CPL and ROAS. For each one:
1. What it means in one plain sentence.
2. The formula, then my number worked out step by step.
3. What my number suggests, and what would make it go up or down.

Then finish with the single metric I should watch most for my goal, and why.

Rules:
- Use only the numbers I gave you. If one is missing, say which metric you can't calculate and why.
- Don't invent benchmarks. If you give a typical range, label it a rough rule of thumb that varies a lot by industry.
- Write like you're explaining it to a friend over coffee. No jargon. No em dashes.
```

**Pro tip:** Run this again next month with new numbers and ask, "What changed and why might that be?"

### AN-03 Decide which ads to kill, keep or scale

**Use it when:** you have several ads running and need to know where to move the money.
**You'll get:** a kill, keep or scale verdict for every ad, with the math behind each call.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a media buyer who manages small ad budgets ($500 to $10,000 a month) and makes cut-or-scale calls every week.

My business: [BUSINESS]
My target cost per result: [TARGET / e.g. $30 per lead]
What one result is worth to me: [VALUE]
Monthly ad budget: [BUDGET]

Here are my ad results for [DATE RANGE]:
[PASTE TABLE: ad name, spend, impressions, clicks, CTR, results, cost per result, days running]

For each ad, give me:
1. Verdict: Kill, Keep, Scale or Too early to tell.
2. The numbers behind the verdict, with your math shown.
3. For Scale, how much to raise the budget and how to do it safely.
4. For Kill, what to learn from it for the next ad.

Then give me a new budget split across the ads I should keep.

Rules:
- Work only from my numbers. Never invent results.
- If an ad has spent less than about 2 to 3 times my target cost per result, or has very few results, mark it "Too early to tell" and say how much more spend you'd need. Call this a rough rule of thumb.
- No em dashes. Short sentences.
```

**Pro tip:** Add a column for "creative type" (video, photo, carousel) so the AI can spot patterns across ads.

### AN-04 Find wasted spend in my Google Ads search terms

**Use it when:** you run Google Search ads and suspect you're paying for clicks from the wrong searches.
**You'll get:** a list of wasted search terms, a negative keyword list and the money you'd have saved.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a Google Ads specialist who has audited search campaigns for local service businesses for 10 years.

My business: [BUSINESS / e.g. emergency plumber]
What I sell: [SERVICES]
What I don't sell or don't want: [EXCLUSIONS / e.g. DIY, jobs, free, commercial work]
Service area: [CITY OR AREA]

Here is my search terms report for [DATE RANGE]:
[PASTE TABLE: search term, match type, clicks, impressions, cost, conversions]

Give me:
1. Search terms that cost money and are clearly the wrong intent, with total cost wasted.
2. Search terms that cost money with no conversions but might be fine, with a note on each.
3. The best-converting terms, which I may want as their own keywords.
4. A negative keyword list ready to paste, grouped by theme, with suggested match type.
5. Total spend that went to clearly wrong terms, with your math.

Rules:
- Use only the terms and numbers I pasted. Show your math.
- Don't call a term a winner or loser off 1 or 2 clicks. Say when the data is too thin.
- Don't add negatives that would block my real services.
- No em dashes. No jargon without a one-line explanation.
```

**Pro tip:** Pull at least 30 days of search terms so there's enough data to spot patterns.

### AN-05 Find where my funnel leaks

**Use it when:** you get traffic or leads but not enough sales, and you don't know which step is broken.
**You'll get:** your conversion rate at each step, the biggest leak and 3 fixes to try.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a conversion consultant who helps small businesses find where customers drop off between first visit and paid sale.

My business: [BUSINESS]
How customers buy from me: [PROCESS / e.g. visit site, fill form, phone call, quote, sale]
Average sale value: [PRICE]

My numbers for [DATE RANGE]:
- Website visits: [VISITS]
- Leads (forms, messages, bookings): [LEADS]
- Calls or consults held: [CALLS]
- Quotes or proposals sent: [QUOTES, if any]
- Sales: [SALES]

Give me:
1. The conversion rate from each step to the next, with the math shown.
2. The step losing the most people, and why that matters in dollars.
3. Likely causes of that leak, phrased as questions I can check.
4. 3 fixes to try first, ranked by effort and likely impact.
5. What the extra revenue would be if that one step improved by a few percentage points, with the math.

Rules:
- Work only from my numbers. Never invent data.
- If any step has very small numbers, warn me the rate could swing a lot.
- Don't make up benchmarks. Any typical range must be labeled a rough rule of thumb.
- Plain English. No em dashes.
```

**Pro tip:** Run it twice, once for each main traffic source, to see if one source leaks more than the other.

### AN-06 Work out what a lead is worth and what I can pay for one

**Use it when:** you need to know the most you can spend to get a lead and still make money.
**You'll get:** the value of a lead, a break-even cost per lead and a safe target to give your ads.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a small business finance coach who helps owners set ad budgets from their real margins.

My business: [BUSINESS]
Average sale value: [PRICE / e.g. $1,200]
Profit margin on a sale, before marketing: [MARGIN / e.g. 40%]
Percent of leads that become customers: [CLOSE RATE / e.g. 1 in 5]
Average number of purchases per customer over time: [REPEAT PURCHASES / e.g. 3 over 2 years, or "1" if one-off]

Give me:
1. Profit per sale, with the math.
2. Lifetime profit per customer, with the math.
3. What one lead is worth to me in profit, with the math.
4. My break-even cost per lead, using first sale only and using lifetime value.
5. A safe target cost per lead to give my ads, and why you'd leave room.
6. What changes if my close rate goes up or down by 5 points.

Rules:
- Use only my numbers. Show every step of the math.
- If any number looks like a guess, tell me which one moves the answer most so I can check it.
- Don't invent industry averages.
- No em dashes. Short sentences.
```

**Pro tip:** If you don't know your close rate, count your last 20 leads and how many paid you. That's a start.

### AN-07 Analyze my email stats and pick the next test

**Use it when:** you send emails regularly and want to know what's working and what to try next.
**You'll get:** a read of your email results, patterns across sends and one clear test to run next.
**Works in:** ChatGPT, Claude, Gemini

```text
You are an email marketer who has run newsletters and promotions for small businesses with lists under 5,000 people.

My business: [BUSINESS]
List size: [LIST SIZE]
What I want emails to do: [GOAL / e.g. book calls, drive sales, keep past clients warm]

Here are my last [NUMBER] emails:
[PASTE TABLE: date, subject line, recipients, open rate, click rate, unsubscribes, replies or sales if known]

Give me:
1. The top 3 and bottom 3 emails, and what they have in common.
2. Patterns in subject lines, send days or topics, with the numbers that back them up.
3. Anything that worries you (rising unsubscribes, falling clicks).
4. One test to run next: what to change, what to keep the same and what result would count as a win.

Rules:
- Work only from my numbers. Show your math for any averages.
- Treat open rates with caution, since privacy features in some email apps can inflate them. Lean on clicks and replies.
- If differences are small or based on a few sends, say they may be noise.
- Don't invent benchmarks. Label any typical range a rough rule of thumb.
- No em dashes.
```

**Pro tip:** Include at least 8 to 10 emails so patterns aren't just luck.

### AN-08 Build a simple weekly marketing dashboard

**Use it when:** you want to track your marketing every week without drowning in data.
**You'll get:** a short list of numbers to track, where to find each one and a ready-to-copy tracking sheet layout.
**Works in:** ChatGPT, Claude, Gemini

```text
You are an operations coach who sets up simple, low-effort tracking for owner-run businesses.

My business: [BUSINESS]
Marketing I do now: [CHANNELS / e.g. Facebook ads, Google Business Profile, email, Instagram]
Tools I use: [TOOLS / e.g. Facebook Ads Manager, Google Analytics, Mailchimp, GoHighLevel, a spreadsheet]
Main goal: [GOAL / e.g. more booked jobs]
Time I can spend on this each week: [TIME / e.g. 15 minutes]

Give me:
1. No more than 8 numbers to track weekly, each with why it matters in one sentence.
2. Where to find each number in the tools I listed, step by step.
3. A spreadsheet layout I can copy: column headers and one example row with blank values.
4. 2 or 3 simple formulas to add (like cost per lead).
5. A 5-minute weekly review routine: what to look at and what question to ask.

Rules:
- Fit my time limit. Cut anything I won't really use.
- Only suggest tools I listed, unless one is free and clearly needed. Say why.
- Don't invent targets for me. Leave target columns blank for me to fill.
- Plain English. No em dashes.
```

**Pro tip:** After 4 weeks, paste the filled sheet back in and ask, "What trend do you see?"

### AN-09 Write a one-page 90-day marketing plan

**Use it when:** you're tired of random acts of marketing and want a focused plan for the next quarter.
**You'll get:** a one-page plan with one goal, a few channels, monthly priorities and the numbers to track.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a fractional marketing director who writes practical 90-day plans for businesses with 1 to 20 employees.

My business: [BUSINESS]
What I sell and the price: [OFFER AND PRICE]
Who buys: [AUDIENCE]
Where customers come from now: [CURRENT SOURCES]
Monthly marketing budget: [BUDGET]
Hours per week I or my team can give: [HOURS]
Goal for the next 90 days: [GOAL / e.g. 15 new clients a month]

Before you write anything, ask me up to 5 questions you need answered. Wait for my answers.

Then write a one-page plan with:
1. One main goal with a number.
2. 2 or 3 channels to focus on, and what to stop doing.
3. Month 1, 2 and 3 priorities, 3 bullets each.
4. Weekly numbers to track.
5. A checkpoint at day 30 and day 60: what result means keep going, and what means change course.

Rules:
- Fit my budget and hours. Don't plan work I can't do.
- Use specific details from my answers. Don't invent results or statistics.
- Never use these words: delve, leverage, unlock, elevate, seamless, game-changer, robust.
- No em dashes. Short sentences.
```

**Pro tip:** Print it and put the weekly numbers next to your desk. A plan you see is a plan you follow.

### AN-10 Find my best customers in a customer list

**Use it when:** you have a customer list or sales export and want to know who your best buyers are.
**You'll get:** a profile of your best customers, what sets them apart and who to target next.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a customer analyst who helps small businesses find patterns in their sales data.

Before pasting: remove all names, emails, phone numbers and street addresses. Keep a customer ID number, plus columns like city or zip, first purchase date, last purchase date, number of orders, total spent, product or service bought and how they found me.

My business: [BUSINESS]
Here is my customer list (CSV):
[PASTE CSV]

Give me:
1. The top 20% of customers by total spent, and what share of revenue they bring in, with the math.
2. What those customers have in common (location, product, source, timing).
3. Customers who bought once and never came back, and any pattern in them.
4. Past good customers who have gone quiet and may be worth a win-back message.
5. A description of who to target next, based only on this data.
6. 3 marketing actions based on what you found.

Rules:
- Work only from the data I pasted. Show your math.
- If a pattern rests on a handful of customers, say it's too small to trust.
- Don't guess at personal details not in the data.
- No em dashes. Plain English.
```

**Pro tip:** If the list is long, paste the most recent 12 months first so the AI can handle it.

### AN-11 Do a competitor teardown from their website and ads

**Use it when:** a competitor seems to be winning and you want to see how they're doing it.
**You'll get:** a breakdown of their offer, message, proof and weak spots, plus ideas you can use.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a competitive research analyst who studies small business marketing for owners who want to win in their local market.

My business: [BUSINESS]
Competitor: [COMPETITOR NAME]
Here is what I copied from their website (homepage, services, pricing if shown):
[PASTE WEBSITE TEXT]
Here are their ads I found (Meta Ad Library or Google), copied as text:
[PASTE AD TEXT]
Anything else I noticed (reviews, offers, social posts): [NOTES]

Give me:
1. Who they seem to be targeting.
2. Their main offer and promise, in one sentence each.
3. What proof they use (reviews, guarantees, numbers).
4. Their calls to action and how easy they make it to buy.
5. 3 things they do well that I should learn from.
6. 3 gaps or weak spots I could use.
7. 3 specific moves I could make in the next 30 days.

Rules:
- Work only from what I pasted. If something isn't visible, say "not shown" instead of guessing.
- Don't suggest copying their words. Suggest my own angle.
- No em dashes. Short sentences.
```

**Pro tip:** Find their ads free by searching their page name in the Meta Ad Library.

### AN-12 Find my unique angle against 3 competitors

**Use it when:** you look and sound like everyone else in your market and need a clear reason to be chosen.
**You'll get:** a side-by-side comparison and 3 positioning angles you can own, with a one-line pitch for each.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a brand strategist who helps local and niche businesses stand out in crowded markets.

My business: [BUSINESS]
What I offer, price and how I deliver it: [OFFER DETAILS]
What customers tell me they like about me: [REAL CUSTOMER FEEDBACK, if you have it]

Competitor 1: [NAME] / what they say and offer: [PASTE]
Competitor 2: [NAME] / what they say and offer: [PASTE]
Competitor 3: [NAME] / what they say and offer: [PASTE]

Before you write anything, ask me up to 5 questions you need answered. Wait for my answers.

Then give me:
1. A comparison table: promise, price, audience, proof, tone, for me and each competitor.
2. What all 4 of us say that customers probably tune out.
3. 3 angles I could own, each with why it fits me and the risk of choosing it.
4. A one-line pitch for each angle.
5. Which one you'd test first and why.

Rules:
- Only claim strengths I actually have. Don't invent results, awards or reviews.
- Talk about the customer's problem before my offer.
- Never use these words: delve, leverage, unlock, elevate, seamless, game-changer, cutting-edge.
- No em dashes.
```

**Pro tip:** Test the winning one-liner as the headline of your next ad and compare it to your current one.

### AN-13 Turn customer reviews into insights

**Use it when:** you have reviews or feedback and want to know what customers really value.
**You'll get:** what customers love, what to fix and the exact words to reuse in your marketing.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a customer research specialist who mines reviews for small businesses to improve their service and marketing.

My business: [BUSINESS]
Here are my reviews and feedback (Google, Facebook, surveys, emails). I removed reviewer names:
[PASTE REVIEWS]

Give me:
1. The top 5 things customers love, how many reviews mention each and a short quote for each.
2. Complaints or friction points, how often each appears and a quote for each.
3. Words and phrases customers use that I should reuse in ads and on my website.
4. The problem customers had before they found me, in their words.
5. 3 fixes to my service or process, ranked by how often the issue comes up.
6. 3 headline ideas built from customer language.

Rules:
- Use only what's in the reviews. Quote exactly. Don't invent or polish quotes.
- Count mentions and show the counts.
- If there are fewer than about 15 reviews, say the patterns are early signals.
- No em dashes. Plain English.
```

**Pro tip:** Paste competitors' 3-star reviews in a second chat to find what their customers wish they got.

### AN-14 Set a monthly marketing budget and split

**Use it when:** you don't know how much to spend on marketing or where to put it.
**You'll get:** a monthly budget range based on your numbers and a split across channels with reasons.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a fractional CMO who sets marketing budgets for small businesses based on their margins and goals.

My business: [BUSINESS]
Monthly revenue now: [REVENUE]
Profit margin before marketing: [MARGIN]
Average sale value: [PRICE]
Goal: [GOAL / e.g. grow to $40k a month, fill weekday slots]
Channels I use now and what each costs: [CHANNELS AND COSTS]
Where my best customers come from: [BEST SOURCES]

Before you write anything, ask me up to 5 questions you need answered. Wait for my answers.

Then give me:
1. A monthly budget range, with the math tied to my margin and goal.
2. A split across channels in dollars and percent, with a reason for each.
3. A small test budget for one new channel, and what result would earn it more money.
4. What to cut if money gets tight.
5. How many leads or sales the budget needs to bring in to pay for itself, with the math.

Rules:
- Base it on my numbers. Don't promise results.
- If you mention a common percent-of-revenue range, call it a rough rule of thumb, not a standard.
- No em dashes. Short sentences.
```

**Pro tip:** Pair this with AN-06 so your budget matches what a lead is really worth to you.

### AN-15 Plan an A/B test properly

**Use it when:** you want to test an ad, email, page or offer and get an answer you can trust.
**You'll get:** a test plan with a hypothesis, one change, how long to run it and what counts as a win.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a conversion testing specialist who helps small businesses run simple, honest tests with limited traffic.

My business: [BUSINESS]
What I want to test: [THING / e.g. Facebook ad headline, email subject line, landing page offer]
Current version: [PASTE OR DESCRIBE IT]
Idea for the new version: [IDEA, or "help me choose"]
Current traffic or volume: [VOLUME / e.g. 400 landing page visits a week, 1,200 email subscribers]
Current result: [CURRENT RATE / e.g. 3% of visitors fill the form]

Give me:
1. A hypothesis in one sentence: "If I change X, then Y will happen, because Z."
2. The one thing to change, and everything to keep the same.
3. How to split the traffic.
4. How long to run it and how many results each version needs, with your reasoning and math.
5. What counts as a win, a loss and "no clear difference."
6. What to do after each outcome.

Rules:
- Work from my numbers. Show your math.
- If my volume is too low to get a clear answer in a reasonable time, say so and suggest a bigger change to test or a different metric.
- Don't invent benchmarks. Label any rule of thumb as rough.
- No em dashes. Plain English.
```

**Pro tip:** Write down your hypothesis before you start. It stops you from reading the result the way you hoped.

### AN-16 Audit my homepage for conversions

**Use it when:** people visit your website but don't call, book or buy.
**You'll get:** a section-by-section audit, the top fixes ranked and rewritten copy for the top of the page.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a conversion copywriter who has audited hundreds of small business websites for clarity and action.

My business: [BUSINESS]
Who the site is for: [AUDIENCE]
The one action I want visitors to take: [ACTION / e.g. book a free estimate]
Here is my homepage text, top to bottom (include buttons and menu labels):
[PASTE HOMEPAGE TEXT]

Give me:
1. The 5-second test: what a new visitor would understand from the top section alone.
2. A section-by-section review: what works, what's unclear, what's missing.
3. Problems with my calls to action (wording, number, placement as written).
4. Missing proof or trust signals I should add if I have them.
5. The top 5 fixes, ranked by likely impact and effort.
6. A rewrite of the headline, subheadline and main button, in 2 versions.

Rules:
- Work only from the text I pasted. You can't see the design, so say when a fix depends on how it looks.
- Talk about the customer's problem before my offer.
- Don't invent testimonials or results. Use [A REAL RESULT OR TESTIMONIAL] as a placeholder.
- Never use these words: elevate, seamless, unlock, game-changer, cutting-edge, "look no further".
- No em dashes.
```

**Pro tip:** Also paste the text a visitor sees on a phone screen before scrolling. That's where most people decide.

### AN-17 Write a monthly results report for a client

**Use it when:** you do marketing for clients and need a clear monthly report they'll read.
**You'll get:** a client-ready report with results, what they mean, what you did and next month's plan.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a marketing account manager who writes short, honest monthly reports that small business clients actually read.

Client business: [CLIENT BUSINESS]
What I do for them: [SERVICES / e.g. Facebook ads and Google Business Profile]
Their main goal: [GOAL]
This month's numbers: [PASTE NUMBERS]
Last month's numbers: [PASTE NUMBERS, if you have them]
What I did this month: [WORK DONE]
What I plan next month: [PLAN]
Anything that went wrong or is still unclear: [ISSUES]

Write a report with:
1. A 3-sentence summary at the top a busy owner can read in 20 seconds.
2. Key results in a simple table, with change from last month and the math shown.
3. What the numbers mean in plain English.
4. What I did this month, in bullets.
5. What didn't work and what I'm changing.
6. Next month's plan and one thing I need from the client.

Rules:
- Use only the numbers I gave you. Don't round in my favor.
- Report bad news plainly and early, with what I'm doing about it.
- If a change is based on small numbers, say it's too early to call.
- No jargon without a one-line explanation. No em dashes.
```

**Pro tip:** Send the report with a short video walking through the summary. Clients read more when you show your face.

### AN-18 Check my Google Business Profile and list fixes

**Use it when:** you want to show up higher in Google Maps and local search in your area.
**You'll get:** a checklist of what's missing or weak on your profile and the fixes, in priority order.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a local SEO specialist who has optimized Google Business Profiles for service businesses for 8 years.

My business: [BUSINESS]
City and service area: [CITY / AREA]
Here is what's on my profile now (copy it in):
- Business name as shown: [NAME]
- Primary category: [CATEGORY]
- Secondary categories: [CATEGORIES]
- Description: [DESCRIPTION]
- Services listed: [SERVICES]
- Hours, phone, website: [DETAILS]
- Number of reviews and average rating: [REVIEWS]
- How often I reply to reviews: [REPLY HABIT]
- Photos: [ROUGH COUNT AND WHEN LAST ADDED]
- Posts: [HOW OFTEN]
- Q&A: [ANY QUESTIONS ANSWERED]

Give me:
1. A checklist of every field: done well, weak or missing.
2. The top 7 fixes, in order of likely impact on local ranking and calls.
3. A rewritten description under 750 characters, using my real services and area.
4. A simple plan to get more reviews honestly, plus 2 review request messages.
5. A 4-week posting plan with 1 post idea per week.

Rules:
- Work only from what I pasted. Don't invent services, awards or reviews.
- Don't suggest stuffing keywords into my business name. It breaks Google's rules.
- Never suggest buying or faking reviews.
- No em dashes.
```

**Pro tip:** Check your primary category against the top 3 businesses in the map results for your main service.

### AN-19 Find out why leads aren't turning into sales

**Use it when:** you're getting leads but too few of them become paying customers.
**You'll get:** where your follow-up loses people, what to change and a better follow-up schedule.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a sales process coach who helps service businesses close more of the leads they already pay for.

My business: [BUSINESS]
Average sale value: [PRICE]
Where leads come from: [SOURCES]
My follow-up process, step by step (who, how and how fast): [PASTE PROCESS / e.g. form comes in, I call same day if I can, send one email]
My numbers for [DATE RANGE]:
- Leads: [LEADS]
- Leads I reached: [CONTACTED]
- Appointments or consults booked: [BOOKED]
- Showed up: [SHOWED]
- Sales: [SALES]
Common reasons people give for not buying: [REASONS, if known]

Give me:
1. The rate at each step, with the math shown.
2. The step losing the most people and what it's costing me in dollars.
3. Gaps in my follow-up process (speed, number of touches, channels).
4. A new follow-up schedule for the first 14 days: day, channel and what to say in one line.
5. 3 changes to make this week, ranked by impact.

Rules:
- Work only from my numbers. If a step has very few people, say the rate isn't reliable yet.
- Don't make up benchmarks. Any typical figure must be labeled a rough rule of thumb.
- Keep follow-up honest. No fake deadlines or false scarcity.
- No em dashes. Short sentences.
```

**Pro tip:** Track response time for one week. How fast you reply is often the easiest fix.

### AN-20 Pick the one marketing move that matters most this month

**Use it when:** you have too many ideas and too little time and need to choose one thing.
**You'll get:** one recommended move with the reasoning, a simple action plan and how to know it worked.
**Works in:** ChatGPT, Claude, Gemini

```text
You are a business advisor who helps busy owners focus on the one marketing action with the biggest payoff.

My business: [BUSINESS]
Monthly revenue and goal: [REVENUE AND GOAL]
What's working now (with numbers if you have them): [WHAT'S WORKING]
What's not working: [WHAT'S NOT]
My key numbers (leads, close rate, average sale, ad spend): [NUMBERS]
Ideas I'm considering: [LIST OF IDEAS]
Time and money I have this month: [TIME AND BUDGET]

Before you answer, ask me up to 5 questions you need answered. Wait for my answers.

Then give me:
1. The one move you recommend, in one sentence.
2. Why it beats the other options, using my numbers and showing any math.
3. A week-by-week plan for the month.
4. The one number to watch and what result would mean it worked.
5. What to stop or pause so I have time for it.

Rules:
- Pick one. Don't hedge with a list.
- Base it on my numbers and situation. Don't promise results or invent statistics.
- If my numbers are too thin to be sure, say so and tell me what to track.
- No em dashes. Plain English.
```

**Pro tip:** At the end of the month, paste your results back in and ask, "Keep going, change or stop?"
