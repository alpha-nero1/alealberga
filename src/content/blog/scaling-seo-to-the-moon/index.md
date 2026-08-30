---
title: "Scaling SEO to the moon"
excerpt: "How juggernaut SEO players like Domain and realestate.com.au scale their SEO architecture, and what it means for the age of AI search."
pubDate: 2026-08-30
draft: true
---

Every so often a niche gets so competitive that the winners stop competing on **content** and start competing on **architecture**. 

Australian property searching is exactly that niche, and Domain and realestate.com.au are the two juggernauts that own the game. 

Neither company is in front because they write better copy than everyone else, they're in front because they've built systems that make winning inevitable. Here's what they're actually doing, and why it's worth understanding even if you never end up building anything close to their scale (but hey, you never know!)

## What are they actually trying to achieve?

Both Domain and realestate.com.au are aggregators, not owners, which gives them a great edge. 

Interestingly neither company owns the properties listed on their sites, real estate agents do, and agents pay to have their listings featured. That business model only works if the aggregator is where buyers and renters actually start their search, which means the entire company's revenue is downstream of one thing: **being the page Google shows first.**

Think of it as more of an advertising model on the behalf of realestate agents.

<figure>
  <img src="/blog/scaling-seo-to-the-moon/ads.gif" alt="It's jsut ads" width="400"  />
  <figcaption>It's just ads</figcaption>
</figure>

The play isn't to rank for "houses for sale sydney" and call it a day. A handful of head terms like that only capture a few thousand searches a month between them, nowhere near enough to justify the business. The real play is the long tail, ranking individually for every suburb, every property type, every specific address, all at once.

One listing page competing for "3 bedroom house bondi" is a rounding error. A million listing pages, each uniquely indexable and each capturing its own slice of ultra-specific, low-competition search traffic, compounds into something no competitor can realistically catch up to by hand.

This is programmatic SEO taken about as far as it can go. Nobody is hand-writing a million pages, they're building a system that generates genuinely useful, unique pages at a scale that makes manual competition pointless.

## Why Google loves them

It's no accident that google ranks these sites so highly, here is what they get right:

### Topical Authority
Hundreds of thousands of pages, all tightly clustered around one topic, signal genuine depth and expertise on that topic in a way a single well-written article never can. 
Google's own quality guidelines describe this as part of Experience, Expertise, Authoritativeness and Trustworthiness  <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content#eat" target="_blank" rel="noreferrer">(E-E-A-T)</a> , and few sites embody topical authority on Australian property more completely than the two platforms that host most of the actual listings.

<figure>
  <img src="/blog/scaling-seo-to-the-moon/authoritah.gif" alt="Domain and Realestate.com have topical authoritah" width="400"  />
  <figcaption>Domain and Realestate.com have topical authoritah!</figcaption>
</figure>

### Backlink Paradise
Everything from news articles, agent websites, price comparison tools and social shares all naturally link back to specific property pages on these platforms because that's where the canonical listing actually lives!

That's an **enormous**, organically earned backlink graph that would be almost impossible to replicate through outreach alone.

### So fresh and so clean
These pages are kept fresh and up to date frequently, from prices changes, listings going under offer, new stock coming on, all happening continuously. 

For query types where freshness genuinely matters, Google rewards sites that visibly, verifiably update all the time, which these platforms do by default just effortlessly running their core business and letting **their customers drive the content**. Brilliant!

### Techically sound
Fast Core Web Vitals, clean and crawlable URL structures, XML sitemaps that scale to millions of pages without breaking, and `schema.org` structured data (RealEstateListing markup specifically) on every single listing so Google doesn't have to guess what the page is about. 

None of this is exotic, it's the same technical foundation I covered in my <a href="/blogs/nextjs-astro-for-seo" target="_blank" rel="noreferrer">Next.js vs Astro post</a>, just executed at a scale where getting it wrong equates to serious lost dollars!

## The architecture behind the ranking

Now this is the part that actually interests me as an engineer: *how do you keep a million-plus pages fast, crawlable, and constantly up to date, without your dev team grinding to a halt under the weight of it?*

<figure>
  <img src="/blog/scaling-seo-to-the-moon/epic.gif" alt="Epic architecture" width="400"  />
</figure>

Both companies have not kept their approach secret, nor would it be easy too anyway.

Domain's own engineering blog describes a stack built on `Next.js` & `GraphQL`, with components specifying their own data requirements against a shared GraphQL layer rather than every team hand-rolling bespoke REST endpoints. 
REA Group (realestate.com.au) has documented a deliberate <a href="https://computerworld.com.au/article/634277/rea-group-works-re-platforming-realestate-com-au" target="_blank" rel="noreferrer">re-platform from an older monolith to React micro-frontends</a>, backed by a genuine <a href="https://www.grahamlea.com/2015/05/microservices-at-rea-yow-2014/" target="_blank" rel="noreferrer">microservices architecture</a>, with Elasticsearch handling search and Kubernetes running the infrastructure underneath.

Okay Ale, that's a lot of buzz words, what are they really up to. Here are the architectual themes that show up between the two:

- **Micro-frontends and microservices, so teams don't block each other.** Search, listing detail, and agent profile pages can all ship independently. That's what "high velocity development" actually means in practice, not moving fast recklessly, but structuring the system so a hundred engineers aren't all queued up behind the same deploy.
- **Hybrid rendering for the pages that need to be crawlable.** The SEO-critical listing pages get server-rendered or statically generated HTML, fast and complete on arrival, while the more app-like, personalised parts of the experience (saved searches, alerts, agent dashboards) can lean into client-side interactivity without dragging the crawlable pages down with them.
- **A GraphQL data layer**, so frontend teams can query exactly the data a page needs without waiting on a backend team to build a new endpoint for every UI change. That alone removes a huge amount of the coordination overhead that slows large teams down.
- **Automated reindexing, not just automated publishing.** When a listing goes live or a price changes, that needs to propagate into sitemaps and actively prompt a recrawl, via tools like the Indexing API, rather than passively waiting for Googlebot to get around to it on its own schedule. At this scale, "eventually indexed" isn't good enough.
- **Structured data generated programmatically**, not hand-coded per page, so every one of a million-plus listings gets consistent, correct `schema.org` markup without a human ever touching it.

None of this is individually exotic. What's genuinely hard is doing all of it, consistently, across a page count that makes any manual process fall over.

## What this means in the age of AI search

Here's the part that's shifting fastest. AI Overviews, ChatGPT search, Perplexity and their peers are increasingly answering questions directly rather than just handing back ten blue links, and property search is a natural fit for that: "what's the median house price in Bondi" is exactly the kind of question an AI search tool wants to answer inline rather than make you click through for.

The interesting bit is that the same playbook that built these companies' traditional SEO dominance is, almost by accident, precisely what positions them well for this shift too. Large language models grounding an answer in real data lean heavily on structured, authoritative, unambiguous facts, which is exactly what clean `schema.org` markup on a million verified listings provides. A scraped, inconsistent, poorly structured competitor is a much worse source for an AI system to cite or ground an answer in than a platform that has spent a decade making its data machine-readable by necessity.

This is early enough that the discipline doesn't have a settled name yet, though "Generative Engine Optimisation" (GEO) is the term getting the most traction, being the canonical, well-structured, frequently-cited source of truth for a topic increases the odds of being surfaced or cited when an AI system answers a question in that space. It's the same fundamentals as traditional SEO, topical authority, trustworthy structured data, genuine freshness, just being read by a model instead of a crawler.

There's a real threat buried in here too. If AI search increasingly answers directly without a click-through, the value of a page-one ranking changes, possibly for the worse, and that's a genuine strategic problem these companies are having to work through, not a solved one. But the underlying moat, being the deep, authoritative, structured source of truth for an entire category, doesn't go away just because the interface reading it changed. If anything, it's a moat that's actually widening the further AI search goes.

## To Summarise

Domain and realestate.com.au don't rank because they're clever with keywords, they rank because they've built the architecture, the data model, and the organisational structure needed to be the authoritative, fast, constantly fresh source of truth for an entire category, at a scale competitors can't match by hand. That same foundation, structured data, topical authority, genuine freshness, technical fundamentals done properly, is turning out to be exactly what positions them for AI search too. The tools reading the internet are changing, the underlying playbook for winning it really isn't.
