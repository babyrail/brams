/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    ".pages/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
      15: "15px",
    },
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        SegoeUI: ["Segoe UI", "sans-serif"],
      },
      colors: {
        customBlack: "#1D1D1F",
        customWhite: "#F5F5F7",
        customBlack2: "#16161a",
        highlight: "#7f5af0",
        primary: "#4A68C4",
        secondary: "#885DF1",
        tertiary: "#32DFAD",
        approved: "#00ff00",
        error: "#ff0000",
        error2: "#ff3333",
        navBar: "#c5cad4",
        navBarHighlight: "#292B2D",
      },
      backgroundImage: {
        "hero-pattern": "url('/wave.svg')",
        bgTexture: "url('/denim.webp')",
        bgImage: "url('/bg-image2.jpeg')",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
