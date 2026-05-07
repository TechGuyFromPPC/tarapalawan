import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'ribbon-one': 'ribbon 12s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        ribbon: {
          '0%': { transform: 'translateX(-50%) translateY(-50%) rotate(0deg)' },
          '100%': { transform: 'translateX(-50%) translateY(-50%) rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        }
      },
    },
  },
  plugins: [],
};
export default config;