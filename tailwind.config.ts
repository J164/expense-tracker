import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // https://www.paulie.dev/posts/2023/11/a-set-of-sign-in-with-google-buttons-made-with-tailwind/
                google: {
                    "text-gray": "#3c4043",
                    "button-blue": "#1a73e8",
                    "button-blue-hover": "#5195ee",
                    "button-dark": "#202124",
                    "button-dark-hover": "#555658",
                    "button-border-light": "#dadce0",
                    "logo-blue": "#4285f4",
                    "logo-green": "#34a853",
                    "logo-yellow": "#fbbc05",
                    "logo-red": "#ea4335"
                }
            }
        }
    },
    plugins: []
} satisfies Config;
