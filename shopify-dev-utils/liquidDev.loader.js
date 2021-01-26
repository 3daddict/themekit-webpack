const loaderUtils = require('loader-utils');
const path = require('path');
const { Liquid } = require('liquidjs');
const glob = require('glob');
const { moneyWithoutTrailingZeros } = require('./filters/money_without_trailing_zeros');
const { moneyWithCurrency } = require('./filters/money_with_currency');
const { within } = require('./filters/within');
const { defaultPagination } = require('./filters/default_pagination');
const { scriptTag } = require('./filters/script_tag');
const { stylesheetTag } = require('./filters/stylesheet_tag');
const { assetUrl } = require('./filters/asset_url');
const { getStoreGlobalData } = require('./storeData');
const { liquidSectionTags } = require('./section-tags/index');
const { Paginate } = require('./tags/paginate');
const { Style } = require('./tags/style');

let engine;
let loadPromise;

function initEngine() {
    if (!loadPromise) {
        loadPromise = new Promise(async (resolve) => {
            const liquidFiles = [
                ...glob
                    .sync('./src/components/**/*.liquid')
                    .map((filePath) =>
                        path.resolve(path.join(__dirname, '../'), path.dirname(filePath))
                    )
                    .reduce((set, dir) => {
                        set.add(dir);
                        return set;
                    }, new Set()),
            ];

            engine = new Liquid({
                root: liquidFiles, // root for layouts/includes lookup
                extname: '.liquid', // used for layouts/includes, defaults "",
                globals: await getStoreGlobalData(),
            });

            engine.registerFilter('asset_url', assetUrl);
            engine.registerFilter('stylesheet_tag', stylesheetTag);
            engine.registerFilter('script_tag', scriptTag);
            engine.registerFilter('default_pagination', defaultPagination);
            engine.registerFilter('within', within);
            engine.registerFilter('money_with_currency', moneyWithCurrency);
            engine.registerFilter('money_without_trailing_zeros', moneyWithoutTrailingZeros);

            engine.registerTag('paginate', Paginate);
            engine.registerTag('style', Style);
            engine.plugin(liquidSectionTags());

            resolve();
        });
    }

    return loadPromise;
}

module.exports = async function (content) {
    if (this.cacheable) this.cacheable();
    const callback = this.async();

    if (!engine) {
        await initEngine();
    }

    engine.options.loaderOptions = loaderUtils.getOptions(this);
    const { isSection } = engine.options.loaderOptions;

    // section handled specially
    if (typeof isSection === 'function' && isSection(this.context)) {
        const sectionName = path.basename(this.resourcePath, '.liquid');
        content = `{% section "${sectionName}" %}`;
    }

    return engine
        .parseAndRender(content, engine.options.loaderOptions.globals || {})
        .then((result) => callback(null, result));
};
