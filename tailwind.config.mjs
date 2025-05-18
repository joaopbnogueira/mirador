/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#007bff', // Example primary color
                'brand-secondary': '#6c757d', // Example secondary color
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Example modern font
            },
        },
    },
    plugins: [],
}