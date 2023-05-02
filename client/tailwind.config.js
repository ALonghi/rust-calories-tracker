module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "themebg-300": "#363F64",
        "themebg-400": "#273053",
        "themebg-500": "#1A223E",
      },
    },
  },
  plugins: [
    // ...
  ],
};
