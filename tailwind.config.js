/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './global.css',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#1A2634',
        surface: '#2C3E50',
        secondary: '#34495E',
        card: '#263340',
        primary: '#3498DB',

        // 🧾 Text
        text: '#ECF0F1',
        muted: '#95A5A6',
        white: '#FFFFFF',

        // ✅ Status
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',

        // 🩺 Neutrals
        neutral: '#94a3b8',
        purple: '#8b5cf6',

        // 🪶 Slate Variants
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          400: '#94a3b8',
          300: '#cbd5e1',
        },

        // 📊 Adherence
        adherence: {
          high: '#10b981',
          medium: '#f59e0b',
          low: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};