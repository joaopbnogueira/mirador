/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#2C3E50', // Rich dark blue/charcoal
                'brand-secondary': '#B08D57', // Muted gold/bronze accent
                'brand-accent': '#D4AC0D', // Brighter gold for specific highlights
                'brand-text': '#34495E',    // Softer black for text
                'brand-light-text': '#5D6D7E', // Lighter text for secondary info
                'brand-light-gray': '#F4F6F6', // Very light gray for backgrounds/borders
                'brand-bg': '#FFFFFF',      // Primary background (white)
                'brand-dark-bg': '#1C2833',  // Dark background for footer or specific sections
            },
            fontFamily: {
                sans: ['Figtree', 'Inter', 'system-ui', 'sans-serif'], // Added Figtree as primary
                serif: ['Georgia', 'serif'], // Example serif if needed
            },
            transitionTimingFunction: {
                'custom-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
            boxShadow: {
                'subtle': '0 4px 12px rgba(0, 0, 0, 0.05)',
                'lifted': '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.04)',
            }
        },
    },
    plugins: [],
}