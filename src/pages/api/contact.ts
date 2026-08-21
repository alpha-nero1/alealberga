export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';

const CONTACT_EMAIL = 'ale.alberga1@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

	if (!EMAIL_RE.test(email)) {
		return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const apiKey = env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'Email delivery not configured.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const resend = new Resend(apiKey);

	const { error } = await resend.emails.send({
		from: 'Portfolio Contact <onboarding@resend.dev>',
		to: CONTACT_EMAIL,
		replyTo: email,
		subject: `New message from ${name} via alealberga.com`,
		text: `From: ${name} <${email}>\n\n${message}`,
	});

	if (error) {
		console.error('[contact] resend error', error);
		return new Response(JSON.stringify({ error: 'Failed to send message.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
