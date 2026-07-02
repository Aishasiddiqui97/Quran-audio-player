import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          accent: "hsl(var(--sidebar-accent))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        islamic: {
          green: "#0B6B3A",
          "green-dark": "#08522C",
          "green-light": "#0E8A4C",
          gold: "#C8A24A",
          "gold-light": "#D4B66A",
          "gold-dark": "#A8852E",
          beige: "#F5F0E8",
          cream: "#FAF7F2",
        },
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "glow-green": "0 0 20px rgba(11, 107, 58, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)",
        "glow-gold": "0 0 20px rgba(200, 162, 74, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)",
        "premium": "0 0 40px rgba(11, 107, 58, 0.08), 0 8px 32px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        amiri: ["Amiri", "serif"],
        scheherazade: ["Scheherazade New", "serif"],
        arabic: ["Amiri", "serif"],
        "arabic-simple": ["Scheherazade New", "serif"],
        "arabic-indopak": ["Noto Naskh Arabic", "serif"],
        "arabic-nastaleeq": ["Noto Nastaliq Urdu", "serif"],
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        card: "20px",
        button: "14px",
        input: "16px",
        panel: "24px",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "islamic-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "wave-bar": {
          "0%, 100%": { height: "4px" },
          "50%": { height: "20px" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(11, 107, 58, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(11, 107, 58, 0.6)" },
        },
        "gold-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(200, 162, 74, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(200, 162, 74, 0.6)" },
        },
        ripple: {
          from: { transform: "scale(0)", opacity: "1" },
          to: { transform: "scale(4)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-left": "slide-left 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "islamic-spin": "islamic-spin 1.5s linear infinite",
        "wave-bar": "wave-bar 0.8s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        ripple: "ripple 0.6s linear",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
