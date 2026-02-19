/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["'Outfit'", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "2xs": "var(--font-2xs)",
        xs: "var(--font-xs)",
        sm: "var(--font-sm)",
        base: "var(--font-base)",
        lg: "var(--font-lg)",
        xl: "var(--font-xl)",
        "2xl": "var(--font-2xl)",
        "3xl": "var(--font-3xl)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      colors: {
        /* ── New design tokens ── */
        bg: {
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          muted: "var(--bg-muted)",
        },
        txt: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        star: {
          filled: "var(--star-filled)",
          empty: "var(--star-empty)",
        },
        status: {
          active: "var(--status-active)",
          completed: "var(--status-completed)",
        },

        /* ── shadcn/ui compatibility (hsl removed, merged with new tokens) ── */
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          primary: "var(--accent-primary)",
          light: "var(--accent-light)",
          red: "var(--accent-red)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
