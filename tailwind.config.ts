import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'beauty-purple': '#8B5A96',
        'beauty-pink': '#E879B9',
        'beauty-lavender': '#C084C7',
        'beauty-pink-light': '#F8BBE6',
        'beauty-lavender-light': '#D8B4E2',
        'beauty-black': '#0F0F0F',
        'beauty-white': '#FEFEFE',
      }
    },
  },
  plugins: [],
}
export default config