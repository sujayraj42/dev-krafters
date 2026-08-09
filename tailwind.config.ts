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
          DEFAULT: '#0F4C4C',
          dark: '#0A3838',
        },
        accent: {
          DEFAULT: '#E85A3C',
          dark: '#C94A2F',
        },
        'surface-alt': '#F7F9F9',
        muted: '#5C6B6B',
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
        btn: '0.75rem',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};
export default config;
