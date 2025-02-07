import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(255, 255, 255)",
        secondary: "rgb(72,95,129)",
        active: "rgba(127,248,2,255)",
        primary: "rgb(54,98,227)",
        destructive: "rgba(255, 99, 71, 1)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundColor: {
        background: "rgb(255, 255, 255)",
        secondary: "rgb(72,95,129)",
        active: "rgba(127,248,2,255)",
        primary: "rgb(54,98,227)",
      },
      borderRadius: {
        lg: "20px",
        md: "10px",
        sm: "5px",
      },
      borderColor: {
        DEFAULT: "rgb(209, 209, 209)",
      },
      textColor: {
        "primary-foreground": "hsl(0, 0%, 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
