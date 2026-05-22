/** PostCSS fallback for hosts that process CSS without the Vite Tailwind plugin (e.g. some Replit previews). */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
