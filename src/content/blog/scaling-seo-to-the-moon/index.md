---
title: "Scaling SEO to the moon!"
excerpt: "How juggernaut SEO players like Domain and realestate.com.au scale their SEO architecture, and how they are adapting for the age of AI search."
pubDate: 2026-08-30
draft: false
---

Every so often a niche gets so competitive that the winners stop competing on **content** and start competing on **architecture**. 

Australian property searching is exactly that niche, and Domain and realestate.com.au are the two juggernauts that own the game. 

Neither company is in front because they write better copy than everyone else, they're in front because they've built systems that make winning inevitable. Here's what they're actually doing, and why it's worth understanding even if you never end up building anything close to their scale (but hey, you never know!)

## What are they actually trying to achieve?

Both Domain and realestate.com.au are aggregators, not owners, which gives them a great edge. 

Interestingly neither company owns the properties listed on their sites, real estate agents do, and agents pay to have their listings featured. That business model only works if the aggregator is where buyers and renters actually start their search, which means the entire company's revenue is downstream of one thing: **being the page Google shows first.**

Think of it as more of an advertising model on behalf of real estate agents.

<figure>
  <img src="/blog/scaling-seo-to-the-moon/ads.gif" alt="It's just ads" width="400"  />
  <figcaption>It's just ads</figcaption>
</figure>

The play isn't to rank for "houses for sale sydney" and call it a day. A handful of head terms like that only capture a few thousand searches a month between them, nowhere near enough to justify the business. The real play is the long tail, ranking individually for every suburb, every property type, every specific address, all at once.

One listing page competing for "3 bedroom house bondi" is a rounding error. A million listing pages, each uniquely indexable and each capturing its own slice of ultra-specific, low-competition search traffic, compounds into something no competitor can realistically catch up to.

This is programmatic SEO taken about as far as it can go. Nobody is hand-writing a million pages, they're building a system that generates genuinely useful, unique pages at a scale that makes manual competition pointless.

## Why Google loves them

It's no accident (or secret) that Google ranks these sites so highly. Here is what they get right:

### Topical Authority
Hundreds of thousands of pages, all tightly clustered around one topic, signal genuine depth and expertise on that topic in a way a single well-written article never can. 
Google's own quality guidelines describe this as part of Experience, Expertise, Authoritativeness and Trustworthiness <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content#eat" target="_blank" rel="noreferrer">(E-E-A-T)</a>, and few sites embody topical authority on Australian property more completely than the two platforms that host most of the actual listings.

<figure>
  <img src="/blog/scaling-seo-to-the-moon/authoritah.gif" alt="Domain and realestate.com.au have topical authoritah" width="400"  />
  <figcaption>Domain and realestate.com.au have topical authoritah!</figcaption>
</figure>

### Backlink paradise
Everything from news articles, agent websites, price comparison tools and social shares all naturally link back to specific property pages on these platforms because that's where the canonical listing actually lives!

That's an **enormous**, organically earned backlink graph/street cred that would be almost impossible to replicate through outreach alone.

### So fresh and so clean
These pages are kept fresh and up to date frequently, from price changes, listings going under offer, new stock coming on, all happening continuously. 

For query types where freshness genuinely matters, Google rewards sites that visibly, verifiably update all the time, which these platforms do by default just effortlessly running their core business and letting **their customers drive the content**. Brilliant!

### Technically sound
Fast Core Web Vitals, clean and crawlable URL structures, XML sitemaps that scale to millions of pages without breaking, and `schema.org` structured data (RealEstateListing markup specifically) on every single listing so Google doesn't have to guess what the page is about. 

None of this is exotic, it's the same technical foundation I covered in my <a href="/blogs/nextjs-astro-for-seo" target="_blank" rel="noreferrer">Next.js vs Astro post</a>, just executed at a scale where getting it wrong equates to serious lost dollars!

## The architecture behind the ranking

Now this is the part that actually interests me as an engineer: *how do you keep a million-plus pages fast, crawlable, and constantly up to date, without your dev team (or bank account!) grinding to a halt under the weight of it?*

<figure>
  <img src="/blog/scaling-seo-to-the-moon/epic.gif" alt="Epic architecture" width="400"  />
</figure>

### The overview
Broadly speaking, both companies lean on a similar family of tools. Domain and REAs frontend runs on `Next.js` and `GraphQL`, with components specifying their own data requirements against a shared GraphQL layer rather than every team requiring bespoke REST endpoints. 

Both companies also make heavy use of micro-frontends and microservices to ensure that dev teams are not stacked in queues waiting to press the release button.

Okay Ale, that's a lot of buzzwords, but what are they really up to? Here are the architectural themes that show up between the two:

### The specifics

- **Hybrid rendering strategy.** Probably the most important component, the listing pages get **server-rendered** or **statically generated** HTML, fast and complete on arrival. 
While I cannot confirm the exact rendering strategy (as I have never worked at either company), I can only imagine that these giants have used some sort of ISR (Incremental Static Regeneration) as it combines the blazingly fast load speeds of static sites with the ability to continually bake in updates, an indispensable tool in this area. And of course anything that needs to be genuinely functional like logins, dashboards, etc. would be rendered as client-side apps in their own right.
- **Micro-frontends and microservices.** Search, listing detail, and agent profile pages can all ship independently. That's how these big platforms are able to ship and stay resilient without falling over, a simple structural change delivering huge benefits.
- **A GraphQL data layer**, so frontend teams can query exactly the data a page needs without waiting on a backend team to build a new endpoint for every UI change. This elegant level of abstraction alone removes a huge amount of the coordination overhead that slows large teams down in the REST world as changing one simple data model will simply propagate through your GQL setup.
- **Automated reindexing, not just automated publishing.** When a listing goes live or a price changes, that needs to propagate into sitemaps and actively prompt a *recrawl*, via tools like the <a href="https://developers.google.com/search/apis/indexing-api/v3/quickstart" target="_blank" rel="noreferrer">Indexing API</a>, rather than sitting around waiting for Googlebot to get around to it on its own schedule. At this scale, "eventually indexed" isn't good enough. They need to be proactive.
- **Great structured data.** So every one of a million-plus listings gets consistent, correct `schema.org` markup. This allows Googlebot and other crawlers to get key information off the bat.

None of this is individually ground-breaking, but when you bring all these aspects together, marrying together quality content at break-neck speeds, you get your SEO paradise!

## How this translates into the AI age

<figure>
  <img src="/blog/scaling-seo-to-the-moon/ohno.gif" alt="Oh no, change!" width="400"  />
  <figcaption>Oh no, change!</figcaption>
</figure>

Here's the part that's shifting the fastest. AI Overviews, ChatGPT search, Perplexity and their peers are increasingly answering questions directly rather than just handing back ten blue links.

Not only this, but property search is a natural fit in this world with prompts like: *"What's the median house price in Five Dock?"*, *"Recent sale prices for properties in Forest Lodge"* or *"Common amenities in Leichhardt"*. These companies must effectively adapt their business and technical strategies to make sure they always show up in these prompt results and still continue to generate revenue at the same scale. Manage that, and their dominance continues, fail to, and they risk slipping into becoming the "physical newspaper" of news.

Fortunately for these companies, the same playbook that built these traditionally SEO-dominant platforms is, almost by accident, precisely what positions them well for this AI shift!
Large language models grounding an answer in real data lean heavily on structured, authoritative, unambiguous facts, which is exactly what clean `schema.org` markup on millions of verified listings provides. 

A scraped, inconsistent, poorly structured competitor is a much worse source for an AI system to cite or ground an answer in than a platform that has spent a decade making its data machine-readable by necessity.

It is still early days, and the discipline doesn't have a settled name yet, though "Generative Engine Optimisation" <a href="https://www.coursera.org/articles/what-is-generative-engine-optimization" target="_blank" rel="noreferrer">(GEO)</a> is the term getting thrown around most often.

**Now more than ever, being the canonical, well-structured, frequently-cited source of truth for a topic increases the odds of being surfaced when an AI system answers a question in that space**. It's the same fundamentals as traditional SEO, topical authority, trustworthy structured data, genuine freshness, just being read by a model instead of a crawler.

There's still a real threat here though. If AI search increasingly answers directly without a click-through, the value of a page-one ranking changes, almost certainly for the worse, and that's a genuine strategic problem these companies are having to work through. But the great moat of being the deep, authoritative, structured source of truth for an entire category doesn't go away just because the interface reading it changed. If anything, it's a moat that's actually widening the further AI search goes.

## To Summarise

Juggernauts Domain and realestate.com.au don't rank because they're geniuses with keywords. They rank because they've built the architecture, the data model, and the organisational structure needed to be the authoritative, fast, constantly fresh source of truth for an entire category. 

They have done this at a scale competitors can't match without **serious investment**, and that same foundation, structured data, topical authority, genuine freshness, technical fundamentals done properly, is turning out to be exactly what positions them for AI search too. 

Whilst these companies are not automatically in the clear for the AI age and can't just stop "trying", the game has not been flipped on its head just yet given the wide area of overlap that still exists between SEO and GEO.

<figure>
  <img src="/blog/scaling-seo-to-the-moon/chilling.gif" alt="Domain and REA, chilling" width="400"  />
  <figcaption>Domain and REA not needing to change strategy for GEO</figcaption>
</figure>
