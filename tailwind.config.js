module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: [
      './dist/**/*.liquid',
      './dist/**/*.js',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
