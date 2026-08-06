import type { Config } from "tailwindcss";

// Design tokens are HSL triplets (no `hsl()` wrapper) so shadcn's
// `hsl(var(--token))` pattern keeps working, and every color still
// resolves to the workbook's original hex identity:
//   navy  #1B2A4A -> 221 47% 20%
//   gold  #B08D57 -> 36 36% 52%
//   good  #1E8749 -> 145 64% 32%
//   bad   #C0392B -> 6 63% 46%

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1360px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // brand — the only tokens carrying the fixed identity
        navy: {
          DEFAULT: "hsl(var(--brand-navy))",
          soft: "hsl(var(--brand-navy-soft))",
        },
        gold: {
          DEFAULT: "hsl(var(--brand-gold))",
          soft: "hsl(var(--brand-gold-soft))",
        },
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        warn: "hsl(var(--warn))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 3px)",
        sm: "calc(var(--radius) - 5px)",
        xl: "calc(var(--radius) + 6px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,42,74,.06), 0 8px 24px -12px rgba(27,42,74,.18)",
        "card-hover": "0 4px 10px rgba(27,42,74,.10), 0 20px 40px -16px rgba(27,42,74,.30)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .4s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
