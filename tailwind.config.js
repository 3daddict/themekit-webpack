const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: mode === "development" ? false : true,
    content: [
      './dist/layout/*.liquid',
      './dist/templates/*.liquid',
      './dist/sections/*.liquid',
      './dist/snippets/*.liquid',
    ],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
