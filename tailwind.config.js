/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#000000",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#b1c7f2",
        "primary-container": "#001b3d",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#001b3d",
        "on-primary-fixed-variant": "#31476b",
        "on-primary-container": "#6f84ac",

        "secondary": "#006d37",
        "secondary-fixed": "#6bfe9c",
        "secondary-fixed-dim": "#4ae183",
        "secondary-container": "#6bfe9c",
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#00210c",
        "on-secondary-fixed-variant": "#005228",
        "on-secondary-container": "#00743a",

        "tertiary": "#000000",
        "tertiary-fixed": "#cce5ff",
        "tertiary-fixed-dim": "#92ccff",
        "tertiary-container": "#001d31",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#001d31",
        "on-tertiary-fixed-variant": "#004b73",
        "on-tertiary-container": "#1d8acd",

        "surface": "#f7fafc",
        "surface-dim": "#d7dadc",
        "surface-bright": "#f7fafc",
        "surface-variant": "#e0e3e5",
        "surface-tint": "#495f84",
        "surface-container": "#ebeef0",
        "surface-container-low": "#f1f4f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e5e9eb",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#181c1e",
        "on-surface-variant": "#44474e",

        "background": "#f7fafc",
        "on-background": "#181c1e",

        "outline": "#74777f",
        "outline-variant": "#c4c6cf",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eef1f3",
        "inverse-primary": "#b1c7f2",
      },
      fontFamily: {
        headline: ["'Hanken Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
    },
  },
  plugins: [],
}
