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
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          light: 'var(--color-accent)',
        },
        surface: {
          DEFAULT: 'var(--color-bg)',
          alt: 'var(--color-bg-alt)',
        },
        'surface-alt': 'var(--color-bg-alt)',
        muted: 'var(--color-text-muted)',
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
