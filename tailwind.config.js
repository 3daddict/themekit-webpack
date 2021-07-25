module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,liquid}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}

//   purge: ["./src/**/*.{js,liquid}"],