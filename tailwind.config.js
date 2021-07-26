const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  mode: 'jit',
  purge: {
    enabled: mode === "development" ? false : true,
    content: ["./src/**/*.{js,liquid}"],
  },
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
