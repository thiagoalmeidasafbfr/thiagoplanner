import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cream palette
        "cream-page": "#f9f7f2",
        "cream-card": "#fdfbf6",
        "cream-inset": "#ece6d8",
        "cream-canvas": "#f5f2eb",
        // Ink palette
        "ink-primary": "#1a1410",
        "ink-secondary": "#3a2e1c",
        "on-dark": "#f3eee2",
        // Gold palette
        gold: "#be8c4a",
        "gold-soft": "#dcc89a",
        "gold-deep": "#7a6244",
        // Table / UI
        "tbl-head": "#e7e5de",
        // Status
        "var-pos": "#166534",
        "var-pos-tint": "#dcf0e4",
        "var-neg": "#b91c1c",
        "var-neg-tint": "#fce8e8",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        "ibm-plex-mono": ["var(--font-ibm-plex-mono)", "monospace"],
        "jetbrains-mono": ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(40,32,22,0.04)",
        "card-hover":
          "0 1px 0 rgba(40,32,22,0.04), 0 4px 12px -8px rgba(40,32,22,0.10)",
        "card-lift":
          "0 1px 0 rgba(40,32,22,0.04), 0 8px 24px -8px rgba(40,32,22,0.14)",
      },
      letterSpacing: {
        label: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
