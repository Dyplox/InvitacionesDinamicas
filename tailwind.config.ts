import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf9fa",
        surface: "#faf9fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f4",
        "surface-container": "#efedee",
        "surface-container-high": "#e9e8e9",
        "surface-container-highest": "#e3e2e3",
        "surface-dim": "#dbdadb",
        "surface-variant": "#e3e2e3",
        "on-surface": "#1b1c1d",
        "on-surface-variant": "#434653",
        primary: "#094cb2",
        "on-primary": "#ffffff",
        "primary-container": "#3366cc",
        "on-primary-container": "#e7ebff",
        secondary: "#5a5f63",
        "secondary-container": "#dfe3e8",
        tertiary: "#6d5e00",
        "outline-variant": "#c3c6d5",
      },
      fontFamily: {
        serif: ["'Noto Serif'", "serif"],
        sans: ["Inter", "sans-serif"],
        label: ["'Public Sans'", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'modal': '0 24px 40px rgba(27, 28, 29, 0.06)',
      }
    },
  },
  plugins: [],
};
export default config;
