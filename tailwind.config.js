module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: [
      './dist/**/*.liquid',
      './src/**/*.{js,liquid}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
