# alealberga.com
My own resume, portfolio & blog website.

Essentially showing off my employability.

Current version `1.0.1`, preview URL: https://alealberga.ale-alberga1.workers.dev

Website sections and descriptions:

1. Introduction, about me.
    Your passion!
2. What I specialise in.
    Languages and why you use them, and why you love them!
3. What stacks I believe in.
    All different stacks and why you believe in them, this conveys that you know and understand how different technologies work together.
4. What I'm proud of
    This section is your acheivements and your ongoing learnings.
5. Employment history section.
6. Hobbies
    What I get up to in my spare time.
7. Blogs
    Read what I have to say about different topics, from front end app development to AI.

Show the AI section as a lower right chat element.
Get in contact lower blurb.


2026-08-07
- Make the AI section enticing.

## Deploy config

`wrangler.jsonc` at the project root declares custom Worker bindings (currently: rate limiters for `/api/chat` and `/api/contact`). It intentionally **omits** `main` and `assets` — the `@astrojs/cloudflare` adapter generates those itself into `dist/server/wrangler.json` on every build, and if this file tries to set `main` to a path that doesn't exist yet (e.g. `./dist/server/entry.mjs`), the build breaks before it even starts. Astro merges this file's fields (bindings, `name`, `compatibility_date`) into its generated config rather than replacing it. If you need a new binding (KV, another rate limiter, etc.), add it here — don't add `main`/`assets`.

## Updating secrets

Three secrets are used: `OPENAI_API_KEY` (AleBot chat), `RESEND_API_KEY` (contact form email), and `TURNSTILE_SECRET` (contact form bot protection — get it from the Turnstile widget's dashboard page, next to the site key). AleBot calls OpenAI directly from `/api/chat.ts` — no external hosting (Hugging Face, etc.) involved.

**Local dev** — edit both `.env` and `.dev.vars` (both gitignored, keep them in sync):

```
OPENAI_API_KEY=...
RESEND_API_KEY=...
TURNSTILE_SECRET=...
```

**Production (Cloudflare Worker)** — these are set separately per secret, not read from `.env`:

```bash
npx wrangler secret put OPENAI_API_KEY --name alealberga
npx wrangler secret put RESEND_API_KEY --name alealberga
npx wrangler secret put TURNSTILE_SECRET --name alealberga
```

The Turnstile site key (`0x4AAAAAAEZ7q2SBS1gYTwdJ`) is public and hardcoded in `ContactSection.astro` — only the secret needs to stay out of the repo.

Each command prompts for the value, then updates it live — no redeploy needed. Requires `wrangler login` first if not already authenticated.

## Tasks
### General
- [DONE] First preview deployment success.
- [DONE] Site must be perfectly mobile responsive.
- [] Deployment without blogs.
- [] Add rate limiting for the apis.

### Content
- [DONE] Add links to acheivements
- [DONE] Get in touch working. - Uses resender
- [DONE] Add cloud/DB specialisation sub section.
- [DONE] Proof read intro
- [DONE] Proof read specialisation section
- [DONE] Proof read achievements
- [DONE] Prood read employment history
- [DONE] Proof read hobbies section
- [] Proof read blogs section
- [] Final pass

### AleBot
- [WONT_DO] Deploy AI to huggingface. - HF free tier forces ZeroGPU hardware, can't downgrade without PRO. Not worth the hassle for a plain API call.
- [DONE] Chat window working E2E
- [] Proof read Ale knowledge base file

### Blogs
- [] Complete flutter and firebase blog.
- [] Complete astro/SEO blog.
- [] Python for AI agents
- [] React vs flutter
- [] Need for thinking blog

### Signoffs
- [WONT_DO] Signoff stacks I use section.