export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	let body: { name?: string; email?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const name = (body.name ?? '').trim();
	const email = (body.email ?? '').trim();
	const message = (body.message ?? '').trim();

	if (!name || !email || !message) {
		return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// TODO: wire this up to an actual email/notification service.
	console.log('[contact] new message', { name, email, message });

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
