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
        primary: {
          DEFAULT: "#0B0F19",
          dark: "#030712",
        },
        accent: {
          DEFAULT: "#FF5A3C",
          dark: "#E04326",
        },
        cyber: {
          teal: "#00F2FE",
          purple: "#8B5CF6",
        },
        surface: {
          bg: "#030712",
          alt: "#0B0F19",
        },
        muted: "#94A3B8",
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
