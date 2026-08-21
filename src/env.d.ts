/// <reference types="astro/client" />

declare module 'cloudflare:workers' {
	export const env: {
		OPENAI_API_KEY?: string;
		RESEND_API_KEY?: string;
	};
}
