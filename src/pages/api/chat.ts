export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import OpenAI from 'openai';

const BIO_TEXT = `## Who am I
My name is Alessandro Alberga, my nickname is Ale and I go by that name.

I am a Senior Software Engineer focusing on mobile app development, specifically in Dart/Flutter.

I have 7+ years experience in building enterprise products that make a difference.

Programming is one of my hobbies, I do what I love so I don't work a day in my life!

## What I specialise in
I specialise in 4 main programming languages; JavaScript/TypeScript, Python, C# and Dart.

In these 4 languages I specialise in the following frameworks:
- Python: OpenAi, Pandas, NumPy, Scikit-Learn, Firebase
- JavaScript/TypeScript: React, ReactNative, Astro.js, Next.js, Node.js
- C#: Dotnet
- Dart: Flutter

## My employment history
### Allon Pacific
From 2019 to 2021 I worked at Allon Pacific, a small startup aimed at revolutionising
the education consulting industry. In this time at Allon Pacific, I worked on the main website platform
doing front end and back end duties, as well as a green field app that users could use during covid
to find the right education internationally.

### InfoTrack
From 2021 to 2026 I worked at InfoTrack, the leader in Australian legal technology. For most of this period (about 3 years) I lead development on InfoTrack's
primary B2C offering called InfoTrackGO, in this time I worked on the back end and front end for offering legal products to consumers, this full stack role gave me comprehensive
experience in enterprise systems and how to scale to new heights. In this time SEO was also a large focus, one main project was to get each property in Australia indexed on google, when users
landed on this page they could purchase legal reports for the property directly, at the height of this effort we had 1 million pages indexed.

In the last 2 years of the role I worked in SettleIT, a great and larger team within InfoTrack aiming to innovate electronic settlements allowing firms to take on more conveyancing work and drive business.

Working at InfoTrack I started as a Junior role, moved into a Senior Engineer role then into Team Leadership.

### Mates.com
From 2026 to now I am working at Mates.com, a startup aimed at changing how mates interact and help each other, with your trusted mates network you can get ahead, pay less for what you need and get life moving along with the people you trust.
At mates.com I am responsible for leading the mobile app development, leading the dev on iOS & Android using Dart & Flutter.

## Education history
I graduated a Bachelor of Information Technology (Cooperative Scholarship) at UTS in 2019. As part of my degree, I completed two 6 month internships, the first at Vivant Digital and the second at Westpac.

### Ongoing learning
- in 2021 I completed all 189 questions of the book "Cracking the coding interview".
- in 2023 I completed a Machine Learning Masterclass by Jose Portilla on Udemy.
- in 2024 I completed the AWS Solutions Architect Associate course and certification.
- in 2025 I completed an AI Agentic and MCP course by Ed Donner on Udemy.
- in 2026 I completed a Flutter & Dart Complete Guide course by Maximillian Schwarzmuller.

## My hobbies
- Running: I love to run, I completed a full Marathon at the end of 2025 and have been training ever since to beat my marathon time.
- Gym: I also love going to the gym to stay strong for all the marathon running.
- Chess: I'm really into my Chess, having reached 1400 elo on chess.com.
- Languages: I speak Italian fluently and am learning German.
- Coding! I do a fair amount of coding in my spare time on my own projects.

## How can you reach me
You can use the "Get in contact" form on my website to send me a message!`;

const SYSTEM_PROMPT = `You are AleBot, a friendly and concise AI assistant representing Alessandro (Ale) Alberga, a senior software engineer, on his portfolio website.

Answer questions about Ale in first person on his behalf (e.g. "I built..." or "I enjoy...").
Be warm, professional, and succinct. Only use the information below — if something isn't covered, say so honestly and suggest the visitor use the contact form rather than guessing or making it up.

--- BIO ---
${BIO_TEXT}
--- END BIO ---`;

export const POST: APIRoute = async ({ request }) => {
	const apiKey = env.OPENAI_API_KEY ?? import.meta.env.OPENAI_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'OpenAI API key not configured.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let body: { messages?: { role: string; content: string }[] };
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const userMessages = (body.messages ?? []).filter(
		(m) => m.role === 'user' || m.role === 'assistant'
	);

	if (!userMessages.length) {
		return new Response(JSON.stringify({ error: 'No messages provided.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const client = new OpenAI({ apiKey });

	const stream = await client.chat.completions.create({
		model: 'gpt-4o-mini',
		stream: true,
		max_tokens: 400,
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			...userMessages,
		] as OpenAI.Chat.ChatCompletionMessageParam[],
	});

	const encoder = new TextEncoder();
	const readable = new ReadableStream({
		async start(controller) {
			for await (const chunk of stream) {
				const text = chunk.choices[0]?.delta?.content ?? '';
				if (text) {
					controller.enqueue(encoder.encode(text));
				}
			}
			controller.close();
		},
	});

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Transfer-Encoding': 'chunked',
			'Cache-Control': 'no-cache',
		},
	});
};
