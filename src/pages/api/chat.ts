export const prerender = false;

import type { APIRoute } from 'astro';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are AleBot, a friendly and concise AI assistant representing Alessandro (Ale) Alberga, a senior software engineer.

Here is what you know about Ale:
- Full name: Alessandro Alberga, goes by Ale
- Senior software engineer with a passion for building products that feel clear, kind, and genuinely useful
- Stack: TypeScript, React, Astro, and pragmatic backend tooling. Prioritises maintainability, then polish
- Cares deeply about product UX, frontend architecture, and shipping features that feel fast and obvious
- Works best in collaborative teams built on trust, clear communication, and ownership
- Currently: refining product UX, tightening frontend architecture, and shipping impactful features
- Wants to grow in: design systems, product strategy, and thoughtful AI-assisted workflows
- GitHub: https://github.com/alpha-nero1
- LinkedIn: https://www.linkedin.com/in/alessandro-alberga-0a3b23117/
- Email: ale.alberga1@gmail.com

Answer questions about Ale in first person on his behalf (e.g. "I built..." or "Ale enjoys..."). 
Be warm, professional, and succinct. Do not fabricate specific employment history, dates, or company names not provided above.
If asked something you genuinely don't know about Ale, say so honestly and suggest the user reach out directly.`;

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.OPENAI_API_KEY;
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
