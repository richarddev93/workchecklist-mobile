const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./global.css",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        /* Base */
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        foreground: "hsl(var(--text))",

        /* Texto */
        text: "hsl(var(--text))",
        muted: "hsl(var(--text-muted))",

        /* Bordas */
        border: "hsl(var(--border))",
        divider: "hsl(var(--divider))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* Ações */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        /* Estados */
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
        },

        /* Cards */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* Ícones */
        icon: "hsl(var(--icon))",
        "icon-muted": "hsl(var(--icon-muted))",

        /* Tabs */
        "tab-icon-default": "hsl(var(--tab-icon-default))",
        "tab-icon-selected": "hsl(var(--tab-icon-selected))",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
