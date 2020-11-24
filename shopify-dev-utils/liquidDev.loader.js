const loaderUtils = require('loader-utils');
const path = require('path');
const { Liquid } = require('liquidjs');
const glob = require('glob');
const { fetchStoreData } = require('./storeData');
const { liquidSectionTags } = require('./section-tags/index');

const liquidFiles = [
  ...glob
    .sync('./src/components/**/*.liquid')
    .map((filePath) => path.resolve(path.join(__dirname, '../'), path.dirname(filePath)))
    .reduce((set, dir) => {
      set.add(dir);
      return set;
    }, new Set()),
];

const engine = new Liquid({
  root: liquidFiles, // root for layouts/includes lookup
  extname: '.liquid', // used for layouts/includes, defaults "",
  globals: fetchStoreData()
});

engine.registerFilter('asset_url', function (v) {
  const { publicPath } = this.context.opts.loaderOptions;

  return `${publicPath}${v}`;
});

engine.registerFilter('paginate', function (_v) {
  return ``;
});

engine.registerFilter('stylesheet_tag', function (_v) {
  return ``; // in Dev mode we load css from js for HMR
});

engine.registerFilter('script_tag', function (v) {
  return `<script src="${v}"></script>`;
});

engine.plugin(liquidSectionTags());

module.exports = function (content) {
  if (this.cacheable) this.cacheable();

  engine.options.loaderOptions = loaderUtils.getOptions(this);
  const { isSection } = engine.options.loaderOptions;

  // section handled specially
  if (typeof isSection === 'function' && isSection(this.context)) {
    const sectionName = path.basename(this.resourcePath, '.liquid');
    content = `{% section "${sectionName}" %}`;
  }

  const callback = this.async();

  return engine
    .parseAndRender(content, engine.options.loaderOptions.globals || {})
    .then((result) => callback(null, result));
};
