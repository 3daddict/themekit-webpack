const loaderUtils = require('loader-utils');
const path = require('path');
const { Liquid } = require('liquidjs');
const glob = require('glob');
const { liquidSectionTags } = require('liquidjs-section-tags');

const liquidFiles = [
    ...glob
        .sync('./src/components/**/*.liquid')
        .map((filePath) => path.resolve(__dirname, path.dirname(filePath)))
        .reduce((set, dir) => {
            set.add(dir);
            return set;
        }, new Set()),
];

const engine = new Liquid({
    root: liquidFiles, // root for layouts/includes lookup
    extname: '.liquid', // used for layouts/includes, defaults ""
});

engine.registerFilter('asset_url', function (v) {
    const { publicPath } = this.context.opts.loaderOptions;

    return `${publicPath}${v}`;
});

engine.registerFilter('stylesheet_tag', function (v) {
    return ``; // in Dev mode we load css from js for HMR
});

engine.registerFilter('script_tag', function (v) {
    return `<script src="${v}"></script>`;
});

engine.plugin(
    liquidSectionTags({
        root: liquidFiles,
    })
);

module.exports = function (content) {
    if (this.cacheable) this.cacheable();

    engine.options.loaderOptions = loaderUtils.getOptions(this);
    const callback = this.async();

    return engine
        .parseAndRender(content, engine.options.loaderOptions.globals || {})
        .then((result) => callback(null, result));
};
