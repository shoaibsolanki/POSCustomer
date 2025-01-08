/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ["12px", "16px"],
      sm: ["14px", "20px"],
      base: ["16px", "19.5px"],
      lg: ["18px", "21.94px"],
      xl: ["20px", "24.38px"],
      "2xl": ["24px", "29.26px"],
      "3xl": ["28px", "50px"],
      "4xl": ["48px", "58px"],
      "8xl": ["96px", "106px"],
    },
    extend: {
      fontFamily: {
        palanquin: ["Palanquin", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        custom: "61% 39% 81% 19% / 64% 27% 73% 36%",
      },
      colors: {
        cardbg: "#ffffffde",
        primary: "#003f62",
        second: "#eda415",
        lightgray: "#f4f4f4",
        light: "#e2f4ff",
        light2: "#2E8FC5",
        darkPrimary: "#134321",
        dark: "#3A3A3A",
        ultraLight: "#E6E6E6",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)",
      },
      boxShadow: {
        "3xl": "0 10px 40px  rgb(0, 178, 7,0.2)",
      },
      backgroundImage: {},
      screens: {
        wide: "1440px",
      },
      // Add scrollbar width here
      scrollbarWidth: {
        auto: "auto",
        thin: "thin",
        none: "none",
      },
    },
  },
  plugins: [],
}