module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "themebg-300": "#3c3c50",
        "themebg-400": "#2c3759",
        "themebg-500": "#1A223EFF",
      },
    },
  },
  plugins: [
    // ...
  ],
};
