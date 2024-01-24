/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#638889",
        secondary: "#EBD9B4",
        tertiary: "#F9EFDB",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      dropShadow: {
        'yellow': '0 10px 15px rgba(235, 255, 50, 0.8)',
      },
      backgroundImage: {
        'search-icon': "url('./assets/searchicon.png')",
      },

    },
  },
  plugins: [],
}

