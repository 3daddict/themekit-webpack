module.exports.assetUrl = function assetUrl(v) {
    const { publicPath } = this.context.opts.loaderOptions;

    return `${publicPath}${v}`;
};
