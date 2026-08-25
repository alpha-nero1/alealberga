export const prerender = false;

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';

const CONTACT_EMAIL = 'ale.alberga1@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_ACTION = 'contact';
const TURNSTILE_HOSTNAMES = new Set(['alealberga.com', 'localhost']);

interface TurnstileResult {
	success: boolean;
	hostname?: string;
	action?: string;
	'error-codes'?: string[];
}

async function verifyTurnstile(token: string, secret: string, remoteip: string | null) {
	const params = new URLSearchParams({ secret, response: token });
	if (remoteip) params.set('remoteip', remoteip);

	const res = await fetch(TURNSTILE_VERIFY_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params,
		signal: AbortSignal.timeout(10_000),
	});

	if (!res.ok) return false;

	const result = (await res.json()) as TurnstileResult;
	return (
		result.success &&
		result.action === TURNSTILE_ACTION &&
		!!result.hostname &&
		TURNSTILE_HOSTNAMES.has(result.hostname)
	);
}

export const POST: APIRoute = async ({ request }) => {
	const remoteip = request.headers.get('CF-Connecting-IP');
	const rateLimit = await env.CONTACT_RATE_LIMITER?.limit({ key: remoteip ?? 'unknown' });
	if (rateLimit && !rateLimit.success) {
		return new Response(JSON.stringify({ error: 'Too many requests, please slow down.' }), {
			status: 429,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let body: { name?: string; email?: string; message?: string; turnstileToken?: string };
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
	const turnstileToken = (body.turnstileToken ?? '').trim();

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

	const turnstileSecret = env.TURNSTILE_SECRET ?? import.meta.env.TURNSTILE_SECRET;
	if (!turnstileSecret) {
		return new Response(JSON.stringify({ error: 'Verification not configured.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!turnstileToken) {
		return new Response(JSON.stringify({ error: 'Verification required.' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let turnstileOk = false;
	try {
		turnstileOk = await verifyTurnstile(turnstileToken, turnstileSecret, remoteip);
	} catch (err) {
		console.error('[contact] turnstile verify error', err);
	}

	if (!turnstileOk) {
		return new Response(JSON.stringify({ error: 'Verification failed.' }), {
			status: 403,
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
