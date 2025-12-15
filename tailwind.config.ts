import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    emerald: "#064E3B",   // Deep Royal Green (Text/Buttons)
                    dark: "#022C22",      // Almost Black Green (Footer/Contrast)
                    gold: "#C5A059",      // Muted Metallic Gold (Borders/Icons)
                    cream: "#FAFAF9",     // Warm White Background
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;