/// <reference types="astro/client" />

interface RateLimitBinding {
	limit(options: { key: string }): Promise<{ success: boolean }>;
}

declare module 'cloudflare:workers' {
	export const env: {
		OPENAI_API_KEY?: string;
		RESEND_API_KEY?: string;
		TURNSTILE_SECRET?: string;
		CHAT_RATE_LIMITER?: RateLimitBinding;
		CONTACT_RATE_LIMITER?: RateLimitBinding;
	};
}
