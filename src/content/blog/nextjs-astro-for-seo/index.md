---
title: "Next.js vs Astro, and building for SEO"
excerpt: "Next.js vs Astro or plain old WordPress, which to pick?"
pubDate: 2026-08-29
draft: false
---

Ever built something you were really proud of, only to watch it sit in obscurity because Google refused to index it? 

A great product with zero discoverability might as well not exist. When SEO is a core requirement, the rendering strategy you pick from day one matters more than almost any other technical decision you'll make, in this regard there are many technologies to choose from to achieve your SEO paradise, with many options such as Astro, Next.js, WordPress and plain old static web, here's how I navigate what to choose.

## Static vs hybrid rendering, duel of the SEO fate

<figure>
  <img src="/blog/nextjs-astro-for-seo/duel.gif" alt="Duel of the SEO fate?" min-width="400" />
</figure>

Search crawlers (and their Core Web Vitals metrics) all care about the same underlying thing: **how fast can a complete, meaningful page arrive.**

Client-side rendering, where the server ships a near-empty HTML shell and JavaScript fills in the content after the fact, is the **worst starting position for SEO**. 

Googlebot and other crawlers *can* execute JavaScript, but it does so on a delayed second pass, it's inconsistent, and every millisecond spent waiting on a script to hydrate content is a millisecond working against your <a href="https://web.dev/articles/lcp" target="_blank" rel="noreferrer">Largest Contentful Paint (LCP)</a>, something that crawlers penalise heavily in the decision to index your website.

We can therefore cross <a href="https://developer.mozilla.org/en-US/docs/Glossary/SPA" target="_blank" rel="noreferrer">Single Page Applications (SPAs)</a> off our list of SEO-effective tools.

Static generation flips this entirely. The HTML is fully built ahead of time, ready to go, so both the crawler and the user get a complete page instantly, no JavaScript overhead required to see the content. The catch here, however, is that "static" alone doesn't handle pages that genuinely need to be dynamic or personalised.

That's where hybrid rendering (or an islands architecture) earns its keep. You get a statically generated shell for speed and crawlability, with only the specific components that truly need interactivity hydrated on the client. You're not shipping an entire app runtime just to render a paragraph of text, you're shipping exactly as much JavaScript as the page actually needs, and not a byte more.

## Next.js, Astro, WordPress, or plain static HTML?

Four different tools can all get you a clean SEO result, and they sit at different points on the same spectrum: how much flexibility do you need, versus how much simplicity can you get away with.

<figure>
  <img src="/blog/nextjs-astro-for-seo/decision.gif" alt="Decisions, decisions, decisions" width="400"  />
</figure>

### Next.js
Next.js is a full application framework first. With the App Router and React Server Components, you get **static** generation, **incremental** static regeneration, and genuinely **dynamic** per-user experiences all in one coherent system. When the product has real interactivity behind the content like logged-in dashboards, checkout flows or anything stateful, Next.js gives you the means to build that without switching frameworks halfway through. In many projects, this is indispensable.

### Astro
Astro takes the opposite default: ship zero JavaScript unless a component explicitly asks for it. For content-heavy sites where most of the page is genuinely static, marketing pages, blogs, documentation, product catalogues, this is the difference between fighting a framework to get a 100 score on Lighthouse and getting there by default.

### WordPress
WordPress is the old guard for a reason: it's a CMS first, not a framework, and it's built around letting **non-developers** publish content without touching code. It's server-rendered PHP by default (not truly static), so out-of-the-box page speed is usually worse than the other three, but a good caching/CDN layer closes most of that gap, and its SEO plugin ecosystem (Yoast, RankMath) is battle-hardened and genuinely unmatched in maturity.

### Plain ol' Wild West static HTML
Plain static HTML is the floor, and sometimes that's exactly what you want! No framework, no build step, no dependencies to keep patched, just files served directly. It's the fastest possible <a href="https://web.dev/articles/ttfb" target="_blank" rel="noreferrer">Time To First Byte (TTFB)</a> you can get, at the cost of zero component reuse, zero templating, and every page being hand-maintained. 

If you outgrow that but still don't want a JS framework's runtime, a dedicated static site generator like <a href="https://gohugo.io/" target="_blank" rel="noreferrer">Hugo</a>, <a href="https://jekyllrb.com/" target="_blank" rel="noreferrer">Jekyll</a>, or <a href="https://www.11ty.dev/" target="_blank" rel="noreferrer">11ty</a> can sit in between, giving you templating and markdown-driven content with a build step, but still nothing but static HTML shipped to the browser. 

Worth knowing that world exists even if it's something I generally don't reach for because I often find one of the first 3 options fit for my purposes.

## What each option actually gives you for SEO
It's not enough to know that these can all render statically (or close to it), the specific tooling each one hands you is crucial for making the right decision.

**Next.js** brings a mature, batteries-included metadata system: the `generateMetadata` API for per-page titles, descriptions and Open Graph tags, built-in dynamic OG image generation, and <a href="https://vercel.com/docs/incremental-static-regeneration" target="_blank" rel="noreferrer">Incremental Static Regeneration</a> so a page that was statically built last week can quietly refresh its content without a full site rebuild. That last part matters a lot for anything with content that changes on its own schedule like *prices, listings, availability*, without wanting to run a build pipeline every time!

As mentioned before **Astro's** pitch is different: zero JavaScript shipped by default, on every page, unless a component explicitly *opts in* to hydration. That's not a minor detail for SEO, since Core Web Vitals directly reward exactly this. Astro's <a href="https://docs.astro.build/en/guides/content-collections/" target="_blank" rel="noreferrer">Content Collections</a> also give you type-safe, structured content out of the box (this very blog is built on them!), and sitemap/RSS generation are first-party integrations rather than something you bolt on. 
Importantly, you can still drop a React, Vue, or Svelte island into an Astro page exactly where you need interactivity, without paying the JS cost everywhere else.

**WordPress's** strength on the other hand is not architectural, it's ecosystem depth. Decades of plugins, themes, and tooling built specifically around ranking well, plus a content editing experience marketers and writers can use without a dev, which is critical for high-velocity marketing teams in the industry. The key trade-off being that plugin bloat and server-rendered PHP mean you have to make a conscious effort to keep Core Web Vitals healthy, rather than getting it for free.

**Plain static HTML** gives you total, granular control, every meta tag, every byte on the page is exactly what you wrote, nothing more. No abstraction to fight, but also none of the automation the other three give you for free (sitemaps, structured data, metadata templating), you're writing all of that by hand, every time (granted AI coding agents like Claude can make light work of this for you).

Okay Ale, thanks for the low-down, so which should I pick, and when?

<figure>
  <img src="/blog/nextjs-astro-for-seo/tough.gif" alt="What do I choose?" width="400" />
  <figcaption>Fear not Michael, I got you!</figcaption>
</figure>

### Reach for Next.js when
1. The product has real per-user interactivity behind the SEO-facing content: dashboards, auth-gated flows, checkout
2. Your content changes often enough that rebuilding the whole static site on every update isn't practical, ISR solves this cleanly
3. You need/want React's component ecosystem end-to-end across the whole app, not just the marketing pages
4. The team already knows Next.js/React and there's shared code with an existing React app

### Reach for Astro when
1. Content is the product: blogs, marketing pages, documentation, catalogue-style listings
2. You want the fastest possible page-speed scores without fighting the framework to strip out unnecessary JS
3. Most of the page doesn't need interactivity at all, and you want the shipped bundle to reflect that
4. You want to mix and match UI libraries (or none at all) rather than being locked into React everywhere

### Reach for WordPress when
1. Non-technical people (marketing, content, a small business owner) need to publish and edit without a developer in the loop
2. You want the deepest, most battle-tested SEO plugin ecosystem without building anything custom
3. The site is content-driven and dev velocity isn't the focus, editorial velocity is

> 🚨 Important mention: A no-code builder like Webflow or Squarespace covers similar ground here too, this is worth a look if you want WordPress's non-technical editing without managing plugins and hosting yourself

### Reach for plain static HTML (or a static site generator) when
1. It's just a handful of pages that basically never change, a single landing page, a simple brochure site
2. Zero framework runtime is the entire point, you don't need component reuse or client-side interactivity at all
3. You want the simplest possible deploy: no server process, no database, nothing to keep patched

> 🚨 Important note: If the page count or update frequency grows past a "handful," you will want to reach for another framework like Hugo/Jekyll/11ty or move into a JS/WordPress framework, all dependent on your situation, of course.

### The quick vibe-check
Still not sure? Ask yourself these two questions:

1. **First**: After someone lands on the page from a Google search, do they need to log in, interact with live data, or move through a multi-step flow? If yes, that's a Next.js-shaped product. If it's mostly reading the content, with maybe a touch of custom functionality, Astro would be the go-to.
2. **Second**: Who needs to update this content, and how often? A marketing/content team publishing regularly points to WordPress (or a no-code builder). A developer maintaining content that rarely changes points to plain static HTML or a static site generator. 

Everything content-heavy in between, where you still want speed, structure and some room for custom interactivity, is Astro's sweet spot.

<figure>
  <img src="/blog/nextjs-astro-for-seo/feel-better.gif" alt="Feeling better now" width="400"  />
  <figcaption>You're welcome!</figcaption>
</figure>

## To Summarise
When SEO is core to what you're building, there are a few horses in the race. To sum up, real interactivity behind the content/frequent content changes points to Next.js. Content that mostly just needs to be fast, crawlable and well structured points to Astro. Non-technical editors publishing on their own schedule point to WordPress (or a no-code builder). A handful of pages that barely change point to plain static HTML or a static site generator. 

Getting the rendering strategy and the tooling choice right early avoids a lot of future pain and helps you sprint towards your SEO goals instead of fighting the technology that you have chosen.