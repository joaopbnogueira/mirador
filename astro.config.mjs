import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind()],
    site: 'https://your-property-domain.com', // Replace with your actual domain
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'pt'],
        routing: {
            prefixDefaultLocale: false, // English at `/`, Portuguese at `/pt/`
        }
    }
});