import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const createColorScale = (prefix: string, isAlpha: boolean = false) => {
  return Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [
      i + 1,
      isAlpha ? `var(--${prefix}${i + 1})` : `var(--${prefix}-${i + 1})`,
    ]),
  );
};

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: { ...createColorScale("gray") },
        "gray-a": createColorScale("gray-a", true),
        red: createColorScale("red"),
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          ...createColorScale("accent"),
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "spinner-leaf-fade": {
          "0%, 100%": {
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
        },

        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "spinner-leaf-fade": "spinner-leaf-fade 800ms linear infinite",
        "collapsible-down":
          "collapsible-down 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "collapsible-up":
          "collapsible-up 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [tailwindAnimate, typography],
} satisfies Config;
