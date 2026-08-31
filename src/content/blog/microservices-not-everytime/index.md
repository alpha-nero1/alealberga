---
title: "Microservices, not everytime!"
excerpt: "One of the biggest pains of backend development is when the wrong architecture is used for the purpose at hand. Here's why I shake my fist at the word 'microservice' when it's thrown around like the only plausible solution for building a product."
pubDate: 2026-08-31
draft: false
---

Every senior engineer I know has, at some point, sat in a planning meeting where someone confidently proposes microservices for a product with twelve users, one small team, and a single deployment target. Nobody ever asks why. It's just assumed to be the "trendy" way to build software these days.

Microservices are not without merit of course, in fact they can be and are a game-changer! But I've personally been burnt jumping into microservice land too early, so here's the case for and against, and the actual questions you should be asking before you touch Kubernetes.

<figure>
  <img src="/blog/all-the-time.gif" alt="When I see microservices" width="400" />
  <figcaption>When I see microservices</figcaption>
</figure>


## Microservices, the problems it actually solves

To be clear upfront, none of this is an argument that microservices are bad. They solve real problems, just specific ones:

- **Independent scaling.** If one part of your system (a search endpoint, a checkout flow) gets hammered while the rest sits idle, you can scale just that piece instead of the whole application.
- **Independent deployment.** Teams ship on their own schedule instead of queueing behind a shared release train, and a bad deploy in one service doesn't necessarily take the whole product down with it.
- **Technology fit.** Different problems suit different tools. A recommendation engine in Python sitting next to a Dotnet API is a perfectly reasonable thing to want, and microservices let you have both without contorting one language to do a job it's bad at.
- **Organisational alignment.** This is the big one. When you've got multiple teams working on the same product, giving each team a clean service boundary to own reduces the coordination tax of everyone working in one shared codebase.

Every one of these is a genuine, real benefit. The catch is they're all benefits that show up at a certain *scale*, of team size, of traffic, of organisational complexity. They don't show up for free on day one just because you decided to use the architecture that solves them.

<figure>
  <img src="/blog/yes.gif" alt="Sounds great, what's the problem?" width="400" />
  <figcaption>Sounds great, what's the problem?</figcaption>
</figure>

## The traps of reaching for microservices too early

Here's where going right into microservice land by default can be a trap.

**You've swapped function calls for network calls.** What used to be a direct, reliable, practically-free call within the same process is now a network hop that can time out, fail halfway through, or arrive out of order. Every one of those failure modes is now something your team has to design for, explicitly, everywhere.

**Debugging becomes a distributed systems problem.** A single user request now touches four or five services, each with their own logs, and tracking down what actually went wrong means correlation IDs and distributed tracing instead of a single stack trace. That's a real skill and real tooling investment, not something you back into by accident. Additionally, think about how complicated you've just made your dev environment, if you have a small team looking after many microservices, you have very likely slowed down development because your team needs to set up the whole "ecosystem" locally just to test simple product flows.

**Data consistency gets genuinely hard.** No more wrapping a set of changes in one database transaction. Now you're dealing with sagas, eventual consistency, and the fun of figuring out what "one operation" even means when it spans three services and two of them just disagreed about the state of the world.

**The operational tax is paid whether or not you need the benefits yet.** Service discovery, an API gateway, container orchestration, centralised logging, inter-service auth, this all needs to exist and be maintained, regardless of whether you're actually at the traffic or team size where independent scaling and deployment pay for themselves. You can imagine a situation where you are paying 7x the DevOps costs because you jumped to microservices too early.

**And the one that stings the most:** a five-person team running fifteen microservices means each engineer is quietly the sole owner of two or three services. The organisational-alignment benefit that microservices are supposed to deliver requires *multiple teams* to actually exist in the first place. If there's only one team, you've paid the full distributed-systems tax and gained none of the org-boundary benefit it was meant to buy you!

<figure>
  <img src="/blog/trap.gif" alt="It's a trap!" />
</figure>


## Why a (modular) monolith wins more often than not

This is where I think most teams, especially smaller ones, actually want to land: a **modular monolith**. One deployable unit, but with genuinely clean internal boundaries between domains, enforced in code, not just convention.

You get most of what people actually wanted from microservices in the first place, **clear separation of concerns**, one domain's code not leaking into another's, without paying the network, ops, or consistency tax to get there. Moving a function between modules is a code change you can make and test in an afternoon, whilst moving a service boundary in a genuine microservices setup is a migration project.

**The bit people underrate**: a well-built modular monolith is also the *best possible starting position* to extract a real microservice from, later, if and when you actually need one. You've already done the hard work of drawing clean boundaries after all. When a specific module genuinely needs independent scaling or its own team, you cut along a seam that already exists, backed by **real production evidence** of where the pressure actually is, rather than guessing about your future architecture on day one.

And here's the simple truth: most products simply never hit the scale where the monolith itself is the bottleneck. The business model, the user growth, the team's ability to ship features fast enough to matter, those things become the limiting factor long before "our monolith can't handle the load" does.

<figure>
  <img src="/blog/think.gif" alt="Thinking" width="400" />
  <figcaption>Hmmm, he might be on to something...</figcaption>
</figure>

## IMO the actual decision is platforms get microservices, products get modular monoliths

Here's the heuristic I actually use, and it comes down to one word: **platform** versus **product**.

A **platform** is a system that exists to serve multiple independent consumers, often multiple internal teams or even multiple external products, each with genuinely different scaling profiles, release cadences, and reasons to exist. Think of the kind of company from my <a href="/blogs/scaling-seo-to-the-moon" target="_blank" rel="noreferrer">Scaling SEO to the moon post</a>, search, listings, and agent profiles are all different consumer-facing surfaces, owned by different teams, with different traffic patterns and different reasons to deploy on their own schedule. That's a platform. Microservices earn their keep here because the organisation is *already* decomposed into multiple teams that genuinely need to move independently.

A **product** is a single, cohesive thing being built and iterated on rapidly, usually by one team. Products may make use of platforms, but unless your product has a genuine need for independent scaling, more likely than not, you are just slowing things down by going the microservice route. My own project, FluentSRS, is about as clear an example as it gets, one person, one codebase, one thing to ship. There is no organisational boundary to align a service architecture to, or reason to scale different parts independently, thus in this case it's safe to ignore microservices (for now at least!).

The test I'd actually put to you before reaching for microservices: **do multiple teams need to deploy and scale this thing independently, right now, not hypothetically?** If yes, you might genuinely be building a platform, and microservices fit here perfectly. If no, and honestly, for most early and mid-stage products, the answer is no, start with a modular monolith. Draw your boundaries properly, ship fast, and extract a real service later when you have actual evidence telling you where to cut, not a hunch.

## To Summarise

Microservices solve real problems; they aren't all the rage just because the term sounds cool: independent scaling, independent deployment, technology fit, and organisational alignment across multiple teams are indispensible benefits when you need them. They just solve problems that only exist once you're actually at that scale, and reaching for them before you get there buys you all of the distributed-systems tax with none of the benefit.

A modular monolith gets you the clean boundaries people actually want, without the network calls, the operational overhead, or the debugging/dev headaches, and it leaves you perfectly positioned to extract a real microservice later, backed by evidence instead of guesswork. 

Building a platform for multiple teams? Microservices are likely to be the right call. Building a product? Have a small team? Start with the monolith, and thank yourself later.

<figure>
  <img src="/blog/good-luck.gif" alt="Good luck" width="400" />
  <figcaption>Good luck!</figcaption>
</figure>
