/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/App.tsx',
    './src/main.tsx',
    './src/components/**/*.{jsx,tsx}',
    './src/data/**/*.{ts,tsx}',
    './src/minigames/**/*.tsx',
    './src/hooks/**/*.{ts}',
    './src/lib/**/*.{ts}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14',
        'neon-purple': '#bf00ff',
        'neon-pink': '#ff10f0',
        'neon-yellow': '#ffff00',
        'neon-cyan': '#00f5ff',
        void: '#0a0014',
      },
      animation: {
        'screen-shake': 'screen-shake 0.45s ease-in-out',
        'screen-flash': 'screen-flash 0.35s ease-in-out 3',
        'flash-text': 'flash-text 0.8s linear infinite',
        'pulse-neon': 'pulse-neon 1s ease-in-out infinite',
      },
      keyframes: {
        'screen-shake': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-8px, 4px)' },
          '40%': { transform: 'translate(8px, -4px)' },
          '60%': { transform: 'translate(-6px, -6px)' },
          '80%': { transform: 'translate(6px, 6px)' },
        },
        'screen-flash': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(2.5) saturate(2)' },
        },
        'flash-text': {
          '0%, 100%': { color: '#39ff14', textShadow: '0 0 8px #39ff14' },
          '50%': { color: '#bf00ff', textShadow: '0 0 12px #bf00ff' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
