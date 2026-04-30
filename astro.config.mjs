// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    output: 'static',
    adapter: cloudflare(),
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'it', 'de', 'es', 'ja', 'zh'],
        routing: { prefixDefaultLocale: false },
    },
});